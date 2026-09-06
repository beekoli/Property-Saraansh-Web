/**
 * Video chapters → Google "Key Moments" (schema.org Clip).
 *
 * The source of truth is a plain-text field you can paste straight out of a
 * YouTube description, one chapter per line:
 *
 *     0:00 Introduction & Reality Check
 *     2:19 Location Analysis — Sigma 3, Greater Noida
 *     3:57 Project Planning & Layout Review
 *
 * Separators are forgiving: "0:00 - Title", "0:00 – Title", "[0:00] Title" and
 * "0:00: Title" all parse. Hours are supported ("1:02:30 Title").
 *
 * This module is deliberately dependency-free so it can be unit-tested with
 * plain ts-node (see scripts/verify-video-chapters.ts).
 */

export interface Chapter {
  /** Seconds from the start of the video. */
  startOffset: number;
  /** Seconds from the start of the video; derived from the next chapter. */
  endOffset: number;
  /** Chapter title, as it should read in the SERP. */
  name: string;
  /** "12:23" — for display next to the title. */
  label: string;
}

/** Google ignores a single-clip list, and a lone chapter is not a chapter set. */
const MIN_CHAPTERS = 2;

/** How long the last chapter runs when the video duration is unknown. */
const TRAILING_CHAPTER_SECONDS = 60;

const LINE_RE = /^\s*\[?(\d{1,2}(?::\d{1,2}){1,2})\]?\s*(?:[-–—:|]\s*)?(.+?)\s*$/;

/** "1:02:30" → 3750, "12:23" → 743. Returns undefined for anything else. */
export function timestampToSeconds(stamp: string): number | undefined {
  const parts = stamp.split(':').map((p) => Number(p));
  if (parts.some((n) => !Number.isFinite(n) || n < 0)) return undefined;
  if (parts.length === 2) {
    const [m, s] = parts;
    if (s > 59) return undefined;
    return m * 60 + s;
  }
  if (parts.length === 3) {
    const [h, m, s] = parts;
    if (m > 59 || s > 59) return undefined;
    return h * 3600 + m * 60 + s;
  }
  return undefined;
}

/** 743 → "12:23", 3750 → "1:02:30". */
export function secondsToTimestamp(total: number): string {
  const s = Math.max(0, Math.floor(total));
  const hours = Math.floor(s / 3600);
  const minutes = Math.floor((s % 3600) / 60);
  const seconds = s % 60;
  const mm = hours > 0 ? String(minutes).padStart(2, '0') : String(minutes);
  return `${hours > 0 ? `${hours}:` : ''}${mm}:${String(seconds).padStart(2, '0')}`;
}

/**
 * Accepts the ?t= values that appear in the wild: "510", "510s", "8m30s",
 * "1h02m30s" and "8:30". Anything unparseable returns undefined so the player
 * simply starts from the beginning rather than throwing.
 */
export function parseTimeParam(value: string | string[] | undefined): number | undefined {
  const raw = (Array.isArray(value) ? value[0] : value)?.trim();
  if (!raw) return undefined;

  if (/^\d+$/.test(raw)) {
    const n = Number(raw);
    return Number.isFinite(n) && n >= 0 ? n : undefined;
  }
  if (raw.includes(':')) return timestampToSeconds(raw);

  const m = raw.match(/^(?:(\d+)h)?(?:(\d+)m)?(?:(\d+)s)?$/i);
  if (!m || (!m[1] && !m[2] && !m[3])) return undefined;
  return Number(m[1] || 0) * 3600 + Number(m[2] || 0) * 60 + Number(m[3] || 0);
}

/**
 * Parse the chapters textarea into ordered, non-overlapping chapters.
 *
 * Lines that do not start with a timestamp are ignored (so a stray heading in
 * the pasted description is harmless). Chapters that would start at or after
 * the end of the video are dropped — a stale timestamp must never produce a
 * Clip that points past the runtime, which invalidates the whole markup.
 */
export function parseChapters(
  raw: string | undefined | null,
  videoDurationSeconds?: number
): Chapter[] {
  if (!raw) return [];

  const seen = new Set<number>();
  const parsed: { start: number; name: string }[] = [];

  for (const line of raw.split(/\r?\n|\|\|/)) {
    const m = line.match(LINE_RE);
    if (!m) continue;

    const start = timestampToSeconds(m[1]);
    if (start === undefined || seen.has(start)) continue;

    const name = m[2].replace(/\s+/g, ' ').trim();
    if (!name) continue;

    seen.add(start);
    parsed.push({ start, name });
  }

  parsed.sort((a, b) => a.start - b.start);

  const duration =
    typeof videoDurationSeconds === 'number' && videoDurationSeconds > 0
      ? Math.floor(videoDurationSeconds)
      : undefined;

  const usable = duration ? parsed.filter((c) => c.start < duration) : parsed;
  if (usable.length < MIN_CHAPTERS) return [];

  return usable.map((c, i) => {
    const next = usable[i + 1]?.start;
    const fallbackEnd = duration ?? c.start + TRAILING_CHAPTER_SECONDS;
    const end = next ?? fallbackEnd;
    return {
      startOffset: c.start,
      endOffset: Math.max(end, c.start + 1),
      name: c.name,
      label: secondsToTimestamp(c.start),
    };
  });
}

export interface ClipJsonLd {
  '@type': 'Clip';
  name: string;
  startOffset: number;
  endOffset: number;
  url: string;
}

/**
 * schema.org Clip entries for VideoObject.hasPart.
 *
 * The URL points at our own watch page, not at youtube.com — Google requires
 * the clip URL to load the player and genuinely seek to that timestamp, and it
 * should keep the click on the site. The watch page reads ?t= and passes
 * start= to the embed, which is what makes these URLs compliant.
 */
export function toClips(chapters: Chapter[], watchPageUrl: string): ClipJsonLd[] {
  return chapters.map((c) => ({
    '@type': 'Clip' as const,
    name: c.name,
    startOffset: c.startOffset,
    endOffset: c.endOffset,
    url: `${watchPageUrl}?t=${c.startOffset}`,
  }));
}

/**
 * Chapters that were hardcoded in the watch page before the WordPress field
 * existed. Kept here so nothing regresses while the `chapters` field is being
 * filled in; a value in WordPress always wins over an entry in this map.
 * Delete a slug from here once its chapters are in WordPress.
 */
export const FALLBACK_CHAPTERS: Record<string, string> = {
  'noida-market-slowdown-2026': `0:45 Crash vs Slowdown Explained
1:36 Builder Strategy: Payment Plans & Unit Sizes
6:11 Seller & Investor Strategy: Hold or Sell?
8:29 Buyer Strategy in Slow Noida Property Market`,
  'godrej-arden-sigma-3-review': `0:00 Introduction & Reality Check
2:19 Godrej Arden Location Analysis — Sigma 3, Greater Noida
3:57 Project Planning & Layout Review
7:35 Godrej Arden Price & Payment Plan
8:41 Competition: Godrej Arden vs Experion 151 vs Sobha
10:47 Should You Buy Godrej Arden? — Property Saraansh Verdict`,
};
