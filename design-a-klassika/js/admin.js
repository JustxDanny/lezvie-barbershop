/* ============================================================
   ЛЕЗВИЕ — Admin Panel Logic
   Password gate, gallery management, drag-and-drop upload
   ============================================================ */

(function () {
  'use strict';

  var STORAGE_KEY = 'lezvie-a-gallery';
  var PASSWORD = 'lezvie2026';

  /* ---------- DOM ---------- */
  var loginForm = document.getElementById('loginForm');
  var passwordInput = document.getElementById('passwordInput');
  var loginError = document.getElementById('loginError');
  var loginSection = document.getElementById('loginSection');
  var adminSection = document.getElementById('adminSection');
  var thumbnailGrid = document.getElementById('thumbnailGrid');
  var dropZone = document.getElementById('dropZone');
  var fileInput = document.getElementById('fileInput');
  var imageCount = document.getElementById('imageCount');

  /* ---------- Auth ---------- */
  function handleLogin(e) {
    e.preventDefault();
    var value = passwordInput.value.trim();

    if (value === PASSWORD) {
      loginSection.style.display = 'none';
      adminSection.style.display = 'block';
      renderThumbnails();
    } else {
      loginError.textContent = 'Неверный пароль';
      loginError.style.display = 'block';
      passwordInput.value = '';
      passwordInput.focus();
    }
  }

  /* ---------- Get/Set images ---------- */
  function getImages() {
    try {
      var stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        var parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) { /* use empty */ }
    return [];
  }

  function saveImages(images) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(images));
    updateCount(images.length);
  }

  function updateCount(count) {
    if (imageCount) {
      imageCount.textContent = count;
    }
  }

  /* ---------- Render Thumbnails ---------- */
  function renderThumbnails() {
    var images = getImages();
    thumbnailGrid.innerHTML = '';

    if (images.length === 0) {
      thumbnailGrid.innerHTML = '<p class="admin__empty">Нет изображений. Загрузите через зону ниже.</p>';
      updateCount(0);
      return;
    }

    updateCount(images.length);

    images.forEach(function (src, index) {
      var item = document.createElement('div');
      item.className = 'admin__thumb';

      var img = document.createElement('img');
      img.src = src;
      img.alt = 'Фото ' + (index + 1);

      var deleteBtn = document.createElement('button');
      deleteBtn.className = 'admin__delete';
      deleteBtn.innerHTML = '&times;';
      deleteBtn.title = 'Удалить';
      deleteBtn.setAttribute('aria-label', 'Удалить фото ' + (index + 1));

      deleteBtn.addEventListener('click', function () {
        if (confirm('Удалить это изображение?')) {
          var current = getImages();
          current.splice(index, 1);
          saveImages(current);
          renderThumbnails();
        }
      });

      item.appendChild(img);
      item.appendChild(deleteBtn);
      thumbnailGrid.appendChild(item);
    });
  }

  /* ---------- File Upload ---------- */
  function handleFiles(files) {
    var images = getImages();
    var remaining = files.length;

    Array.from(files).forEach(function (file) {
      if (!file.type.startsWith('image/')) {
        remaining--;
        if (remaining === 0) {
          saveImages(images);
          renderThumbnails();
        }
        return;
      }

      var reader = new FileReader();
      reader.onload = function (e) {
        images.push(e.target.result);
        remaining--;
        if (remaining === 0) {
          saveImages(images);
          renderThumbnails();
        }
      };
      reader.readAsDataURL(file);
    });
  }

  /* ---------- Drag & Drop ---------- */
  function initDropZone() {
    if (!dropZone || !fileInput) return;

    dropZone.addEventListener('dragover', function (e) {
      e.preventDefault();
      dropZone.classList.add('admin__drop--active');
    });

    dropZone.addEventListener('dragleave', function () {
      dropZone.classList.remove('admin__drop--active');
    });

    dropZone.addEventListener('drop', function (e) {
      e.preventDefault();
      dropZone.classList.remove('admin__drop--active');
      if (e.dataTransfer.files.length > 0) {
        handleFiles(e.dataTransfer.files);
      }
    });

    dropZone.addEventListener('click', function () {
      fileInput.click();
    });

    fileInput.addEventListener('change', function () {
      if (this.files.length > 0) {
        handleFiles(this.files);
        this.value = '';
      }
    });
  }

  /* ---------- Reset to defaults ---------- */
  function initReset() {
    var resetBtn = document.getElementById('resetBtn');
    if (!resetBtn) return;

    resetBtn.addEventListener('click', function () {
      if (confirm('Сбросить галерею к изображениям по умолчанию? Все загруженные фото будут удалены.')) {
        localStorage.removeItem(STORAGE_KEY);
        renderThumbnails();
      }
    });
  }

  /* ---------- Init ---------- */
  function init() {
    if (loginForm) {
      loginForm.addEventListener('submit', handleLogin);
    }
    initDropZone();
    initReset();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
