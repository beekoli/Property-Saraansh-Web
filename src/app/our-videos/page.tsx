import { Metadata } from 'next';
import { getChannelStats } from '@/lib/youtube';
import { videos } from '@/lib/videos';
import VideosClient from './VideosClient';

export const revalidate = 60; // Revalidate every minute

export async function generateMetadata(): Promise<Metadata> {
  const stats = await getChannelStats();
  return {
    title: `Real Estate Videos & Property Reviews | Property Saraansh`,
    description: `Browse honest video walkthroughs, RERA analyses, and ground reports for Noida real estate. Over ${stats.subscriberCount} subscribers on YouTube.`,
  };
}

export default async function OurVideos() {
  const stats = await getChannelStats();

  // Exclude Shorts from the long videos directory page
  const longVideos = videos.filter((video) => video.category !== 'Shorts');

  const formattedVideos = longVideos.map((v) => ({
    id: v.youtubeId,
    title: v.title,
    description: v.description,
    thumbnail: v.thumbnail,
    publishedAt: v.publishedAt,
    duration: v.duration.replace('PT', '').replace('M', ' Mins ').replace('S', ' Secs').replace('H', ' Hrs '),
    category: v.category,
    views: v.views,
    slug: v.slug
  }));

  return <VideosClient initialVideos={formattedVideos} stats={stats} />;
}
