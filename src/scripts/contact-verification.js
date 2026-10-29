// Load the challenge near the form, not while rendering the first screen.
export function createContactVerification(form, getLanguage) {
  const container = form.querySelector('[data-contact-verification]');
  let scriptPromise;
  let widget;
  let widgetLanguage;
  let pending;

  function settle(error, token) {
    if (!pending) return;
    clearTimeout(pending.timeout);
    if (error) pending.reject(error);
    else pending.resolve(token);
    pending = undefined;
  }

  function loadScript() {
    if (window.turnstile) return Promise.resolve();
    if (scriptPromise) return scriptPromise;
    scriptPromise = new Promise((resolve, reject) => {
      const script = document.createElement('script');
      const fail = () => {
        clearTimeout(timeout);
        script.remove();
        scriptPromise = undefined;
        reject(new Error('Verification unavailable'));
      };
      const timeout = setTimeout(fail, 15000);
      script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';
      script.async = true;
      script.addEventListener('load', () => {
        clearTimeout(timeout);
        if (window.turnstile) resolve();
        else fail();
      }, { once: true });
      script.addEventListener('error', fail, { once: true });
      document.head.append(script);
    });
    return scriptPromise;
  }

  async function prepare() {
    await loadScript();
    const language = getLanguage();
    if (widget !== undefined && widgetLanguage === language) return;
    if (widget !== undefined) window.turnstile.remove(widget);
    widgetLanguage = language;
    widget = window.turnstile.render(container, {
      sitekey: container.dataset.sitekey,
      action: 'contact',
      language,
      theme: 'dark',
      size: 'compact',
      appearance: 'interaction-only',
      'response-field': false,
      callback: token => settle(null, token),
      'error-callback': () => { settle(new Error('Verification failed')); return true; },
      'timeout-callback': () => settle(new Error('Verification timed out')),
    });
  }

  const warmup = () => { void prepare().catch(() => {}); };
  form.addEventListener('focusin', warmup, { once: true });
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => {
      if (entries.some(entry => entry.isIntersecting)) { observer.disconnect(); warmup(); }
    }, { rootMargin: '500px' });
    observer.observe(form);
  }

  return {
    async getToken() {
      await prepare();
      const token = window.turnstile.getResponse(widget);
      if (token && !window.turnstile.isExpired(widget)) return token;
      // A previous error may have stopped the widget's automatic retries.
      return new Promise((resolve, reject) => {
        pending = { resolve, reject, timeout: setTimeout(() => settle(new Error('Verification timed out')), 120000) };
        window.turnstile.reset(widget);
      });
    },
    reset() {
      settle(new Error('Verification reset'));
      if (widget !== undefined) window.turnstile.reset(widget);
    },
    updateLanguage() {
      if (widget !== undefined && !pending) warmup();
    },
  };
}
