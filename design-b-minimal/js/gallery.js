/* ============================================
   ЛЕЗВИЕ — Design B "МИНИМАЛ" — Gallery JS
   Renders gallery from defaults or localStorage
   ============================================ */

(function () {
  'use strict';

  var STORAGE_KEY = 'lezvie-b-gallery';

  // Default gallery images (relative to index.html)
  var defaultImages = [
    '../shared/img/gallery-1.jpg',
    '../shared/img/gallery-2.jpg',
    '../shared/img/gallery-3.jpg',
    '../shared/img/gallery-4.jpg',
    '../shared/img/gallery-5.jpg',
    '../shared/img/gallery-6.jpg'
  ];

  /**
   * Load images from localStorage or fall back to defaults.
   * @returns {string[]} Array of image URLs or data URLs
   */
  function loadImages() {
    try {
      var stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        var parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      // Ignore parse errors, use defaults
    }
    return defaultImages;
  }

  /**
   * Render gallery items into the grid.
   */
  function renderGallery() {
    var grid = document.getElementById('galleryGrid');
    if (!grid) return;

    var images = loadImages();
    grid.innerHTML = '';

    var srcs = [];

    images.forEach(function (src, index) {
      var item = document.createElement('div');
      item.className = 'gallery__item';
      item.setAttribute('role', 'button');
      item.setAttribute('tabindex', '0');
      item.setAttribute('aria-label', 'Открыть фото ' + (index + 1));

      var img = document.createElement('img');
      img.src = src;
      img.alt = 'ЛЕЗВИЕ барбершоп — фото ' + (index + 1);
      img.loading = 'lazy';
      img.width = 600;
      img.height = 400;

      item.appendChild(img);
      grid.appendChild(item);
      srcs.push(src);

      // Click to open lightbox
      item.addEventListener('click', function () {
        if (window.lezvieGallery) {
          window.lezvieGallery.open(index);
        }
      });

      // Keyboard: Enter/Space
      item.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          if (window.lezvieGallery) {
            window.lezvieGallery.open(index);
          }
        }
      });
    });

    // Register images with lightbox in main.js
    if (window.lezvieGallery) {
      window.lezvieGallery.register(srcs);
    }
  }

  // Render on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', renderGallery);
  } else {
    renderGallery();
  }

  // Expose for external use (admin page can trigger re-render)
  window.lezvieGalleryRender = renderGallery;
})();
