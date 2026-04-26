/* ════════════════════════════════════════════════════════════
   АПАГА · main.js
   Header · Mobile nav · Reveal · FAQ · Calc · Form · BTT
   ════════════════════════════════════════════════════════════ */

(() => {
  'use strict';

  /* ─── Header scroll state ──────────────────────────────── */
  const hdr = document.querySelector('.hdr');
  const btt = document.querySelector('.btt');
  const onScroll = () => {
    const y = window.scrollY;
    if (hdr) hdr.classList.toggle('scrolled', y > 12);
    if (btt) btt.classList.toggle('on', y > 600);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
  if (btt) btt.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

  /* ─── Mobile menu ──────────────────────────────────────── */
  const burger = document.querySelector('.burger');
  const mobNav = document.querySelector('.mob-nav');
  if (burger && mobNav) {
    burger.addEventListener('click', () => {
      const open = burger.classList.toggle('open');
      mobNav.classList.toggle('show', open);
      document.body.style.overflow = open ? 'hidden' : '';
    });
    mobNav.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
      burger.classList.remove('open');
      mobNav.classList.remove('show');
      document.body.style.overflow = '';
    }));
  }

  /* ─── Reveal on scroll ────────────────────────────────── */
  const ro = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('on');
        ro.unobserve(e.target);
      }
    });
  }, { threshold: .12, rootMargin: '0px 0px -60px 0px' });
  document.querySelectorAll('.r-up, .r-left, .r-right, .r-scale, .h-slide').forEach(el => ro.observe(el));

  /* ─── Process line animation ──────────────────────────── */
  const proc = document.querySelector('.proc');
  if (proc) {
    const procObs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { e.target.classList.add('played'); procObs.unobserve(e.target); }
    }, { threshold: .35 });
    procObs.observe(proc);
  }

  /* ─── Number counter animation ────────────────────────── */
  const counters = document.querySelectorAll('[data-count]');
  if (counters.length) {
    const animateCount = (el) => {
      const target = parseInt(el.dataset.count, 10);
      const dur = 1400;
      const start = performance.now();
      const tick = (now) => {
        const p = Math.min((now - start) / dur, 1);
        const eased = 1 - Math.pow(1 - p, 3);
        el.textContent = Math.floor(eased * target);
        if (p < 1) requestAnimationFrame(tick);
        else el.textContent = target;
      };
      requestAnimationFrame(tick);
    };
    const co = new IntersectionObserver((entries) => {
      entries.forEach(e => { if (e.isIntersecting) { animateCount(e.target); co.unobserve(e.target); } });
    }, { threshold: .5 });
    counters.forEach(c => co.observe(c));
  }

  /* ─── FAQ accordion ───────────────────────────────────── */
  document.querySelectorAll('.faq-item__q').forEach(q => {
    q.addEventListener('click', () => {
      const item = q.parentElement;
      const wasOpen = item.classList.contains('open');
      item.parentElement.querySelectorAll('.faq-item').forEach(i => i.classList.remove('open'));
      if (!wasOpen) item.classList.add('open');
    });
  });

  /* ─── Phone mask ──────────────────────────────────────── */
  document.querySelectorAll('input[type="tel"]').forEach(input => {
    input.addEventListener('input', e => {
      let v = e.target.value.replace(/\D/g, '');
      if (v.startsWith('8')) v = '7' + v.slice(1);
      if (!v) { e.target.value = ''; return; }
      let out = '+7';
      if (v.length > 1)  out += ' (' + v.slice(1, 4);
      if (v.length >= 4) out += ') ' + v.slice(4, 7);
      if (v.length >= 7) out += '-' + v.slice(7, 9);
      if (v.length >= 9) out += '-' + v.slice(9, 11);
      e.target.value = out;
    });
  });

  /* ─── Form submit (soft mock) ─────────────────────────── */
  document.querySelectorAll('form[data-form]').forEach(form => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const phone = form.querySelector('input[type="tel"]');
      if (phone && phone.value.replace(/\D/g, '').length < 11) {
        phone.classList.add('err');
        phone.focus();
        setTimeout(() => phone.classList.remove('err'), 2200);
        return;
      }
      const fields = form.querySelector('.cta-card__fields') || form;
      const ok = form.querySelector('.cta-success') || form.parentElement.querySelector('.cta-success');
      if (fields && ok) {
        fields.style.display = 'none';
        ok.classList.add('on');
      } else {
        alert('Заявка получена! Свяжемся в течение рабочего дня.');
        form.reset();
      }
    });
  });

  /* ─── Smooth scroll for in-page anchors ───────────────── */
  document.querySelectorAll('a[href^="#"]:not([href="#"])').forEach(a => {
    a.addEventListener('click', (e) => {
      const id = a.getAttribute('href');
      const t = document.querySelector(id);
      if (t) {
        e.preventDefault();
        const top = t.getBoundingClientRect().top + window.scrollY - 90;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

  /* ─── Calculator ──────────────────────────────────────── */
  const calc = document.querySelector('[data-calc]');
  if (calc) {
    const RATES = {
      monolit: { base: [12000, 18000], unit: 'м³', label: 'Монолитные работы' },
      fasad:   { base: [3500, 6500],   unit: 'м²', label: 'Фасадные работы' },
      otdelka: { base: [5500, 11000],  unit: 'м²', label: 'Отделочные работы' },
      seti:    { base: [3000, 7500],   unit: 'м²', label: 'Инженерные сети' },
    };
    const OBJECT_FACTOR = {
      kindergarten: 1.05, school: 1.05, polyclinic: 1.10,
      residential:  1.0,  commercial: 1.08, industrial: 1.15, other: 1.0,
    };
    const REGION_FACTOR = { moscow: 1.20, mo: 1.10, regions: 1.0 };
    const state = { service: 'monolit', object: 'school', region: 'moscow', volume: 1000 };

    const fmt = (n) => Math.round(n).toLocaleString('ru-RU');
    const $ = (sel) => calc.querySelector(sel);

    const update = () => {
      const r = RATES[state.service];
      const ofac = OBJECT_FACTOR[state.object] || 1;
      const rfac = REGION_FACTOR[state.region] || 1;
      const v = Math.max(0, parseFloat(state.volume) || 0);
      const lo = r.base[0] * v * ofac * rfac;
      const hi = r.base[1] * v * ofac * rfac;
      const num = $('.calc__res-num');
      if (v === 0) {
        num.innerHTML = `от&nbsp;<small>укажите объём</small>`;
      } else if (v < 50) {
        num.innerHTML = `от ${fmt(lo)}&nbsp;<small>₽</small>`;
      } else {
        num.innerHTML = `${fmt(lo / 1e6).replace('.', ',')}–${fmt(hi / 1e6).replace('.', ',')}&nbsp;<small>млн ₽</small>`;
      }
      $('.calc__unit').textContent = r.unit;
      $('.calc__res-svc').textContent = r.label;
    };

    calc.querySelectorAll('[data-pill]').forEach(p => {
      p.addEventListener('click', () => {
        const group = p.dataset.group;
        calc.querySelectorAll(`[data-pill][data-group="${group}"]`).forEach(x => x.classList.remove('active'));
        p.classList.add('active');
        state[group] = p.dataset.pill;
        update();
      });
    });

    const vol = $('input[data-vol]');
    if (vol) vol.addEventListener('input', e => { state.volume = parseFloat(e.target.value) || 0; update(); });
    const sel = $('select[data-region]');
    if (sel) sel.addEventListener('change', e => { state.region = e.target.value; update(); });
    update();
  }

  /* ─── Active nav highlighting ─────────────────────────── */
  const path = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('[data-nav]').forEach(link => {
    if (link.dataset.nav === path) link.classList.add('active');
  });

})();
