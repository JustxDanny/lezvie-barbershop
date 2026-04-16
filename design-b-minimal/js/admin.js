/* ============================================
   ЛЕЗВИЕ — Design B "МИНИМАЛ" — Admin JS
   Password gate, gallery CRUD, drag-drop upload
   ============================================ */

(function () {
  'use strict';

  var STORAGE_KEY = 'lezvie-b-gallery';
  var PASSWORD = 'lezvie2026';

  // --- DOM refs ---
  var gate = document.getElementById('adminGate');
  var gateForm = document.getElementById('gateForm');
  var gatePassword = document.getElementById('gatePassword');
  var gateError = document.getElementById('gateError');
  var panel = document.getElementById('adminPanel');
  var uploadZone = document.getElementById('uploadZone');
  var uploadBtn = document.getElementById('uploadBtn');
  var uploadInput = document.getElementById('uploadInput');
  var galleryGrid = document.getElementById('adminGallery');

  // --- Auth ---
  var authenticated = false;

  // Check session
  if (sessionStorage.getItem('lezvie-admin-auth') === '1') {
    showPanel();
  }

  gateForm.addEventListener('submit', function (e) {
    e.preventDefault();
    if (gatePassword.value === PASSWORD) {
      sessionStorage.setItem('lezvie-admin-auth', '1');
      showPanel();
    } else {
      gateError.textContent = 'Неверный пароль';
      gatePassword.value = '';
      gatePassword.focus();
    }
  });

  function showPanel() {
    authenticated = true;
    gate.hidden = true;
    panel.hidden = false;
    renderGallery();
  }

  // --- Gallery data ---
  function getImages() {
    try {
      var stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        var parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch (e) { /* ignore */ }
    return [];
  }

  function saveImages(images) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(images));
  }

  // --- Render admin gallery ---
  function renderGallery() {
    var images = getImages();
    galleryGrid.innerHTML = '';

    if (images.length === 0) {
      var empty = document.createElement('div');
      empty.className = 'admin-empty';
      empty.textContent = 'Галерея пуста. Загрузите фото.';
      galleryGrid.appendChild(empty);
      return;
    }

    images.forEach(function (src, index) {
      var item = document.createElement('div');
      item.className = 'admin-gallery__item';

      var img = document.createElement('img');
      img.src = src;
      img.alt = 'Фото ' + (index + 1);
      img.loading = 'lazy';

      var del = document.createElement('button');
      del.className = 'admin-gallery__delete';
      del.setAttribute('aria-label', 'Удалить фото ' + (index + 1));
      del.innerHTML = '&times;';
      del.addEventListener('click', function () {
        if (confirm('Удалить это фото?')) {
          deleteImage(index);
        }
      });

      item.appendChild(img);
      item.appendChild(del);
      galleryGrid.appendChild(item);
    });
  }

  function deleteImage(index) {
    var images = getImages();
    images.splice(index, 1);
    saveImages(images);
    renderGallery();
  }

  // --- Upload ---
  uploadBtn.addEventListener('click', function () {
    uploadInput.click();
  });

  uploadInput.addEventListener('change', function () {
    handleFiles(this.files);
    this.value = '';
  });

  // Drag & drop
  uploadZone.addEventListener('dragover', function (e) {
    e.preventDefault();
    uploadZone.classList.add('admin-upload--active');
  });

  uploadZone.addEventListener('dragleave', function () {
    uploadZone.classList.remove('admin-upload--active');
  });

  uploadZone.addEventListener('drop', function (e) {
    e.preventDefault();
    uploadZone.classList.remove('admin-upload--active');
    handleFiles(e.dataTransfer.files);
  });

  // Click anywhere in zone to upload
  uploadZone.addEventListener('click', function (e) {
    if (e.target !== uploadBtn) {
      uploadInput.click();
    }
  });

  function handleFiles(fileList) {
    if (!fileList || fileList.length === 0) return;

    var images = getImages();
    var remaining = fileList.length;

    Array.from(fileList).forEach(function (file) {
      if (!file.type.startsWith('image/')) {
        remaining--;
        if (remaining === 0) renderGallery();
        return;
      }

      var reader = new FileReader();
      reader.onload = function (e) {
        images.push(e.target.result);
        remaining--;
        if (remaining === 0) {
          saveImages(images);
          renderGallery();
        }
      };
      reader.readAsDataURL(file);
    });
  }
})();
