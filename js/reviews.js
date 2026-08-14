/* ============================================================
   ЛЕЗВИЕ 2.0 — Design C "ДВИЖЕНИЕ"
   reviews.js — 2ГИС reviews carousel, shuffle-bag rotation
   ============================================================ */

(function () {
  'use strict';

  /* ---------- Global gates ---------- */
  var RM   = window.matchMedia('(prefers-reduced-motion: reduce)');
  var EASE_OUT = 'cubic-bezier(0.16,1,0.3,1)';
  var EASE_IN  = 'cubic-bezier(0.7,0,0.84,0)';

  var AUTOPLAY_MS = 6000; // keep in sync with .reviews__progress span animation-duration in CSS

  /* Real 5-star reviews pulled from the shop's 2ГИС profile (Пушкинская 270,
     4.9/5, 360+ reviews). Refresh this list every few months. */
  var REVIEWS = [
    { name: 'Илья Т.',            text: 'Лучший барбершоп в Ижевске! Хожу уже много лет. Отдельное спасибо барберу Рашаду.' },
    { name: 'Сергей Филиппов',    text: 'Уже много лет стрижемся с сыном у Рашада! Всегда идеально.' },
    { name: 'Alex Alex',          text: 'Рашад — мой мастер уже более 5 лет. Стрижёт красиво, стабильно качественно и быстро.' },
    { name: 'Константин Беков',   text: 'Посещали студию... Идеальное место... В общем, 10 из 10.' },
    { name: 'Дмитрий Горынцев',   text: 'Стригусь тут больше года — всё отлично.' },
    { name: 'Городской житель',   text: 'Был у барбера Георгия, это высший уровень — быстро, чётко и профессионально.' },
    { name: 'khinkal',            text: 'Приятный персонал, стажёр-барбер Заур постриг хорошо, результатом доволен.' },
    { name: 'Александр Ахмадеев', text: 'Барбер Рашад сделал всё по красоте.' },
    { name: 'Влад Юшков',         text: 'Рекомендую это место, несколько лет посещаю — Насибу отдельный респект.' },
    { name: 'Александр Бушмелев', text: 'Постоянно стригусь здесь, Насиб лучший, своё дело знает!' },
    { name: 'Артур Ильдарович',   text: 'Асиф — отличный барбер: высокий профессионализм, аккуратность, вежливость.' },
    { name: 'Тимур Цатиев',       text: 'Хожу сюда не в первый раз к мастеру Асифу — настоящий мастер.' },
    { name: 'Данил Димитрович',   text: 'Отлично подстригал, молодец Асиф, зайду ещё.' },
    { name: 'Кирилл Байков',      text: 'Очень приятная атмосфера, был впервые и нисколько не пожалел!' },
    { name: 'Намик Мустафаев',    text: 'Очень понравилось, как стриг топ-барбер Мустафа.' },
    { name: 'Хасрат Гадирли',     text: 'Постригаюсь только у Мустафы — делает такие вещи, что в шоке. Спасибо!' },
    { name: 'Ильнур Хайруллин',   text: 'Хожу к мастеру своего дела Рашаду — ребята знают своё дело.' }
  ];

  var trackEl, progressEl, prevBtn, nextBtn;
  var bag = [];
  var lastIndex = -1;
  var currentIndex = 0;
  var timer = null;
  var paused = false;
  var transitioning = false; // hard lock — only one card may ever be settled/visible at a time

  /* ---------- Shuffle-bag rotation — no repeat until every review has played,
     and no repeat across the reshuffle boundary either ---------- */
  function refillBag() {
    bag = REVIEWS.map(function (_, i) { return i; });
    for (var i = bag.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var tmp = bag[i]; bag[i] = bag[j]; bag[j] = tmp;
    }
    // bag.pop() serves from the end — if that would repeat lastIndex, swap it out
    if (bag.length > 1 && bag[bag.length - 1] === lastIndex) {
      var swapWith = Math.floor(Math.random() * (bag.length - 1));
      var t = bag[bag.length - 1];
      bag[bag.length - 1] = bag[swapWith];
      bag[swapWith] = t;
    }
  }

  function nextFromBag() {
    if (!bag.length) refillBag();
    lastIndex = bag.pop();
    return lastIndex;
  }

  /* ---------- Render ---------- */
  function buildCard(review) {
    var card = document.createElement('div');
    card.className = 'reviews__card';

    var stars = document.createElement('div');
    stars.className = 'reviews__stars';
    stars.setAttribute('aria-label', '5 из 5 звёзд');
    stars.textContent = '★★★★★';

    var text = document.createElement('p');
    text.className = 'reviews__text';
    text.textContent = review.text;

    var meta = document.createElement('div');
    meta.className = 'reviews__meta';

    var name = document.createElement('span');
    name.className = 'reviews__name';
    name.textContent = review.name;

    var source = document.createElement('span');
    source.className = 'reviews__source';
    source.textContent = '2ГИС';

    meta.appendChild(name);
    meta.appendChild(source);
    card.appendChild(stars);
    card.appendChild(text);
    card.appendChild(meta);
    return card;
  }

  function showCard(dir) {
    if (!trackEl) return;
    var review = REVIEWS[currentIndex];
    var incoming = buildCard(review);
    // querySelectorAll, not querySelector — sweeps up EVERY existing card, not
    // just the first, so a stray leftover can never linger next to a new one
    var outgoingEls = Array.prototype.slice.call(trackEl.querySelectorAll('.reviews__card'));

    if (!outgoingEls.length || RM.matches || !('animate' in Element.prototype)) {
      trackEl.innerHTML = '';
      trackEl.appendChild(incoming);
      restartProgress();
      return;
    }

    dir = dir || 1;
    transitioning = true;
    incoming.style.position = 'absolute';
    incoming.style.inset = '0';
    incoming.style.opacity = '0';
    trackEl.appendChild(incoming);

    outgoingEls.forEach(function (outgoing) {
      if (outgoing.getAnimations) {
        outgoing.getAnimations().forEach(function (a) { a.cancel(); });
      }
      outgoing.animate(
        [{ opacity: 1, transform: 'translateX(0)' },
         { opacity: 0, transform: 'translateX(' + (dir * -18) + 'px)' }],
        { duration: 220, easing: EASE_IN, fill: 'forwards' }
      ).finished.then(function () {
        if (outgoing.parentNode) outgoing.parentNode.removeChild(outgoing);
      }).catch(function () {
        if (outgoing.parentNode) outgoing.parentNode.removeChild(outgoing);
      });
    });

    incoming.animate(
      [{ opacity: 0, transform: 'translateX(' + (dir * 18) + 'px)' },
       { opacity: 1, transform: 'translateX(0)' }],
      { duration: 320, delay: 100, easing: EASE_OUT, fill: 'backwards' }
    ).finished.then(function () {
      incoming.style.position = '';
      incoming.style.inset = '';
      incoming.style.opacity = '';
      transitioning = false;
    }).catch(function () {
      transitioning = false;
    });

    restartProgress();
  }

  function step(dir) {
    if (transitioning) return; // ignore clicks/ticks mid-transition — never overlap two active cards
    currentIndex = nextFromBag();
    showCard(dir);
  }

  /* ---------- Autoplay progress bar (CSS-driven, restarted per cycle) ---------- */
  function restartProgress() {
    if (!progressEl || RM.matches) return;
    var bar = progressEl.firstElementChild;
    if (!bar) return;
    bar.classList.remove('reviews__progress-fill--run');
    // Force reflow so the animation restarts from 0
    void bar.offsetWidth;
    bar.classList.add('reviews__progress-fill--run');
  }

  function scheduleNext() {
    clearTimeout(timer);
    if (RM.matches) return;
    timer = setTimeout(function () {
      if (!paused) step(1);
      scheduleNext();
    }, AUTOPLAY_MS);
  }

  function setPaused(state) {
    paused = state;
    if (progressEl) {
      var bar = progressEl.firstElementChild;
      if (bar) bar.style.animationPlayState = state ? 'paused' : 'running';
    }
  }

  /* ---------- INIT ---------- */
  function init() {
    trackEl    = document.getElementById('reviewsTrack');
    progressEl = document.getElementById('reviewsProgress');
    if (!trackEl) return;

    var stage = trackEl.closest('.reviews__stage');
    prevBtn = stage ? stage.querySelector('.reviews__arrow--prev') : null;
    nextBtn = stage ? stage.querySelector('.reviews__arrow--next') : null;

    currentIndex = nextFromBag();
    var first = buildCard(REVIEWS[currentIndex]);
    trackEl.appendChild(first);
    restartProgress();

    if (prevBtn) prevBtn.addEventListener('click', function () { step(-1); scheduleNext(); });
    if (nextBtn) nextBtn.addEventListener('click', function () { step(1);  scheduleNext(); });

    var section = document.getElementById('reviews');
    if (section) {
      section.addEventListener('mouseenter', function () { setPaused(true); });
      section.addEventListener('mouseleave', function () { setPaused(false); });
      section.addEventListener('focusin',  function () { setPaused(true); });
      section.addEventListener('focusout', function () { setPaused(false); });
    }

    scheduleNext();
  }

  document.addEventListener('DOMContentLoaded', init);

})();
