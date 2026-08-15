/**
 * Date formatting for regulator-sourced fields.
 *
 * Kept in its own module, free of any Next.js-specific code, so it can be
 * unit-tested directly — importing it via property.ts drags in that file's
 * `fetch(..., { next: ... })` calls, which only typecheck inside the Next
 * build.
 */

const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

/**
 * "2031-02-15" → "15 February 2031".
 *
 * `rera_completion_date` is written from the UP RERA portal in ISO form, which
 * is unambiguous to store and unpleasant to read. Anything that is not a clean
 * ISO date is passed through untouched rather than guessed at — the field is
 * free text, so an editor can type something we have not anticipated, and a
 * regulatory date is the last thing to start reformatting speculatively.
 */
export function formatReraDate(value?: string): string {
  const raw = (value || "").trim();
  const m = raw.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!m) return raw;
  const month = Number(m[2]);
  if (month < 1 || month > 12) return raw;
  return `${Number(m[3])} ${MONTH_NAMES[month - 1]} ${m[1]}`;
}
