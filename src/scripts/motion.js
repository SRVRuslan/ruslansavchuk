// Imported after app.js so dynamically created project cards animate as before.
(() => {
  'use strict';

  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  const finePointer = matchMedia('(hover: hover) and (pointer: fine)');
  const running = new Set();
  const revealed = new WeakSet();
  const header = document.querySelector('.header');
  const hero = document.querySelector('.hero-art');

  // Content stays visible if animation or observation is unavailable.
  function appear(element, delay = 0) {
    if (reducedMotion.matches || !element.animate) return;
    const animation = element.animate([
      { opacity: 0, translate: '0 20px' },
      { opacity: 1, translate: '0 0' },
    ], {
      duration: 650,
      delay,
      easing: 'cubic-bezier(0.22, 1, 0.36, 1)',
      fill: 'backwards',
    });
    running.add(animation);
    const cleanup = () => running.delete(animation);
    animation.addEventListener('finish', cleanup, { once: true });
    animation.addEventListener('cancel', cleanup, { once: true });
  }

  const targets = document.querySelectorAll(
    '.section-top, .section-heading-row, ' +
    '.project-card, .services-heading, .service-card, .about-visual, ' +
    '.about-copy, .process-section > h2, .process-grid > article, ' +
    '.faq-section > div, .contact-copy, .contact-form'
  );

  const delays = new WeakMap();
  document.querySelectorAll('.projects-grid, .services-grid, .process-grid').forEach(group => {
    [...group.children].forEach((child, index) => delays.set(child, Math.min(index * 65, 260)));
  });

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting || entry.target.hidden) return;
        if (!revealed.has(entry.target)) {
          revealed.add(entry.target);
          appear(entry.target, delays.get(entry.target) || 0);
        }
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.08 });
    targets.forEach(element => observer.observe(element));
  }

  document.addEventListener('click', event => {
    if (event.target.closest('[data-filter]')) {
      document.querySelectorAll('.project-card:not([hidden])').forEach((card, index) => {
        revealed.add(card);
        appear(card, index * 65);
      });
    }
    if (event.target.closest('[data-project]')) {
      const dialog = document.getElementById('project-dialog');
      if (dialog.open) appear(dialog);
    }
  });

  let scrollFrame = 0;
  function updateScroll() {
    scrollFrame = 0;
    const distance = document.documentElement.scrollHeight - innerHeight;
    header.style.setProperty('--page-progress', distance > 0 ? Math.min(1, Math.max(0, scrollY / distance)) : 0);
    header.classList.toggle('is-scrolled', scrollY > 16);
  }
  function queueScroll() {
    if (!scrollFrame) scrollFrame = requestAnimationFrame(updateScroll);
  }
  addEventListener('scroll', queueScroll, { passive: true });
  addEventListener('resize', queueScroll, { passive: true });
  if ('ResizeObserver' in window) new ResizeObserver(queueScroll).observe(document.body);
  else queueScroll();

  let pointerFrame = 0;
  let x = 0;
  let y = 0;
  function resetArt() {
    cancelAnimationFrame(pointerFrame);
    pointerFrame = 0;
    hero.style.setProperty('--art-x', '0px');
    hero.style.setProperty('--art-y', '0px');
  }
  hero.addEventListener('pointermove', event => {
    if (reducedMotion.matches || !finePointer.matches || event.pointerType === 'touch') return;
    const rect = hero.getBoundingClientRect();
    x = ((event.clientX - rect.left) / rect.width - 0.5) * 16;
    y = ((event.clientY - rect.top) / rect.height - 0.5) * 12;
    if (!pointerFrame) pointerFrame = requestAnimationFrame(() => {
      pointerFrame = 0;
      hero.style.setProperty('--art-x', `${x}px`);
      hero.style.setProperty('--art-y', `${y}px`);
    });
  }, { passive: true });
  hero.addEventListener('pointerleave', resetArt);
  hero.addEventListener('pointercancel', resetArt);
  finePointer.addEventListener('change', resetArt);
  reducedMotion.addEventListener('change', () => {
    resetArt();
    if (reducedMotion.matches) running.forEach(animation => animation.cancel());
  });
})();
