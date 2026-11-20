/**
 * Editorial Luxury Portfolio Interaction Script - Anusha N
 * Enhanced with:
 * 1. Mobile navigation toggle & keyboard accessibility
 * 2. Copy-to-clipboard for email with polite floating feedback toast (zero layout shift)
 * 3. Theme Toggle (Warm Ivory Light / Pitch Midnight Dark)
 * 4. Active navigation link scroll spy (animated underline & active dot sync)
 * 5. Library 1 of 2: AOS (Animate On Scroll) initialization with medium-smooth 380ms choreography
 * 6. Library 2 of 2: Lenis smooth momentum scrolling with anchor navigation integration (0.42s)
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
  // 2. Copy-to-Clipboard for Email (Zero Layout Shift + Floating Toast)
  // --------------------------------------------------------------------------
  const copyButtons = document.querySelectorAll('.copy-email-btn');
  const notificationToast = document.getElementById('copy-notification');
  let notificationTimer = null;

  function showNotification(message) {
    if (!notificationToast) return;

    const textSpan = notificationToast.querySelector('.toast-text');
    if (textSpan && message) {
      textSpan.textContent = message;
    } else if (message) {
      notificationToast.textContent = message;
    }

    notificationToast.classList.add('is-visible');

    if (notificationTimer) {
      clearTimeout(notificationTimer);
    }

    notificationTimer = setTimeout(function () {
      notificationToast.classList.remove('is-visible');
    }, 2400);
  }

  copyButtons.forEach(function (btn) {
    btn.addEventListener('click', function () {
      const emailToCopy = btn.getAttribute('data-email') || 'anusha21narasimman@gmail.com';
      const btnText = btn.querySelector('.btn-text');
      const copyIcon = btn.querySelector('.copy-icon');
      const checkIcon = btn.querySelector('.check-icon');
      const originalText = btnText ? btnText.textContent : "Let's Connect";

      function setCopiedState() {
        if (btnText) btnText.textContent = 'Copied!';
        if (copyIcon) copyIcon.hidden = true;
        if (checkIcon) checkIcon.hidden = false;
        btn.setAttribute('aria-label', 'Email copied to clipboard');

        showNotification('Email copied to clipboard: ' + emailToCopy);

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
      textArea.style.top = '-9999px';
      textArea.setAttribute('aria-hidden', 'true');
      document.body.appendChild(textArea);
      textArea.select();
      const successful = document.execCommand('copy');
      document.body.removeChild(textArea);
      if (successful && typeof onSuccess === 'function') {
        onSuccess();
      }
    } catch (err) {
      console.warn('Fallback copy failed:', err);
    }
  }

  // --------------------------------------------------------------------------
  // 3. Theme Toggle (Warm Ivory Light / Midnight Dark)
  // --------------------------------------------------------------------------
  const themeToggle = document.getElementById('theme-toggle');
  const STORAGE_KEY = 'portfolio_editorial_theme';

  if (themeToggle) {
    const savedTheme = localStorage.getItem(STORAGE_KEY);
    const systemPrefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    const currentTheme = savedTheme || (systemPrefersDark ? 'dark' : 'light');

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
  // 4. Active Navigation Link Scroll Spy (Dot & Underline Indicator)
  // --------------------------------------------------------------------------
  const trackedSectionIds = ['hero', 'about', 'skills', 'experience', 'projects', 'certifications', 'contact'];
  const desktopNavLinks = document.querySelectorAll('.desktop-nav .nav-link');
  const mobileNavLinks = document.querySelectorAll('.mobile-nav .mobile-nav-link');

  function updateActiveNav() {
    const scrollPosition = window.pageYOffset || document.documentElement.scrollTop;
    const headerHeight = 80;

    trackedSectionIds.forEach(function (sectionId) {
      const section = document.getElementById(sectionId);
      if (!section) return;

      const sectionTop = section.offsetTop - headerHeight;
      const sectionHeight = section.offsetHeight;

      if (scrollPosition >= sectionTop - 50 && scrollPosition < sectionTop + sectionHeight - 50) {
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
  // 5. Library 1 of 2: AOS (Animate On Scroll) Initialization (380ms)
  // --------------------------------------------------------------------------
  if (typeof AOS !== 'undefined') {
    AOS.init({
      duration: 380,
      easing: 'ease-out-cubic',
      once: true,
      offset: 30,
      disable: function () {
        return prefersReducedMotion;
      }
    });
  }

  // --------------------------------------------------------------------------
  // 6. Library 2 of 2: Lenis Smooth Momentum Scrolling (0.42s Medium-Smooth)
  // --------------------------------------------------------------------------
  let lenisInstance = null;

  if (typeof Lenis !== 'undefined' && !prefersReducedMotion) {
    try {
      lenisInstance = new Lenis({
        duration: 0.42,
        easing: function (t) {
          return 1 - Math.pow(1 - t, 3);
        },
        smoothWheel: true,
        touchMultiplier: 1.15
      });

      function raf(time) {
        if (lenisInstance) {
          lenisInstance.raf(time);
          requestAnimationFrame(raf);
        }
      }
      requestAnimationFrame(raf);

      // Connect anchor links for smooth scrolling with header offset
      const anchorLinks = document.querySelectorAll('a[href^="#"]');
      anchorLinks.forEach(function (anchor) {
        anchor.addEventListener('click', function (e) {
          const targetId = this.getAttribute('href');
          if (targetId && targetId !== '#') {
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
              e.preventDefault();
              lenisInstance.scrollTo(targetElement, {
                offset: -70,
                duration: 0.42,
                easing: function (t) {
                  return 1 - Math.pow(1 - t, 3);
                }
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
})();
