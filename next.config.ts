import type { NextConfig } from "next";

const isProd = process.env.NODE_ENV === 'production';

// Strabl checkout SDK (hosts taken from the compiled SDK, v1.0.2):
//   api.*      — store config, cart creation and telemetry fetches
//   checkout.* — the hosted checkout iframe and its loading assets
//   cdn.* / strabl.io — "Powered by" branding inside the dialog
// The sandbox hosts can be dropped once production is the only environment.
const strabl = {
  api: 'https://api.strabl.com https://sandbox.api.strabl.com',
  checkout: 'https://checkout.strabl.io https://sandbox.checkout.strabl.io',
  cdn: 'https://cdn.strabl.com https://strabl.io',
  // Strabl's checkout hands the card entry / 3-D Secure step to Paymob by
  // NAVIGATING its own iframe to https://uae.paymob.com/... (routes "3ds" and
  // "perform-3ds/:redirectUuid" in the checkout app). A nested frame's
  // navigation is checked against the embedding page's frame-src, so without
  // this Chrome shows "This content is blocked. Contact the site owner".
  // Wildcard because Paymob is regional (uae., ksa., accept. …) and the exact
  // host comes from Strabl's API at runtime, not from the SDK.
  gateway: 'https://*.paymob.com',
};

// Next.js injects inline bootstrap scripts, so 'unsafe-inline' is required
// here. Tightening this to a nonce-based script-src is a follow-up. The Strabl
// SDK also injects a <style> tag and inline styles, so 'unsafe-inline' on
// style-src is required for it too.
const csp = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${isProd ? '' : " 'unsafe-eval'"}`,
  "style-src 'self' 'unsafe-inline'",
  // i.ytimg.com serves the YouTube poster frame.
  `img-src 'self' data: blob: https://i.ytimg.com ${strabl.checkout} ${strabl.cdn}`,
  "font-src 'self' data:",
  `connect-src 'self' ${strabl.api}`,
  // Required for the hero background video and the Strabl checkout dialog.
  // Without an explicit frame-src an iframe falls back to default-src 'self'
  // and is silently blocked.
  `frame-src https://www.youtube-nocookie.com https://www.youtube.com ${strabl.checkout} ${strabl.gateway}`,
  "frame-ancestors 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "object-src 'none'",
].join('; ');

// NOTE: Permissions-Policy below deliberately does NOT include `payment=()`.
// The Strabl iframe requests allow="publickey-credentials-get; payment";
// denying it would break Apple Pay and passkeys inside the checkout.

const securityHeaders = [
  { key: 'Content-Security-Policy', value: csp },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'X-Frame-Options', value: 'DENY' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=(), interest-cohort=()' },
  ...(isProd
    ? [{ key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' }]
    : []),
];

const nextConfig: NextConfig = {
  poweredByHeader: false,
  // Minimal self-contained server bundle for the Docker image (see Dockerfile).
  // Vercel ignores this setting and uses its own packaging, so it's harmless there.
  output: 'standalone',
  images: {
    // Serve modern formats automatically for every next/image on the site;
    // the browser picks whichever it supports (AVIF first, then WebP).
    formats: ['image/avif', 'image/webp'],
  },
  async headers() {
    return [{ source: '/:path*', headers: securityHeaders }];
  },
};

export default nextConfig;
