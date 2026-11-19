// Use the visitor's local calendar, independently of the build date and year.
export function isHalloween(date = new Date()) {
  return date.getMonth() === 9 && date.getDate() === 31;
}

export function isChristmas(date = new Date()) {
  return date.getMonth() === 11 && date.getDate() >= 24 && date.getDate() <= 26;
}

export function nextLocalMidnight(date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate() + 1);
}
