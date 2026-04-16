/* ============================================================
   ЛЕЗВИЕ — Design C "ДВИЖЕНИЕ"
   gallery.js — Gallery rendering with parallax + lightbox
   ============================================================ */

(function () {
  'use strict';

  var STORAGE_KEY = 'lezvie-c-gallery';

  /* Default gallery images */
  var DEFAULT_IMAGES = [
    { src: '../shared/img/gallery-1.jpg', alt: 'Галерея 1' },
    { src: '../shared/img/gallery-2.jpg', alt: 'Галерея 2' },
    { src: '../shared/img/gallery-3.jpg', alt: 'Галерея 3' },
    { src: '../shared/img/gallery-4.jpg', alt: 'Галерея 4' },
    { src: '../shared/img/gallery-5.jpg', alt: 'Галерея 5' },
    { src: '../shared/img/gallery-6.jpg', alt: 'Галерея 6' },
    { src: '../shared/img/gallery-7.jpg', alt: 'Галерея 7' },
    { src: '../shared/img/gallery-8.jpg', alt: 'Галерея 8' },
    { src: '../shared/img/gallery-9.jpg', alt: 'Галерея 9' }
  ];

  /* Parallax speeds per item (varied for depth) */
  var PARALLAX_SPEEDS = [0.08, -0.05, 0.1, -0.06, 0.04, -0.08, 0.07, -0.04, 0.06];

  /* Animation delays for stagger */
  var ANIM_DELAYS = [0, 0.1, 0.2, 0.15, 0.25, 0.3, 0.1, 0.2, 0.35];

  var gridEl, lightboxEl, lightboxImg;
  var currentImages = [];
  var currentIndex = 0;

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
      var item = document.createElement('div');
      item.className = 'gallery__item';
      item.setAttribute('data-animate', 'fade-up');
      item.setAttribute('data-delay', String(ANIM_DELAYS[i % ANIM_DELAYS.length]));

      // Parallax only on desktop
      if (window.innerWidth >= 768) {
        item.setAttribute('data-parallax', String(PARALLAX_SPEEDS[i % PARALLAX_SPEEDS.length]));
      }

      var imgEl = document.createElement('img');
      imgEl.src = img.src;
      imgEl.alt = img.alt || 'Фото ' + (i + 1);
      imgEl.loading = 'lazy';
      imgEl.draggable = false;

      item.appendChild(imgEl);
      item.addEventListener('click', function () {
        openLightbox(i);
      });

      gridEl.appendChild(item);
    });

    // Re-init scroll observer for newly added elements
    initGalleryObserver();
  }

  /* ---------- Scroll observer for gallery items ---------- */
  function initGalleryObserver() {
    var items = gridEl.querySelectorAll('[data-animate]');
    if (!items.length) return;

    items.forEach(function (el) {
      var delay = el.getAttribute('data-delay');
      if (delay) {
        el.style.transitionDelay = delay + 's';
      }
    });

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.15,
      rootMargin: '0px 0px -50px 0px'
    });

    items.forEach(function (el) {
      observer.observe(el);
    });
  }

  /* ---------- Lightbox ---------- */
  function openLightbox(index) {
    lightboxEl = document.getElementById('lightbox');
    lightboxImg = document.getElementById('lightboxImg');
    if (!lightboxEl || !lightboxImg) return;

    currentIndex = index;
    lightboxImg.src = currentImages[currentIndex].src;
    lightboxImg.alt = currentImages[currentIndex].alt || '';
    lightboxEl.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    if (!lightboxEl) return;
    lightboxEl.classList.remove('active');
    document.body.style.overflow = '';
  }

  function prevImage() {
    if (!currentImages.length) return;
    currentIndex = (currentIndex - 1 + currentImages.length) % currentImages.length;
    lightboxImg.src = currentImages[currentIndex].src;
    lightboxImg.alt = currentImages[currentIndex].alt || '';
  }

  function nextImage() {
    if (!currentImages.length) return;
    currentIndex = (currentIndex + 1) % currentImages.length;
    lightboxImg.src = currentImages[currentIndex].src;
    lightboxImg.alt = currentImages[currentIndex].alt || '';
  }

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
    });
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
