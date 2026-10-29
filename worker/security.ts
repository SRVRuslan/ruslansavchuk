// Apply these to every response, including API errors and redirects.
export function secureResponse(response: Response, request: Request): Response {
  const headers = new Headers(response.headers);
  headers.set('X-Content-Type-Options', 'nosniff');
  headers.set('X-Frame-Options', 'DENY');
  headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  headers.set('Permissions-Policy', 'accelerometer=(), autoplay=(), camera=(), display-capture=(), geolocation=(), gyroscope=(), microphone=(), payment=(), usb=(), browsing-topics=()');
  headers.set('Cross-Origin-Opener-Policy', 'same-origin');
  headers.set('Cross-Origin-Resource-Policy', 'same-origin');
  headers.set('X-Permitted-Cross-Domain-Policies', 'none');
  if (new URL(request.url).protocol === 'https:') {
    // Do not opt unrelated subdomains into HSTS or preload the domain.
    headers.set('Strict-Transport-Security', 'max-age=31536000');
  }
  // Static HTML receives its build-generated, hash-based policy from ASSETS.
  // API/error responses have no active content and need no resource access.
  if (!headers.has('Content-Security-Policy')) {
    headers.set('Content-Security-Policy', "default-src 'none'; base-uri 'none'; object-src 'none'; frame-ancestors 'none'; form-action 'none'");
  }
  return new Response(response.body, { status: response.status, statusText: response.statusText, headers });
}
