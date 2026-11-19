import { isHalloween, isChristmas, nextLocalMidnight } from './seasonal-date.js';

let midnightTimer;

function updateSeason() {
  clearTimeout(midnightTimer);
  const now = new Date();
  // This preview is removed from production builds; calendar rules stay authoritative.
  const christmasPreview = import.meta.env.DEV && new URLSearchParams(location.search).get('preview') === 'christmas';
  document.documentElement.toggleAttribute('data-halloween', !christmasPreview && isHalloween(now));
  document.documentElement.toggleAttribute('data-christmas', christmasPreview || isChristmas(now));
  if (document.hidden) return;
  // Recheck at local midnight, including on pages left open across the date change.
  midnightTimer = setTimeout(updateSeason, nextLocalMidnight(now).getTime() - now.getTime() + 50);
}

updateSeason();
document.addEventListener('visibilitychange', updateSeason);
window.addEventListener('pageshow', updateSeason);
window.addEventListener('focus', updateSeason);
window.addEventListener('pagehide', () => clearTimeout(midnightTimer));
