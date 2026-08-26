import type { Video } from './videos';
import { getVideoSlug, parseIsoDuration, formatViewCount } from './youtube';
import { CHANNELS, isOwnChannel, uploadsPlaylistId } from './channels';

/**
 * Live "newest uploads" helpers for /our-videos.
 *
 * src/lib/videos.ts is a hand-curated list, so a freshly published video never
 * appeared on the site until someone edited that file. These helpers pull the
 * channel's newest uploads straight from the YouTube Data API so they show up
 * automatically, and — critically — they only ever return LONG-FORM videos.
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

/**
 * The newest LONG-FORM uploads from ONE channel. Kept separate from the
 * public helper below so a failure on one channel cannot empty the other.
 */
async function latestFromChannel(channelId: string, limit: number): Promise<Video[]> {
  if (!YOUTUBE_API_KEY) return [];

  try {
    const url = `https://www.googleapis.com/youtube/v3/playlistItems?key=${YOUTUBE_API_KEY}&playlistId=${uploadsPlaylistId(
      channelId
    )}&part=snippet&maxResults=${Math.min(limit, 50)}`;
    const res = await fetch(url, { next: { revalidate: 3600 } });
    if (!res.ok) return [];

    const data = await res.json();
    if (!data.items || data.items.length === 0) return [];

    const candidates = data.items
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
      )
      // Check 2: an explicit Shorts hashtag anywhere in the title or description.
      .filter((v: { title: string; description: string }) => !hasShortsTag(`${v.title} ${v.description}`));

    const details = await fetchDetails(candidates.map((v: { id: string }) => v.id));

    // Check 1: a REAL duration over 60s. No details means no card — we never
    // fall back to a guessed duration on this page.
    const longEnough = candidates.filter(
      (v: { id: string }) => details[v.id] && details[v.id].seconds > SHORTS_MAX_SECONDS
    );

    // Check 3: YouTube's own verdict, for Shorts that run longer than 60s.
    const shortsFlags = await Promise.all(longEnough.map((v: { id: string }) => isShortsUrl(v.id)));

    return longEnough
      .filter((_: unknown, i: number) => !shortsFlags[i])
      .map((v: { id: string; title: string; description: string; thumbnail: string; publishedAt: string }) => ({
        slug: getVideoSlug({ id: v.id, title: v.title }),
        title: v.title,
        description: v.description.split('\n')[0] || v.title,
        youtubeId: v.id,
        thumbnail: v.thumbnail,
        publishedAt: toDateOnly(v.publishedAt),
        duration: details[v.id].durationIso,
        focusKeyword: v.title,
        category: 'Real Estate',
        views: details[v.id].views,
        channelId,
      }));
  } catch (err) {
    console.error(`Failed to fetch latest long videos for channel ${channelId}`, err);
    return [];
  }
}

/**
 * The newest LONG-FORM uploads across every Property Saraansh channel, shaped
 * exactly like a curated Video so /our-videos and /our-videos/[slug] can render
 * them with no special cases. Returns [] when the API key is missing.
 *
 * The channels are fetched in parallel and merged newest-first, so a project
 * review published on the Reviews channel sits in the same feed as a market
 * update from the main channel, in date order. `limit` applies to the merged
 * result; each channel is asked for the full limit so one quiet channel cannot
 * hold back the other.
 */
export async function getLatestLongVideos(limit = 15): Promise<Video[]> {
  if (!YOUTUBE_API_KEY) return [];

  const perChannel = await Promise.all(CHANNELS.map((c) => latestFromChannel(c.id, limit)));

  const seen = new Set<string>();
  return perChannel
    .flat()
    .filter((v) => {
      if (seen.has(v.youtubeId)) return false;
      seen.add(v.youtubeId);
      return true;
    })
    .sort((a, b) => (a.publishedAt < b.publishedAt ? 1 : a.publishedAt > b.publishedAt ? -1 : 0))
    .slice(0, limit);
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
    // Only the brand's own uploads get a page here — either channel qualifies,
    // anything else does not.
    if (item.snippet?.channelId && !isOwnChannel(item.snippet.channelId)) return null;

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
      channelId: item.snippet?.channelId || undefined,
    };
  } catch (err) {
    console.error('Failed to fetch live video by id', err);
    return null;
  }
}
