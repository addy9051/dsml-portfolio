/* ─── Navigation active state ──────────────────────────────── */
function setActiveNav() {
  const current = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-link').forEach(link => {
    const href = link.getAttribute('href');
    if (href === current || (current === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });
}

/* ─── Mobile menu ──────────────────────────────────────────── */
function initMobileMenu() {
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobile-menu');
  const closeBtn  = document.getElementById('mobile-close');
  if (!hamburger) return;

  hamburger.addEventListener('click', () => mobileMenu.classList.add('open'));
  closeBtn?.addEventListener('click',  () => mobileMenu.classList.remove('open'));
  mobileMenu?.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => mobileMenu.classList.remove('open'));
  });
}

/* ─── Scroll reveal ────────────────────────────────────────── */
function initReveal() {
  const els = document.querySelectorAll('.reveal');
  if (!els.length) return;
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); obs.unobserve(e.target); } });
  }, { threshold: 0.08 });
  els.forEach(el => obs.observe(el));
}

/* ─── Navbar shrink on scroll ──────────────────────────────── */
function initNavScroll() {
  const nav = document.querySelector('.navbar');
  if (!nav) return;
  window.addEventListener('scroll', () => {
    nav.style.top = window.scrollY > 40 ? '8px' : '16px';
  }, { passive: true });
}

/* ─── Animated project counters ────────────────────────────── */
function initCounters() {
  const nums = document.querySelectorAll('.count-num');
  if (!nums.length) return;

  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const easeOutCubic = t => 1 - Math.pow(1 - t, 3);

  const countTarget = (el) => {
    // Explicit target wins; otherwise derive the *live* count — either from a
    // CSS selector (e.g. the page's project sections) or a track card's list —
    // so the number stays in sync with the actual content.
    const explicit = parseInt(el.dataset.count, 10);
    if (!isNaN(explicit)) return explicit;
    if (el.dataset.countSelector) {
      return document.querySelectorAll(el.dataset.countSelector).length;
    }
    const card = el.closest('.track-card');
    const list = card && card.querySelector('.track-projects');
    if (!list) return 0;
    return list.textContent.split('·').filter(s => s.trim().length).length;
  };

  const animate = (el, target) => {
    if (prefersReduced || target <= 0) { el.textContent = target; return; }
    const duration = 900, start = performance.now();
    const step = (now) => {
      const p = Math.min((now - start) / duration, 1);
      el.textContent = Math.round(easeOutCubic(p) * target);
      if (p < 1) requestAnimationFrame(step);
      else el.textContent = target;
    };
    requestAnimationFrame(step);
  };

  const obs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      animate(e.target, countTarget(e.target));
      obs.unobserve(e.target);
    });
  }, { threshold: 0.5 });

  nums.forEach(n => { n.textContent = '0'; obs.observe(n); });
}

/* ─── init ─────────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  setActiveNav();
  initMobileMenu();
  initReveal();
  initNavScroll();
  initCounters();
});
