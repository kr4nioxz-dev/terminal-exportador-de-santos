/* Interações: header scroll, menu mobile acessível, reveal on scroll,
 * back-to-top, formulário demo, ano atual, tilt sutil em cards,
 * fechamento do menu com Esc/clique fora, foco preso no menu mobile.
 */
(() => {
  'use strict';

  const $  = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

  const header     = $('[data-header]');
  const menuToggle = $('[data-menu-toggle]');
  const mobileMenu = $('[data-mobile-menu]');
  const backToTop  = $('[data-back-to-top]');

  /* ---------- Menu Mobile ---------- */
  const setMenu = (open) => {
    if (!menuToggle || !mobileMenu) return;
    menuToggle.setAttribute('aria-expanded', String(open));
    mobileMenu.hidden = !open;
    document.body.classList.toggle('menu-open', open);
    if (open) {
      const firstLink = mobileMenu.querySelector('a');
      firstLink?.focus({ preventScroll: true });
    }
  };
  const closeMenu = () => setMenu(false);

  menuToggle?.addEventListener('click', () => {
    setMenu(menuToggle.getAttribute('aria-expanded') !== 'true');
  });

  mobileMenu && $$('a', mobileMenu).forEach((a) => a.addEventListener('click', closeMenu));

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeMenu();
  });

  document.addEventListener('click', (e) => {
    if (!mobileMenu || mobileMenu.hidden) return;
    if (mobileMenu.contains(e.target) || menuToggle?.contains(e.target)) return;
    closeMenu();
  });

  /* ---------- Header scroll + back-to-top ---------- */
  let ticking = false;
  const onScroll = () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      const y = window.scrollY;
      header?.classList.toggle('is-scrolled', y > 18);
      backToTop?.classList.toggle('is-visible', y > 700);
      ticking = false;
    });
  };
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  /* ---------- Reveal on scroll ---------- */
  const revealEls = $$('[data-reveal]');
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-revealed');
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    revealEls.forEach((el) => io.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add('is-revealed'));
  }

  /* ---------- Tilt sutil em .value-card e .link-card (desktop only) ---------- */
  const canHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  if (canHover) {
    $$('.value-card, .link-card, .sig-card').forEach((card) => {
      card.addEventListener('mousemove', (e) => {
        const r = card.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width - 0.5;
        const y = (e.clientY - r.top) / r.height - 0.5;
        card.style.setProperty('--tiltX', `${(-y * 4).toFixed(2)}deg`);
        card.style.setProperty('--tiltY', `${(x * 4).toFixed(2)}deg`);
      });
      card.addEventListener('mouseleave', () => {
        card.style.setProperty('--tiltX', '0deg');
        card.style.setProperty('--tiltY', '0deg');
      });
    });
  }

  /* ---------- Formulário de contato (demo local) ---------------------- */
  const form = $('[data-contact-form]');
  const formStatus = $('[data-form-status]');
  form?.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = new FormData(form).get('nome');
    if (formStatus) {
      formStatus.textContent = `Obrigado${name ? `, ${name}` : ''}. Sua mensagem foi recebida nesta demonstração.`;
    }
    form.reset();
  });

  /* ---------- Ano atual ----------------------------------------------- */
  const year = $('[data-current-year]');
  if (year) year.textContent = String(new Date().getFullYear());

  /* ---------- Smooth scroll com offset para âncoras internas ---------- */
  document.addEventListener('click', (e) => {
    const link = e.target.closest?.('a[href^="#"]');
    if (!link) return;
    const id = link.getAttribute('href');
    if (!id || id === '#') return;
    const target = document.querySelector(id);
    if (!target) return;
    e.preventDefault();
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    if (history.pushState) history.pushState(null, '', id);
  });
})();
