/* ============================================================
   ЛЕЗВИЕ — Design C "ДВИЖЕНИЕ"
   admin.js — Gallery admin panel (password gate, upload, delete)
   ============================================================ */

(function () {
  'use strict';

  var STORAGE_KEY = 'lezvie-c-gallery';
  var PASSWORD = 'lezvie2026';

  /* DOM */
  var gateEl     = document.getElementById('gate');
  var panelEl    = document.getElementById('panel');
  var passwordEl = document.getElementById('password');
  var loginBtn   = document.getElementById('loginBtn');
  var gateError  = document.getElementById('gateError');
  var uploadZone = document.getElementById('uploadZone');
  var uploadBtn  = document.getElementById('uploadBtn');
  var fileInput  = document.getElementById('fileInput');
  var thumbGrid  = document.getElementById('thumbGrid');
  var emptyState = document.getElementById('emptyState');

  var images = [];

  /* ==========================================================
     1. PASSWORD GATE
     ========================================================== */
  function checkAuth() {
    // Session-based auth (sessionStorage so it clears on tab close)
    return sessionStorage.getItem('lezvie-admin-auth') === 'true';
  }

  function authenticate() {
    var pwd = passwordEl.value.trim();
    if (pwd === PASSWORD) {
      sessionStorage.setItem('lezvie-admin-auth', 'true');
      showPanel();
    } else {
      gateError.textContent = 'Неверный пароль';
      passwordEl.value = '';
      passwordEl.focus();
    }
  }

  function showPanel() {
    gateEl.style.display = 'none';
    panelEl.classList.add('active');
    loadImages();
  }

  loginBtn.addEventListener('click', authenticate);
  passwordEl.addEventListener('keydown', function (e) {
    if (e.key === 'Enter') authenticate();
  });

  /* ==========================================================
     2. IMAGE STORAGE
     ========================================================== */
  function loadImages() {
    try {
      var stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        var parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          images = parsed;
        }
      }
    } catch (e) {
      images = [];
    }
    renderThumbnails();
  }

  function saveImages() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(images));
    } catch (e) {
      alert('Ошибка сохранения. Возможно, хранилище заполнено.');
    }
  }

  /* ==========================================================
     3. RENDER THUMBNAILS
     ========================================================== */
  function renderThumbnails() {
    thumbGrid.innerHTML = '';

    if (images.length === 0) {
      emptyState.style.display = 'block';
      return;
    }

    emptyState.style.display = 'none';

    images.forEach(function (img, i) {
      var item = document.createElement('div');
      item.className = 'thumb-grid__item';

      var imgEl = document.createElement('img');
      imgEl.src = img.src;
      imgEl.alt = img.alt || 'Фото ' + (i + 1);

      var deleteBtn = document.createElement('button');
      deleteBtn.className = 'thumb-grid__delete';
      deleteBtn.innerHTML = '&times;';
      deleteBtn.title = 'Удалить';
      deleteBtn.addEventListener('click', function () {
        deleteImage(i);
      });

      var order = document.createElement('span');
      order.className = 'thumb-grid__order';
      order.textContent = String(i + 1).padStart(2, '0');

      item.appendChild(imgEl);
      item.appendChild(deleteBtn);
      item.appendChild(order);
      thumbGrid.appendChild(item);
    });
  }

  /* ==========================================================
     4. UPLOAD (Drag & Drop + File Picker)
     ========================================================== */
  function handleFiles(files) {
    if (!files || !files.length) return;

    var pending = files.length;

    Array.from(files).forEach(function (file) {
      if (!file.type.startsWith('image/')) {
        pending--;
        if (pending === 0) {
          saveImages();
          renderThumbnails();
        }
        return;
      }

      var reader = new FileReader();
      reader.onload = function (e) {
        images.push({
          src: e.target.result,
          alt: file.name.replace(/\.[^.]+$/, '')
        });
        pending--;
        if (pending === 0) {
          saveImages();
          renderThumbnails();
        }
      };
      reader.readAsDataURL(file);
    });
  }

  uploadBtn.addEventListener('click', function (e) {
    e.stopPropagation();
    fileInput.click();
  });

  uploadZone.addEventListener('click', function () {
    fileInput.click();
  });

  fileInput.addEventListener('change', function () {
    handleFiles(this.files);
    this.value = '';
  });

  // Drag & drop
  uploadZone.addEventListener('dragover', function (e) {
    e.preventDefault();
    uploadZone.classList.add('dragover');
  });

  uploadZone.addEventListener('dragleave', function () {
    uploadZone.classList.remove('dragover');
  });

  uploadZone.addEventListener('drop', function (e) {
    e.preventDefault();
    uploadZone.classList.remove('dragover');
    handleFiles(e.dataTransfer.files);
  });

  /* ==========================================================
     5. DELETE
     ========================================================== */
  function deleteImage(index) {
    var confirmed = confirm('Удалить это изображение?');
    if (!confirmed) return;

    images.splice(index, 1);
    saveImages();
    renderThumbnails();
  }

  /* ==========================================================
     INIT
     ========================================================== */
  if (checkAuth()) {
    showPanel();
  }

})();
