import { parseIsoDuration, formatViewCount } from '@/lib/youtube';

export interface Video {
  slug: string;
  title: string;
  description: string;
  content?: string;
  youtubeId: string;
  thumbnail: string;
  publishedAt: string;
  duration: string;
  focusKeyword: string;
  category: string;
  views: string;
}

export function getVideos(): Video[] {
  return videos;
}

export function getVideoBySlug(slug: string): Video | undefined {
  return videos.find(v => v.slug === slug);
}

export function getVideoByYoutubeId(youtubeId: string): Video | undefined {
  return videos.find(v => v.youtubeId === youtubeId);
}

export function getVideosByCategory(category: string): Video[] {
  return videos.filter(v => v.category === category);
}

export function getFormattedDuration(video: Video): string {
  return parseIsoDuration(video.duration);
}

export function getFormattedViews(video: Video): string {
  return formatViewCount(video.views);
}

const videos: Video[] = [