import { getVideoByYoutubeId, getHydratedVideoBySlug } from './videos';
import {
  extractChapterLines,
  parseChapters,
  durationToSeconds,
  secondsToTimestamp,
} from './videoChapters';

/**
 * The "watch our review" card on a property page.
 *
 * The property page no longer embeds the video or carries the Saraansh
 * Verdict — both live on the watch page — so without this the page has no
 * route to the review at all, and the watch pages receive no internal links
 * from the commercial half of the site.
 *
 * Whether the card appears is decided by one question: does a watch page
 * actually exist for this project's video? A property stores a YouTube id in
 * `acf.youtube_url`, but an id alone is not enough — three properties embed a
 * developer's own walkthrough, which is not on our channel and therefore has
 * no watch page. Looking the id up in the video registry answers both "is this
 * our video" and "where does it live" in a single step, and returning null
 * means the card renders nothing at all rather than an empty placeholder.
 *
 * This is the same id the watch page uses to find its property (see
 * relatedToVideo.ts), read in the opposite direction — so the two blocks are
 * driven by one piece of data and cannot drift apart.
 */
export interface PropertyVideoCta {
  /** Watch page path, e.g. /our-videos/godrej-arden-sigma-3-review */
  href: string;
  title: string;
  thumbnail: string;
  /** Display runtime, e.g. "12:24". Empty when YouTube could not be reached. */
  duration: string;
  /** Display view count, e.g. "48K views". */
  views: string;
  /** Key moments in the video; 0 when it has no chapters. */
  chapterCount: number;
}

/**
 * Video titles are written for YouTube search and run long:
 * "Godrej Arden Greater Noida Review | Price ₹1.63–3.1 Cr, Floor Plans &
 * Honest Investment Analysis". Everything after the first pipe is keyword tail
 * that reads as clutter in a card, so keep the part before it.
 */
function cardTitle(title: string): string {
  const head = title.split('|')[0].trim();
  return head.length >= 12 ? head : title.trim();
}

export async function getPropertyVideoCta(
  youtubeId: string | undefined | null
): Promise<PropertyVideoCta | null> {
  if (!youtubeId) return null;

  const base = getVideoByYoutubeId(youtubeId);
  if (!base || !base.slug) return null;

  // Views, runtime and the description come from YouTube so the card never
  // states a stale number. A failure here degrades to the registry's own
  // values rather than hiding the card.
  let video = base;
  try {
    video = (await getHydratedVideoBySlug(base.slug)) || base;
  } catch {
    video = base;
  }

  const chapters = parseChapters(
    extractChapterLines(video.youtubeDescription),
    durationToSeconds(video.duration)
  );

  // The registry stores ISO 8601 ("PT12M24S") while the YouTube hydration
  // overwrites it with a display string ("12:24"). Normalise, so a card
  // rendered without the API never prints "PT12M24S" at a visitor.
  const seconds = durationToSeconds(video.duration);

  return {
    href: `/our-videos/${video.slug}`,
    title: cardTitle(video.title),
    thumbnail: video.thumbnail || `https://i.ytimg.com/vi/${youtubeId}/hqdefault.jpg`,
    duration: seconds ? secondsToTimestamp(seconds) : '',
    views: video.views || '',
    chapterCount: chapters.length,
  };
}
