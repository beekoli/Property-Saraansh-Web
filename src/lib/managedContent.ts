import { getPageBySlug, getWPVideoBySlug, stripHtml } from './wordpress';
import { decodeHtml } from './decodeHtml';

/**
 * WordPress-managed content layer.
 *
 * The rule this file implements: WordPress owns the words — headings, intro
 * copy, video descriptions, meta title and meta description. The frontend owns
 * the machinery — layout, JSON-LD schema, canonical URLs, robots, sitemap and
 * anything that has to be computed live (YouTube view counts, durations, the
 * newest uploads).
 *
 * The override is FIELD BY FIELD. A field filled in WordPress replaces what the
 * code has; a field left blank falls back to the code's value. So a half-filled
 * WordPress entry can never blank out live copy, and pages can be migrated to
 * WordPress one field at a time. If WordPress is unreachable, every helper here
 * returns null and the page renders exactly as it does today.
 */

/** Returns `wp` only when it is a non-empty string; otherwise the code's value. */
export function preferWP(wp: string | undefined | null, fallback: string): string {
  const cleaned = typeof wp === 'string' ? wp.trim() : '';
  return cleaned ? decodeHtml(cleaned) : fallback;
}

export interface ManagedPage {
  /** Page heading, from the WordPress page title. */
  heading?: string;
  /** Intro paragraph, from the WordPress page excerpt. */
  intro?: string;
  /** SEO title, from Rank Math (falls back to Yoast, then the page title). */
  metaTitle?: string;
  /** Meta description, from Rank Math (falls back to Yoast, then the excerpt). */
  metaDescription?: string;
}

// The REST shape we care about. WordPress returns plenty more; these are the
// only keys this layer reads.
interface WPPageLike {
  title?: { rendered?: string };
  excerpt?: { rendered?: string };
  meta?: Record<string, string>;
  rank_math_json?: { title?: string; description?: string };
  yoast_head_json?: { title?: string; description?: string };
}

/**
 * Page-level copy and SEO for a static route, from the WordPress Page whose
 * slug matches the route (e.g. the page "our-videos" drives /our-videos).
 *
 * Reads the SEO fields in the order they are most likely to be filled:
 * Rank Math post meta → Rank Math REST JSON → Yoast → the page's own title and
 * excerpt. Returns null when no such page exists, which is the normal state
 * until the page is created in WordPress.
 */
export async function getManagedPage(slug: string): Promise<ManagedPage | null> {
  const page = (await getPageBySlug(slug)) as WPPageLike | null;
  if (!page) return null;

  const heading = clean(page.title?.rendered);
  const intro = clean(page.excerpt?.rendered);

  const metaTitle =
    clean(page.meta?.rank_math_title) ||
    clean(page.rank_math_json?.title) ||
    clean(page.yoast_head_json?.title) ||
    heading;

  const metaDescription =
    clean(page.meta?.rank_math_description) ||
    clean(page.rank_math_json?.description) ||
    clean(page.yoast_head_json?.description) ||
    intro;

  return { heading, intro, metaTitle, metaDescription };
}

export interface ManagedVideo {
  /** Card and page heading for the video. */
  title?: string;
  /** One-line summary used on cards and as the meta description fallback. */
  shortDescription?: string;
  /** Long-form "About This Video" copy. Paragraphs are separated by '||'. */
  aboutThisVideo?: string;
  metaTitle?: string;
  metaDescription?: string;
}

/**
 * Per-video copy from the WordPress "Videos" section (post type ps_video),
 * matched on the same slug the frontend uses for the watch page.
 *
 * Everything here is optional: whatever is filled in WordPress wins, whatever
 * is blank keeps the copy already in src/lib/videos.ts.
 */
export async function getManagedVideo(slug: string): Promise<ManagedVideo | null> {
  const video = await getWPVideoBySlug(slug);
  if (!video) return null;

  return {
    title: clean(video.title?.rendered),
    shortDescription: clean(video.acf?.short_description),
    aboutThisVideo: clean(video.acf?.about_this_video),
    metaTitle: clean(video.acf?.meta_title),
    metaDescription: clean(video.acf?.meta_description),
  };
}

/**
 * WordPress returns rendered HTML for titles and excerpts (wrapped in <p>, with
 * entities encoded and an auto "Continue reading" link on excerpts). Reduce it
 * to plain text so it can be dropped straight into metadata or a heading.
 */
function clean(value: string | undefined | null): string | undefined {
  if (!value) return undefined;
  const text = decodeHtml(stripHtml(value))
    .replace(/\s*Continue reading.*$/i, '')
    .replace(/\[&hellip;\]|\[…\]|…\s*$/g, '')
    .replace(/\s+/g, ' ')
    .trim();
  return text || undefined;
}
