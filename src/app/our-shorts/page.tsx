import { Metadata } from 'next';
import { getChannelStats } from '@/lib/youtube';
import { videos } from '@/lib/videos';
import ShortsClient from './ShortsClient';

export const revalidate = 60; // Revalidate every minute

export async function generateMetadata(): Promise<Metadata> {
  const stats = await getChannelStats();
  return {
    title: `Property Shorts & Real Estate Tips | Property Saraansh`,
    description: `Watch quick, under-60-second video walkthroughs, RERA alerts, and Noida property market updates by Saraansh Seth. Over ${stats.subscriberCount} subscribers on YouTube.`,
  };
}

export default async function OurShorts() {
  const stats = await getChannelStats();

  // Filter only Shorts videos
  const shorts = videos.filter((video) => video.category === 'Shorts');

  const formattedVideos = shorts.map((v) => ({
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
