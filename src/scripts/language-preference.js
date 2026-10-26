// Legacy preferences did not distinguish menu selections from shared language links.
export const LANGUAGE_PREFERENCE_KEY = 'devfolio-language-preference-v2';

export function detectBrowserLanguage(primaryLanguage, languages, supportedLanguages, fallback = 'en') {
  const preferences = [primaryLanguage, ...(Array.isArray(languages) ? languages : [])];
  return preferences
    .map(value => typeof value === 'string' ? value.trim().toLowerCase().split(/[-_]/)[0] : '')
    .find(value => supportedLanguages.includes(value)) || fallback;
}

export function resolveInitialLanguage({ queryLanguage, savedPreference, browserLanguage, supportedLanguages }) {
  // A shared language link affects this visit, without creating a saved preference.
  if (supportedLanguages.includes(queryLanguage)) return queryLanguage;
  try {
    const saved = JSON.parse(savedPreference || 'null');
    if (saved?.browserLanguage === browserLanguage && supportedLanguages.includes(saved.language)) {
      return saved.language;
    }
  } catch { /* Ignore malformed or obsolete preferences. */ }
  return browserLanguage;
}
