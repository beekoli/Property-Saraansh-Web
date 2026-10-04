/** Shared between the browser forms and the server guard. Kept in its own
 *  module so the client bundle never pulls in the spam-detection internals. */
export const HONEYPOT_FIELD = 'company_website';
export const RENDERED_AT_FIELD = 'form_rendered_at';
/** A human cannot read a form, type a name and a phone number this fast. */
export const MIN_FILL_MS = 2500;
/** Guards against a stale tab replaying an old timestamp. */
export const MAX_FILL_MS = 1000 * 60 * 60 * 6;
