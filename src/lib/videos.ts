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