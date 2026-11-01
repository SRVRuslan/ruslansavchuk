import { isHalloween, nextLocalMidnight } from './seasonal-date.js';

let midnightTimer;

function updateSeason() {
  clearTimeout(midnightTimer);
  const now = new Date();
  document.documentElement.toggleAttribute('data-halloween', isHalloween(now));
  if (document.hidden) return;
  // Recheck at local midnight, including on pages left open across the date change.
  midnightTimer = setTimeout(updateSeason, nextLocalMidnight(now).getTime() - now.getTime() + 50);
}

updateSeason();
document.addEventListener('visibilitychange', updateSeason);
window.addEventListener('pageshow', updateSeason);
window.addEventListener('focus', updateSeason);
window.addEventListener('pagehide', () => clearTimeout(midnightTimer));
