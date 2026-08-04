/* ============================================================
   ЛЕЗВИЕ — Design C "ДВИЖЕНИЕ"
   gallery.js — Gallery rendering with parallax + lightbox
   ============================================================ */

(function () {
  'use strict';

  /* ---------- Global gates ---------- */
  var RM   = window.matchMedia('(prefers-reduced-motion: reduce)');
  var FINE = window.matchMedia('(hover: hover) and (pointer: fine)');

  /* must stay in sync with :root easings */
  var EASE_OUT = 'cubic-bezier(0.16,1,0.3,1)';
  var EASE_IN  = 'cubic-bezier(0.7,0,0.84,0)';

  var STORAGE_KEY = 'lezvie-c-gallery';

  /* Default gallery images — real shots from the shop's VK */
  var DEFAULT_IMAGES = [
    { src: 'img/gallery-vk-1.jpg', alt: 'Фейд — чистая работа' },
    { src: 'img/gallery-vk-2.jpg', alt: 'Классический фейд с бородой' },
    { src: 'img/gallery-vk-3.jpg', alt: 'Помпадур — результат мастера' },
    { src: 'img/gallery-vk-4.jpg', alt: 'Бритьё опасной бритвой' },
    { src: 'img/gallery-vk-5.jpg', alt: 'Мастер за работой' },
    { src: 'img/gallery-vk-6.jpg', alt: 'Медали чемпионата — команда ЛЕЗВИЕ' }
  ];

  /* Parallax speeds per item (varied for depth) */
  var PARALLAX_SPEEDS = [0.08, -0.05, 0.1, -0.06, 0.04, -0.08];

  /* Animation delays for stagger */
  var ANIM_DELAYS = [0, 0.1, 0.2, 0.15, 0.25, 0.3];

  var gridEl, lightboxEl, lightboxImg;
  var currentImages = [];
  var currentIndex = 0;
  var lastFocus = null;

  function preload(src) {
    if (!src) return;
    var img = new Image();
    img.src = src;
  }

  /* Directional WAAPI swap — old img exits opposite to travel, the new one
     arrives from the pressed direction. dir: +1 next, -1 prev. */
  function swapImg(src, alt, dir) {
    if (!lightboxImg) return;

    // RM — jump-cut swap
    if (RM.matches) {
      lightboxImg.src = src;
      lightboxImg.alt = alt || '';
      return;
    }

    // No WAAPI — keep the plain opacity fade
    if (!('animate' in Element.prototype)) {
      lightboxImg.style.opacity = '0';
      setTimeout(function () {
        lightboxImg.src = src;
        lightboxImg.alt = alt || '';
        lightboxImg.style.opacity = '';
      }, 140);
      return;
    }

    dir = dir || 1;
    // Cancel stale animations (rapid clicks / failed loads leave forwards fills)
    if (lightboxImg.getAnimations) {
      lightboxImg.getAnimations().forEach(function (a) { a.cancel(); });
    }
    var out = lightboxImg.animate(
      [{ opacity: 1, transform: 'translateX(0)' },
       { opacity: 0, transform: 'translateX(' + (dir * -28) + 'px)' }],
      { duration: 160, easing: EASE_IN, fill: 'forwards' });

    out.finished.then(function () {
      lightboxImg.src = src;
      lightboxImg.alt = alt || '';
      var go = function () {
        var arrive = lightboxImg.animate(
          [{ opacity: 0, transform: 'translateX(' + (dir * 28) + 'px)' },
           { opacity: 1, transform: 'translateX(0)' }],
          { duration: 260, easing: EASE_OUT });
        // Release the out-animation's forwards fill once the new img has landed
        arrive.onfinish = function () { out.cancel(); };
      };
      // Load gate kills flash-of-empty on slow networks
      if (lightboxImg.complete) go();
      else {
        lightboxImg.addEventListener('load', go, { once: true });
        // Failed load: release the forwards fill so the lightbox isn't stuck blank
        lightboxImg.addEventListener('error', function () { out.cancel(); }, { once: true });
      }
    });
  }

  /* ---------- Load images from localStorage or default ---------- */
  function getImages() {
    try {
      var stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        var parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      // Fall through to default
    }
    return DEFAULT_IMAGES;
  }

  /* ---------- Render gallery ---------- */
  function renderGallery() {
    gridEl = document.getElementById('galleryGrid');
    if (!gridEl) return;

    currentImages = getImages();
    gridEl.innerHTML = '';

    currentImages.forEach(function (img, i) {
      /* Three-layer transform split — outer owns parallax (inline translate3d),
         inner owns the zoom-in reveal + editorial offset, img owns hover/press */
      var item = document.createElement('div');
      item.className = 'gallery__item';

      // Parallax only on desktop
      if (window.innerWidth >= 768) {
        item.setAttribute('data-parallax', String(PARALLAX_SPEEDS[i % PARALLAX_SPEEDS.length]));
      }

      var inner = document.createElement('div');
      inner.className = 'gallery__item-inner';
      inner.setAttribute('data-animate', 'zoom-in');
      inner.setAttribute('data-delay', String(ANIM_DELAYS[i % ANIM_DELAYS.length]));

      var imgEl = document.createElement('img');
      imgEl.src = img.src;
      imgEl.alt = img.alt || 'Фото ' + (i + 1);
      imgEl.loading = 'lazy';
      imgEl.decoding = 'async';
      imgEl.draggable = false;
      imgEl.width  = 800;
      imgEl.height = 600;

      inner.appendChild(imgEl);
      item.appendChild(inner);

      // Keyboard access — cursor:zoom-in advertises interactivity, so keyboard
      // users must be able to reach and trigger it too
      item.tabIndex = 0;
      item.setAttribute('role', 'button');
      item.setAttribute('aria-label', imgEl.alt);
      item.addEventListener('click', function () {
        openLightbox(i);
      });
      item.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          openLightbox(i);
        }
      });

      gridEl.appendChild(item);
    });

    // Re-init scroll observer for newly added elements
    initGalleryObserver();

    // Register late-rendered items with the parallax engine (fixes the
    // DOMContentLoaded ordering race — main.js queries before we render)
    if (typeof window.__lezvieParallax === 'function') {
      window.__lezvieParallax(gridEl.querySelectorAll('[data-parallax]'));
    }
  }

  /* ---------- Scroll observer via shared helper from main.js ---------- */
  function initGalleryObserver() {
    var items = gridEl.querySelectorAll('[data-animate]');
    if (!items.length) return;

    if (typeof window.__lezvieReveal === 'function') {
      window.__lezvieReveal(items);
      return;
    }

    // Fallback if main.js failed to load
    items.forEach(function (el) {
      var d = el.getAttribute('data-delay');
      if (d) {
        el.style.transitionDelay = d + 's';
        el.style.setProperty('--reveal-delay', d + 's');
      }
    });
    var obs = new IntersectionObserver(function (entries, o) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          e.target.classList.add('visible');
          o.unobserve(e.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });
    items.forEach(function (el) { obs.observe(el); });
  }

  /* ---------- Lightbox ---------- */
  function openLightbox(index) {
    lightboxEl  = document.getElementById('lightbox');
    lightboxImg = document.getElementById('lightboxImg');
    if (!lightboxEl || !lightboxImg) return;

    lastFocus = document.activeElement;
    currentIndex = index;
    // Clear any stuck WAAPI fills from a previous session's failed swap
    if (lightboxImg.getAnimations) {
      lightboxImg.getAnimations().forEach(function (a) { a.cancel(); });
    }
    lightboxImg.src = currentImages[currentIndex].src;
    lightboxImg.alt = currentImages[currentIndex].alt || '';
    lightboxEl.classList.add('active');
    document.body.style.overflow = 'hidden';

    // Preload neighbors
    var n = currentImages.length;
    preload(currentImages[(currentIndex + 1) % n].src);
    preload(currentImages[(currentIndex - 1 + n) % n].src);

    var closeBtn = lightboxEl.querySelector('.lightbox__close');
    if (closeBtn) closeBtn.focus();
  }

  function closeLightbox() {
    if (!lightboxEl) return;
    lightboxEl.classList.remove('active');
    document.body.style.overflow = '';
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }

  function step(dir) {
    if (!currentImages.length) return;
    var n = currentImages.length;
    currentIndex = (currentIndex + dir + n) % n;
    swapImg(currentImages[currentIndex].src, currentImages[currentIndex].alt, dir);
    preload(currentImages[(currentIndex + dir + n) % n].src);
  }

  function prevImage() { step(-1); }
  function nextImage() { step(1);  }

  function initLightbox() {
    lightboxEl = document.getElementById('lightbox');
    if (!lightboxEl) return;

    var closeBtn = lightboxEl.querySelector('.lightbox__close');
    var prevBtn  = lightboxEl.querySelector('.lightbox__prev');
    var nextBtn  = lightboxEl.querySelector('.lightbox__next');

    if (closeBtn) closeBtn.addEventListener('click', closeLightbox);
    if (prevBtn) prevBtn.addEventListener('click', prevImage);
    if (nextBtn) nextBtn.addEventListener('click', nextImage);

    // Close on backdrop click
    lightboxEl.addEventListener('click', function (e) {
      if (e.target === lightboxEl) closeLightbox();
    });

    // Keyboard navigation
    document.addEventListener('keydown', function (e) {
      if (!lightboxEl.classList.contains('active')) return;

      if (e.key === 'Escape') closeLightbox();
      else if (e.key === 'ArrowLeft') prevImage();
      else if (e.key === 'ArrowRight') nextImage();
      else if (e.key === 'Tab') {
        // Focus trap — role=dialog must not leak focus to the page behind
        var focusables = [closeBtn, prevBtn, nextBtn].filter(Boolean);
        if (!focusables.length) return;
        var idx = focusables.indexOf(document.activeElement);
        e.preventDefault();
        var next = e.shiftKey
          ? (idx <= 0 ? focusables.length - 1 : idx - 1)
          : (idx === -1 || idx === focusables.length - 1 ? 0 : idx + 1);
        focusables[next].focus();
      }
    });

    // Swipe — the mobile replacement for hover-discoverable arrows
    var touchX = 0;
    var touchY = 0;

    lightboxEl.addEventListener('touchstart', function (e) {
      touchX = e.changedTouches[0].clientX;
      touchY = e.changedTouches[0].clientY;
    }, { passive: true });

    lightboxEl.addEventListener('touchend', function (e) {
      var dx = e.changedTouches[0].clientX - touchX;
      var dy = e.changedTouches[0].clientY - touchY;
      if (Math.abs(dx) > 48 && Math.abs(dx) > 2 * Math.abs(dy)) {
        step(dx < 0 ? 1 : -1);
      }
    }, { passive: true });
  }

  /* ---------- INIT ---------- */
  document.addEventListener('DOMContentLoaded', function () {
    renderGallery();
    initLightbox();
  });

  // Listen for storage changes (admin panel updates)
  window.addEventListener('storage', function (e) {
    if (e.key === STORAGE_KEY) {
      renderGallery();
    }
  });

})();
