import type { Video } from './videos';
import { getVideoSlug, parseIsoDuration, formatViewCount } from './youtube';

/**
 * Live "newest uploads" helpers for /our-videos and /our-shorts.
 *
 * src/lib/videos.ts is a hand-curated list, so a freshly published video never
 * appeared on the site until someone edited that file. These helpers pull the
 * channel's newest uploads straight from the YouTube Data API so they show up
 * automatically.
 *
 * The two exported functions are opposite halves of the SAME classification:
 * getLatestLongVideos keeps everything that is not a Short, getLatestShorts
 * keeps everything that is. Sharing one test is the point — a video can never
 * land on both pages, or on neither.
 *
 * Shorts are excluded with three independent checks, because any single one of
 * them can be wrong:
 *   1. duration <= 60s (the API duration, never a guessed fallback)
 *   2. a #short / #shorts tag in the title or description
 *   3. youtube.com/shorts/<id> resolving without a redirect (YouTube's own
 *      answer — catches Shorts longer than 60s, which have no API flag)
 *
 * A video is only shown when we have its REAL duration from the API. If the
 * API key is missing (e.g. on preview deployments) or the request fails, these
 * return nothing at all rather than guessing — the curated list still renders,
 * and no Short can leak onto the long-video page.
 */

const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY || process.env.NEXT_PUBLIC_YOUTUBE_API_KEY;
const YOUTUBE_CHANNEL_ID =
  process.env.YOUTUBE_CHANNEL_ID || process.env.NEXT_PUBLIC_YOUTUBE_CHANNEL_ID || 'UC5eDcgQ_bYCzNrJUm34C4_w';

const SHORTS_MAX_SECONDS = 60;

interface VideoDetails {
  durationIso: string;
  seconds: number;
  views: string;
}

function hasShortsTag(text: string): boolean {
  return /#shorts?\b/i.test(text || '');
}

