import { fetchSlim } from './wordpress';
import { ytId } from './property';

/**
 * What else on this site is about the same video.
 *
 * A watch page used to be a dead end. /properties/<slug> links to it, a blog
 * post links to it, and it linked back to neither — it passed its authority
 * only sideways, to three more watch pages. That is the exact shape Google
 * reads as a low-value orphan: a page that receives internal links and returns
 * none to the pages that actually convert.
 *
 * No new ACF field is needed, because the relationship is already in the data.
 * Both sides key off the SAME YouTube id the watch page is built from:
 *
 *   - a property carries it in acf.youtube_url (or acf.video_id)
 *   - a blog post carries it in ps_video_id (or acf.video_id), which is exactly
 *     what /blog/[slug] already reads to decide which video to link out to
 *
 * So this is the reverse of a mapping the site already trusts, rather than a
 * second, hand-maintained one that could drift out of step with the first.
 *
 * Both lookups request only the handful of fields they need. Asking for full
 * property objects here would pull well over 2MB — past the limit Next can
 * cache — so every watch page would refetch the lot on every render.
 */

export interface RelatedLink {
  href: string;
  title: string;
  /** Short line explaining why this link is here, shown under the title. */
  blurb: string;
}

export interface RelatedToVideo {
  property: RelatedLink | null;
  blog: RelatedLink | null;
  /**
   * The Saraansh Verdict for the project this video reviews, from the
   * property's `video_review_text` field. It is the opinion the video gives,
   * so it belongs on the watch page rather than on the property page, where it
   * used to sit under a second copy of the same embed.
   */
  verdict: string | null;
}

/** WordPress returns titles HTML-encoded; the watch page renders plain text. */
function plainTitle(raw: unknown): string {
  const s = typeof raw === 'string' ? raw : (raw as { rendered?: string })?.rendered || '';
  return s
    .replace(/&#0?39;|&apos;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&amp;/g, '&')
    .replace(/&#8217;/g, '’')
    .replace(/&#8211;/g, '–')
    .replace(/<[^>]*>/g, '')
    .trim();
}

/**
 * The verdict is written as plain paragraphs in WordPress, but the field has
 * carried stray HTML in the past. Reduce it to text and drop anything empty.
 */
function verdictText(raw: unknown): string {
  if (typeof raw !== 'string') return '';
  return raw
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/p>\s*<p>/gi, '\n\n')
    .replace(/<[^>]*>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/[ \t]+/g, ' ')
    .trim();
}

/** A YouTube id from any of the shapes the two content types store it in. */
function idFrom(acf: Record<string, unknown> | undefined, direct?: unknown): string {
  const fromUrl = ytId(String(acf?.youtube_url || ''));
  if (fromUrl) return fromUrl;
  const raw = String(direct || acf?.video_id || '').trim();
  // Stored ids sometimes carry a trailing "?t=" or "&list=" fragment.
  return raw.replace(/[?&].*$/, '');
}

/**
 * The property page and blog post that cover the same video, or nulls.
 * Never throws: a missing related link is a smaller problem than a watch page
 * that fails to render, so any failure degrades to "no block shown".
 */
export async function getRelatedToVideo(youtubeId: string): Promise<RelatedToVideo> {
  const empty: RelatedToVideo = { property: null, blog: null, verdict: null };
  if (!youtubeId) return empty;

  const [properties, posts] = await Promise.all([
    fetchSlim('/properties?per_page=100&_fields=slug,title,acf'),
    fetchSlim('/posts?per_page=100&_fields=slug,title,acf,ps_video_id'),
  ]);

  const property = (properties || []).find(
    (p) => idFrom(p.acf, undefined) === youtubeId
  );
  const post = (posts || []).find(
    (b) => idFrom(b.acf, b.ps_video_id) === youtubeId
  );

  return {
    property: property?.slug
      ? {
          href: `/properties/${property.slug}`,
          title: plainTitle(property.title),
          blurb: 'Price, floor plans, RERA details and payment plan',
        }
      : null,
    blog: post?.slug
      ? {
          href: `/blog/${post.slug}`,
          title: plainTitle(post.title),
          blurb: 'The written analysis behind this video',
        }
      : null,
    verdict: verdictText(property?.acf?.video_review_text) || null,
  };
}
