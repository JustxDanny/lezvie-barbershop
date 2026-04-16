/* ============================================
   ЛЕЗВИЕ — Design B "МИНИМАЛ" — Main JS
   Nav, scroll behavior, maps
   ============================================ */

(function () {
  'use strict';

  // --- DOM refs ---
  const nav = document.getElementById('nav');
  const navLinks = document.getElementById('navLinks');
  const navBurger = document.getElementById('navBurger');

  // --- Mobile menu overlay (injected once) ---
  const overlay = document.createElement('div');
  overlay.className = 'nav__overlay';
  document.body.appendChild(overlay);

  // --- Nav scroll state ---
  function updateNav() {
    if (window.scrollY > 60) {
      nav.classList.add('nav--scrolled');
    } else {
      nav.classList.remove('nav--scrolled');
    }
  }

  window.addEventListener('scroll', updateNav, { passive: true });
  updateNav();

  // --- Mobile menu toggle ---
  function openMenu() {
    navLinks.classList.add('nav__links--open');
    navBurger.classList.add('nav__burger--open');
    overlay.classList.add('nav__overlay--visible');
    navBurger.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  }

  function closeMenu() {
    navLinks.classList.remove('nav__links--open');
    navBurger.classList.remove('nav__burger--open');
    overlay.classList.remove('nav__overlay--visible');
    navBurger.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  navBurger.addEventListener('click', function () {
    var isOpen = navLinks.classList.contains('nav__links--open');
    isOpen ? closeMenu() : openMenu();
  });

  overlay.addEventListener('click', closeMenu);

  // Close menu on nav link click
  navLinks.querySelectorAll('.nav__link').forEach(function (link) {
    link.addEventListener('click', closeMenu);
  });

  // Close on Escape
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeMenu();
  });

  // --- Smooth scroll for anchor links ---
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      var target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        var offset = nav.offsetHeight;
        var top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top: top, behavior: 'smooth' });
      }
    });
  });

  // --- Yandex Maps ---
  function initMaps() {
    var locations = [
      { id: 'map1', coords: [56.852775, 53.211463], title: 'ул. Барышникова, 27' },
      { id: 'map2', coords: [56.843924, 53.234105], title: 'ул. Пушкинская, 270' },
      { id: 'map3', coords: [56.851700, 53.204800], title: 'ул. Красноармейская, 164' }
    ];

    locations.forEach(function (loc) {
      var el = document.getElementById(loc.id);
      if (!el) return;

      // Embed Yandex Maps via iframe for simplicity (no API key needed)
      var iframe = document.createElement('iframe');
      iframe.src = 'https://yandex.ru/map-widget/v1/?ll=' + loc.coords[1] + '%2C' + loc.coords[0] +
        '&z=16&l=map&pt=' + loc.coords[1] + '%2C' + loc.coords[0] + '%2Cpm2rdm';
      iframe.setAttribute('allowfullscreen', '');
      iframe.setAttribute('loading', 'lazy');
      iframe.title = loc.title;
      el.appendChild(iframe);
    });
  }

  // Load maps when locations section is near viewport
  var mapsLoaded = false;
  var locationsSection = document.getElementById('locations');

  if (locationsSection) {
    if ('IntersectionObserver' in window) {
      var observer = new IntersectionObserver(function (entries) {
        if (entries[0].isIntersecting && !mapsLoaded) {
          mapsLoaded = true;
          initMaps();
          observer.disconnect();
        }
      }, { rootMargin: '200px' });
      observer.observe(locationsSection);
    } else {
      // Fallback: load on DOMContentLoaded
      initMaps();
    }
  }

  // --- Lightbox ---
  var lightbox = document.getElementById('lightbox');
  var lightboxImg = document.getElementById('lightboxImg');
  var currentIndex = -1;
  var galleryImages = [];

  function openLightbox(index) {
    if (index < 0 || index >= galleryImages.length) return;
    currentIndex = index;
    lightboxImg.src = galleryImages[index];
    lightbox.hidden = false;
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    lightbox.hidden = true;
    document.body.style.overflow = '';
    currentIndex = -1;
  }

  // Expose for gallery.js to register images
  window.lezvieGallery = {
    register: function (images) {
      galleryImages = images;
    },
    open: function (index) {
      openLightbox(index);
    }
  };

  if (lightbox) {
    lightbox.querySelector('.lightbox__close').addEventListener('click', closeLightbox);

    lightbox.querySelector('.lightbox__prev').addEventListener('click', function () {
      if (currentIndex > 0) openLightbox(currentIndex - 1);
      else openLightbox(galleryImages.length - 1);
    });

    lightbox.querySelector('.lightbox__next').addEventListener('click', function () {
      if (currentIndex < galleryImages.length - 1) openLightbox(currentIndex + 1);
      else openLightbox(0);
    });

    // Close on background click
    lightbox.addEventListener('click', function (e) {
      if (e.target === lightbox) closeLightbox();
    });

    // Keyboard nav
    document.addEventListener('keydown', function (e) {
      if (lightbox.hidden) return;
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowLeft') {
        openLightbox(currentIndex > 0 ? currentIndex - 1 : galleryImages.length - 1);
      }
      if (e.key === 'ArrowRight') {
        openLightbox(currentIndex < galleryImages.length - 1 ? currentIndex + 1 : 0);
      }
    });
  }
})();
