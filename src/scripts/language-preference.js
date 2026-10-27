export function detectBrowserLanguage(primaryLanguage, languages, supportedLanguages, fallback = 'en') {
  const preferences = [primaryLanguage, ...(Array.isArray(languages) ? languages : [])];
  return preferences
    .map(value => typeof value === 'string' ? value.trim().toLowerCase().split(/[-_]/)[0] : '')
    .find(value => supportedLanguages.includes(value)) || fallback;
}

export function resolveInitialLanguage({ queryLanguage, browserLanguage, supportedLanguages }) {
  // A language link affects this visit; previous visits never override the device.
  if (supportedLanguages.includes(queryLanguage)) return queryLanguage;
  return browserLanguage;
}
