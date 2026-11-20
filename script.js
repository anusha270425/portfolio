/**
 * Portfolio Interaction Script - Anusha N
 * Enhanced with:
 * 1. Mobile navigation toggle & keyboard accessibility
 * 2. Copy-to-clipboard for email with polite feedback toast
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
  const notificationToast = document.getElementById('copy-notification');
  let notificationTimer = null;

  function showNotification(message) {
    if (!notificationToast) return;

    if (message) {
      notificationToast.textContent = message;
    }
    notificationToast.hidden = false;

    if (notificationTimer) {
      clearTimeout(notificationTimer);
    }

    notificationTimer = setTimeout(function () {
      notificationToast.hidden = true;
    }, 2500);
  }

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
      duration: 400,
      easing: 'ease-out-cubic',
      once: true,
      offset: 40,
      disable: function () {
        return prefersReducedMotion;
      }
    });
  }

  // --------------------------------------------------------------------------
  // 6. Library 2 of 2: Lenis Smooth Momentum Scrolling (Medium & Responsive)
  // --------------------------------------------------------------------------
  let lenisInstance = null;

  if (typeof Lenis !== 'undefined' && !prefersReducedMotion) {
    try {
      lenisInstance = new Lenis({
        duration: 0.55,
        easing: function (t) {
          return Math.min(1, 1.001 - Math.pow(2, -10 * t));
        },
        smoothWheel: true,
        touchMultiplier: 1.2
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
                offset: -68,
                duration: 0.5
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
