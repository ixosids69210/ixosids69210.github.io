// 等待DOM完全加载
document.addEventListener('DOMContentLoaded', function () {
    // 移动端菜单切换
    const menuToggle = document.querySelector('.menu-toggle');
    const navMenu = document.querySelector('.nav-menu');

    if (menuToggle) {
        menuToggle.addEventListener('click', function () {
            navMenu.classList.toggle('active');
            this.querySelector('i').classList.toggle('fa-bars');
            this.querySelector('i').classList.toggle('fa-times');
        });
    }

    // 点击导航链接后关闭菜单
    const navLinks = document.querySelectorAll('.nav-menu a');

    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (navMenu.classList.contains('active')) {
                navMenu.classList.remove('active');
                menuToggle.querySelector('i').classList.add('fa-bars');
                menuToggle.querySelector('i').classList.remove('fa-times');
            }
        });
    });

    // 复制到剪贴板功能
    window.copyToClipboard = function(text) {
        // 创建临时输入框
        const input = document.createElement('input');
        input.style.position = 'fixed';
        input.style.opacity = 0;
        input.value = text;
        document.body.appendChild(input);
        
        // 选择文本
        input.select();
        input.setSelectionRange(0, 99999);
        
        try {
            // 执行复制命令
            document.execCommand('copy');
            // 显示成功提示
            showToast('复制成功！');
        } catch (err) {
            console.error('复制失败:', err);
            showToast('复制失败，请手动复制');
        }
        
        // 移除临时输入框
        document.body.removeChild(input);
    }

    // 显示提示框
    function showToast(message) {
        // 检查是否已存在toast
        let toast = document.querySelector('.toast');
        
        // 如果不存在则创建新的toast
        if (!toast) {
            toast = document.createElement('div');
            toast.className = 'toast';
            document.body.appendChild(toast);
        }
        
        // 设置提示内容
        toast.innerHTML = `
            <i class="fas fa-check-circle"></i>
            <span>${message}</span>
        `;
        
        // 显示提示
        toast.classList.add('show');
        
        // 3秒后隐藏
        setTimeout(() => {
            toast.classList.remove('show');
        }, 3000);
    }

    // 手风琴菜单
    const accordionItems = document.querySelectorAll('.accordion-item');

    accordionItems.forEach(item => {
        const header = item.querySelector('.accordion-header');
        header.addEventListener('click', () => {
            const isActive = item.classList.contains('active');

            // 关闭所有面板
            accordionItems.forEach(otherItem => {
                otherItem.classList.remove('active');
            });

            // 如果当前面板不是活动的，则打开它
            if (!isActive) {
                item.classList.add('active');
            }
        });
    });

    // 监听窗口滚动，显示/隐藏返回顶部按钮
    const backToTop = document.querySelector('.back-to-top');

    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 300) {
            backToTop.style.opacity = '1';
            backToTop.style.visibility = 'visible';
        } else {
            backToTop.style.opacity = '0';
            backToTop.style.visibility = 'hidden';
        }
    });

    // 平滑滚动实现
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();

            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);

            if (targetElement) {
                const headerOffset = 70;
                const elementPosition = targetElement.offsetTop;
                const offsetPosition = elementPosition - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // 导航栏滚动效果
    let lastScrollTop = 0;
    const navbar = document.querySelector('.navbar');

    window.addEventListener('scroll', () => {
        let scrollTop = window.pageYOffset || document.documentElement.scrollTop;

        if (scrollTop > lastScrollTop && scrollTop > 100) {
            navbar.style.transform = 'translateY(-100%)';
        } else {
            navbar.style.transform = 'translateY(0)';
            navbar.style.backgroundColor = scrollTop > 20 ? '#fff' : 'transparent';
            navbar.style.boxShadow = scrollTop > 20 ? '0 2px 10px rgba(0, 0, 0, 0.1)' : 'none';
        }

        lastScrollTop = scrollTop;
    });

    // 弹出式公告控制
    const announcementModal = document.getElementById('announcementModal');
    const closeAnnouncement = document.querySelector('.close-announcement');

    // 显示公告
    setTimeout(function () {
        announcementModal.style.display = 'flex';
        // 触发重排以确保过渡效果生效
        announcementModal.offsetHeight;
        announcementModal.classList.add('show');
        document.body.style.overflow = 'hidden';
    }, 1000);

    // 关闭公告
    closeAnnouncement.addEventListener('click', function () {
        announcementModal.classList.remove('show');
        announcementModal.classList.add('fade-out');

        setTimeout(function () {
            announcementModal.style.display = 'none';
            document.body.style.overflow = 'auto';
            announcementModal.classList.remove('fade-out');
        }, 300);
    });

    // 点击模态框外部关闭
    window.addEventListener('click', function (event) {
        if (event.target == announcementModal) {
            announcementModal.classList.remove('show');
            announcementModal.classList.add('fade-out');

            setTimeout(function () {
                announcementModal.style.display = 'none';
                document.body.style.overflow = 'auto';
                announcementModal.classList.remove('fade-out');
            }, 300);
        }
    });

    // 资源加载进度控制
    const progressBar = document.getElementById('progressBar');
    const loadingText = document.getElementById('loadingText');
    const loadingOverlay = document.getElementById('loadingOverlay');
    let progress = 0;

    // 模拟资源加载进度
    const interval = setInterval(() => {
        progress += Math.random() * 30;
        if (progress > 100) progress = 100;

        progressBar.style.width = progress + '%';
        loadingText.textContent = `正在加载资源... ${Math.floor(progress)}%`;

        if (progress === 100) {
            clearInterval(interval);
            setTimeout(() => {
                loadingOverlay.style.opacity = '0';
                setTimeout(() => {
                    loadingOverlay.style.display = 'none';
                }, 300);
            }, 500);
        }
    }, 200);
}); 