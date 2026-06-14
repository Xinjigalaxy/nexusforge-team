(function() {
    // === DOM 元素 ===
    const navbar = document.getElementById('navbar');
    const navLinks = document.getElementById('navLinks');
    const hamburger = document.getElementById('hamburger');
    const mobileOverlay = document.getElementById('mobileOverlay');
    const backToTop = document.getElementById('backToTop');
    const allNavAnchors = navLinks.querySelectorAll('a');

    // === 汉堡菜单切换 ===
    function openMenu() {
        navLinks.classList.add('open');
        hamburger.classList.add('active');
        mobileOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeMenu() {
        navLinks.classList.remove('open');
        hamburger.classList.remove('active');
        mobileOverlay.classList.remove('active');
        document.body.style.overflow = '';
    }

    hamburger.addEventListener('click', () => {
        if (navLinks.classList.contains('open')) {
            closeMenu();
        } else {
            openMenu();
        }
    });

    mobileOverlay.addEventListener('click', closeMenu);

    allNavAnchors.forEach(anchor => {
        anchor.addEventListener('click', () => {
            closeMenu();
            allNavAnchors.forEach(a => a.classList.remove('active'));
            anchor.classList.add('active');
        });
    });

    // === 导航栏滚动阴影 ===
    function updateNavShadow() {
        if (window.scrollY > 20) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    }

    // === 回到顶部按钮显隐 ===
    function updateBackToTop() {
        if (window.scrollY > 600) {
            backToTop.classList.add('visible');
        } else {
            backToTop.classList.remove('visible');
        }
    }

    // === 滚动时高亮当前区块对应的导航链接 ===
    function updateActiveNavLink() {
        const sections = document.querySelectorAll('section[id]');
        const scrollPos = window.scrollY + 120;
        let currentSectionId = '';

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
                currentSectionId = section.getAttribute('id');
            }
        });

        allNavAnchors.forEach(anchor => {
            anchor.classList.remove('active');
            if (anchor.getAttribute('href') === '#' + currentSectionId) {
                anchor.classList.add('active');
            }
        });

        if (window.scrollY < 200 && !currentSectionId) {
            allNavAnchors.forEach(a => a.classList.remove('active'));
            const homeLink = navLinks.querySelector('a[href="#hero"]');
            if (homeLink) homeLink.classList.add('active');
        }
    }

    // === 数字滚动动画 ===
    function animateCounters() {
        const counters = document.querySelectorAll('.stat-number[data-count]');
        counters.forEach(counter => {
            const target = parseInt(counter.getAttribute('data-count'));
            const current = parseInt(counter.textContent) || 0;
            if (current === target) return;

            const duration = 1500;
            const startTime = performance.now();

            function update(now) {
                const elapsed = now - startTime;
                const progress = Math.min(elapsed / duration, 1);
                const eased = 1 - Math.pow(1 - progress, 3);
                const value = Math.round(eased * target);
                counter.textContent = value + (target === 100 ? '%' : '');
                if (progress < 1) {
                    requestAnimationFrame(update);
                } else {
                    counter.textContent = target + (target === 100 ? '%' : '');
                }
            }

            requestAnimationFrame(update);
        });
    }

    // === 使用 IntersectionObserver 触发计数器动画 ===
    const aboutSection = document.getElementById('about');
    let countersAnimated = false;
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !countersAnimated) {
                countersAnimated = true;
                animateCounters();
            }
        });
    }, { threshold: 0.35 });

    if (aboutSection) {
        observer.observe(aboutSection);
    }

    // === 全局滚动监听（合并优化） ===
    let ticking = false;
    function onScroll() {
        if (!ticking) {
            requestAnimationFrame(() => {
                updateNavShadow();
                updateBackToTop();
                updateActiveNavLink();
                ticking = false;
            });
            ticking = true;
        }
    }

    window.addEventListener('scroll', onScroll, { passive: true });

    // === 回到顶部点击 ===
    backToTop.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    // === 键盘 ESC 关闭菜单 ===
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && navLinks.classList.contains('open')) {
            closeMenu();
        }
    });

    // === 初始状态检查 ===
    updateNavShadow();
    updateBackToTop();
    updateActiveNavLink();

    // 页面加载完成后若 about 已在视口则触发动画
    setTimeout(() => {
        if (aboutSection && !countersAnimated) {
            const rect = aboutSection.getBoundingClientRect();
            if (rect.top < window.innerHeight && rect.bottom > 0) {
                countersAnimated = true;
                animateCounters();
            }
        }
    }, 400);

    console.log('🔥 删库跑路团队页面已就绪！');
    console.log('   成员：吉洋、黄灵果、夏考洪、雷骐源、温厚焜、陈涛、蒋熹奉、辛俊');
})();
