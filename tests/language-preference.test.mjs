import test from 'node:test';
import assert from 'node:assert/strict';
import { detectBrowserLanguage, resolveInitialLanguage } from '../src/scripts/language-preference.js';

const supportedLanguages = ['uk', 'en', 'fr', 'es', 'de', 'pt', 'it', 'pl'];
const resolve = values => resolveInitialLanguage({ queryLanguage: null, savedPreference: null, browserLanguage: 'uk', supportedLanguages, ...values });

test('device language variants select the matching translation', () => {
  for (const [locale, language] of [['uk-CA', 'uk'], ['uk-UA', 'uk'], ['en-CA', 'en'], ['fr-CA', 'fr'], ['es-MX', 'es'], ['de-DE', 'de'], ['de-AT', 'de'], ['de-CH', 'de'], ['pt-PT', 'pt'], ['pt-BR', 'pt'], ['pt-AO', 'pt'], ['it-IT', 'it'], ['it-CH', 'it'], ['it-SM', 'it'], ['pl', 'pl'], ['pl-PL', 'pl'], ['pl-US', 'pl']]) {
    assert.equal(detectBrowserLanguage(locale, [locale], supportedLanguages), language);
  }
});

test('the primary browser language wins over a different secondary preference', () => {
  assert.equal(detectBrowserLanguage('uk-CA', ['es-ES', 'uk-CA'], supportedLanguages), 'uk');
  assert.equal(detectBrowserLanguage('it-CH', ['fr-CH', 'it-CH'], supportedLanguages), 'it');
  assert.equal(detectBrowserLanguage('pl-PL', ['uk-UA', 'pl-PL'], supportedLanguages), 'pl');
  assert.equal(detectBrowserLanguage('nl-NL', ['nl-NL', 'fr-CA'], supportedLanguages), 'fr');
});

test('unsupported or missing browser languages fall back to English', () => {
  for (const languages of [['nl-NL', 'sv-SE'], [], undefined]) {
    assert.equal(detectBrowserLanguage('nl-NL', languages, supportedLanguages), 'en');
  }
});

test('shared language links do not become a preference for later Ukrainian visits', () => {
  for (const language of ['fr', 'es', 'de', 'pt', 'it', 'pl']) {
    assert.equal(resolve({ queryLanguage: language }), language);
    assert.equal(resolve({}), 'uk');
    // Old string preferences may have come from a shared link rather than the menu.
    assert.equal(resolve({ savedPreference: language }), 'uk');
    assert.equal(resolve({ savedPreference: JSON.stringify(language) }), 'uk');
  }
});

test('saved menu selections never override the device language on a new visit', () => {
  for (const browserLanguage of supportedLanguages) {
    for (const language of supportedLanguages) {
      const savedPreference = JSON.stringify({ language, browserLanguage });
      assert.equal(resolve({ savedPreference, browserLanguage }), browserLanguage);
    }
  }
});

test('an explicit language link overrides the device only for its current visit', () => {
  for (const queryLanguage of supportedLanguages) {
    assert.equal(resolve({ queryLanguage, savedPreference: '{"language":"es","browserLanguage":"uk"}' }), queryLanguage);
    assert.equal(resolve({}), 'uk');
  }
});

test('invalid links and malformed saved preferences cannot break language detection', () => {
  for (const savedPreference of ['{bad', 'null', '[]', '{}', '{"language":"nl","browserLanguage":"uk"}']) {
    assert.equal(resolve({ savedPreference, queryLanguage: 'invalid' }), 'uk');
  }
});
