// --- 1. 资源加载动画逻辑 (立即执行，不等待 DOMContentLoaded) ---
(function initLoader() {
  const loadingScreen = document.getElementById("loading-screen");
  const progressBar = document.getElementById("progress-bar");
  const progressText = document.getElementById("progress-text");

  // 1. 安全检查：如果找不到元素，直接结束，避免报错
  if (!loadingScreen || !progressBar) return;

  // 2. 初始进度设置：从 10% 开始，让用户立马看到条子在动，而不是 0%
  let width = 10;
  progressBar.style.width = width + "%";
  if (progressText) progressText.innerText = width + "%";

  // 3. 动画核心定时器
  const interval = setInterval(() => {
    // A. 如果宽度还没满 100
    if (width < 100) {
      // 随机增加进度
      let increment = Math.random() * 3; // 基础速度加快

      // 进度越高，跑得越慢 (模拟真实感)
      if (width > 60) increment = Math.random() * 1;
      if (width > 80) increment = Math.random() * 0.3;

      width += increment;

      // 关键点：如果页面还没加载完 (!window.pageLoaded)，死活卡在 95% 不许走
      // 只有当页面加载完了，才允许超过 95%
      if (width >= 95 && !window.pageLoaded) {
        width = 95;
      }

      // 更新 UI
      // 限制最大显示 99% (100%留给加载完成事件)
      let displayWidth = Math.min(width, 99);
      progressBar.style.width = displayWidth + "%";
      if (progressText) progressText.innerText = Math.floor(displayWidth) + "%";
    }
    // B. 如果宽度已经达到或超过 100 (由 window.onload 触发)
    else {
      clearInterval(interval);
      // 确保 UI 显示满格
      progressBar.style.width = "100%";
      if (progressText) progressText.innerText = "100%";

      // 稍微停顿 200ms 让用户看到 100%，然后执行消失动画
      setTimeout(() => {
        loadingScreen.classList.add("fade-out");
        document.body.style.overflow = "auto"; // 恢复滚动

        // 动画结束后彻底移除
        setTimeout(() => {
          loadingScreen.style.display = "none";
        }, 600);
      }, 200);
    }
  }, 30); // 30ms 刷新一次，很丝滑

  // 4. 监听页面真正加载完毕 (图片、CSS都好了)
  window.addEventListener("load", () => {
    window.pageLoaded = true;
    // 关键修正：页面加载完了，直接拉满到 100%！不要慢慢跑了！
    width = 100;
  });
})();

document.addEventListener("DOMContentLoaded", () => {
  // --- 2. 配置与密码逻辑 ---
  const CONFIG = {
    // 密码: 123456
    PASSWORD_B64: "NjIxNw==",
    AUTH_KEY: "jiedian_auth_v2",
    EXPIRE_HOURS: 24,
  };

  const loginSection = document.getElementById("login-section");
  const mainSection = document.getElementById("main-section");
  const passwordInput = document.getElementById("password-input");
  const loginBtn = document.getElementById("login-btn");
  const errorMsg = document.getElementById("error-msg");

  // 检查登录
  checkLogin();

  function checkLogin() {
    const authData = localStorage.getItem(CONFIG.AUTH_KEY);
    if (authData) {
      try {
        const { timestamp } = JSON.parse(authData);
        const now = new Date().getTime();
        if (now - timestamp < CONFIG.EXPIRE_HOURS * 60 * 60 * 1000) {
          showMain();
          return;
        }
      } catch (e) {
        localStorage.removeItem(CONFIG.AUTH_KEY);
      }
    }
    showLogin();
  }

  function handleLogin() {
    const inputPwd = passwordInput.value.trim();
    if (btoa(inputPwd) === CONFIG.PASSWORD_B64) {
      const data = { timestamp: new Date().getTime() };
      localStorage.setItem(CONFIG.AUTH_KEY, JSON.stringify(data));
      errorMsg.style.display = "none";
      showMain();
    } else {
      errorMsg.style.display = "block";
      passwordInput.classList.add("shake");
      setTimeout(() => passwordInput.classList.remove("shake"), 500);
    }
  }

  if (loginBtn) {
    loginBtn.addEventListener("click", handleLogin);
  }

  if (passwordInput) {
    passwordInput.addEventListener("keypress", (e) => {
      if (e.key === "Enter") handleLogin();
    });
  }

  function showMain() {
    if (!loginSection || !mainSection) return;
    loginSection.classList.remove("active-section");
    loginSection.classList.add("hidden-section");
    mainSection.classList.remove("hidden-section");
    mainSection.classList.add("active-section");
    window.scrollTo(0, 0);
  }

  function showLogin() {
    if (!loginSection || !mainSection) return;
    mainSection.classList.remove("active-section");
    mainSection.classList.add("hidden-section");
    loginSection.classList.remove("hidden-section");
    loginSection.classList.add("active-section");
  }

  window.logout = function () {
    localStorage.removeItem(CONFIG.AUTH_KEY);
    if (passwordInput) passwordInput.value = "";
    showLogin();
  };

  // --- 3. 复制功能 ---
  window.copyText = function (text) {
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard
        .writeText(text)
        .then(() => {
          showToast("复制成功！");
        })
        .catch(() => {
          fallbackCopy(text);
        });
    } else {
      fallbackCopy(text);
    }
  };

  function fallbackCopy(text) {
    const textArea = document.createElement("textarea");
    textArea.value = text;
    textArea.style.position = "fixed";
    textArea.style.left = "-9999px";
    textArea.style.top = "0";
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    try {
      document.execCommand("copy");
      showToast("复制成功！");
    } catch (err) {
      showToast("复制失败，请手动复制");
    }
    document.body.removeChild(textArea);
  }

  function showToast(msg) {
    const toast = document.getElementById("toast");
    const toastMsg = document.getElementById("toast-msg");
    if (!toast || !toastMsg) return;

    toastMsg.textContent = msg;
    toast.classList.add("show");

    if (window.toastTimeout) clearTimeout(window.toastTimeout);
    window.toastTimeout = setTimeout(() => {
      toast.classList.remove("show");
    }, 2000);
  }

  // --- 4. 弹窗控制 ---
  window.toggleModal = function (modalId) {
    const modal = document.getElementById(modalId);
    if (!modal) return;
    const style = window.getComputedStyle(modal);
    if (style.display === "flex") {
      modal.style.display = "none";
    } else {
      modal.style.display = "flex";
    }
  };

  window.openTutorial = function () {
    const modal = document.getElementById("tutorial-modal");
    if (modal) modal.style.display = "flex";
  };

  function closeModalOnOutside(event) {
    if (event.target.classList.contains("modal")) {
      event.target.style.display = "none";
      event.preventDefault();
    }
  }
  window.addEventListener("click", closeModalOnOutside);
  window.addEventListener("touchend", closeModalOnOutside);

  // --- 5. 教程 Tab 切换 ---
  window.switchTab = function (tabId) {
    document.querySelectorAll(".tab-btn").forEach((btn) => {
      btn.classList.remove("active");
    });
    document.querySelectorAll(".tab-pane").forEach((pane) => {
      pane.classList.remove("active");
    });

    const btns = document.querySelectorAll(".tab-btn");
    btns.forEach((btn) => {
      if (btn.getAttribute("onclick").includes(tabId)) {
        btn.classList.add("active");
      }
    });

    const target = document.getElementById(tabId);
    if (target) target.classList.add("active");
  };
});
