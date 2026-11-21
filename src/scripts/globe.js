import surfaceDesktop from '../assets/globe/earth-surface-2048.webp?url';
import surfaceMobile from '../assets/globe/earth-surface-1024.webp?url';
import nightDesktop from '../assets/globe/earth-night-2048.webp?url';
import nightMobile from '../assets/globe/earth-night-1024.webp?url';
import bordersDesktop from '../assets/globe/earth-borders.webp?url';
import bordersMobile from '../assets/globe/earth-borders-1024.webp?url';

const canvas = document.querySelector('[data-hero-globe]');
const overlay = document.querySelector('[data-globe-network]');

if (canvas && overlay && 'transferControlToOffscreen' in canvas && 'Worker' in window && 'createImageBitmap' in window) {
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  const mobileScreen = matchMedia('(max-width: 900px), (pointer: coarse)');
  let worker;
  let size = canvas.getBoundingClientRect().width;
  let visible = false;
  let pageActive = true;
  let attempted = false;

  const currentState = () => ({
    size,
    ratio: Math.min(devicePixelRatio || 1, mobileScreen.matches ? 1.5 : 2),
    compact: mobileScreen.matches,
    active: visible && pageActive && !document.hidden && !reducedMotion.matches,
  });

  function update() {
    worker?.postMessage({ type: 'state', state: currentState() });
  }

  function fallback() {
    canvas.parentElement.removeAttribute('data-globe-ready');
    worker?.terminate();
    worker = null;
  }

  async function load() {
    if (attempted) return;
    attempted = true;
    let bitmaps = [];
    try {
      // Paint the lightweight hero image before requesting the animated layers.
      const poster = canvas.parentElement.querySelector('.globe-poster img');
      if (poster) await poster.decode().catch(() => {});
      await new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)));
      if ('requestIdleCallback' in window) {
        await new Promise(resolve => requestIdleCallback(resolve, { timeout: 1200 }));
      }
      const compact = mobileScreen.matches || navigator.connection?.saveData;
      const urls = compact ? [surfaceMobile, nightMobile, bordersMobile] : [surfaceDesktop, nightDesktop, bordersDesktop];
      // Decoding and GPU work happen asynchronously, then entirely in a worker.
      const results = await Promise.allSettled(urls.map(async url => {
        const response = await fetch(url, { priority: 'low' });
        if (!response.ok) throw new Error('Globe texture unavailable');
        const bitmap = await createImageBitmap(await response.blob());
        return bitmap;
      }));
      bitmaps = results.filter(result => result.status === 'fulfilled').map(result => result.value);
      if (results.some(result => result.status === 'rejected')) throw new Error('Globe texture unavailable');
      worker = new Worker(new URL('./globe-worker.js', import.meta.url), { type: 'module', name: 'portfolio-globe' });
      worker.onmessage = ({ data }) => {
        if (data.type === 'ready') canvas.parentElement.setAttribute('data-globe-ready', '');
        else if (data.type === 'lost') canvas.parentElement.removeAttribute('data-globe-ready');
        else if (data.type === 'fallback') fallback();
      };
      worker.onerror = fallback;
      const surface = canvas.transferControlToOffscreen();
      const network = overlay.transferControlToOffscreen();
      worker.postMessage({ type: 'init', canvas: surface, overlay: network, images: bitmaps, state: currentState() }, [surface, network, ...bitmaps]);
    } catch {
      bitmaps.forEach(bitmap => bitmap.close());
      fallback();
    }
  }

  function resize(nextSize) {
    if (nextSize) size = nextSize;
    update();
  }
  if ('ResizeObserver' in window) {
    new ResizeObserver(([entry]) => resize(entry.contentRect.width)).observe(canvas);
    addEventListener('resize', update, { passive: true });
  } else addEventListener('resize', () => resize(canvas.getBoundingClientRect().width), { passive: true });

  if ('IntersectionObserver' in window) {
    new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible) load();
      update();
    }, { rootMargin: '80px' }).observe(canvas);
  } else { visible = true; load(); }

  document.addEventListener('visibilitychange', update);
  reducedMotion.addEventListener('change', update);
  mobileScreen.addEventListener('change', update);
  window.addEventListener('pagehide', () => { pageActive = false; update(); });
  window.addEventListener('pageshow', () => { pageActive = true; update(); });
}
