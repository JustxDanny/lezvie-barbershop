/* ============================================================
   ЛЕЗВИЕ — Main JavaScript
   Nav, scroll, hero slider, maps, animations
   ============================================================ */

(function () {
  'use strict';

  /* ---------- DOM References ---------- */
  const nav = document.getElementById('nav');
  const hero = document.getElementById('hero');
  const hamburger = document.getElementById('hamburger');
  const navMenu = document.getElementById('navMenu');
  const navLinks = document.querySelectorAll('.nav__link');
  const heroSlides = document.querySelectorAll('.hero__slide');

  /* ---------- Nav: Transparent → Solid on Scroll ---------- */
  function initNavObserver() {
    if (!hero || !nav) return;

    const observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            nav.classList.remove('nav--scrolled');
          } else {
            nav.classList.add('nav--scrolled');
          }
        });
      },
      { threshold: 0, rootMargin: '-72px 0px 0px 0px' }
    );

    observer.observe(hero);
  }

  /* ---------- Hamburger Menu ---------- */
  function initHamburger() {
    if (!hamburger || !navMenu) return;

    hamburger.addEventListener('click', function () {
      const isOpen = navMenu.classList.toggle('open');
      hamburger.classList.toggle('active');
      hamburger.setAttribute('aria-expanded', isOpen);
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    /* Close on nav link click */
    navLinks.forEach(function (link) {
      link.addEventListener('click', function () {
        navMenu.classList.remove('open');
        hamburger.classList.remove('active');
        hamburger.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      });
    });

    /* Close on clicking inside open menu background */
    navMenu.addEventListener('click', function (e) {
      if (e.target === navMenu) {
        navMenu.classList.remove('open');
        hamburger.classList.remove('active');
        hamburger.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      }
    });
  }

  /* ---------- Hero Slider ---------- */
  function initHeroSlider() {
    if (heroSlides.length < 2) return;

    var current = 0;
    var total = heroSlides.length;

    setInterval(function () {
      heroSlides[current].classList.remove('active');
      current = (current + 1) % total;
      heroSlides[current].classList.add('active');
    }, 5000);
  }

  /* ---------- Parallax on Hero ---------- */
  function initParallax() {
    if (!hero) return;

    var prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) return;

    var ticking = false;

    window.addEventListener('scroll', function () {
      if (!ticking) {
        window.requestAnimationFrame(function () {
          var scrollY = window.pageYOffset;
          var heroHeight = hero.offsetHeight;

          if (scrollY < heroHeight) {
            var slides = hero.querySelectorAll('.hero__slide');
            slides.forEach(function (slide) {
              slide.style.transform = 'translateY(' + scrollY * 0.35 + 'px) scale(1.05)';
            });
          }

          ticking = false;
        });
        ticking = true;
      }
    });

    /* Apply initial scale */
    heroSlides.forEach(function (slide) {
      slide.style.transform = 'scale(1.05)';
    });
  }

  /* ---------- Fade-in Animations ---------- */
  function initFadeAnimations() {
    var prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) return;

    var sections = document.querySelectorAll('.section');

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('fade-in', 'visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );

    sections.forEach(function (section) {
      section.classList.add('fade-in');
      observer.observe(section);
    });
  }

  /* ---------- Smooth Scroll for anchor links ---------- */
  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
      anchor.addEventListener('click', function (e) {
        var targetId = this.getAttribute('href');
        if (targetId === '#') return;

        var target = document.querySelector(targetId);
        if (!target) return;

        e.preventDefault();

        var navHeight = parseInt(
          getComputedStyle(document.documentElement).getPropertyValue('--nav-height')
        );

        var top = target.getBoundingClientRect().top + window.pageYOffset - navHeight;

        window.scrollTo({
          top: top,
          behavior: 'smooth',
        });
      });
    });
  }

  /* ---------- Yandex Maps ---------- */
  function initMaps() {
    if (typeof ymaps === 'undefined') return;

    ymaps.ready(function () {
      var locations = [
        { id: 'map1', coords: [56.852167, 53.206000], title: 'ул. Барышникова, 27' },
        { id: 'map2', coords: [56.843700, 53.232400], title: 'ул. Пушкинская, 270' },
        { id: 'map3', coords: [56.851200, 53.214700], title: 'ул. Красноармейская, 164' },
      ];

      locations.forEach(function (loc) {
        var container = document.getElementById(loc.id);
        if (!container) return;

        var map = new ymaps.Map(loc.id, {
          center: loc.coords,
          zoom: 16,
          controls: ['zoomControl'],
        });

        map.behaviors.disable('scrollZoom');

        var placemark = new ymaps.Placemark(
          loc.coords,
          {
            balloonContent: '<strong>ЛЕЗВИЕ</strong><br>' + loc.title,
          },
          {
            preset: 'islands#darkBrownBarberIcon',
            iconColor: '#C9A96E',
          }
        );

        map.geoObjects.add(placemark);
      });
    });
  }

  /* ---------- Init Everything ---------- */
  function init() {
    initNavObserver();
    initHamburger();
    initHeroSlider();
    initParallax();
    initFadeAnimations();
    initSmoothScroll();
    initMaps();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
