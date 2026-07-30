import { permanentRedirect } from 'next/navigation';
import { videos } from '@/lib/videos';

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateStaticParams() {
  return videos.map((video) => ({
    id: video.youtubeId,
  }));
}

export default async function ShortUrlRedirectPage({ params }: PageProps) {
  const { id } = await params;
  
  const video = videos.find(
    (v) => v.youtubeId.toLowerCase() === id.toLowerCase() || v.slug.toLowerCase() === id.toLowerCase()
  );

  if (video) {
    permanentRedirect(`/our-videos/${video.slug}`);
  } else {
    permanentRedirect(`/our-videos`);
  }
}
