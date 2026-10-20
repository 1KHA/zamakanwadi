'use client';

import type { ICart } from '@strabl-engineering/checkout-sdk';

/**
 * Strabl checkout — browser side. See mdfiles/STRABL_CHECKOUT.md.
 *
 * initialize() reads localStorage and injects a <style> tag, so it can only
 * run in the browser. The SDK (~23 KB) is loaded lazily on the first payment
 * click so it stays off every other page.
 */

type StrablSdk = typeof import('@strabl-engineering/checkout-sdk').default;

export interface StrablClientConfig {
  platformUuid: string;
  environment: 'sandbox' | 'production';
}

let sdkPromise: Promise<StrablSdk> | null = null;
let initialisedFor: string | null = null;

/**
 * The SDK caches the platform config in localStorage for 10 minutes and does
 * NOT key it by UUID or environment (Finding 7). Clear it when switching, or a
 * sandbox test would silently keep using production config (or vice versa).
 */
function clearStaleSdkCache() {
  try {
    window.localStorage.removeItem('strablPlatformConfig');
    window.localStorage.removeItem('strablConfigTimeOut');
  } catch {
    // storage disabled — nothing to clear
  }
}

function loadStrabl(config: StrablClientConfig): Promise<StrablSdk> {
  if (!config.platformUuid) {
    return Promise.reject(new Error('Strabl is not configured (missing platform UUID)'));
  }

  const key = `${config.environment}:${config.platformUuid}`;
  if (sdkPromise && initialisedFor === key) return sdkPromise;

  if (initialisedFor && initialisedFor !== key) clearStaleSdkCache();
  initialisedFor = key;

  sdkPromise = import('@strabl-engineering/checkout-sdk')
    .then(async ({ default: Strabl }) => {
      await Strabl.initialize({
        // The README says `platformUUID`; the SDK actually reads `platformUuid`.
        platformUuid: config.platformUuid,
        environment: config.environment,
        storeName: 'Zamakan',
        storeUrl: window.location.origin,
        storeLogo: `${window.location.origin}/images/logo/logo.png`,
        // No buttonSelector: it overwrites React-managed DOM with English-only
        // markup (Finding 8). We keep our own bilingual button.
      });
      return Strabl;
    })
    .catch((err) => {
      sdkPromise = null; // allow a retry after a network failure
      initialisedFor = null;
      throw err;
    });

  return sdkPromise;
}

/**
 * Opens the hosted checkout. Resolves once the dialog is OPEN, not when payment
 * finishes. Success and failure are handled by cart.merchantUrls, which gives
 * one server-verified landing page for both modes — so no onSuccess/onFailure
 * here. (If you add them, note the SDK never removes its message listener, so
 * callbacks from earlier attempts fire too — Finding 6.)
 */
export async function payWithStrabl(
  cart: ICart,
  config: StrablClientConfig,
  mode: 'dialog' | 'redirect' = 'dialog'
): Promise<void> {
  const Strabl = await loadStrabl(config);
  // isExpressCheckout is always false: bookings are date/space-bound, so adding
  // items inside Strabl would bypass availability checks and server pricing.
  if (mode === 'redirect') {
    return Strabl.checkoutWithRedirect({ cart, isExpressCheckout: false });
  }
  return Strabl.checkoutWithDialog({ cart, isExpressCheckout: false });
}
