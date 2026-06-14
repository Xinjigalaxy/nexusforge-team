(function() {
    const navbar = document.getElementById('navbar');
    const navLinks = document.getElementById('navLinks');
    const hamburger = document.getElementById('hamburger');
    const mobileOverlay = document.getElementById('mobileOverlay');
    const backToTop = document.getElementById('backToTop');
    const allNavAnchors = navLinks.querySelectorAll('a');

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
        navLinks.classList.contains('open') ? closeMenu() : openMenu();
    });
    mobileOverlay.addEventListener('click', closeMenu);

    allNavAnchors.forEach(anchor => {
        anchor.addEventListener('click', () => {
            closeMenu();
            allNavAnchors.forEach(a => a.classList.remove('active'));
            anchor.classList.add('active');
        });
    });

    function updateNavActive() {
        const sections = document.querySelectorAll('section[id]');
        let current = '';
        const scrollPos = window.scrollY + 100;
        sections.forEach(section => {
            const top = section.offsetTop;
            const height = section.offsetHeight;
            if (scrollPos >= top && scrollPos < top + height) {
                current = section.getAttribute('id');
            }
        });
        allNavAnchors.forEach(a => {
            a.classList.remove('active');
            if (a.getAttribute('href') === '#' + current) a.classList.add('active');
        });
    }

    function animateCounters() {
        const counters = document.querySelectorAll('.stat-number[data-count]');
        counters.forEach(counter => {
            const target = +counter.getAttribute('data-count');
            if (parseInt(counter.textContent) === target) return;
            const duration = 1400;
            const start = performance.now();
            function update(now) {
                const elapsed = now - start;
                const progress = Math.min(elapsed / duration, 1);
                const value = Math.round(progress * target);
                counter.textContent = value + (target === 100 ? '%' : '');
                if (progress < 1) requestAnimationFrame(update);
                else counter.textContent = target + (target === 100 ? '%' : '');
            }
            requestAnimationFrame(update);
        });
    }

    const aboutSection = document.getElementById('about');
    let animated = false;
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !animated) {
                animated = true;
                animateCounters();
            }
        });
    }, { threshold: 0.3 });
    if (aboutSection) observer.observe(aboutSection);

    let ticking = false;
    window.addEventListener('scroll', () => {
        if (!ticking) {
            requestAnimationFrame(() => {
                updateNavActive();
                if (window.scrollY > 400) backToTop.classList.add('visible');
                else backToTop.classList.remove('visible');
                ticking = false;
            });
            ticking = true;
        }
    }, { passive: true });

    backToTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && navLinks.classList.contains('open')) closeMenu();
    });

    // 初始高亮
    updateNavActive();
    if (window.scrollY > 400) backToTop.classList.add('visible');
    setTimeout(() => {
        if (aboutSection && !animated) {
            const rect = aboutSection.getBoundingClientRect();
            if (rect.top < window.innerHeight && rect.bottom > 0) {
                animated = true;
                animateCounters();
            }
        }
    }, 500);
})();
