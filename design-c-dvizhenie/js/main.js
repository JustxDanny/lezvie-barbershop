/* ============================================================
   ЛЕЗВИЕ 2.0 — Design C "ДВИЖЕНИЕ"
   main.js — Nav, scroll animations, parallax, lazy maps, hero
   ============================================================ */

(function () {
  'use strict';

  /* ---------- DOM Cache ---------- */
  const nav         = document.getElementById('nav');
  const navBurger   = document.getElementById('navBurger');
  const navMenu     = document.getElementById('navMenu');
  const heroEl      = document.getElementById('hero');
  const heroTagline = document.getElementById('heroTagline');

  /* ---------- Shared animation observer (exposed globally for gallery.js) ---------- */
  function makeRevealObserver() {
    return new IntersectionObserver(function (entries, obs) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          obs.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.12,
      rootMargin: '0px 0px -60px 0px'
    });
  }

  /* Expose a helper for late-added nodes (gallery items) */
  window.__lezvieReveal = function (nodes) {
    if (!nodes || !nodes.length) return;
    nodes.forEach(function (el) {
      var delay = el.getAttribute('data-delay');
      if (delay) el.style.transitionDelay = delay + 's';
    });
    var obs = makeRevealObserver();
    nodes.forEach(function (el) { obs.observe(el); });
  };

  /* ==========================================================
     1. STAGGERED WORD REVEAL — Hero Tagline
     ========================================================== */
  function initHeroTagline() {
    if (!heroTagline) return;

    var text  = heroTagline.textContent.trim();
    var words = text.split(/\s+/).filter(Boolean);
    heroTagline.textContent = '';

    words.forEach(function (word, i) {
      var span = document.createElement('span');
      span.className = 'word';
      span.textContent = word;
      span.style.animationDelay = (0.35 + i * 0.11) + 's';
      heroTagline.appendChild(span);
      if (i < words.length - 1) {
        heroTagline.appendChild(document.createTextNode(' '));
      }
    });
  }

  /* ==========================================================
     2. STICKY NAV — rAF-throttled
     ========================================================== */
  function initNav() {
    if (!nav || !heroEl) return;

    var ticking = false;
    var threshold = heroEl.offsetHeight * 0.5;

    function update() {
      nav.classList.toggle('nav--solid', window.scrollY > threshold);
      ticking = false;
    }

    function onScroll() {
      if (!ticking) {
        requestAnimationFrame(update);
        ticking = true;
      }
    }

    // Recompute threshold on resize (hero height changes on rotation)
    window.addEventListener('resize', function () {
      threshold = heroEl.offsetHeight * 0.5;
    }, { passive: true });

    window.addEventListener('scroll', onScroll, { passive: true });
    update();
  }

  /* ==========================================================
     3. HAMBURGER MENU (Mobile)
     ========================================================== */
  function initBurger() {
    if (!navBurger || !navMenu) return;

    function closeMenu() {
      navMenu.classList.remove('open');
      navBurger.classList.remove('active');
      navBurger.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    }

    navBurger.addEventListener('click', function () {
      var isOpen = navMenu.classList.toggle('open');
      navBurger.classList.toggle('active', isOpen);
      navBurger.setAttribute('aria-expanded', String(isOpen));
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    navMenu.querySelectorAll('.nav__link, .nav__cta').forEach(function (link) {
      link.addEventListener('click', closeMenu);
    });

    // Close on escape
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && navMenu.classList.contains('open')) closeMenu();
    });
  }

  /* ==========================================================
     4. SCROLL REVEAL — all [data-animate] elements
     ========================================================== */
  function initScrollAnimations() {
    var els = document.querySelectorAll('[data-animate]');
    if (!els.length) return;

    els.forEach(function (el) {
      var delay = el.getAttribute('data-delay');
      if (delay) el.style.transitionDelay = delay + 's';
    });

    var obs = makeRevealObserver();
    els.forEach(function (el) { obs.observe(el); });
  }

  /* ==========================================================
     5. PARALLAX — rAF
     ========================================================== */
  function initParallax() {
    var els = document.querySelectorAll('[data-parallax]');
    if (!els.length) return;

    var ticking = false;
    var cache = [];

    function recache() {
      cache = [];
      els.forEach(function (el) {
        var rect = el.getBoundingClientRect();
        cache.push({
          el: el,
          top: rect.top + window.scrollY,
          height: rect.height,
          speed: parseFloat(el.getAttribute('data-parallax')) || 0
        });
      });
    }

    function update() {
      var scrollY = window.scrollY;
      var viewH = window.innerHeight;

      cache.forEach(function (c) {
        if (scrollY + viewH * 2 > c.top && scrollY < c.top + c.height + viewH) {
          var offset = (scrollY - c.top + viewH) * c.speed;
          c.el.style.transform = 'translate3d(0, ' + offset.toFixed(2) + 'px, 0)';
        }
      });

      ticking = false;
    }

    function onScroll() {
      if (!ticking) {
        requestAnimationFrame(update);
        ticking = true;
      }
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', recache, { passive: true });
    window.addEventListener('load', recache);
    recache();
    update();
  }

  /* ==========================================================
     6. YANDEX MAPS — lazy init via IntersectionObserver
     ========================================================== */
  function initMaps() {
    var mapEls = document.querySelectorAll('.locations__map');
    if (!mapEls.length) return;

    function fallback(el) {
      el.style.display        = 'flex';
      el.style.alignItems     = 'center';
      el.style.justifyContent = 'center';
      el.style.fontFamily     = 'var(--font-body)';
      el.style.color          = 'var(--color-text-muted)';
      el.style.fontSize       = '0.9rem';
      el.style.padding        = '1rem';
      el.style.textAlign      = 'center';
      el.textContent          = el.getAttribute('data-address') || 'Карта';
    }

    function buildMap(el) {
      if (el.dataset.mapReady === '1') return;
      el.dataset.mapReady = '1';

      var lat     = parseFloat(el.getAttribute('data-lat'));
      var lon     = parseFloat(el.getAttribute('data-lon'));
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
    }

    function init() {
      if (typeof ymaps === 'undefined') {
        mapEls.forEach(fallback);
        return;
      }

      ymaps.ready(function () {
        var obs = new IntersectionObserver(function (entries, o) {
          entries.forEach(function (e) {
            if (e.isIntersecting) {
              buildMap(e.target);
              o.unobserve(e.target);
            }
          });
        }, { rootMargin: '200px 0px' });

        mapEls.forEach(function (el) { obs.observe(el); });
      });
    }

    // Wait for ymaps script (loaded with defer); poll briefly if not ready
    if (typeof ymaps !== 'undefined') {
      init();
    } else {
      var tries = 0;
      var poll = setInterval(function () {
        tries++;
        if (typeof ymaps !== 'undefined') {
          clearInterval(poll);
          init();
        } else if (tries > 40) { // 4s
          clearInterval(poll);
          mapEls.forEach(fallback);
        }
      }, 100);
    }
  }

  /* ==========================================================
     7. SMOOTH SCROLL
     ========================================================== */
  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(function (link) {
      link.addEventListener('click', function (e) {
        var href = this.getAttribute('href');
        // Dead-link placeholder — prevent scroll-to-top
        if (href === '#' || href.length < 2) {
          e.preventDefault();
          return;
        }

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
     8. BODY REVEAL
     ========================================================== */
  function revealBody() {
    // Next frame so initial transition applies cleanly
    requestAnimationFrame(function () {
      document.body.classList.add('is-ready');
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
    revealBody();
  });

  window.addEventListener('load', initMaps);

})();