/** "2026-07-18T09:12:33Z" -> "2026-07-18", matching the curated publishedAt format. */
function toDateOnly(publishedAt: string): string {
  const d = new Date(publishedAt);
  if (isNaN(d.getTime())) return publishedAt;
  const pad = (n: number) => n.toString().padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

/** Pulls the 11-character YouTube id off the end of a generated slug. */
export function youtubeIdFromSlug(slug: string): string | null {
  const match = (slug || '').match(/([A-Za-z0-9_-]{11})$/);
  return match ? match[1] : null;
}

/**
 * Asks YouTube directly whether an id is a Short. /shorts/<id> serves the
 * Shorts player for real Shorts and 30x-redirects to /watch for everything
 * else. Returns false when the probe itself fails, so a network hiccup can
 * never hide a long video — the duration and tag checks still apply.
 */
async function isShortsUrl(id: string): Promise<boolean> {
  try {
    const res = await fetch(`https://www.youtube.com/shorts/${id}`, {
      method: 'HEAD',
      redirect: 'manual',
      next: { revalidate: 21600 },
    });
    return res.status === 200;
  } catch {
    return false;
  }
}

async function fetchDetails(ids: string[]): Promise<Record<string, VideoDetails>> {
  const map: Record<string, VideoDetails> = {};
  if (!YOUTUBE_API_KEY || ids.length === 0) return map;

  const url = `https://www.googleapis.com/youtube/v3/videos?key=${YOUTUBE_API_KEY}&id=${ids.join(
    ','
  )}&part=contentDetails,statistics`;
  const res = await fetch(url, { next: { revalidate: 3600 } });
  if (!res.ok) return map;

  const data = await res.json();
  if (!data.items) return map;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data.items.forEach((item: any) => {
    const durationIso = item.contentDetails?.duration || '';
    if (!durationIso) return;
    const { seconds } = parseIsoDuration(durationIso);
    if (!seconds) return;
    map[item.id] = {
      durationIso,
      seconds,
      views: formatViewCount(item.statistics?.viewCount || ''),
    };
  });

  return map;
}

interface Candidate {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  publishedAt: string;
}

/**
 * The channel's newest uploads, unclassified. Shared by both exported helpers
 * so the long-video page and the Shorts page always see the same list.
 */
async function fetchRecentUploads(limit: number): Promise<Candidate[]> {
  if (!YOUTUBE_API_KEY) return [];

  const uploadsPlaylistId = YOUTUBE_CHANNEL_ID.startsWith('UC')
    ? 'UU' + YOUTUBE_CHANNEL_ID.substring(2)
    : YOUTUBE_CHANNEL_ID;

  try {
    const url = `https://www.googleapis.com/youtube/v3/playlistItems?key=${YOUTUBE_API_KEY}&playlistId=${uploadsPlaylistId}&part=snippet&maxResults=${Math.min(
      limit,
      50
    )}`;
    const res = await fetch(url, { next: { revalidate: 3600 } });
    if (!res.ok) return [];

    const data = await res.json();
    if (!data.items || data.items.length === 0) return [];

    return data.items
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .map((item: any) => ({
        id: item.snippet?.resourceId?.videoId || '',
        title: item.snippet?.title || '',
        description: item.snippet?.description || '',
        thumbnail:
          item.snippet?.thumbnails?.maxres?.url ||
          item.snippet?.thumbnails?.high?.url ||
          `https://i.ytimg.com/vi/${item.snippet?.resourceId?.videoId}/hqdefault.jpg`,
        publishedAt: item.snippet?.publishedAt || '',
      }))
      // Private/deleted uploads still appear in the playlist with no usable snippet.
      .filter(
        (v: { id: string; title: string }) =>
          v.id && v.title && v.title !== 'Private video' && v.title !== 'Deleted video'
      );
  } catch (err) {
    console.error('Failed to fetch recent uploads from YouTube', err);
    return [];
  }
}

/** A candidate paired with the verdict on whether it is a Short. */
interface Classified {
  video: Candidate;
  details: VideoDetails;
  isShort: boolean;
}

/**
 * Decide, for each recent upload, whether it is a Short.
 *
 * Three independent checks, because any one of them can be wrong:
 *   1. a #short / #shorts tag in the title or description
 *   2. a REAL duration of 60s or less, straight from the API
 *   3. youtube.com/shorts/<id> serving without a redirect — YouTube's own
 *      answer, and the only one that catches a Short running over 60 seconds
 *
 * Check 3 costs a request each, so it only runs for uploads the first two
 * checks did not already settle.
 *
 * Anything with no API details is dropped entirely. Both pages show a duration,
 * and a guessed duration is worse than an absent card.
 */
async function classifyUploads(candidates: Candidate[]): Promise<Classified[]> {
  const details = await fetchDetails(candidates.map((v) => v.id));
  const withDetails = candidates.filter((v) => details[v.id]);

  const settled = withDetails.map((video) => {
    const tagged = hasShortsTag(`${video.title} ${video.description}`);
    const brief = details[video.id].seconds <= SHORTS_MAX_SECONDS;
    return { video, details: details[video.id], known: tagged || brief };
  });

  const undecided = settled.filter((s) => !s.known);
  const probes = await Promise.all(undecided.map((s) => isShortsUrl(s.video.id)));
  const probedShort = new Set(
    undecided.filter((_, i) => probes[i]).map((s) => s.video.id)
  );

  return settled.map((s) => ({
    video: s.video,
    details: s.details,
    isShort: s.known || probedShort.has(s.video.id),
  }));
}

/** Shape a classified upload like a curated Video so pages need no special cases. */
function toVideo(c: Classified): Video {
  return {
    slug: getVideoSlug({ id: c.video.id, title: c.video.title }),
    title: c.video.title,
    description: c.video.description.split('\n')[0] || c.video.title,
    youtubeId: c.video.id,
    thumbnail: c.video.thumbnail,
    publishedAt: toDateOnly(c.video.publishedAt),
    duration: c.details.durationIso,
    focusKeyword: c.video.title,
    category: c.isShort ? 'Shorts' : 'Real Estate',
    views: c.details.views,
  };
}

/**
 * The channel's newest LONG-FORM uploads, shaped exactly like a curated Video
 * so /our-videos and /our-videos/[slug] can render them with no special cases.
 * Returns [] when the API key is missing or the API call fails.
 */
export async function getLatestLongVideos(limit = 15): Promise<Video[]> {
  const classified = await classifyUploads(await fetchRecentUploads(limit));
  return classified.filter((c) => !c.isShort).map(toVideo);
}

/**
 * The channel's newest SHORTS, shaped the same way — the mirror of the helper
 * above, and the reason /our-shorts no longer needs a hand-written entry for
 * every upload. Six Shorts had piled up unpublished before this existed.
 *
 * The default limit is higher than the long-video one because Shorts are posted
 * more often, so they fall out of a 15-upload window faster.
 */
export async function getLatestShorts(limit = 30): Promise<Video[]> {
  const classified = await classifyUploads(await fetchRecentUploads(limit));
  return classified.filter((c) => c.isShort).map(toVideo);
}

/**
 * A single live video by id, shaped like a curated Video. Used by
 * /our-videos/[slug] so a brand-new upload gets a real watch page (player,
 * lead form, schema) instead of a 404, before anyone hand-writes an entry for
 * it in videos.ts. Returns null when the video can't be verified.
 */
export async function getLiveVideoById(id: string): Promise<Video | null> {
  if (!YOUTUBE_API_KEY || !id) return null;

  try {
    const url = `https://www.googleapis.com/youtube/v3/videos?key=${YOUTUBE_API_KEY}&id=${id}&part=snippet,contentDetails,statistics`;
    const res = await fetch(url, { next: { revalidate: 3600 } });
    if (!res.ok) return null;

    const data = await res.json();
    if (!data.items || data.items.length === 0) return null;

    const item = data.items[0];
    // Only this channel's own uploads get a page here.
    if (item.snippet?.channelId && item.snippet.channelId !== YOUTUBE_CHANNEL_ID) return null;

    const title = item.snippet?.title || '';
    const description = item.snippet?.description || '';
    const durationIso = item.contentDetails?.duration || '';
    const { seconds } = parseIsoDuration(durationIso);
    const isShort =
      hasShortsTag(`${title} ${description}`) ||
      (seconds > 0 && seconds <= SHORTS_MAX_SECONDS) ||
      (await isShortsUrl(id));

    return {
      slug: getVideoSlug({ id, title }),
      title,
      description: description.split('\n')[0] || title,
      // The watch page renders content as paragraphs split on '||'.
      content: description
        .split(/\n{2,}/)
        .map((p: string) => p.trim())
        .filter(Boolean)
        .join('||'),
      youtubeId: id,
      thumbnail:
        item.snippet?.thumbnails?.maxres?.url ||
        item.snippet?.thumbnails?.high?.url ||
        `https://i.ytimg.com/vi/${id}/hqdefault.jpg`,
      publishedAt: toDateOnly(item.snippet?.publishedAt || ''),
      duration: durationIso,
      focusKeyword: title,
      category: isShort ? 'Shorts' : 'Real Estate',
      views: formatViewCount(item.statistics?.viewCount || ''),
      // Chapters are read out of this on the watch page.
      youtubeDescription: description || undefined,
    };
  } catch (err) {
    console.error('Failed to fetch live video by id', err);
    return null;
  }
}
