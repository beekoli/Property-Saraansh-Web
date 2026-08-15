/**
 * launchDate — tolerant parsing for the WordPress `launch_date` ACF field.
 *
 * That field is a free-text input, not a date picker, so editors have written
 * it every way a person reasonably would. Real values on production today:
 *
 *   "11 September 2025"   day + month + year
 *   "October 2024"        month + year          (the most common shape)
 *   "2025"                year only
 *   " June 2024 "         stray whitespace
 *   "RERA registered July 2026, allotment expected around 10 August 2026"
 *
 * We parse what we can and refuse to guess at the rest. Two separate outputs
 * matter here and they are deliberately NOT the same thing:
 *
 *   `time`  — a sortable timestamp, extracted from anywhere in the string.
 *   `label` — text we are willing to print on a card, set ONLY when the whole
 *             value is a clean date. A prose value like the ACE Arte one above
 *             still sorts, but we do not render "Launched Aug 2026" from it,
 *             because that date is an expected allotment, not a launch. Showing
 *             it would state something the data does not actually say.
 *
 * Anything unparseable returns null and the caller sinks it to the bottom of
 * the list rather than inventing an order for it.
 */

/**
 * The raw `launch_date` off a WordPress property, or undefined.
 *
 * Kept here rather than in `getCardData` so that every rule about this one
 * unreliable field — reading it, parsing it, deciding whether it is safe to
 * print — lives in a single file. If the ACF field is ever converted to a real
 * date picker, this module is the only thing that needs revisiting.
 */
/* eslint-disable-next-line @typescript-eslint/no-explicit-any */
export function rawLaunchDate(prop: { acf?: any }): string | undefined {
  const value = prop?.acf?.launch_date;
  return typeof value === 'string' ? value : undefined;
}

const MONTHS: Record<string, number> = {
  january: 0, february: 1, march: 2, april: 3, may: 4, june: 5,
  july: 6, august: 7, september: 8, october: 9, november: 10, december: 11,
  jan: 0, feb: 1, mar: 2, apr: 3, jun: 5, jul: 6, aug: 7, sep: 8, sept: 8, oct: 9, nov: 10, dec: 11,
};

const SHORT_MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export interface ParsedLaunchDate {
  /** Sort key. Larger is more recent. */
  time: number;
  /** "Oct 2025" — only set when the raw value was a clean date on its own. */
  label: string | null;
}

/** Precision we managed to recover, used to decide how much to print. */
type Grain = 'day' | 'month' | 'year';

function build(year: number, month: number, day: number, grain: Grain, clean: boolean): ParsedLaunchDate {
  const time = Date.UTC(year, month, day);
  // A bare year is too vague to print as a launch month, so it sorts (as
  // 1 January) but shows only the year.
  const label = !clean ? null : grain === 'year' ? String(year) : `${SHORT_MONTHS[month]} ${year}`;
  return { time, label };
}

export function parseLaunchDate(raw?: string | null): ParsedLaunchDate | null {
  if (!raw) return null;
  const trimmed = String(raw).trim();
  if (!trimmed) return null;
  const s = trimmed.toLowerCase();

  // ISO first — the shape the ACF field would produce if it is ever switched
  // to a real date picker, so this keeps working after any data cleanup.
  const iso = s.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (iso) {
    return build(Number(iso[1]), Number(iso[2]) - 1, Number(iso[3]), 'day', true);
  }

  // "11 September 2025" / "4 Nov 2025" — day, month name, year.
  const dmy = s.match(/\b(\d{1,2})(?:st|nd|rd|th)?\s+([a-z]+)\s+(\d{4})\b/);
  if (dmy && dmy[2] in MONTHS) {
    const clean = dmy[0] === s;
    return build(Number(dmy[3]), MONTHS[dmy[2]], Number(dmy[1]), 'day', clean);
  }

  // "September 11, 2025" — month name, day, year.
  const mdy = s.match(/\b([a-z]+)\s+(\d{1,2})(?:st|nd|rd|th)?,?\s+(\d{4})\b/);
  if (mdy && mdy[1] in MONTHS) {
    const clean = mdy[0] === s;
    return build(Number(mdy[3]), MONTHS[mdy[1]], Number(mdy[2]), 'day', clean);
  }

  // "October 2024" — month name and year. The common case.
  const my = s.match(/\b([a-z]+)\s+(\d{4})\b/);
  if (my && my[1] in MONTHS) {
    const clean = my[0] === s;
    return build(Number(my[2]), MONTHS[my[1]], 1, 'month', clean);
  }

  // "2025" — year alone.
  const y = s.match(/\b(19|20)\d{2}\b/);
  if (y) {
    const clean = y[0] === s;
    return build(Number(y[0]), 0, 1, 'year', clean);
  }

  return null;
}

/** "Launched Oct 2025", or null when we have nothing printable. */
export function launchLabel(raw?: string | null): string | null {
  const parsed = parseLaunchDate(raw);
  return parsed?.label ? `Launched ${parsed.label}` : null;
}

/**
 * Order a list newest-launch-first.
 *
 * Projects with a readable launch date lead, most recent first. Everything
 * else keeps its existing relative order behind them — we do NOT fall back to
 * the WordPress publish date, because every property was entered during the
 * mid-2026 bulk import and that date records when it was typed in, not when
 * the project launched. Sorting on it would look authoritative and mean
 * nothing.
 */
export function sortByLaunchDate<T>(items: T[], getRaw: (item: T) => string | undefined): T[] {
  return items
    .map((item, index) => ({ item, index, parsed: parseLaunchDate(getRaw(item)) }))
    .sort((a, b) => {
      if (a.parsed && b.parsed) {
        if (b.parsed.time !== a.parsed.time) return b.parsed.time - a.parsed.time;
        return a.index - b.index; // stable within the same launch month
      }
      if (a.parsed) return -1;
      if (b.parsed) return 1;
      return a.index - b.index; // undated: leave them exactly as they were
    })
    .map((entry) => entry.item);
}
