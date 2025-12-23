document.addEventListener("DOMContentLoaded", () => {
  // --- 1. 资源加载动画逻辑 ---
  const loadingScreen = document.getElementById("loading-screen");
  const progressBar = document.getElementById("progress-bar");

  // 模拟加载进度 (为了展示动画效果)
  let width = 0;
  const interval = setInterval(() => {
    if (width >= 100) {
      clearInterval(interval);
      // 进度条满后，隐藏遮罩
      setTimeout(() => {
        loadingScreen.style.opacity = "0";
        loadingScreen.style.visibility = "hidden";
      }, 300);
    } else {
      // 随机增加进度，模拟真实网络波动
      width += Math.random() * 10;
      if (width > 100) width = 100;
      progressBar.style.width = width + "%";
    }
  }, 100); // 每100ms更新一次

  // --- 2. 配置与密码逻辑 ---
  const CONFIG = {
    // 你可以在浏览器控制台输入 btoa('你的密码')
    PASSWORD_B64: "MDg3MQ==", // 密码123456
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
      const { timestamp } = JSON.parse(authData);
      const now = new Date().getTime();
      if (now - timestamp < CONFIG.EXPIRE_HOURS * 60 * 60 * 1000) {
        showMain();
        return;
      }
    }
    showLogin();
  }

  function handleLogin() {
    const inputPwd = passwordInput.value.trim();
    // 将用户输入转为 Base64 进行比对
    // 注意：这只是简单的混淆，防止直接看源码看到密码
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

  loginBtn.addEventListener("click", handleLogin);
  passwordInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") handleLogin();
  });

  function showMain() {
    loginSection.classList.remove("active-section");
    loginSection.classList.add("hidden-section");
    mainSection.classList.remove("hidden-section");
    mainSection.classList.add("active-section");
    window.scrollTo(0, 0);
  }

  function showLogin() {
    mainSection.classList.remove("active-section");
    mainSection.classList.add("hidden-section");
    loginSection.classList.remove("hidden-section");
    loginSection.classList.add("active-section");
  }

  window.logout = function () {
    localStorage.removeItem(CONFIG.AUTH_KEY);
    passwordInput.value = "";
    showLogin();
  };

  // --- 3. 复制功能 ---
  window.copyText = function (text) {
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
  };

  function showToast(msg) {
    const toast = document.getElementById("toast");
    const toastMsg = document.getElementById("toast-msg");
    toastMsg.textContent = msg;
    toast.classList.add("show");
    setTimeout(() => {
      toast.classList.remove("show");
    }, 2000);
  }

  // --- 4. 弹窗控制 (通用) ---
  window.toggleModal = function (modalId) {
    const modal = document.getElementById(modalId);
    if (modal.style.display === "flex") {
      modal.style.display = "none";
    } else {
      modal.style.display = "flex";
    }
  };

  // 专门打开教程
  window.openTutorial = function () {
    const modal = document.getElementById("tutorial-modal");
    modal.style.display = "flex";
  };

  // --- 4. 弹窗控制 (通用) ---
  window.toggleModal = function (modalId) {
    const modal = document.getElementById(modalId);
    // 使用 getComputedStyle 获取真实显示状态，更加稳健
    const style = window.getComputedStyle(modal);
    if (style.display === "flex") {
      modal.style.display = "none";
    } else {
      modal.style.display = "flex";
    }
  };

  // 专门打开教程
  window.openTutorial = function () {
    const modal = document.getElementById("tutorial-modal");
    modal.style.display = "flex";
  };

  // --- 修改：点击或触摸空白处关闭弹窗 (兼容手机端) ---
  function closeModalOnOutside(event) {
    if (event.target.classList.contains("modal")) {
      event.target.style.display = "none";
      // 阻止事件冒泡，防止误触
      event.preventDefault();
    }
  }

  // 同时监听鼠标点击和触摸结束事件
  window.addEventListener("click", closeModalOnOutside);
  window.addEventListener("touchend", closeModalOnOutside);

  // --- 5. 教程 Tab 切换 ---
  window.switchTab = function (tabId) {
    // 1. 移除所有 tab 按钮的 active 类
    document.querySelectorAll(".tab-btn").forEach((btn) => {
      btn.classList.remove("active");
    });
    // 2. 隐藏所有内容区域
    document.querySelectorAll(".tab-pane").forEach((pane) => {
      pane.classList.remove("active");
    });

    // 3. 激活当前点击的按钮 (通过 event 获取有点麻烦，这里简化处理)
    // 找到调用此函数的按钮
    const btns = document.querySelectorAll(".tab-btn");
    btns.forEach((btn) => {
      if (btn.getAttribute("onclick").includes(tabId)) {
        btn.classList.add("active");
      }
    });

    // 4. 显示对应内容
    document.getElementById(tabId).classList.add("active");
  };
});
