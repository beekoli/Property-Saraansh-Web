import { Metadata } from 'next';
import { getLatestYouTubeVideos, getChannelStats } from '@/lib/youtube';
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
  const [videos, stats] = await Promise.all([
    getLatestYouTubeVideos(50), // Fetch up to 50 videos
    getChannelStats()
  ]);

  return <VideosClient initialVideos={videos} stats={stats} />;
}
