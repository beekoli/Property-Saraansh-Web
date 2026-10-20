'use client';

import { useEffect } from 'react';
import { WHATSAPP_NUMBER } from '@/lib/whatsapp';

/**
 * Mounted once in the root layout. Does two jobs for every wa.me link on the
 * site, so no page carries its own WhatsApp script:
 *
 *  1. Analytics — one `whatsapp_click` event per click, on every device.
 *  2. Mobile deep-linking — a plain wa.me link bounces through a browser page
 *     before reaching the app. On phones we hand the OS a scheme it can open
 *     directly, with wa.me as the fallback so a click never dead-ends.
 */
export default function WhatsAppDeepLink() {
  useEffect(() => {
    const ua = navigator.userAgent;
    const isAndroid = /Android/i.test(ua);
    const isIOS = /iPhone|iPad|iPod/i.test(ua);
    // Instagram's and Facebook's in-app browsers block the intent: scheme.
    const inApp = /FBAN|FBAV|FB_IAB|Instagram|Line\/|; wv\)/i.test(ua);

    function onClick(e: MouseEvent) {
      const target = e.target as HTMLElement | null;
      const a = target?.closest?.('a[href*="wa.me/"]') as HTMLAnchorElement | null;
      if (!a) return;

      let text = '';
      try {
        text = new URL(a.href).searchParams.get('text') || '';
      } catch {
        /* malformed href — fall through with an empty message */
      }

      // --- analytics: one event, through whichever tag is already on the page
      const payload = {
        project: a.dataset.waProject || 'general',
        location: a.dataset.waLocation || 'unknown',
      };
      try {
        const w = window as unknown as {
          gtag?: (...args: unknown[]) => void;
          dataLayer?: unknown[];
        };
        if (typeof w.gtag === 'function') {
          w.gtag('event', 'whatsapp_click', payload);
        } else if (Array.isArray(w.dataLayer)) {
          w.dataLayer.push({ event: 'whatsapp_click', ...payload });
        }
      } catch {
        /* never let tracking break the click */
      }

      // --- desktop keeps the plain wa.me link opening in a new tab
      if (!isAndroid && !isIOS) return;

      const query = `phone=${WHATSAPP_NUMBER}&text=${encodeURIComponent(text)}`;
      const webUrl = a.href;
      e.preventDefault();

      if (isIOS) {
        // iOS resolves wa.me to the app itself; a new tab would strand the user.
        window.location.href = webUrl;
        return;
      }

      if (isAndroid && !inApp) {
        // Lets Android offer WhatsApp vs WhatsApp Business when both exist.
        window.location.href =
          `intent://send?${query}#Intent;scheme=whatsapp;` +
          `S.browser_fallback_url=${encodeURIComponent(webUrl)};end`;
        return;
      }

      // In-app browser: try the app scheme, and if we are still here, use the web link.
      const started = Date.now();
      window.location.href = `whatsapp://send?${query}`;
      window.setTimeout(() => {
        if (!document.hidden && Date.now() - started < 3000) {
          window.location.href = webUrl;
        }
      }, 1600);
    }

    document.addEventListener('click', onClick, false);
    return () => document.removeEventListener('click', onClick, false);
  }, []);

  return null;
}
