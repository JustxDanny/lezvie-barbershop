/* ============================================================
   ЛЕЗВИЕ — Preloader engine
   Tracks REAL asset loading (weighted by actual file size),
   buffers the bar in the 40–50% window, sweeps to 100% once
   ~90% of bytes are in, short hold, then curtain reveal.

   Skins (?loader=1|2|3, production default: 2)
     1 — «Бритва»: strop line + gliding blade, vertical split
     2 — «Barber pole»: spinning pole + bar, horizontal split
     3 — «Отсчёт»: editorial giant counter, curtain lifts up
   Review aid:  &demo=1 — simulates a slow network so the
   buffer phase is visible on localhost where cache is instant.
   ============================================================ */
(function () {
  'use strict';

  var doc = document.documentElement;
  /* main.js adds these later too — needed NOW so the overlay can show
     while no-JS visitors never see it. Idempotent. */
  doc.classList.add('js');
  doc.classList.add('is-preloading');

  var root = document.getElementById('preloader');
  if (!root) { doc.classList.remove('is-preloading'); return; }

  function bail() {
    doc.classList.remove('is-preloading');
    root.style.display = 'none';
  }

  try {
    var RM = window.matchMedia('(prefers-reduced-motion: reduce)');
    var params = new URLSearchParams(window.location.search);
    var skin = params.get('loader');
    if (['1', '2', '3'].indexOf(skin) === -1) skin = '2';
    var demo = params.get('demo') === '1';

    /* ---------- Skin markup ---------- */
    var MARKUP = {
      '1':
        '<div class="pl__panel pl__panel--a"></div>' +
        '<div class="pl__panel pl__panel--b"></div>' +
        '<span class="pl__seam"></span>' +
        '<div class="pl__ui">' +
          '<span class="pl__brand">ЛЕЗВИЕ</span>' +
          '<div class="pl__track">' +
            '<span class="pl__fill"></span>' +
            '<span class="pl__rail"><span class="pl__blade"></span></span>' +
          '</div>' +
          '<span class="pl__pct">0%</span>' +
        '</div>',
      '2':
        '<div class="pl__panel pl__panel--a"></div>' +
        '<div class="pl__panel pl__panel--b"></div>' +
        '<div class="pl__ui">' +
          '<div class="pl__pole"><span class="pl__stripes"></span></div>' +
          '<div class="pl__track"><span class="pl__fill"></span></div>' +
          '<div class="pl__row">' +
            '<span class="pl__brand">ЛЕЗВИЕ</span>' +
            '<span class="pl__pct">0%</span>' +
          '</div>' +
        '</div>',
      '3':
        '<div class="pl__panel pl__panel--solo"></div>' +
        '<div class="pl__ui pl__ui--corner">' +
          '<span class="pl__label">ЛЕЗВИЕ &middot; ИЖЕВСК</span>' +
          '<span class="pl__num"><span class="pl__pct">0</span><span class="pl__pctsign">%</span></span>' +
        '</div>' +
        '<div class="pl__baseline"><span class="pl__fill"></span></div>'
    };

    root.setAttribute('data-skin', skin);
    root.innerHTML = MARKUP[skin];
    var pctEls = root.querySelectorAll('.pl__pct');

    /* ---------- Real-asset manifest ----------
       Weights = actual KB on disk, so progress ≈ bytes landed.
       Preloading here also warms the cache: the lazy-loaded
       gallery/barber images below the fold appear instantly. */
    var ASSETS = [
      { src: 'img/hero-1.jpg',        w: 196 },
      { src: 'img/barber-rashad.jpg', w: 16  },
      { src: 'img/barber-elmin-v7.jpg', w: 56 },
      { src: 'img/barber-mustafa.jpg', w: 72 },
      { src: 'img/barber-duo.jpg',    w: 24  },
      { src: 'img/gallery-vk-1.jpg',  w: 324 },
      { src: 'img/gallery-vk-2.jpg',  w: 168 },
      { src: 'img/gallery-vk-3.jpg',  w: 208 },
      { src: 'img/gallery-vk-4.jpg',  w: 260 },
      { src: 'img/gallery-vk-5.jpg',  w: 536 },
      { src: 'img/gallery-vk-6.jpg',  w: 460 }
    ];
    var FONTS_W = 120; /* Oswald + Lora via Google Fonts */

    var totalW = FONTS_W;
    var loadedW = 0;
    ASSETS.forEach(function (a) { totalW += a.w; });

    var winLoaded = false;
    window.addEventListener('load', function () { winLoaded = true; });

    if (!demo) {
      ASSETS.forEach(function (a) {
        var im = new Image();
        /* an error still counts as "done" — a dead file must not trap the visitor */
        im.onload = im.onerror = function () { loadedW += a.w; };
        im.src = a.src;
      });
      if (document.fonts && document.fonts.ready && document.fonts.ready.then) {
        document.fonts.ready.then(
          function () { loadedW += FONTS_W; },
          function () { loadedW += FONTS_W; }
        );
      } else {
        loadedW += FONTS_W;
      }
    }

    var demoStart = null;
    var DEMO_RAMP = 4200;

    function realFraction(now) {
      if (demo) {
        if (demoStart === null) demoStart = now;
        return Math.min(1, (now - demoStart) / DEMO_RAMP);
      }
      return winLoaded ? 1 : Math.min(1, loadedW / totalW);
    }

    /* ---------- Display engine ---------- */
    var REAL_GATE    = 0.9;  /* "site actually ~90% loaded" → release */
    var CREEP_CAP    = 46;   /* the bar waits inside the 40–50 band  */
    var MIN_SHOW     = 900;  /* fully-cached visits still get a beat  */
    var HARD_TIMEOUT = 8000; /* stalled network can never trap anyone */
    var SWEEP_MS     = 650;
    var HOLD_MS      = 350;  /* the short buffer at 100% */

    var displayed = 0;
    var sweeping = false;
    var sweepStart = 0;
    var sweepFrom = 0;
    var finished = false;
    var startT = null;

    function render() {
      var p = Math.round(displayed);
      root.style.setProperty('--pl-p', displayed.toFixed(2));
      var label = skin === '3' ? String(p) : p + '%';
      for (var i = 0; i < pctEls.length; i++) pctEls[i].textContent = label;
    }

    function finish() {
      if (finished) return;
      finished = true;
      window.setTimeout(function () {
        doc.classList.remove('is-preloading'); /* unlocks scroll, releases the hero tagline */
        root.classList.add('preloader--open');
        try { window.dispatchEvent(new CustomEvent('lezvie:loaded')); } catch (e) {}
        window.setTimeout(function () {
          if (root.parentNode) root.parentNode.removeChild(root);
        }, 1500);
      }, RM.matches ? 0 : HOLD_MS);
    }

    function frame(now) {
      if (finished) return;
      if (startT === null) startT = now;
      var elapsed = now - startT;
      var real = realFraction(now);
      var expired = elapsed > HARD_TIMEOUT;

      if (!sweeping) {
        /* Buffer phase: crawl into the 40–50 window, led by whichever is
           further along — real bytes or time (a stall never reads as a freeze) */
        var timeLead = Math.min(1, elapsed / 3000) * 0.82;
        var target = CREEP_CAP * Math.max(real, timeLead);
        displayed += (target - displayed) * (RM.matches ? 1 : 0.08);
        if ((real >= REAL_GATE || expired) && elapsed >= MIN_SHOW) {
          sweeping = true;
          sweepStart = now;
          sweepFrom = displayed;
        }
      } else {
        var t = Math.min(1, (now - sweepStart) / (RM.matches ? 1 : SWEEP_MS));
        var e = 1 - Math.pow(1 - t, 3); /* easeOutCubic */
        displayed = sweepFrom + (100 - sweepFrom) * e;
        if (t >= 1) {
          displayed = 100;
          render();
          finish();
          return;
        }
      }
      render();
      window.requestAnimationFrame(frame);
    }

    /* Belt-and-braces: whatever happens, the site is never trapped behind
       the overlay (covers a stalled rAF in a background tab too) */
    window.setTimeout(finish, HARD_TIMEOUT + SWEEP_MS + 2000);

    window.requestAnimationFrame(frame);
  } catch (err) {
    bail();
  }
})();
