/* ═══════════════════════════════════════════════════════════
   DEALIX.IN — INTERACTION ENGINE
   Every animation serves a purpose. Every effect drives perception.
   ═══════════════════════════════════════════════════════════ */

(function () {
    'use strict';

    // ─── PAGE TRANSITION ───
    const pageTransition = document.getElementById('pageTransition');
    if (pageTransition) {
        window.addEventListener('load', () => {
            setTimeout(() => {
                pageTransition.classList.add('done');
                setTimeout(() => {
                    pageTransition.style.display = 'none';
                }, 600);
            }, 400);
        });
    }

    // ─── NAVBAR SCROLL ───
    const nav = document.getElementById('mainNav');
    if (nav) {
        let lastY = 0;
        const pinThreshold = 60;

        const handleNavScroll = () => {
            const y = window.pageYOffset;
            if (y > pinThreshold) {
                nav.classList.add('pinned');
            } else {
                nav.classList.remove('pinned');
            }
            lastY = y;
        };

        window.addEventListener('scroll', handleNavScroll, { passive: true });
    }

    // ─── MOBILE MENU ───
    const hamburger = document.getElementById('hamburger');
    const mobileNav = document.getElementById('mobileNav');

    if (hamburger && mobileNav) {
        const toggleMobile = () => {
            hamburger.classList.toggle('open');
            mobileNav.classList.toggle('open');
            document.body.style.overflow = mobileNav.classList.contains('open') ? 'hidden' : '';
        };

        hamburger.addEventListener('click', toggleMobile);

        mobileNav.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('open');
                mobileNav.classList.remove('open');
                document.body.style.overflow = '';
            });
        });
    }

    // ─── SCROLL REVEAL ───
    const revealEls = document.querySelectorAll('.reveal, .reveal-scale');

    if (revealEls.length > 0) {
        const revealObserver = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('visible');
                    }
                });
            },
            {
                threshold: 0.12,
                rootMargin: '0px 0px -60px 0px',
            }
        );

        revealEls.forEach((el) => revealObserver.observe(el));
    }

    // ─── COUNTER ANIMATION ───
    function animateNumber(el, target, suffix = '', duration = 2000) {
        let current = 0;
        const step = target / (duration / 16);
        const isDecimal = String(target).includes('.');

        const tick = () => {
            current += step;
            if (current >= target) {
                current = target;
                el.textContent = (isDecimal ? current.toFixed(1) : Math.floor(current)) + suffix;
                return;
            }
            el.textContent = (isDecimal ? current.toFixed(1) : Math.floor(current)) + suffix;
            requestAnimationFrame(tick);
        };

        requestAnimationFrame(tick);
    }

    // Trigger counters
    const counterEls = document.querySelectorAll('[data-count]');
    if (counterEls.length > 0) {
        const counterObserver = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        const el = entry.target;
                        const target = parseFloat(el.dataset.count);
                        const suffix = el.dataset.suffix || '';
                        const duration = parseInt(el.dataset.duration) || 2000;
                        animateNumber(el, target, suffix, duration);
                        counterObserver.unobserve(el);
                    }
                });
            },
            { threshold: 0.5 }
        );

        counterEls.forEach((el) => counterObserver.observe(el));
    }

    // ─── PARTICLES ───
    const particlesContainer = document.getElementById('particles');
    if (particlesContainer) {
        const count = window.innerWidth < 768 ? 12 : 30;

        for (let i = 0; i < count; i++) {
            const p = document.createElement('div');
            p.classList.add('particle');
            const size = Math.random() * 3 + 1;
            p.style.width = size + 'px';
            p.style.height = size + 'px';
            p.style.left = Math.random() * 100 + '%';
            p.style.setProperty('--drift', (Math.random() * 100 - 50) + 'px');
            p.style.animationDuration = (Math.random() * 10 + 8) + 's';
            p.style.animationDelay = (Math.random() * 12) + 's';
            particlesContainer.appendChild(p);
        }
    }

    // ─── CUSTOM CURSOR ───
    const cursor = document.getElementById('customCursor');
    const cursorDot = document.getElementById('customCursorDot');

    if (cursor && cursorDot && window.matchMedia('(pointer: fine)').matches) {
        let mouseX = 0, mouseY = 0;
        let cursorX = 0, cursorY = 0;
        let dotX = 0, dotY = 0;
        let visible = false;

        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
            if (!visible) {
                cursor.style.opacity = '1';
                cursorDot.style.opacity = '1';
                visible = true;
            }
        });

        document.addEventListener('mouseleave', () => {
            cursor.style.opacity = '0';
            cursorDot.style.opacity = '0';
            visible = false;
        });

        // Smooth follow
        const lerp = (a, b, t) => a + (b - a) * t;

        const updateCursor = () => {
            cursorX = lerp(cursorX, mouseX, 0.12);
            cursorY = lerp(cursorY, mouseY, 0.12);
            dotX = lerp(dotX, mouseX, 0.35);
            dotY = lerp(dotY, mouseY, 0.35);

            cursor.style.transform = `translate(${cursorX - 20}px, ${cursorY - 20}px)`;
            cursorDot.style.transform = `translate(${dotX - 4}px, ${dotY - 4}px)`;

            requestAnimationFrame(updateCursor);
        };

        updateCursor();

        // Hover effect on interactive elements
        const hoverTargets = document.querySelectorAll(
            'a, button, .glass, .folio-card, .process-card, .faq-trigger, input, textarea, select'
        );

        hoverTargets.forEach((el) => {
            el.addEventListener('mouseenter', () => {
                cursor.classList.add('cursor-hover');
                cursorDot.classList.add('dot-hover');
            });
            el.addEventListener('mouseleave', () => {
                cursor.classList.remove('cursor-hover');
                cursorDot.classList.remove('dot-hover');
            });
        });
    }

    // ─── MAGNETIC BUTTONS ───
    if (window.matchMedia('(pointer: fine)').matches) {
        document.querySelectorAll('.btn-prime, .btn-ghost').forEach((btn) => {
            btn.addEventListener('mousemove', (e) => {
                const rect = btn.getBoundingClientRect();
                const x = e.clientX - rect.left - rect.width / 2;
                const y = e.clientY - rect.top - rect.height / 2;

                btn.style.transform = `translate(${x * 0.18}px, ${y * 0.18}px)`;
            });

            btn.addEventListener('mouseleave', () => {
                btn.style.transform = '';
                btn.style.transition = 'transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)';
                setTimeout(() => {
                    btn.style.transition = '';
                }, 500);
            });
        });
    }

    // ─── PARALLAX ORBS ───
    if (window.matchMedia('(min-width: 768px)').matches) {
        const orbs = document.querySelectorAll('.orb');
        if (orbs.length > 0) {
            window.addEventListener(
                'scroll',
                () => {
                    const y = window.pageYOffset;
                    orbs.forEach((orb, i) => {
                        const speed = (i + 1) * 0.04;
                        orb.style.transform = `translateY(${y * speed}px)`;
                    });
                },
                { passive: true }
            );
        }
    }

    // ─── ACTIVE NAV LINK ───
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');

    if (sections.length > 0 && navLinks.length > 0) {
        window.addEventListener(
            'scroll',
            () => {
                let current = '';
                sections.forEach((s) => {
                    const top = s.offsetTop - 250;
                    if (window.pageYOffset >= top) {
                        current = s.getAttribute('id');
                    }
                });

                navLinks.forEach((link) => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') && link.getAttribute('href').includes(current)) {
                        link.classList.add('active');
                    }
                });
            },
            { passive: true }
        );
    }

    // ─── SMOOTH ANCHOR SCROLL ───
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href === '#') return;
            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                const offset = target.getBoundingClientRect().top + window.pageYOffset - 90;
                window.scrollTo({ top: offset, behavior: 'smooth' });
            }
        });
    });

    // ─── PAGE LINK TRANSITIONS ───
    document.querySelectorAll('a[href$=".html"]').forEach((link) => {
        link.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (!href || href.startsWith('http')) return;

            e.preventDefault();

            // Create transition overlay
            const overlay = document.createElement('div');
            overlay.style.cssText = `
                position: fixed; inset: 0; background: #050505; z-index: 99999;
                opacity: 0; transition: opacity 0.4s ease; pointer-events: none;
            `;
            document.body.appendChild(overlay);

            requestAnimationFrame(() => {
                overlay.style.opacity = '1';
            });

            setTimeout(() => {
                window.location.href = href;
            }, 400);
        });
    });

    // ─── FAQ ACCORDION ───
    document.querySelectorAll('.faq-trigger').forEach((trigger) => {
        trigger.addEventListener('click', () => {
            const item = trigger.closest('.faq-item');
            const answer = item.querySelector('.faq-answer');
            const inner = answer.querySelector('.faq-answer-inner');
            const isOpen = item.classList.contains('open');

            // Close all
            document.querySelectorAll('.faq-item.open').forEach((openItem) => {
                if (openItem !== item) {
                    openItem.classList.remove('open');
                    openItem.querySelector('.faq-answer').style.maxHeight = '0';
                }
            });

            if (isOpen) {
                item.classList.remove('open');
                answer.style.maxHeight = '0';
            } else {
                item.classList.add('open');
                answer.style.maxHeight = inner.scrollHeight + 40 + 'px';
            }
        });
    });

    // ─── TILT EFFECT ON CARDS ───
    if (window.matchMedia('(pointer: fine)').matches) {
        document.querySelectorAll('.glass, .folio-card').forEach((card) => {
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = (e.clientX - rect.left) / rect.width - 0.5;
                const y = (e.clientY - rect.top) / rect.height - 0.5;

                card.style.transform = `
                    translateY(-6px)
                    perspective(800px)
                    rotateX(${y * -4}deg)
                    rotateY(${x * 4}deg)
                `;
            });

            card.addEventListener('mouseleave', () => {
                card.style.transform = '';
                card.style.transition = 'transform 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)';
                setTimeout(() => {
                    card.style.transition = '';
                }, 600);
            });
        });
    }

    // ─── FORM VALIDATION VISUAL FEEDBACK ───
    document.querySelectorAll('.form-input, .form-textarea').forEach((input) => {
        input.addEventListener('blur', () => {
            if (input.value.trim().length > 0) {
                input.style.borderColor = 'rgba(0, 255, 136, 0.3)';
            } else {
                input.style.borderColor = '';
            }
        });
    });

    // ─── PRELOAD CRITICAL FONT ───
    if ('fonts' in document) {
        Promise.all([
            document.fonts.load('700 1em "Space Grotesk"'),
            document.fonts.load('400 1em "Inter"'),
            document.fonts.load('500 1em "JetBrains Mono"'),
        ]).then(() => {
            document.documentElement.classList.add('fonts-loaded');
        });
    }

})();