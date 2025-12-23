// --- 1. 资源加载动画逻辑 (立即执行，不等待 DOMContentLoaded) ---
(function initLoader() {
  const loadingScreen = document.getElementById("loading-screen");
  const progressBar = document.getElementById("progress-bar");
  const progressText = document.getElementById("progress-text"); // 记得在 HTML 里加这个 span

  // 确保元素存在
  if (!loadingScreen || !progressBar) return;

  let width = 0;
  // 使用更平滑的动画间隔 (30ms = 约30fps)
  const interval = setInterval(() => {
    // 随机增加进度，但前期快，后期慢，模拟真实感
    let increment = Math.random() * 2;
    if (width > 70) increment = Math.random() * 0.5; // 70%后变慢
    if (width > 90) increment = Math.random() * 0.2; // 90%后更慢，等待页面加载

    width += increment;

    // 如果页面已经完全加载(window.loaded 标记)，允许跑到 100%
    // 否则卡在 95% 等待资源
    if (width >= 95 && !window.pageLoaded) {
      width = 95;
    }

    if (width >= 100) {
      width = 100;
      clearInterval(interval);

      // 更新 UI 到 100%
      progressBar.style.width = "100%";
      if (progressText) progressText.innerText = "100%";

      // 稍微停顿一下让用户看到 100%，然后消失
      setTimeout(() => {
        loadingScreen.classList.add("fade-out");
        document.body.style.overflow = "auto"; // 恢复滚动

        // 动画结束后彻底移除，释放内存（可选）
        setTimeout(() => {
          loadingScreen.style.display = "none";
        }, 600);
      }, 500);
    } else {
      progressBar.style.width = width + "%";
      if (progressText) progressText.innerText = Math.floor(width) + "%";
    }
  }, 30); // 30ms 更新一次

  // 监听整个页面资源加载完毕（包括图片、CSS）
  window.addEventListener("load", () => {
    window.pageLoaded = true;
    // 如果加载很快，直接加速进度条到 100
    width = Math.max(width, 80);
  });
})();

document.addEventListener("DOMContentLoaded", () => {
  // --- 2. 配置与密码逻辑 ---
  const CONFIG = {
    // 你可以在浏览器控制台输入 btoa('你的密码')
    PASSWORD_B64: "MDg3MQ==", // 密码0871
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
      // 优先使用新版 API
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

    // 清除之前的定时器，防止快速点击时闪烁
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

  // 点击空白关闭弹窗
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
