import { Metadata } from 'next';
import { getChannelStats } from '@/lib/youtube';
import { getVideosWithRealtimeStats } from '@/lib/videos';
import { getLatestShorts } from '@/lib/latestLongVideos';
import ShortsClient from './ShortsClient';
import { buildPageMetadata } from '@/lib/seo';

export const revalidate = 60; // Revalidate every minute

export async function generateMetadata(): Promise<Metadata> {
  const stats = await getChannelStats();
  return buildPageMetadata({
    path: '/our-shorts',
    title: `Property Shorts & Real Estate Tips | Property Saraansh`,
    description: `Watch quick, under-60-second video walkthroughs, RERA alerts, and Noida property market updates by Saraansh Seth. Over ${stats.subscriberCount} subscribers on YouTube.`,
  });
}

export default async function OurShorts() {
  const [stats, videos, latest] = await Promise.all([
    getChannelStats(),
    getVideosWithRealtimeStats(),
    // Newest Shorts straight from the channel. Without this the page showed
    // only the hand-written entries in videos.ts, so every Short posted after
    // the last code change was invisible — they stopped dead at 31 Aug 2026.
    getLatestShorts(30),
  ]);

  // Filter only Shorts videos
  const shorts = videos.filter((video) => video.category === 'Shorts');

  // Anything already hand-curated in videos.ts wins: it has the written SEO
  // copy, so we keep that version and drop the auto-fetched duplicate.
  const curatedIds = new Set(videos.map((v) => v.youtubeId));
  const newShorts = latest.filter((v) => !curatedIds.has(v.youtubeId));

  // Newest uploads first, then the curated (already newest-first) list.
  const formattedVideos = [...newShorts, ...shorts].map((v) => ({
    id: v.youtubeId,
    title: v.title,
    description: v.description,
    thumbnail: v.thumbnail,
    publishedAt: v.publishedAt,
    duration: "0:59",
    category: v.category,
    views: v.views,
    slug: v.slug
  }));

  return <ShortsClient initialVideos={formattedVideos} stats={stats} />;
}
