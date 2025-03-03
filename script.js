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

    // 复制链接功能
    window.copyToClipboard = function (text) {
        navigator.clipboard.writeText(text).then(() => {
            showToast('复制成功！');
        }).catch(err => {
            console.error('复制失败:', err);
            showToast('复制失败，请手动复制');
        });
    };

    // Toast提示函数
    function showToast(message, type = 'success') {
        // 移除现有的toast
        const existingToast = document.querySelector('.toast');
        if (existingToast) {
            existingToast.remove();
        }

        // 创建新的toast
        const toast = document.createElement('div');
        toast.className = 'toast';
        toast.innerHTML = `
            <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
            <span>${message}</span>
        `;

        // 添加到页面
        document.body.appendChild(toast);

        // 触发重排以确保动画生效
        toast.offsetHeight;

        // 显示toast
        toast.classList.add('show');

        // 3秒后隐藏
        setTimeout(() => {
            toast.classList.remove('show');
            // 等待过渡动画完成后移除元素
            setTimeout(() => {
                toast.remove();
            }, 300);
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
}); 