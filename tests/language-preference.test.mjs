import test from 'node:test';
import assert from 'node:assert/strict';
import { LANGUAGE_PREFERENCE_KEY, detectBrowserLanguage, resolveInitialLanguage } from '../src/scripts/language-preference.js';

const supportedLanguages = ['uk', 'en', 'fr', 'es', 'de', 'pt'];
const resolve = values => resolveInitialLanguage({ queryLanguage: null, savedPreference: null, browserLanguage: 'uk', supportedLanguages, ...values });

test('device language variants select the matching translation', () => {
  for (const [locale, language] of [['uk-CA', 'uk'], ['uk-UA', 'uk'], ['en-CA', 'en'], ['fr-CA', 'fr'], ['es-MX', 'es'], ['de-DE', 'de'], ['de-AT', 'de'], ['de-CH', 'de'], ['pt-PT', 'pt'], ['pt-BR', 'pt'], ['pt-AO', 'pt']]) {
    assert.equal(detectBrowserLanguage(locale, [locale], supportedLanguages), language);
  }
});

test('the primary browser language wins over a different secondary preference', () => {
  assert.equal(detectBrowserLanguage('uk-CA', ['es-ES', 'uk-CA'], supportedLanguages), 'uk');
  assert.equal(detectBrowserLanguage('it-IT', ['it-IT', 'fr-CA'], supportedLanguages), 'fr');
});

test('unsupported or missing browser languages fall back to English', () => {
  for (const languages of [['it-IT', 'pl-PL'], [], undefined]) {
    assert.equal(detectBrowserLanguage('it-IT', languages, supportedLanguages), 'en');
  }
});

test('shared language links do not become a preference for later Ukrainian visits', () => {
  for (const language of ['es', 'de', 'pt']) {
    assert.equal(resolve({ queryLanguage: language }), language);
    assert.equal(resolve({}), 'uk');
    // Old string preferences may have come from a shared link rather than the menu.
    assert.equal(resolve({ savedPreference: language }), 'uk');
    assert.equal(resolve({ savedPreference: JSON.stringify(language) }), 'uk');
  }
  assert.notEqual(LANGUAGE_PREFERENCE_KEY, 'devfolio-language');
});

test('an explicit menu selection is remembered only for the same detected browser language', () => {
  const savedPreference = JSON.stringify({ language: 'es', browserLanguage: 'uk' });
  assert.equal(resolve({ savedPreference }), 'es');
  assert.equal(resolve({ savedPreference, browserLanguage: 'en' }), 'en');
  assert.equal(resolve({ savedPreference, queryLanguage: 'fr' }), 'fr');
});

test('invalid links and malformed saved preferences cannot break language detection', () => {
  for (const savedPreference of ['{bad', 'null', '[]', '{}', '{"language":"it","browserLanguage":"uk"}']) {
    assert.equal(resolve({ savedPreference, queryLanguage: 'invalid' }), 'uk');
  }
});
