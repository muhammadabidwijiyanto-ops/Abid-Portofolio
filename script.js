/**
 * ==========================================================================
 * THE ANALYTICAL ARCHITECT — JAVASCRIPT INTERACTIONS
 * Portfolio of Muhammad Abid Wijiyanto
 * Mathematics | Data Analysis, Business & Operations
 * ==========================================================================
 */

document.addEventListener('DOMContentLoaded', () => {
    // Check for user's reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    /* ----------------------------------------------------------------------
       1. STICKY NAVBAR SCROLL BLUR EFFECT
       ---------------------------------------------------------------------- */
    const headerWrapper = document.getElementById('headerWrapper');
    const scrollThreshold = 35;

    const handleNavbarScroll = () => {
        if (!headerWrapper) return;
        if (window.scrollY > scrollThreshold) {
            headerWrapper.classList.add('scrolled');
        } else {
            headerWrapper.classList.remove('scrolled');
        }
    };

    window.addEventListener('scroll', handleNavbarScroll, { passive: true });
    handleNavbarScroll(); // Initial check

    /* ----------------------------------------------------------------------
       2. SCROLLSPY (ACTIVE NAVIGATION LINK TRACKER)
       ---------------------------------------------------------------------- */
    const sections = document.querySelectorAll('section[id]');
    const navItems = document.querySelectorAll('.nav-links .nav-item');
    const mobileNavItems = document.querySelectorAll('.mobile-nav-links .mobile-nav-item');

    const updateActiveNav = (currentId) => {
        navItems.forEach(link => {
            const href = link.getAttribute('href');
            if (href === `#${currentId}`) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });

        mobileNavItems.forEach(link => {
            const href = link.getAttribute('href');
            if (href === `#${currentId}`) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
    };

    // IntersectionObserver for robust section detection
    if ('IntersectionObserver' in window && sections.length > 0) {
        const observerOptions = {
            root: null,
            rootMargin: '-20% 0px -55% 0px',
            threshold: 0
        };

        const sectionObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const currentId = entry.target.getAttribute('id');
                    updateActiveNav(currentId);
                }
            });
        }, observerOptions);

        sections.forEach(section => sectionObserver.observe(section));
    }

    // Scroll listener for bottom-of-page edge case detection
    window.addEventListener('scroll', () => {
        // If at bottom of page, highlight contact
        if ((window.innerHeight + window.scrollY) >= (document.documentElement.scrollHeight - 60)) {
            updateActiveNav('contact');
        }
    }, { passive: true });

    /* ----------------------------------------------------------------------
       3. MOBILE NAVIGATION DRAWER
       ---------------------------------------------------------------------- */
    const mobileToggle = document.getElementById('mobileNavToggle');
    const mobileDrawer = document.getElementById('mobileDrawer');
    const mobileOverlay = document.getElementById('mobileDrawerOverlay');

    const openDrawer = () => {
        if (!mobileDrawer || !mobileOverlay) return;
        mobileDrawer.classList.add('open');
        mobileOverlay.classList.add('active');
        if (mobileToggle) {
            mobileToggle.setAttribute('aria-expanded', 'true');
        }
        document.body.style.overflow = 'hidden';
    };

    const closeDrawer = () => {
        if (!mobileDrawer || !mobileOverlay) return;
        mobileDrawer.classList.remove('open');
        mobileOverlay.classList.remove('active');
        if (mobileToggle) {
            mobileToggle.setAttribute('aria-expanded', 'false');
        }
        document.body.style.overflow = '';
    };

    if (mobileToggle) {
        mobileToggle.addEventListener('click', () => {
            const isOpen = mobileDrawer?.classList.contains('open');
            if (isOpen) {
                closeDrawer();
            } else {
                openDrawer();
            }
        });
    }

    if (mobileOverlay) {
        mobileOverlay.addEventListener('click', closeDrawer);
    }

    // Close mobile drawer when clicking navigation links inside it
    if (mobileNavItems.length > 0) {
        mobileNavItems.forEach(link => {
            link.addEventListener('click', closeDrawer);
        });
    }

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && mobileDrawer?.classList.contains('open')) {
            closeDrawer();
        }
    });

    /* ----------------------------------------------------------------------
       4. EXPERIENCE CATEGORY FILTER TABS
       ---------------------------------------------------------------------- */
    const filterButtons = document.querySelectorAll('.experience-tabs-nav .exp-tab-btn');
    const categoryGroups = document.querySelectorAll('.exp-category-group');

    if (filterButtons.length > 0 && categoryGroups.length > 0) {
        filterButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                const targetFilter = btn.getAttribute('data-filter');

                // Update active button state
                filterButtons.forEach(b => {
                    b.classList.remove('active');
                    b.setAttribute('aria-selected', 'false');
                });
                btn.classList.add('active');
                btn.setAttribute('aria-selected', 'true');

                // Filter category display with smooth transition
                categoryGroups.forEach(group => {
                    const groupCat = group.getAttribute('data-category');

                    if (targetFilter === 'all' || groupCat === targetFilter) {
                        group.style.display = 'block';
                        if (!prefersReducedMotion) {
                            group.style.opacity = '0';
                            group.style.transform = 'translateY(6px)';
                            setTimeout(() => {
                                group.style.transition = 'opacity 0.22s ease, transform 0.22s ease';
                                group.style.opacity = '1';
                                group.style.transform = 'translateY(0)';
                            }, 10);
                        }
                    } else {
                        group.style.display = 'none';
                    }
                });
            });
        });
    }

    /* ----------------------------------------------------------------------
       5. BACK TO TOP BUTTON
       ---------------------------------------------------------------------- */
    const backToTopBtn = document.getElementById('backToTopBtn');
    if (backToTopBtn) {
        backToTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: prefersReducedMotion ? 'auto' : 'smooth'
            });
        });
    }

    /* ----------------------------------------------------------------------
       6. CONSOLE SIGNATURE
       ---------------------------------------------------------------------- */
    console.log(
        '%c Muhammad Abid Wijiyanto %c Mathematics & Data Analytics Portfolio ',
        'background: #38bdf8; color: #07090e; font-weight: 800; padding: 4px 8px; border-radius: 4px 0 0 4px;',
        'background: #0d131f; color: #cbd5e1; font-weight: 500; padding: 4px 8px; border-radius: 0 4px 4px 0;'
    );
});
