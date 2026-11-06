(function () {
  'use strict';

  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const HERO_COLS = [['01', '04', '07', '10'], ['02', '05', '08', '11'], ['03', '06', '09', '12']];
  const SCHOOL_LOGOS = ['harrow', 'shrewsbury', 'kings-college', 'woodstock', 'aga-khan', 'tisb'];

  const debounce = (fn, wait) => {
    let t;
    return (...args) => {
      clearTimeout(t);
      t = setTimeout(() => fn(...args), wait);
    };
  };

  const repeat = (arr, n = 2) => Array.from({ length: n }, () => arr).flat();

  function buildHeroScroller() {
    const track = document.querySelector('.hero__scroll-track');
    if (!track) return;

    const labels = ['a', 'b', 'c'];
    track.replaceChildren(...HERO_COLS.map((ids, i) => {
      const col = document.createElement('div');
      col.className = `hero__scroll-col hero__scroll-col--${labels[i]}`;
      for (let copy = 0; copy < 2; copy++) {
        const group = document.createElement('div');
        group.className = 'hero__scroll-group';
        ids.forEach((id) => {
          const img = document.createElement('img');
          img.className = 'hero__capsule';
          img.src = `assets/hero/${id}.png`;
          img.width = 150;
          img.height = 210;
          img.alt = '';
          img.decoding = 'async';
          img.loading = 'eager';
          group.appendChild(img);
        });
        col.appendChild(group);
      }
      return col;
    }));
  }

  function buildSchoolMarquees() {
    document.querySelectorAll('.schools__track[data-direction]').forEach((track) => {
      const rtl = track.dataset.direction === 'rtl';
      const logos = rtl ? [...SCHOOL_LOGOS].reverse() : SCHOOL_LOGOS;
      const row = document.createElement('div');
      row.className = `schools__row schools__row--${rtl ? 'rtl' : 'ltr'}`;

      repeat(logos).forEach((name) => {
        const wrap = document.createElement('span');
        wrap.className = 'schools__logo';
        const img = document.createElement('img');
        img.src = `assets/schools/${name}.png`;
        img.alt = '';
        img.loading = 'lazy';
        img.decoding = 'async';
        wrap.appendChild(img);
        row.appendChild(wrap);
      });

      track.appendChild(row);
    });
  }

  function initNav() {
    const header = document.querySelector('.nav');
    if (!header) return;

    let ticking = false;
    const update = () => {
      header.classList.toggle('nav--scrolled', scrollY > 10);
      ticking = false;
    };

    update();
    addEventListener('scroll', () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(update);
      }
    }, { passive: true });
  }

  function initAnchors() {
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
      anchor.addEventListener('click', (e) => {
        const id = anchor.getAttribute('href');
        if (!id || id === '#') return;
        const target = document.querySelector(id);
        if (!target) return;
        e.preventDefault();
        target.scrollIntoView({ behavior: reducedMotion ? 'auto' : 'smooth', block: 'start' });
        target.setAttribute('tabindex', '-1');
        target.focus({ preventScroll: true });
      });
    });
  }

  function initForm() {
    const form = document.querySelector('.enquire');
    if (!form) return;

    const success = document.getElementById('enquire-success');
    const validators = {
      parentName: (v) => v.trim().length >= 2 ? '' : 'Please enter your name.',
      phone: (v) => /^[0-9+\-\s()]{7,15}$/.test(v.trim()) ? '' : 'Please enter a valid phone number.',
      grade: (v) => v.trim().length >= 1 ? '' : 'Please tell us the grade.'
    };

    const validate = () => {
      let firstInvalid = null;
      Object.keys(validators).forEach((name) => {
        const input = form.elements[name];
        const errEl = document.getElementById(`${name}-error`);
        const msg = validators[name](input.value);
        if (msg) {
          input.classList.add('is-invalid');
          input.setAttribute('aria-invalid', 'true');
          if (errEl) errEl.textContent = msg;
          if (!firstInvalid) firstInvalid = input;
        } else {
          input.classList.remove('is-invalid');
          input.removeAttribute('aria-invalid');
          if (errEl) errEl.textContent = '';
        }
      });
      return firstInvalid;
    };

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const invalid = validate();
      if (invalid) {
        invalid.focus();
        if (success) success.textContent = '';
        return;
      }
      form.reset();
      if (success) success.textContent = 'Thank you! We will get in touch with you shortly.';
    });

    form.addEventListener('input', (e) => {
      const input = e.target;
      if (!validators[input.name] || !input.classList.contains('is-invalid')) return;
      if (!validators[input.name](input.value)) {
        input.classList.remove('is-invalid');
        input.removeAttribute('aria-invalid');
        const errEl = document.getElementById(`${input.name}-error`);
        if (errEl) errEl.textContent = '';
      }
    });
  }

  function addSwipe(el, onSwipe) {
    let startX = 0, startY = 0, tracking = false;
    el.addEventListener('touchstart', (e) => {
      const t = e.changedTouches[0];
      startX = t.clientX;
      startY = t.clientY;
      tracking = true;
    }, { passive: true });
    el.addEventListener('touchend', (e) => {
      if (!tracking) return;
      tracking = false;
      const t = e.changedTouches[0];
      const dx = t.clientX - startX;
      const dy = t.clientY - startY;
      if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy)) onSwipe(dx < 0 ? 1 : -1);
    }, { passive: true });
  }

  function initSchoolCards() {
    const section = document.querySelector('.school-cards');
    if (!section) return;

    const track = section.querySelector('.school-cards__track');
    const dotsWrap = section.querySelector('.school-cards__dots');
    const cards = [...track.children];
    const mq = matchMedia('(max-width: 767px)');
    let index = 0;

    cards.forEach((_, i) => {
      const dot = document.createElement('button');
      dot.className = 'school-cards__dot';
      dot.type = 'button';
      dot.setAttribute('role', 'tab');
      dot.setAttribute('aria-label', `Slide ${i + 1} of ${cards.length}`);
      dot.setAttribute('aria-selected', i === 0);
      dot.addEventListener('click', () => goTo(i));
      dotsWrap.appendChild(dot);
    });

    const dots = [...dotsWrap.children];

    const update = () => {
      if (!mq.matches) {
        track.style.transform = '';
        return;
      }
      const step = cards[1].getBoundingClientRect().left - cards[0].getBoundingClientRect().left;
      track.style.transform = `translate3d(${-index * step}px, 0, 0)`;
      dots.forEach((d, i) => d.setAttribute('aria-selected', i === index));
    };

    const goTo = (i) => {
      index = Math.max(0, Math.min(cards.length - 1, i));
      update();
    };

    section.addEventListener('keydown', (e) => {
      if (!mq.matches) return;
      if (e.key === 'ArrowRight') { e.preventDefault(); goTo(index + 1); }
      if (e.key === 'ArrowLeft') { e.preventDefault(); goTo(index - 1); }
    });

    addSwipe(track, (dir) => { if (mq.matches) goTo(index + dir); });
    mq.addEventListener('change', () => { index = 0; update(); });
    addEventListener('resize', debounce(update, 150));
    update();
  }

  function initExhibition() {
    const section = document.querySelector('.exhibition');
    if (!section) return;

    const viewport = section.querySelector('.exhibition__viewport');
    const track = section.querySelector('.exhibition__track');
    const cards = [...track.children];
    const prevBtn = section.querySelector('.exhibition__btn--prev');
    const nextBtn = section.querySelector('.exhibition__btn--next');
    let index = 0;

    const cardStep = () => {
      return cards[1].getBoundingClientRect().left - cards[0].getBoundingClientRect().left;
    };

    const maxTravel = () => {
      const lastCard = cards[cards.length - 1];
      const contentWidth = lastCard.getBoundingClientRect().right - cards[0].getBoundingClientRect().left;
      return Math.max(0, contentWidth - track.getBoundingClientRect().width);
    };
    const maxIndex = () => Math.ceil(maxTravel() / cardStep());

    const update = () => {
      index = Math.min(index, maxIndex());
      // Clamp the last step so the final card fits without leaving empty space.
      const travel = Math.min(index * cardStep(), maxTravel());
      track.style.transform = `translate3d(${-travel}px, 0, 0)`;
      viewport.setAttribute('aria-label', `Exhibition highlights, showing slide ${index + 1} of ${maxIndex() + 1}`);
    };

    const next = () => { index = index >= maxIndex() ? 0 : index + 1; update(); };
    const prev = () => { index = index <= 0 ? maxIndex() : index - 1; update(); };

    nextBtn?.addEventListener('click', next);
    prevBtn?.addEventListener('click', prev);
    addEventListener('resize', debounce(update, 150));
    update();
  }

  buildHeroScroller();
  buildSchoolMarquees();
  initNav();
  initAnchors();
  initForm();
  initSchoolCards();
  initExhibition();
})();
