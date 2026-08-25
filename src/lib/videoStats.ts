/**
 * The two YouTube numbers a watch page states to Google, kept in their own
 * module so the verify script can run them under plain ts-node — videos.ts
 * imports Next-specific fetch options that ts-node cannot compile.
 *
 * Both numbers used to be wrong:
 *
 *   - The upload date was hand-typed into videos.ts. 52 of the 84 entries had
 *     drifted onto the same placeholder date, so videos genuinely published in
 *     2024 were telling Google they went up in June 2026.
 *   - The view count was reconstructed by stripping the digits out of a display
 *     string and multiplying by 1000, which read "6.1K views" as 61,000 and
 *     "741 views" as 741,000.
 *
 * Both now come from the YouTube API on every render, and the stored value is
 * only a fallback for when the API cannot be reached.
 */

/**
 * The view count as an integer, or undefined when YouTube did not return one.
 * Carried alongside the formatted "7K views" string rather than parsed back out
 * of it, because that string is lossy in both directions.
 */
export function rawViewCount(viewsStr?: string): number | undefined {
  if (!viewsStr) return undefined;
  const n = parseInt(viewsStr, 10);
  return Number.isFinite(n) ? n : undefined;
}

/**
 * YouTube's publishedAt ("2026-03-16T05:30:00Z") reduced to a plain date.
 * Returns undefined rather than a guess when the value is missing or unparseable,
 * so the caller falls back to the stored date instead of inventing one.
 */
export function publishedDate(publishedAt?: string): string | undefined {
  if (!publishedAt) return undefined;
  const d = new Date(publishedAt);
  return Number.isNaN(d.getTime()) ? undefined : d.toISOString().slice(0, 10);
}
