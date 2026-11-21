/**
 * Portfolio Interaction Script - Anusha N
 * Enhanced with:
 * 1. Mobile navigation toggle & keyboard accessibility
 * 2. In-button copy-to-clipboard for email
 * 3. Theme Toggle (Light / Dark)
 * 4. Active navigation link scroll spy (animated underline sync)
 * 5. Library 1 of 2: AOS (Animate On Scroll) initialization with stagger & reduced-motion checks
 * 6. Library 2 of 2: Lenis smooth momentum scrolling with anchor navigation integration
 * 7. Dynamic copyright year
 */

(function () {
  'use strict';

  const prefersReducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // --------------------------------------------------------------------------
  // 1. Mobile Navigation Toggle
  // --------------------------------------------------------------------------
  const mobileMenuBtn = document.getElementById('mobile-menu-btn');
  const mobileNav = document.getElementById('mobile-nav');

  if (mobileMenuBtn && mobileNav) {
    function toggleMobileMenu() {
      const isExpanded = mobileMenuBtn.getAttribute('aria-expanded') === 'true';
      const nextState = !isExpanded;

      mobileMenuBtn.setAttribute('aria-expanded', String(nextState));
      mobileNav.hidden = !nextState;
      mobileMenuBtn.setAttribute('aria-label', nextState ? 'Close navigation menu' : 'Open navigation menu');
    }

    function closeMobileMenu() {
      mobileMenuBtn.setAttribute('aria-expanded', 'false');
      mobileNav.hidden = true;
      mobileMenuBtn.setAttribute('aria-label', 'Open navigation menu');
    }

    mobileMenuBtn.addEventListener('click', function (e) {
      e.stopPropagation();
      toggleMobileMenu();
    });

    // Close mobile menu when clicking any nav link
    const mobileLinks = mobileNav.querySelectorAll('.mobile-nav-link');
    mobileLinks.forEach(function (link) {
      link.addEventListener('click', closeMobileMenu);
    });

    // Close when clicking outside of the mobile header
    document.addEventListener('click', function (e) {
      if (!mobileNav.hidden && !mobileNav.contains(e.target) && !mobileMenuBtn.contains(e.target)) {
        closeMobileMenu();
      }
    });

    // Close on Escape key
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && !mobileNav.hidden) {
        closeMobileMenu();
        mobileMenuBtn.focus();
      }
    });
  }

  // --------------------------------------------------------------------------
  // 2. Copy-to-Clipboard for Email
  // --------------------------------------------------------------------------
  const copyButtons = document.querySelectorAll('.copy-email-btn');

  copyButtons.forEach(function (btn) {
    btn.addEventListener('click', function () {
      const emailToCopy = btn.getAttribute('data-email') || 'anusha21narasimman@gmail.com';
      const btnText = btn.querySelector('.btn-text');
      const copyIcon = btn.querySelector('.copy-icon');
      const checkIcon = btn.querySelector('.check-icon');
      const originalText = btnText ? btnText.textContent : 'Copy Email';

      function setCopiedState() {
        if (btnText) btnText.textContent = 'Copied!';
        if (copyIcon) copyIcon.hidden = true;
        if (checkIcon) checkIcon.hidden = false;
        btn.setAttribute('aria-label', 'Email copied to clipboard');

        setTimeout(function () {
          if (btnText) btnText.textContent = originalText;
          if (copyIcon) copyIcon.hidden = false;
          if (checkIcon) checkIcon.hidden = true;
          btn.setAttribute('aria-label', 'Copy email address ' + emailToCopy);
        }, 2000);
      }

      // Modern Clipboard API with fallback
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(emailToCopy).then(setCopiedState).catch(function () {
          fallbackCopyText(emailToCopy, setCopiedState);
        });
      } else {
        fallbackCopyText(emailToCopy, setCopiedState);
      }
    });
  });

  function fallbackCopyText(text, onSuccess) {
    try {
      const textArea = document.createElement('textarea');
      textArea.value = text;
      textArea.style.position = 'fixed';
      textArea.style.left = '-9999px';
      textArea.style.top = '0';
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      const successful = document.execCommand('copy');
      document.body.removeChild(textArea);
      if (successful && onSuccess) {
        onSuccess();
      }
    } catch (err) {
      console.error('Fallback copy failed: ', err);
    }
  }

  // --------------------------------------------------------------------------
  // 3. Theme Toggle (Light / Dark)
  // --------------------------------------------------------------------------
  const themeToggle = document.getElementById('theme-toggle');

  if (themeToggle) {
    const STORAGE_KEY = 'anusha-portfolio-theme';
    const storedTheme = localStorage.getItem(STORAGE_KEY);
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;

    // Set initial theme (Default to beautiful futuristic light theme)
    const currentTheme = storedTheme || 'light';
    if (currentTheme === 'dark') {
      document.documentElement.setAttribute('data-theme', 'dark');
      themeToggle.setAttribute('aria-label', 'Switch to light theme');
    } else {
      document.documentElement.removeAttribute('data-theme');
      themeToggle.setAttribute('aria-label', 'Switch to dark theme');
    }

    themeToggle.addEventListener('click', function () {
      const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
      if (isDark) {
        document.documentElement.removeAttribute('data-theme');
        localStorage.setItem(STORAGE_KEY, 'light');
        themeToggle.setAttribute('aria-label', 'Switch to dark theme');
      } else {
        document.documentElement.setAttribute('data-theme', 'dark');
        localStorage.setItem(STORAGE_KEY, 'dark');
        themeToggle.setAttribute('aria-label', 'Switch to light theme');
      }

      // Refresh AOS on theme toggle
      if (typeof AOS !== 'undefined') {
        AOS.refresh();
      }
    });
  }

  // --------------------------------------------------------------------------
  // 4. Active Navigation Link Scroll Spy (Animated Underline Sync)
  // --------------------------------------------------------------------------
  const sections = document.querySelectorAll('section[id]');
  const desktopNavLinks = document.querySelectorAll('.desktop-nav .nav-link');
  const mobileNavLinks = document.querySelectorAll('.mobile-nav .mobile-nav-link');

  function updateActiveNav() {
    if (!desktopNavLinks.length && !mobileNavLinks.length) return;
    const scrollPosition = window.pageYOffset || document.documentElement.scrollTop;
    const headerHeight = 90;

    sections.forEach(function (section) {
      const sectionTop = section.offsetTop - headerHeight;
      const sectionHeight = section.offsetHeight;
      const sectionId = section.getAttribute('id');

      if (scrollPosition >= sectionTop - 60 && scrollPosition < sectionTop + sectionHeight - 60) {
        desktopNavLinks.forEach(function (link) {
          if (link.getAttribute('href') === '#' + sectionId) {
            link.classList.add('active');
          } else {
            link.classList.remove('active');
          }
        });

        mobileNavLinks.forEach(function (link) {
          if (link.getAttribute('href') === '#' + sectionId) {
            link.classList.add('active');
          } else {
            link.classList.remove('active');
          }
        });
      }
    });
  }

  window.addEventListener('scroll', updateActiveNav, { passive: true });
  updateActiveNav();

  // --------------------------------------------------------------------------
  // 5. Library 1 of 2: AOS (Animate On Scroll) Initialization
  // --------------------------------------------------------------------------
  if (typeof AOS !== 'undefined') {
    AOS.init({
      duration: 450,
      easing: 'ease-out-cubic',
      once: true,
      offset: 30,
      disable: function () {
        return prefersReducedMotion;
      }
    });
  }

  // --------------------------------------------------------------------------
  // 6. Library 2 of 2: Lenis Smooth Momentum Scrolling (~450ms Medium-Paced Fluid Transition)
  // --------------------------------------------------------------------------
  let lenisInstance = null;

  if (typeof Lenis !== 'undefined' && !prefersReducedMotion) {
    try {
      // Balanced cubic ease-in-out: smooth departure, fluid medium cruise, gentle arrival
      const smoothEasing = function (t) {
        return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
      };

      lenisInstance = new Lenis({
        duration: 0.45,
        easing: smoothEasing,
        smoothWheel: true,
        touchMultiplier: 1.0
      });

      function raf(time) {
        if (lenisInstance) {
          lenisInstance.raf(time);
          requestAnimationFrame(raf);
        }
      }
      requestAnimationFrame(raf);

      // Sync active navigation link scroll spy with Lenis RAF loop
      lenisInstance.on('scroll', updateActiveNav);

      // Connect anchor links for smooth scrolling with header offset (~450ms duration)
      const anchorLinks = document.querySelectorAll('a[href^="#"]');
      anchorLinks.forEach(function (anchor) {
        anchor.addEventListener('click', function (e) {
          const targetId = this.getAttribute('href');
          if (targetId && targetId !== '#') {
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
              e.preventDefault();
              lenisInstance.scrollTo(targetElement, {
                offset: -68,
                duration: 0.45,
                easing: smoothEasing
              });
            }
          }
        });
      });
    } catch (err) {
      console.warn('Lenis smooth scrolling initialization bypassed:', err);
    }
  }

  // --------------------------------------------------------------------------
  // 7. Dynamic Copyright Year
  // --------------------------------------------------------------------------
  const yearElement = document.getElementById('year');
  if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
  }

  // --------------------------------------------------------------------------
  // 8. Horizontal Certificate Gallery & Preview Lightbox Modal
  // --------------------------------------------------------------------------
  const marqueeContainer = document.querySelector('.cert-marquee-container');
  let isTouchSwiping = false;

  if (marqueeContainer) {
    let startX = 0;
    let startY = 0;

    marqueeContainer.addEventListener('touchstart', function (e) {
      if (e.touches && e.touches.length > 0) {
        startX = e.touches[0].clientX;
        startY = e.touches[0].clientY;
        isTouchSwiping = false;
      }
      marqueeContainer.classList.add('is-paused');
    }, { passive: true });

    marqueeContainer.addEventListener('touchmove', function (e) {
      if (e.touches && e.touches.length > 0) {
        const dx = Math.abs(e.touches[0].clientX - startX);
        const dy = Math.abs(e.touches[0].clientY - startY);
        if (dx > 10 || dy > 10) {
          isTouchSwiping = true;
        }
      }
    }, { passive: true });

    marqueeContainer.addEventListener('touchend', function () {
      marqueeContainer.classList.remove('is-paused');
      setTimeout(function () {
        isTouchSwiping = false;
      }, 80);
    }, { passive: true });

    marqueeContainer.addEventListener('touchcancel', function () {
      marqueeContainer.classList.remove('is-paused');
      isTouchSwiping = false;
    }, { passive: true });
  }

  const certModal = document.getElementById('cert-preview-modal');
  let lastActiveTrigger = null;

  if (certModal) {
    const modalImg = document.getElementById('cert-modal-img');
    const modalTitle = document.getElementById('cert-modal-title');
    const modalIssuer = document.getElementById('cert-modal-issuer');
    const modalMeta = document.getElementById('cert-modal-meta');
    const modalCategory = document.getElementById('cert-modal-category');
    const modalStatus = document.getElementById('cert-modal-status');
    const modalPdfLink = document.getElementById('cert-modal-pdf-link');
    const closeBtns = certModal.querySelectorAll('.cert-modal-close-btn, .cert-modal-dismiss-btn, .cert-modal-backdrop');

    function extractCertData(el) {
      return {
        title: el.getAttribute('data-title') || '',
        issuer: el.getAttribute('data-issuer') || '',
        meta: el.getAttribute('data-meta') || '',
        img: el.getAttribute('data-img') || '',
        pdf: el.getAttribute('data-pdf') || '',
        badge: el.getAttribute('data-badge') || 'Verified',
        category: el.getAttribute('data-category') || 'Certification'
      };
    }

    function openModal(data, triggerEl) {
      if (!data || !data.img) return;
      if (triggerEl) lastActiveTrigger = triggerEl;

      if (modalImg) {
        modalImg.src = data.img;
        modalImg.alt = data.title ? (data.title + ' Official Document Preview') : 'Certificate Preview';
      }
      if (modalTitle) modalTitle.textContent = data.title;
      if (modalIssuer) modalIssuer.textContent = data.issuer;
      if (modalMeta) modalMeta.textContent = data.meta;
      if (modalCategory) modalCategory.textContent = data.category;
      if (modalStatus) {
        modalStatus.textContent = data.badge;
        if (data.badge && data.badge.includes('Elite')) {
          modalStatus.classList.add('credential-status-elite');
        } else {
          modalStatus.classList.remove('credential-status-elite');
        }
      }
      if (modalPdfLink) {
        modalPdfLink.href = data.pdf;
        modalPdfLink.setAttribute('aria-label', 'Open ' + data.title + ' Official PDF in new tab');
      }

      certModal.classList.add('active');
      certModal.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';

      const firstClose = certModal.querySelector('.cert-modal-close-btn');
      if (firstClose) firstClose.focus();
    }

    function closeModal() {
      certModal.classList.remove('active');
      certModal.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
      if (lastActiveTrigger && typeof lastActiveTrigger.focus === 'function') {
        lastActiveTrigger.focus();
        lastActiveTrigger = null;
      }
    }

    // Attach trigger to Compact Cards in Main Gallery (index.html)
    const compactCards = document.querySelectorAll('.compact-cert-card:not(.compact-project-card)');
    compactCards.forEach(function (card) {
      card.addEventListener('click', function (e) {
        if (isTouchSwiping) return;
        if (e.target.closest('a')) return;
        openModal(extractCertData(card), card);
      });
      card.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          openModal(extractCertData(card), card);
        }
      });
    });

    // Attach trigger to Vertical List Thumbnails (certifications.html)
    const listThumbWraps = document.querySelectorAll('.cert-list-thumb-wrap:not(.project-preview-trigger)');
    listThumbWraps.forEach(function (wrap) {
      wrap.addEventListener('click', function () {
        openModal(extractCertData(wrap), wrap);
      });
      wrap.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          openModal(extractCertData(wrap), wrap);
        }
      });
    });

    // Attach trigger to Preview Buttons (certifications.html)
    const previewTriggers = document.querySelectorAll('.cert-preview-trigger');
    previewTriggers.forEach(function (btn) {
      btn.addEventListener('click', function (e) {
        e.stopPropagation();
        openModal(extractCertData(btn), btn);
      });
    });

    // Close button listeners
    closeBtns.forEach(function (btn) {
      btn.addEventListener('click', closeModal);
    });

    // Close on Escape key
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && certModal.classList.contains('active')) {
        closeModal();
      }
    });
  }

  // --------------------------------------------------------------------------
  // 9. Horizontal Project Gallery & Preview Lightbox Modal
  // --------------------------------------------------------------------------
  const projectMarquee = document.querySelector('.project-marquee-container');
  let isProjectSwiping = false;

  if (projectMarquee) {
    let startX = 0;
    let startY = 0;

    projectMarquee.addEventListener('touchstart', function (e) {
      if (e.touches && e.touches.length > 0) {
        startX = e.touches[0].clientX;
        startY = e.touches[0].clientY;
        isProjectSwiping = false;
      }
      projectMarquee.classList.add('is-paused');
    }, { passive: true });

    projectMarquee.addEventListener('touchmove', function (e) {
      if (e.touches && e.touches.length > 0) {
        const dx = Math.abs(e.touches[0].clientX - startX);
        const dy = Math.abs(e.touches[0].clientY - startY);
        if (dx > 10 || dy > 10) {
          isProjectSwiping = true;
        }
      }
    }, { passive: true });

    projectMarquee.addEventListener('touchend', function () {
      projectMarquee.classList.remove('is-paused');
      setTimeout(function () {
        isProjectSwiping = false;
      }, 80);
    }, { passive: true });

    projectMarquee.addEventListener('touchcancel', function () {
      projectMarquee.classList.remove('is-paused');
      isProjectSwiping = false;
    }, { passive: true });
  }

  const projModal = document.getElementById('project-preview-modal');
  let lastActiveProjectTrigger = null;

  if (projModal) {
    const modalImg = document.getElementById('project-modal-img');
    const modalTitle = document.getElementById('project-modal-title');
    const modalCategory = document.getElementById('project-modal-category');
    const modalStatusText = document.getElementById('project-modal-status-text');
    const modalHost = document.getElementById('project-modal-host');
    const modalDesc = document.getElementById('project-modal-desc');
    const modalTechWrap = document.getElementById('project-modal-tech-wrap');
    const modalUrlLink = document.getElementById('project-modal-url-link');
    const modalGithubLink = document.getElementById('project-modal-github-link');
    const closeBtns = projModal.querySelectorAll('.project-modal-close-btn, .project-modal-dismiss-btn, .cert-modal-backdrop');

    function extractProjectData(el) {
      return {
        title: el.getAttribute('data-title') || '',
        category: el.getAttribute('data-category') || 'Web Application',
        status: el.getAttribute('data-status') || 'Active Deploy',
        host: el.getAttribute('data-host') || '',
        desc: el.getAttribute('data-desc') || '',
        tech: el.getAttribute('data-tech') || '',
        url: el.getAttribute('data-url') || '#',
        github: el.getAttribute('data-github') || 'https://github.com/anusha270425',
        img: el.getAttribute('data-img') || ''
      };
    }

    function openProjectModal(data, triggerEl) {
      if (!data) return;
      if (triggerEl) lastActiveProjectTrigger = triggerEl;

      if (modalImg && data.img) {
        modalImg.src = data.img;
        modalImg.alt = (data.title ? data.title + ' Application Preview' : 'Project Preview');
      }
      if (modalTitle) modalTitle.textContent = data.title;
      if (modalCategory) modalCategory.textContent = data.category;
      if (modalStatusText) modalStatusText.textContent = data.status;
      if (modalHost) modalHost.textContent = data.host;
      if (modalDesc) modalDesc.textContent = data.desc;
      if (modalUrlLink) {
        modalUrlLink.href = data.url;
        modalUrlLink.setAttribute('aria-label', 'Visit live app for ' + data.title);
      }
      if (modalGithubLink) {
        modalGithubLink.href = data.github;
        modalGithubLink.setAttribute('aria-label', 'View GitHub code for ' + data.title);
      }

      if (modalTechWrap) {
        modalTechWrap.innerHTML = '';
        if (data.tech) {
          const items = data.tech.split('•');
          items.forEach(function (t) {
            const clean = t.trim();
            if (clean) {
              const span = document.createElement('span');
              span.className = 'project-tech-tag';
              span.textContent = clean;
              modalTechWrap.appendChild(span);
            }
          });
        }
      }

      projModal.classList.add('active');
      projModal.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';

      const firstClose = projModal.querySelector('.project-modal-close-btn');
      if (firstClose) firstClose.focus();
    }

    function closeProjectModal() {
      projModal.classList.remove('active');
      projModal.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
      if (lastActiveProjectTrigger && typeof lastActiveProjectTrigger.focus === 'function') {
        lastActiveProjectTrigger.focus();
        lastActiveProjectTrigger = null;
      }
    }

    // Attach trigger to project triggers (compact cards and list cards)
    const projectTriggers = document.querySelectorAll('.project-preview-trigger');
    projectTriggers.forEach(function (btn) {
      btn.addEventListener('click', function (e) {
        if (isProjectSwiping) return;
        if (e.target.closest('a')) return;
        openProjectModal(extractProjectData(btn), btn);
      });
      btn.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          openProjectModal(extractProjectData(btn), btn);
        }
      });
    });

    closeBtns.forEach(function (btn) {
      btn.addEventListener('click', closeProjectModal);
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && projModal.classList.contains('active')) {
        closeProjectModal();
      }
    });
  }
})();
