import { Metadata } from 'next';
import { getChannelStats } from '@/lib/youtube';
import { getVideosWithRealtimeStats } from '@/lib/videos';
import { getLatestLongVideos } from '@/lib/latestLongVideos';
import { getManagedPage, preferWP } from '@/lib/managedContent';
import VideosClient from './VideosClient';
import { buildPageMetadata } from '@/lib/seo';

export const revalidate = 60; // Revalidate every minute

// The WordPress Page whose slug drives this route. Its title becomes the page
// heading, its excerpt the intro paragraph, and its Rank Math fields the meta
// title and description. Anything left blank in WordPress keeps the copy below.
const WP_PAGE_SLUG = 'our-videos';

const DEFAULT_HEADING = 'Property Insights on YouTube';
const DEFAULT_INTRO =
  'Honest reviews, ground reality checks, and expert advice for your next real estate investment in Noida.';
const DEFAULT_META_TITLE = 'Real Estate Videos & Property Reviews | Property Saraansh';

export async function generateMetadata(): Promise<Metadata> {
  const [stats, managed] = await Promise.all([getChannelStats(), getManagedPage(WP_PAGE_SLUG)]);

  return buildPageMetadata({
    path: '/our-videos',
    title: preferWP(managed?.metaTitle, DEFAULT_META_TITLE),
    description: preferWP(
      managed?.metaDescription,
      `Browse honest video walkthroughs, RERA analyses, and ground reports for Noida real estate. Over ${stats.subscriberCount} subscribers on YouTube.`
    ),
  });
}

const formatDuration = (duration: string) =>
  duration.replace('PT', '').replace('H', ' Hrs ').replace('M', ' Mins ').replace('S', ' Secs');

export default async function OurVideos() {
  const [stats, videos, latest, managed] = await Promise.all([
    getChannelStats(),
    getVideosWithRealtimeStats(),
    // Newest uploads straight from the channel. Long-form only — see
    // src/lib/latestLongVideos.ts for how Shorts are excluded.
    getLatestLongVideos(15),
    getManagedPage(WP_PAGE_SLUG),
  ]);

  // Exclude Shorts from the long videos directory page
  const longVideos = videos.filter((video) => video.category !== 'Shorts');

  // Anything already hand-curated in videos.ts wins: it has the written SEO
  // copy, so we keep that version and drop the auto-fetched duplicate.
  const curatedIds = new Set(videos.map((v) => v.youtubeId));
  const newUploads = latest.filter((v) => !curatedIds.has(v.youtubeId));

  // Newest uploads first, then the curated (already newest-first) list. Both
  // link to the same internal watch page — /our-videos/[slug] falls back to a
  // live YouTube lookup for videos that aren't in videos.ts yet.
  const formattedVideos = [...newUploads, ...longVideos].map((v) => ({
    id: v.youtubeId,
    title: v.title,
    description: v.description,
    thumbnail: v.thumbnail,
    publishedAt: v.publishedAt,
    duration: formatDuration(v.duration),
    category: v.category,
    views: v.views,
    slug: v.slug,
  }));

  return (
    <VideosClient
      initialVideos={formattedVideos}
      stats={stats}
      heading={preferWP(managed?.heading, DEFAULT_HEADING)}
      intro={preferWP(managed?.intro, DEFAULT_INTRO)}
    />
  );
}
