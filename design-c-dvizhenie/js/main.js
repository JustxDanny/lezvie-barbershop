/* ============================================================
   ЛЕЗВИЕ 2.0 — Design C "ДВИЖЕНИЕ"
   main.js — Nav, scroll animations, parallax, lazy maps, hero
   ============================================================ */

(function () {
  'use strict';

  /* All new hidden states are scoped under html.js — no-JS never hides content */
  document.documentElement.classList.add('js');

  /* No @property (Safari <16.4) — border beam degrades to a static gold border */
  if (!('CSSPropertyRule' in window)) {
    document.documentElement.classList.add('no-at-property');
  }

  /* ---------- Global gates ---------- */
  var RM   = window.matchMedia('(prefers-reduced-motion: reduce)');
  var FINE = window.matchMedia('(hover: hover) and (pointer: fine)');

  /* must stay in sync with :root easings */
  var EASE_OUT = 'cubic-bezier(0.16,1,0.3,1)';
  var EASE_IN  = 'cubic-bezier(0.7,0,0.84,0)';

  /* ---------- DOM Cache ---------- */
  const nav         = document.getElementById('nav');
  const navBurger   = document.getElementById('navBurger');
  const navMenu     = document.getElementById('navMenu');
  const heroEl      = document.getElementById('hero');
  const heroTagline = document.getElementById('heroTagline');

  /* ---------- Shared animation observer (exposed globally for gallery.js) ---------- */
  function makeRevealObserver(threshold, rootMargin) {
    return new IntersectionObserver(function (entries, obs) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          var el = entry.target;
          el.classList.add('visible');
          obs.unobserve(el);
          /* Drop the inline reveal stagger once the reveal has played, so later
             hover/press transitions on the same element aren't lagged by it
             (--reveal-delay stays — descendants read it for choreography) */
          var delay = parseFloat(el.style.transitionDelay) || 0;
          if (delay) {
            setTimeout(function () { el.style.transitionDelay = ''; }, (delay + 1.4) * 1000);
          }
        }
      });
    }, {
      threshold: threshold || 0.12,
      rootMargin: rootMargin || '0px 0px -60px 0px'
    });
  }

  /* data-delay → inline transition-delay + --reveal-delay (descendant choreography) */
  function applyRevealDelay(el) {
    var delay = el.getAttribute('data-delay');
    if (delay) {
      /* curtain + rise reveal via keyframes and --reveal-delay only — an inline
         transition-delay would lag their hover transitions afterwards */
      var type = el.getAttribute('data-animate');
      if (type !== 'curtain' && type !== 'rise') {
        el.style.transitionDelay = delay + 's';
      }
      el.style.setProperty('--reveal-delay', delay + 's');
    }
  }

  /* Observe nodes, grouped by data-io threshold override (shared observer per threshold) */
  function observeReveals(nodes) {
    if (!nodes || !nodes.length) return;
    var groups = {};
    Array.prototype.forEach.call(nodes, function (el) {
      applyRevealDelay(el);
      var t = parseFloat(el.getAttribute('data-io')) || 0.12;
      if (!groups[t]) groups[t] = makeRevealObserver(t);
      groups[t].observe(el);
    });
  }

  /* Expose a helper for late-added nodes (gallery items) */
  window.__lezvieReveal = function (nodes) {
    observeReveals(nodes);
  };

  /* ==========================================================
     1. TEXT SPLITTERS — generic word/char splitter + hero tagline
     ========================================================== */
  /* Wraps words/chars in .word/.char spans with inline --i index; returns the spans */
  function splitElement(el, mode) {
    var text  = el.textContent.trim();
    var spans = [];
    /* Screen readers get the intact text; the split spans are decoration —
       inline-block spans would otherwise be announced letter-by-letter */
    el.setAttribute('aria-label', text);
    el.textContent = '';

    if (mode === 'chars') {
      text.split('').forEach(function (ch) {
        if (/\s/.test(ch)) {
          el.appendChild(document.createTextNode(ch));
          return;
        }
        var span = document.createElement('span');
        span.className = 'char';
        span.textContent = ch;
        span.style.setProperty('--i', String(spans.length));
        el.appendChild(span);
        spans.push(span);
      });
    } else {
      var words = text.split(/\s+/).filter(Boolean);
      words.forEach(function (word, i) {
        var span = document.createElement('span');
        span.className = 'word';
        span.textContent = word;
        span.style.setProperty('--i', String(i));
        el.appendChild(span);
        if (i < words.length - 1) {
          el.appendChild(document.createTextNode(' '));
        }
        spans.push(span);
      });
    }
    spans.forEach(function (span) { span.setAttribute('aria-hidden', 'true'); });
    return spans;
  }

  /* Scroll-triggered splits: [data-split="words|chars"] — .split unlocks the parent */
  function initSplitReveal() {
    if (RM.matches) return; // blocks reveal whole — CSS kill-switch keeps them visible
    document.querySelectorAll('[data-split]').forEach(function (el) {
      if (el.classList.contains('split')) return;
      splitElement(el, el.getAttribute('data-split'));
      el.classList.add('split');
    });
  }

  /* Hero tagline keeps its keyframe animation path (wordReveal stagger) */
  function initHeroTagline() {
    if (!heroTagline) return;
    if (RM.matches) return; // reveals as a whole block

    var spans = splitElement(heroTagline, 'words');
    spans.forEach(function (span, i) {
      span.style.animationDelay = (0.35 + i * 0.11) + 's';
    });
    if (spans.length) {
      var brand = spans[spans.length - 1];
      brand.classList.add('word--brand');
      /* second delay drives the brandSheen animation — first sweep at 1.6s */
      brand.style.animationDelay = brand.style.animationDelay + ', 1.6s';
    }
  }

  /* ==========================================================
     2. STICKY NAV — rAF-throttled
     ========================================================== */
  function initNav() {
    if (!nav || !heroEl) return;

    var heroContent = document.querySelector('.hero__content');
    var navProgress = document.querySelector('.nav__progress');
    var hasScrollTimeline = typeof CSS !== 'undefined' && CSS.supports &&
                            CSS.supports('animation-timeline: scroll()');

    var ticking = false;
    var threshold = heroEl.offsetHeight * 0.5;
    var heroH = heroEl.offsetHeight;
    var driftPhase = '';

    function update() {
      var y = window.scrollY;
      nav.classList.toggle('nav--solid', y > threshold);

      /* Scroll progress fallback — CSS scroll-timeline owns it when supported;
         under RM the animation is disabled and JS writes with no smoothing */
      if (navProgress && (!hasScrollTimeline || RM.matches)) {
        var docH = document.documentElement.scrollHeight - window.innerHeight;
        navProgress.style.transform =
          'scaleX(' + (docH > 0 ? Math.min(y / docH, 1) : 0) + ')';
      }

      /* Hero exit drift — content lags the scroll and dissolves (skipped under RM).
         kenburns owns .hero__bg's transform — never double-write it.
         Only the 0<progress<1 window needs per-frame writes; settled states
         write once (driftPhase guard) to avoid style invalidation on every
         scroll frame of the rest of the page. */
      if (heroContent) {
        var progress = Math.min(y / heroH, 1);
        var phase = RM.matches ? 'idle'
                  : progress <= 0 ? 'idle'
                  : progress >= 1 ? 'past' : 'drift';
        if (phase === 'drift') {
          heroContent.style.transform  = 'translate3d(0, ' + (y * 0.18).toFixed(1) + 'px, 0)';
          heroContent.style.opacity    = String(Math.max(1 - progress * 1.15, 0));
          heroContent.style.willChange = 'transform, opacity';
        } else if (phase !== driftPhase) {
          if (phase === 'past') {
            heroContent.style.transform = 'translate3d(0, ' + (heroH * 0.18).toFixed(1) + 'px, 0)';
            heroContent.style.opacity   = '0';
          } else {
            heroContent.style.transform = '';
            heroContent.style.opacity   = '';
          }
          heroContent.style.willChange = '';
        }
        driftPhase = phase;
      }

      ticking = false;
    }

    function onScroll() {
      if (!ticking) {
        requestAnimationFrame(update);
        ticking = true;
      }
    }

    // Recompute threshold on resize (hero height changes on rotation)
    window.addEventListener('resize', function () {
      threshold = heroEl.offsetHeight * 0.5;
      heroH = heroEl.offsetHeight;
      driftPhase = ''; // force a settled-state rewrite with the new heroH
      onScroll();
    }, { passive: true });

    // Tear down / restore the drift mid-session
    RM.addEventListener('change', function () {
      driftPhase = '';
      onScroll();
    });

    window.addEventListener('scroll', onScroll, { passive: true });
    update();
  }

  /* ==========================================================
     2b. SCROLL-SPY — nav link highlights the section in view
     ========================================================== */
  function initScrollSpy() {
    var links = {};
    document.querySelectorAll('.nav__link[href^="#"]').forEach(function (link) {
      links[link.getAttribute('href').slice(1)] = link;
    });

    var sections = [];
    Object.keys(links).forEach(function (id) {
      var section = document.getElementById(id);
      if (section) sections.push(section);
    });
    if (!sections.length) return;

    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        var link = links[entry.target.id];
        if (!link) return;
        if (entry.isIntersecting) {
          Object.keys(links).forEach(function (id) {
            links[id].classList.remove('nav__link--active');
            links[id].removeAttribute('aria-current');
          });
          link.classList.add('nav__link--active');
          link.setAttribute('aria-current', 'true');
        } else {
          link.classList.remove('nav__link--active');
          link.removeAttribute('aria-current');
        }
      });
    }, { rootMargin: '-40% 0px -55% 0px', threshold: 0 });

    sections.forEach(function (section) { spy.observe(section); });
  }

  /* ==========================================================
     3. HAMBURGER MENU (Mobile)
     ========================================================== */
  function initBurger() {
    if (!navBurger || !navMenu) return;

    function closeMenu() {
      navMenu.classList.remove('open');
      navBurger.classList.remove('active');
      navBurger.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    }

    navBurger.addEventListener('click', function () {
      var isOpen = navMenu.classList.toggle('open');
      navBurger.classList.toggle('active', isOpen);
      navBurger.setAttribute('aria-expanded', String(isOpen));
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    navMenu.querySelectorAll('.nav__link, .nav__cta').forEach(function (link) {
      link.addEventListener('click', closeMenu);
    });

    // Close on escape
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && navMenu.classList.contains('open')) closeMenu();
    });
  }

  /* ==========================================================
     3b. NAV CTA TOUCH SHINE — tap fires the same sweep as hover
     ========================================================== */
  function initNavCtaShine() {
    var cta = document.querySelector('.nav__cta');
    if (!cta) return;

    var clearTimer = null;

    function clearPressed() {
      cta.classList.remove('is-pressed');
      clearTimeout(clearTimer);
    }

    cta.addEventListener('touchstart', function () {
      if (FINE.matches || cta.classList.contains('is-pressed')) return;
      cta.classList.add('is-pressed');
      // Safety net in case animationend never fires
      clearTimer = setTimeout(clearPressed, 900);
    }, { passive: true });

    cta.addEventListener('animationend', clearPressed);
  }

  /* ==========================================================
     4. SCROLL REVEAL — all [data-animate] elements
     ========================================================== */
  function initScrollAnimations() {
    observeReveals(document.querySelectorAll('[data-animate]'));
  }

  /* ==========================================================
     5. PARALLAX — rAF, registration-based (window.__lezvieParallax)
     ========================================================== */
  function initParallax() {
    var els = [];
    var cache = [];
    var ticking = false;
    var resizeTimer = null;
    var enabled = window.innerWidth >= 768 && !RM.matches;

    function recache() {
      /* Prune nodes detached by gallery re-renders (admin storage updates) */
      els = els.filter(function (el) { return el.isConnected; });
      cache = [];
      els.forEach(function (el) {
        var rect = el.getBoundingClientRect();
        cache.push({
          el: el,
          top: rect.top + window.scrollY,
          height: rect.height,
          speed: parseFloat(el.getAttribute('data-parallax')) || 0
        });
      });
    }

    function update() {
      ticking = false;
      if (!enabled) return;

      var scrollY = window.scrollY;
      var viewH = window.innerHeight;

      cache.forEach(function (c) {
        if (scrollY + viewH * 2 > c.top && scrollY < c.top + c.height + viewH) {
          var offset = (scrollY - c.top + viewH) * c.speed;
          c.el.style.transform = 'translate3d(0, ' + offset.toFixed(2) + 'px, 0)';
        }
      });
    }

    function onScroll() {
      if (!ticking) {
        requestAnimationFrame(update);
        ticking = true;
      }
    }

    /* Re-evaluate the ≥768px decision + RM gate; clear stale transforms on disable */
    function setEnabled(next) {
      if (next === enabled) return;
      enabled = next;
      if (!enabled) {
        els.forEach(function (el) { el.style.transform = ''; });
      } else {
        recache();
        onScroll();
      }
    }

    function onResize() {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(function () {
        setEnabled(window.innerWidth >= 768 && !RM.matches);
        recache();
        onScroll();
      }, 150);
    }

    /* Registration helper for late-rendered nodes (gallery items) */
    window.__lezvieParallax = function (nodes) {
      if (!nodes || !nodes.length) return;
      Array.prototype.forEach.call(nodes, function (el) {
        if (els.indexOf(el) === -1) els.push(el);
      });
      recache();
      onScroll();
    };

    /* Tear down / restore mid-session */
    RM.addEventListener('change', function () {
      setEnabled(window.innerWidth >= 768 && !RM.matches);
    });

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onResize, { passive: true });
    window.addEventListener('load', recache);

    window.__lezvieParallax(document.querySelectorAll('[data-parallax]'));
  }

  /* ==========================================================
     6. YANDEX MAPS — lazy init via IntersectionObserver
     ========================================================== */
  function initMaps() {
    var mapEls = document.querySelectorAll('.locations__map');
    if (!mapEls.length) return;

    function fallback(el) {
      el.style.display        = 'flex';
      el.style.alignItems     = 'center';
      el.style.justifyContent = 'center';
      el.style.fontFamily     = 'var(--font-body)';
      el.style.color          = 'var(--color-text-muted)';
      el.style.fontSize       = '0.9rem';
      el.style.padding        = '1rem';
      el.style.textAlign      = 'center';
      el.textContent          = el.getAttribute('data-address') || 'Карта';
    }

    function buildMap(el) {
      if (el.dataset.mapReady === '1') return;
      el.dataset.mapReady = '1';

      var lat     = parseFloat(el.getAttribute('data-lat'));
      var lon     = parseFloat(el.getAttribute('data-lon'));
      var address = el.getAttribute('data-address') || '';

      var map = new ymaps.Map(el, {
        center: [lat, lon],
        zoom: 16,
        controls: ['zoomControl']
      });

      map.geoObjects.add(new ymaps.Placemark([lat, lon], {
        balloonContent: address
      }, {
        preset: 'islands#darkOrangeIcon'
      }));

      map.behaviors.disable('scrollZoom');
    }

    function init() {
      if (typeof ymaps === 'undefined') {
        mapEls.forEach(fallback);
        return;
      }

      ymaps.ready(function () {
        var obs = new IntersectionObserver(function (entries, o) {
          entries.forEach(function (e) {
            if (e.isIntersecting) {
              buildMap(e.target);
              o.unobserve(e.target);
            }
          });
        }, { rootMargin: '200px 0px' });

        mapEls.forEach(function (el) { obs.observe(el); });
      });
    }

    // Wait for ymaps script (loaded with defer); poll briefly if not ready
    if (typeof ymaps !== 'undefined') {
      init();
    } else {
      var tries = 0;
      var poll = setInterval(function () {
        tries++;
        if (typeof ymaps !== 'undefined') {
          clearInterval(poll);
          init();
        } else if (tries > 40) { // 4s
          clearInterval(poll);
          mapEls.forEach(fallback);
        }
      }, 100);
    }
  }

  /* ==========================================================
     7. SMOOTH SCROLL
     ========================================================== */
  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(function (link) {
      link.addEventListener('click', function (e) {
        var href = this.getAttribute('href');
        // Dead-link placeholder — prevent scroll-to-top
        if (href === '#' || href.length < 2) {
          e.preventDefault();
          return;
        }

        var target = document.querySelector(href);
        if (target) {
          e.preventDefault();
          var offsetTop = target.getBoundingClientRect().top + window.scrollY - 72;
          window.scrollTo({ top: offsetTop, behavior: RM.matches ? 'auto' : 'smooth' });
        }
      });
    });
  }

  /* ==========================================================
     7b. BUTTONS — magnetic pull / ripple / CTA idle shimmer
     ========================================================== */
  /* Magnetic pull — [data-magnetic], .cta__button only (FINE pointers) */
  function initMagnetic() {
    var els = document.querySelectorAll('[data-magnetic]');
    if (!els.length || !FINE.matches) return; // never attach on touch

    function clamp(v, min, max) { return Math.min(Math.max(v, min), max); }

    Array.prototype.forEach.call(els, function (el) {
      var ticking = false;
      var mx = 0;
      var my = 0;
      var settleTimer = null;

      function apply() {
        ticking = false;
        el.style.setProperty('--mag-x', mx.toFixed(1) + 'px');
        el.style.setProperty('--mag-y', my.toFixed(1) + 'px');
      }

      function reset() {
        mx = 0;
        my = 0;
        el.style.setProperty('--mag-x', '0px');
        el.style.setProperty('--mag-y', '0px');
        clearTimeout(settleTimer);
        // release settles on the spring transition; drop will-change after it lands
        settleTimer = setTimeout(function () { el.style.willChange = ''; }, 550);
      }

      el.addEventListener('pointerenter', function () {
        if (RM.matches || !FINE.matches) return;
        clearTimeout(settleTimer);
        el.style.willChange = 'transform';
      });

      el.addEventListener('pointermove', function (e) {
        if (RM.matches || !FINE.matches) return;
        var rect = el.getBoundingClientRect();
        mx = clamp((e.clientX - rect.left - rect.width  / 2) * 0.25, -6, 6);
        my = clamp((e.clientY - rect.top  - rect.height / 2) * 0.25, -4, 4);
        if (!ticking) {
          requestAnimationFrame(apply);
          ticking = true;
        }
      }, { passive: true });

      el.addEventListener('pointerleave', reset);

      // Tear down mid-session
      RM.addEventListener('change', function () {
        if (RM.matches) reset();
      });
    });
  }

  /* Ripple — press feedback on the primary CTA (all clicks/taps) */
  function initRipple() {
    var button = document.querySelector('.cta__button');
    if (!button) return;

    button.addEventListener('click', function (e) {
      if (RM.matches) return;
      var rect = button.getBoundingClientRect();
      var x = e.clientX ? e.clientX - rect.left : rect.width  / 2;
      var y = e.clientY ? e.clientY - rect.top  : rect.height / 2;

      var ripple = document.createElement('span');
      ripple.className = 'ripple';
      ripple.style.left = x + 'px';
      ripple.style.top  = y + 'px';
      button.appendChild(ripple);

      ripple.addEventListener('animationend', function () {
        if (ripple.parentNode) ripple.parentNode.removeChild(ripple);
      });
    });
  }

  /* CTA idle shimmer — IO toggles .cta--inview (non-one-shot, pauses off-screen) */
  function initCtaShimmer() {
    var cta = document.querySelector('.cta');
    if (!cta) return;

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        cta.classList.toggle('cta--inview', entry.isIntersecting && !RM.matches);
      });
    }, { threshold: 0.2 });

    io.observe(cta);

    RM.addEventListener('change', function () {
      if (RM.matches) cta.classList.remove('cta--inview');
    });
  }

  /* ==========================================================
     7c. SERVICES — spotlight + border-beam battery pause
     ========================================================== */
  /* Spotlight — one delegated rAF-throttled pointermove on the grid writes
     --mx/--my (card-relative px) onto the hovered card. FINE pointers only. */
  function initSpotlight() {
    var grid = document.querySelector('.services__grid');
    if (!grid || !FINE.matches) return; // never attach on touch

    var ticking = false;
    var card = null;
    var mx = 0;
    var my = 0;

    function apply() {
      ticking = false;
      if (!card) return;
      card.style.setProperty('--mx', mx.toFixed(1) + 'px');
      card.style.setProperty('--my', my.toFixed(1) + 'px');
    }

    grid.addEventListener('pointermove', function (e) {
      if (RM.matches || !FINE.matches) return;
      var target = e.target && e.target.closest ? e.target.closest('.services__card') : null;
      if (!target) return;
      var rect = target.getBoundingClientRect();
      card = target;
      mx = e.clientX - rect.left;
      my = e.clientY - rect.top;
      if (!ticking) {
        requestAnimationFrame(apply);
        ticking = true;
      }
    }, { passive: true });
  }

  /* Border beam battery saver — IO pauses the conic rotation off-screen */
  function initBeamPause() {
    var services = document.querySelector('.services');
    if (!services) return;

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        services.classList.toggle('services--inview', entry.isIntersecting);
      });
    }, { threshold: 0 });

    io.observe(services);
  }

  /* ==========================================================
     8. BODY REVEAL
     ========================================================== */
  function revealBody() {
    // Next frame so initial transition applies cleanly
    requestAnimationFrame(function () {
      document.body.classList.add('is-ready');
    });
  }

  /* ==========================================================
     INIT
     ========================================================== */
  document.addEventListener('DOMContentLoaded', function () {
    initHeroTagline();
    initSplitReveal();
    initNav();
    initScrollSpy();
    initBurger();
    initNavCtaShine();
    initScrollAnimations();
    initParallax();
    initSmoothScroll();
    initMagnetic();
    initRipple();
    initCtaShimmer();
    initSpotlight();
    initBeamPause();
    revealBody();
  });

  window.addEventListener('load', initMaps);

})();
