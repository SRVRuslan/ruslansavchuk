const ghost = document.querySelector('[data-halloween-ghost]');

if (ghost?.animate) {
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  const obstacles = 'header, nav, a, button, input, textarea, select, label, summary, code, pre, .art-sticker, .preview-window, .code-window, .contact-form, .project-card, .about-visual, .pumpkin, .hero-spark';
  let timer;
  let animation;
  let lastPosition;

  const randomBetween = (min, max) => min + Math.random() * (max - min);
  const enabled = () => document.documentElement.hasAttribute('data-halloween') && !document.hidden && !reducedMotion.matches;
  const busy = () => document.activeElement?.closest('form') || document.querySelector('dialog[open], .language-toggle[aria-expanded=true], .menu-toggle[aria-expanded=true]');

  function dismiss() {
    animation?.cancel();
    animation = undefined;
    ghost.hidden = true;
  }

  function stop() {
    clearTimeout(timer);
    timer = undefined;
    dismiss();
  }

  function schedule(min = 10000, max = 21000) {
    clearTimeout(timer);
    if (enabled()) timer = setTimeout(appear, randomBetween(min, max));
  }

  function findPosition(width, height) {
    const margin = 18;
    const headerBottom = document.querySelector('header')?.getBoundingClientRect().bottom || 0;
    const minY = Math.max(margin, headerBottom + margin);
    const maxX = innerWidth - width - margin;
    const maxY = innerHeight - height - margin;
    if (maxX < margin || maxY < minY) return;
    // Read all bounds together, only once per appearance, never on animation frames.
    const bounds = [...document.querySelectorAll(obstacles)].map(element => element.getBoundingClientRect());
    const text = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    const range = document.createRange();
    let node;
    while ((node = text.nextNode())) {
      if (!node.textContent.trim() || node.parentElement.closest('script, style, noscript, [data-halloween-ghost]')) continue;
      range.selectNodeContents(node);
      bounds.push(...range.getClientRects());
    }
    const occupied = bounds.filter(rect => rect.width > 0 && rect.height > 0 && rect.bottom > 0 && rect.top < innerHeight && rect.right > 0 && rect.left < innerWidth);
    const candidates = Array.from({ length: 70 }, () => ({ x: randomBetween(margin, maxX), y: randomBetween(minY, maxY) }));
    // Include edge/gap positions so narrow mobile layouts still have safe choices.
    for (let row = 0; row <= 6; row++) {
      for (let column = 0; column <= 6; column++) {
        candidates.push({ x: margin + (maxX - margin) * column / 6, y: minY + (maxY - minY) * row / 6 });
      }
    }
    const clear = candidates.filter(({ x, y }) =>
      (!lastPosition || Math.hypot(x - lastPosition.x, y - lastPosition.y) >= width) &&
      !occupied.some(rect => x < rect.right + margin && x + width > rect.left - margin && y < rect.bottom + margin && y + height > rect.top - margin));
    return clear[Math.floor(Math.random() * clear.length)];
  }

  function appear() {
    timer = undefined;
    if (!enabled()) { stop(); return; }
    if (busy()) { schedule(); return; }
    ghost.hidden = false;
    const { width, height } = ghost.getBoundingClientRect();
    if (!width || !height) { ghost.hidden = true; schedule(); return; }
    const position = findPosition(width, height);
    if (!position) { ghost.hidden = true; schedule(4000, 8000); return; }
    lastPosition = position;
    ghost.style.left = `${position.x}px`;
    ghost.style.top = `${position.y}px`;
    const current = ghost.animate([
      { opacity: 0, transform: 'translate3d(0, 10px, 0) rotate(-4deg)' },
      { opacity: .58, transform: 'translate3d(4px, 0, 0) rotate(-1deg)', offset: .2 },
      { opacity: .64, transform: 'translate3d(-4px, -5px, 0) rotate(3deg)', offset: .6 },
      { opacity: 0, transform: 'translate3d(-6px, -10px, 0) rotate(-2deg)' },
    ], { duration: randomBetween(5500, 7500), easing: 'ease-in-out' });
    animation = current;
    current.finished.then(() => {
      if (animation !== current) return;
      animation = undefined;
      ghost.hidden = true;
      schedule();
    }).catch(() => { /* Dismissal cancels the current appearance. */ });
  }

  function sync() {
    stop();
    if (enabled()) schedule(5000, 10000);
  }

  function dismissForInteraction() {
    if (!animation) return;
    dismiss();
    schedule(7000, 14000);
  }

  new MutationObserver(sync).observe(document.documentElement, { attributes: true, attributeFilter: ['data-halloween'] });
  document.addEventListener('visibilitychange', sync);
  document.addEventListener('focusin', dismissForInteraction);
  document.addEventListener('click', dismissForInteraction);
  window.addEventListener('scroll', dismissForInteraction, { passive: true });
  window.addEventListener('resize', dismissForInteraction, { passive: true });
  window.addEventListener('pageshow', sync);
  window.addEventListener('pagehide', stop);
  reducedMotion.addEventListener('change', sync);
  sync();
}
