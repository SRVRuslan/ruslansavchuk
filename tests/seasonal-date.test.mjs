import test from 'node:test';
import assert from 'node:assert/strict';
import { isHalloween, nextLocalMidnight } from '../src/scripts/seasonal-date.js';

test('Halloween is active for the whole of October 31 every year, including leap years', () => {
  for (const year of [2026, 2027, 2028, 2030, 2040]) {
    assert.equal(isHalloween(new Date(year, 9, 30, 23, 59, 59, 999)), false);
    assert.equal(isHalloween(new Date(year, 9, 31)), true);
    assert.equal(isHalloween(new Date(year, 9, 31, 23, 59, 59, 999)), true);
    assert.equal(isHalloween(new Date(year, 10, 1)), false);
    assert.equal(isHalloween(new Date(year, 11, 31)), false);
    assert.equal(isHalloween(new Date(year, 0, 31)), false);
  }
});

test('the next update uses local midnight across October and year boundaries', () => {
  for (const [now, next] of [
    [new Date(2026, 9, 30, 23, 59), new Date(2026, 9, 31)],
    [new Date(2026, 9, 31, 23, 59), new Date(2026, 10, 1)],
    [new Date(2026, 11, 31, 12), new Date(2027, 0, 1)],
  ]) {
    assert.equal(nextLocalMidnight(now).getTime(), next.getTime());
  }
});
