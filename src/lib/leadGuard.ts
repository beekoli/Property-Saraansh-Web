/**
 * Spam / junk-lead defences for the public lead endpoint.
 *
 * Two classes of rejection:
 *  - "drop"   : almost certainly a bot. Caller should return a success-shaped
 *               200 without forwarding anywhere, so the bot sees no signal and
 *               does not adapt.
 *  - "reject" : a real human got something wrong. Caller should return 400 with
 *               a readable message so they can correct it.
 */

export type GuardVerdict =
  | { ok: true }
  | { ok: false; action: 'drop'; reason: string }
  | { ok: false; action: 'reject'; reason: string; field: string };

import {
  HONEYPOT_FIELD,
  RENDERED_AT_FIELD,
  MIN_FILL_MS,
  MAX_FILL_MS,
} from './leadFormFields';

export { HONEYPOT_FIELD, RENDERED_AT_FIELD, MIN_FILL_MS, MAX_FILL_MS };

const ALLOWED_HOSTS = [
  'propertysaraansh.com',
  'www.propertysaraansh.com',
  'localhost:3000',
];

/** Strip formatting and the +91 / 91 / 0 prefixes Indian numbers arrive with. */
export function normalisePhone(raw: string): string {
  const digits = String(raw || '').replace(/\D/g, '');
  if (digits.length === 12 && digits.startsWith('91')) return digits.slice(2);
  if (digits.length === 11 && digits.startsWith('0')) return digits.slice(1);
  return digits;
}

const ASCENDING = '0123456789';
const DESCENDING = '9876543210';

export function isLikelyRealPhone(raw: string): boolean {
  const n = normalisePhone(raw);
  // Indian mobile numbers are 10 digits and begin 6, 7, 8 or 9.
  if (!/^[6-9]\d{9}$/.test(n)) return false;
  // 9999999999, 8888888888 and friends.
  if (/^(\d)\1{9}$/.test(n)) return false;
  // Runs like 9876543210 or 6789012345.
  if (ASCENDING.includes(n) || DESCENDING.includes(n)) return false;
  // Only two distinct digits across ten positions is not a real number.
  if (new Set(n).size <= 2) return false;
  return true;
}

/** Strict: an actual link. Used on free-text a real buyer might write, so that
 *  "I saw your site propertysaraansh.com" is not mistaken for spam. */
const LINK_RE = /(https?:\/\/|www\.)/i;
/** Looser: a name field has no business containing a domain at all. */
const NAME_URL_RE = /(https?:\/\/|www\.|\.(com|net|ru|xyz|top|click|shop|online)\b)/i;
const MARKUP_RE = /(<\s*a\b|\[url|\[link|<\s*script|\{\{|\$\{)/i;
const NON_LATIN_RE = /[Ѐ-ӿ一-鿿؀-ۿ]/;
const SPAM_WORDS =
  /\b(seo services?|backlinks?|crypto|bitcoin|casino|viagra|cialis|porn|escort|loan offer|work from home|guest post|rank your site|web design services?|digital marketing services?)\b/i;

export function isValidName(name: string): boolean {
  const n = String(name || '').trim();
  if (n.length < 2 || n.length > 60) return false;
  // Needs real letters, not just digits and punctuation.
  if ((n.match(/[A-Za-zऀ-ॿ]/g) || []).length < 2) return false;
  if (NAME_URL_RE.test(n) || MARKUP_RE.test(n)) return false;
  // "asdfgh" style mashing: a long run with no vowel at all.
  if (n.length >= 6 && /^[A-Za-z]+$/.test(n) && !/[aeiouAEIOU]/.test(n)) return false;
  return true;
}

export function looksLikeSpamText(value: string | undefined): boolean {
  const v = String(value || '');
  if (!v) return false;
  return LINK_RE.test(v) || MARKUP_RE.test(v) || SPAM_WORDS.test(v) || NON_LATIN_RE.test(v);
}

/** Posted from a browser on our own site, rather than curl or a script. */
export function hasTrustedOrigin(headers: Headers): boolean {
  const raw = headers.get('origin') || headers.get('referer');
  if (!raw) return false;
  try {
    const { host } = new URL(raw);
    // Preview deployments live on *.vercel.app; without this, testing a form on
    // a preview URL would silently discard the submission.
    return ALLOWED_HOSTS.includes(host) || host.endsWith('.vercel.app');
  } catch {
    return false;
  }
}

type LeadInput = {
  name?: string;
  phone?: string;
  email?: string;
  message?: string;
  project?: string;
  [key: string]: unknown;
};

export function screenLead(body: LeadInput, headers: Headers): GuardVerdict {
  if (body[HONEYPOT_FIELD]) {
    return { ok: false, action: 'drop', reason: 'honeypot filled' };
  }

  if (!hasTrustedOrigin(headers)) {
    return { ok: false, action: 'drop', reason: 'missing or foreign origin' };
  }

  const renderedAt = Number(body[RENDERED_AT_FIELD]);
  if (Number.isFinite(renderedAt) && renderedAt > 0) {
    const elapsed = Date.now() - renderedAt;
    if (elapsed < MIN_FILL_MS) {
      return { ok: false, action: 'drop', reason: `submitted in ${elapsed}ms` };
    }
    if (elapsed > MAX_FILL_MS) {
      return { ok: false, action: 'drop', reason: 'stale form timestamp' };
    }
  } else {
    // Our own forms always send it; anything else is posting the API directly.
    return { ok: false, action: 'drop', reason: 'no form timestamp' };
  }

  if (looksLikeSpamText(body.message) || looksLikeSpamText(body.name)) {
    return { ok: false, action: 'drop', reason: 'spam content' };
  }

  // A domain or markup in the name field is never a typo — drop it silently
  // rather than handing a bot a 400 that tells it which field to vary.
  if (NAME_URL_RE.test(String(body.name || '')) || MARKUP_RE.test(String(body.name || ''))) {
    return { ok: false, action: 'drop', reason: 'domain in name field' };
  }

  if (!isValidName(body.name || '')) {
    return { ok: false, action: 'reject', field: 'name', reason: 'Please enter your full name.' };
  }

  if (!isLikelyRealPhone(body.phone || '')) {
    return {
      ok: false,
      action: 'reject',
      field: 'phone',
      reason: 'Please enter a valid 10-digit Indian mobile number.',
    };
  }

  const email = String(body.email || '').trim();
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
    return { ok: false, action: 'reject', field: 'email', reason: 'Please enter a valid email address.' };
  }

  return { ok: true };
}

/** Best-effort burst control. Serverless instances are short-lived, so this
 *  catches rapid-fire floods hitting one instance, not a distributed attack —
 *  a Vercel Firewall rate-limit rule is the durable layer. */
const hits = new Map<string, number[]>();
const WINDOW_MS = 10 * 60 * 1000;
const MAX_PER_WINDOW = 5;

export function isRateLimited(ip: string): boolean {
  if (!ip) return false;
  const now = Date.now();
  const recent = (hits.get(ip) || []).filter((t) => now - t < WINDOW_MS);
  recent.push(now);
  hits.set(ip, recent);
  if (hits.size > 5000) hits.clear();
  return recent.length > MAX_PER_WINDOW;
}

/** Never interpolate raw form input into notification HTML. */
export function escapeHtml(value: unknown): string {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}
