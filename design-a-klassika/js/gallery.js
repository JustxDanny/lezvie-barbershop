/* ============================================================
   ЛЕЗВИЕ — Gallery Module
   Renders gallery from localStorage or defaults, lightbox
   ============================================================ */

(function () {
  'use strict';

  var STORAGE_KEY = 'lezvie-a-gallery';

  var DEFAULT_IMAGES = [
    '../shared/img/gallery-1.jpg',
    '../shared/img/gallery-2.jpg',
    '../shared/img/gallery-3.jpg',
    '../shared/img/gallery-4.jpg',
    '../shared/img/gallery-5.jpg',
    '../shared/img/gallery-6.jpg',
    '../shared/img/gallery-7.jpg',
    '../shared/img/gallery-8.jpg',
    '../shared/img/gallery-9.jpg',
  ];

  /* ---------- Get images from localStorage or defaults ---------- */
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
      /* ignore parse errors, use defaults */
    }
    return DEFAULT_IMAGES;
  }

  /* ---------- Render gallery grid ---------- */
  function renderGallery() {
    var grid = document.getElementById('galleryGrid');
    if (!grid) return;

    var images = getImages();
    var fragment = document.createDocumentFragment();

    images.forEach(function (src, index) {
      var item = document.createElement('div');
      item.className = 'gallery__item';

      var img = document.createElement('img');
      img.src = src;
      img.alt = 'ЛЕЗВИЕ — фото ' + (index + 1);
      img.loading = 'lazy';
      img.width = 600;
      img.height = 400;

      item.appendChild(img);
      fragment.appendChild(item);
    });

    grid.innerHTML = '';
    grid.appendChild(fragment);

    initGalleryObserver();
    initLightbox();
  }

  /* ---------- Intersection Observer for fade-in ---------- */
  function initGalleryObserver() {
    var prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    var items = document.querySelectorAll('.gallery__item');

    if (prefersReduced) {
      items.forEach(function (item) {
        item.classList.add('visible');
      });
      return;
    }

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );

    items.forEach(function (item) {
      observer.observe(item);
    });
  }

  /* ---------- Lightbox ---------- */
  function initLightbox() {
    var lightbox = document.getElementById('lightbox');
    var lightboxImg = document.getElementById('lightboxImg');
    var lightboxClose = document.getElementById('lightboxClose');

    if (!lightbox || !lightboxImg || !lightboxClose) return;

    var items = document.querySelectorAll('.gallery__item');

    items.forEach(function (item) {
      item.addEventListener('click', function () {
        var img = this.querySelector('img');
        if (!img) return;

        lightboxImg.src = img.src;
        lightboxImg.alt = img.alt;
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
      });
    });

    lightboxClose.addEventListener('click', closeLightbox);

    lightbox.addEventListener('click', function (e) {
      if (e.target === lightbox) {
        closeLightbox();
      }
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && lightbox.classList.contains('active')) {
        closeLightbox();
      }
    });

    function closeLightbox() {
      lightbox.classList.remove('active');
      document.body.style.overflow = '';
    }
  }

  /* ---------- Init ---------- */
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', renderGallery);
  } else {
    renderGallery();
  }

  /* Expose for admin page usage */
  window.LezvieGallery = {
    render: renderGallery,
    getImages: getImages,
    STORAGE_KEY: STORAGE_KEY,
  };
})();
