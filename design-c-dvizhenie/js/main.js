/* ============================================================
   ЛЕЗВИЕ — Design C "ДВИЖЕНИЕ"
   main.js — Nav, scroll animations, parallax, maps, hero tagline
   ============================================================ */

(function () {
  'use strict';

  /* ---------- DOM Cache ---------- */
  const nav        = document.getElementById('nav');
  const navBurger  = document.getElementById('navBurger');
  const navMenu    = document.getElementById('navMenu');
  const heroEl     = document.getElementById('hero');
  const heroTagline = document.getElementById('heroTagline');

  /* ==========================================================
     1. STAGGERED WORD REVEAL — Hero Tagline
     ========================================================== */
  function initHeroTagline() {
    if (!heroTagline) return;

    const text = heroTagline.textContent.trim();
    // Split into lines first (by newline or multiple spaces), then words
    const words = text.split(/\s+/).filter(Boolean);
    heroTagline.textContent = '';

    words.forEach(function (word, i) {
      const span = document.createElement('span');
      span.className = 'word';
      span.textContent = word;
      span.style.animationDelay = (0.3 + i * 0.1) + 's';
      heroTagline.appendChild(span);

      // Add a space text node after each word (except last)
      if (i < words.length - 1) {
        heroTagline.appendChild(document.createTextNode(' '));
      }
    });
  }

  /* ==========================================================
     2. STICKY NAV — Transparent ↔ Solid
     ========================================================== */
  function initNav() {
    if (!nav || !heroEl) return;

    function onScroll() {
      var scrolled = window.scrollY > heroEl.offsetHeight * 0.5;
      nav.classList.toggle('nav--solid', scrolled);
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll(); // Initial check
  }

  /* ==========================================================
     3. HAMBURGER MENU (Mobile)
     ========================================================== */
  function initBurger() {
    if (!navBurger || !navMenu) return;

    navBurger.addEventListener('click', function () {
      var isOpen = navMenu.classList.toggle('open');
      navBurger.classList.toggle('active', isOpen);
      navBurger.setAttribute('aria-expanded', isOpen);
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    // Close on nav link click
    navMenu.querySelectorAll('.nav__link').forEach(function (link) {
      link.addEventListener('click', function () {
        navMenu.classList.remove('open');
        navBurger.classList.remove('active');
        navBurger.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      });
    });
  }

  /* ==========================================================
     4. SCROLL ANIMATION ENGINE — Intersection Observer
     ========================================================== */
  function initScrollAnimations() {
    var animatedEls = document.querySelectorAll('[data-animate]');
    if (!animatedEls.length) return;

    // Apply transition-delay from data-delay attribute
    animatedEls.forEach(function (el) {
      var delay = el.getAttribute('data-delay');
      if (delay) {
        el.style.transitionDelay = delay + 's';
      }
    });

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target); // Animate only once
        }
      });
    }, {
      threshold: 0.15,
      rootMargin: '0px 0px -50px 0px'
    });

    animatedEls.forEach(function (el) {
      observer.observe(el);
    });
  }

  /* ==========================================================
     5. PARALLAX ENGINE — requestAnimationFrame
     ========================================================== */
  function initParallax() {
    var parallaxEls = document.querySelectorAll('[data-parallax]');
    if (!parallaxEls.length) return;

    var ticking = false;

    function updateParallax() {
      var scrollY = window.scrollY;
      var viewH = window.innerHeight;

      parallaxEls.forEach(function (el) {
        var rect = el.getBoundingClientRect();
        var elTop = rect.top + scrollY;
        var speed = parseFloat(el.getAttribute('data-parallax')) || 0;

        // Only process if near viewport (within 1 screen above/below)
        if (scrollY + viewH + viewH > elTop && scrollY < elTop + rect.height + viewH) {
          var offset = (scrollY - elTop + viewH) * speed;
          el.style.transform = 'translateY(' + offset + 'px)';
        }
      });

      ticking = false;
    }

    function onScroll() {
      if (!ticking) {
        requestAnimationFrame(updateParallax);
        ticking = true;
      }
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    updateParallax(); // Initial
  }

  /* ==========================================================
     6. YANDEX MAPS
     ========================================================== */
  function initMaps() {
    var mapEls = document.querySelectorAll('.locations__map');
    if (!mapEls.length) return;

    // Check if ymaps is available (loaded from CDN)
    if (typeof ymaps === 'undefined') {
      // Fallback: show address text in map containers
      mapEls.forEach(function (el) {
        el.style.display = 'flex';
        el.style.alignItems = 'center';
        el.style.justifyContent = 'center';
        el.style.fontFamily = 'var(--font-body)';
        el.style.color = 'var(--color-text-muted)';
        el.style.fontSize = '0.9rem';
        el.style.padding = '1rem';
        el.style.textAlign = 'center';
        el.textContent = el.getAttribute('data-address') || 'Карта';
      });
      return;
    }

    ymaps.ready(function () {
      mapEls.forEach(function (el) {
        var lat = parseFloat(el.getAttribute('data-lat'));
        var lon = parseFloat(el.getAttribute('data-lon'));
        var address = el.getAttribute('data-address') || '';

        var map = new ymaps.Map(el, {
          center: [lat, lon],
          zoom: 16,
          controls: ['zoomControl']
        });

        map.geoObjects.add(new ymaps.Placemark([lat, lon], {
          balloonContent: address
        }, {
          preset: 'islands#darkOrangeIcon'
        }));

        map.behaviors.disable('scrollZoom');
      });
    });
  }

  /* ==========================================================
     7. SMOOTH SCROLL for anchor links
     ========================================================== */
  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(function (link) {
      link.addEventListener('click', function (e) {
        var href = this.getAttribute('href');
        if (href === '#') return;

        var target = document.querySelector(href);
        if (target) {
          e.preventDefault();
          var offsetTop = target.getBoundingClientRect().top + window.scrollY - 72;
          window.scrollTo({ top: offsetTop, behavior: 'smooth' });
        }
      });
    });
  }

  /* ==========================================================
     INIT
     ========================================================== */
  document.addEventListener('DOMContentLoaded', function () {
    initHeroTagline();
    initNav();
    initBurger();
    initScrollAnimations();
    initParallax();
    initSmoothScroll();
  });

  // Maps init after ymaps script loads
  window.addEventListener('load', function () {
    initMaps();
  });

})();
