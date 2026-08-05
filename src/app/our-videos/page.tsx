import { Metadata } from 'next';
import { getChannelStats, getLatestYouTubeVideos } from '@/lib/youtube';
import { getVideosWithRealtimeStats } from '@/lib/videos';
import VideosClient from './VideosClient';
import { buildPageMetadata } from '@/lib/seo';

export const revalidate = 60; // Revalidate every minute

export async function generateMetadata(): Promise<Metadata> {
  const stats = await getChannelStats();
  return buildPageMetadata({
    path: '/our-videos',
    title: `Real Estate Videos & Property Reviews | Property Saraansh`,
    description: `Browse honest video walkthroughs, RERA analyses, and ground reports for Noida real estate. Over ${stats.subscriberCount} subscribers on YouTube.`,
  });
}

export default async function OurVideos() {
  const [stats, videos, latest] = await Promise.all([
    getChannelStats(),
    getVideosWithRealtimeStats(),
    getLatestYouTubeVideos(15).catch(() => []),
  ]);

  // Exclude Shorts from the long videos directory page
  const longVideos = videos.filter((video) => video.category !== 'Shorts');

  const curatedVideos = longVideos.map((v) => ({
    id: v.youtubeId,
    title: v.title,
    description: v.description,
    thumbnail: v.thumbnail,
    publishedAt: v.publishedAt,
    duration: v.duration.replace('PT', '').replace('M', ' Mins ').replace('S', ' Secs').replace('H', ' Hrs '),
    category: v.category,
    views: v.views,
    slug: v.slug,
  }));

  // Auto-fetch the channel's newest uploads and surface any that aren't in the
  // curated list yet, so freshly published videos appear here automatically.
  // These link out to YouTube (they don't have a hand-written SEO detail page),
  // and Shorts are excluded to match the long-video directory.
  const curatedIds = new Set(videos.map((v) => v.youtubeId));
  const autoVideos = latest
    .filter((v) => v.id && !curatedIds.has(v.id) && v.category !== 'Shorts')
    .map((v) => ({
      id: v.id,
      title: v.title,
      description: v.description,
      thumbnail: v.thumbnail,
      publishedAt: v.publishedAt,
      duration: v.duration,
      category: v.category,
      views: v.views || '',
      slug: '',
      watchUrl: `https://www.youtube.com/watch?v=${v.id}`,
    }));

  // Newest auto-fetched uploads first, then the curated (already newest-first) list.
  const formattedVideos = [...autoVideos, ...curatedVideos];

  return <VideosClient initialVideos={formattedVideos} stats={stats} />;
}
