import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Calendar, Eye, Video, ArrowLeft } from 'lucide-react';
import { videos, getVideoBySlug } from '@/lib/videos';
import { getChannelStats } from '@/lib/youtube';
import VideoPlayer from '@/components/VideoPlayer';
import WatchSidebarForm from './WatchSidebarForm';
import { FRONTEND_URL, parseDateToISO8601 } from '@/lib/seo';

export const revalidate = 60; // Revalidate every minute

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return videos.map((video) => ({
    slug: video.slug,
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const video = getVideoBySlug(slug);

  if (!video) {
    return {
      title: 'Video Not Found | Property Saraansh',
    };
  }

  return {
    title: `${video.title} | Watch Review | Property Saraansh`,
    description: video.description || `Watch honest real estate project reviews, construction updates, and investment guides from Saraansh Seth on YouTube.`,
    alternates: {
      canonical: `${FRONTEND_URL}/our-videos/${video.slug}`,
    },
    openGraph: {
      title: `${video.title} | Property Saraansh`,
      description: video.description || `Watch honest real estate project reviews on YouTube.`,
      images: [
        {
          url: video.thumbnail,
          width: 1200,
          height: 630,
          alt: video.focusKeyword,
        },
      ],
      videos: [{ url: `https://www.youtube.com/embed/${video.youtubeId}` }],
    },
    twitter: {
      card: "summary_large_image",
      title: video.title,
      description: video.description,
      images: [video.thumbnail],
    },
    other: {
      "robots": "index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1",
    },
  };
}

export default async function VideoWatchPage({ params }: PageProps) {
  const { slug } = await params;
  const video = getVideoBySlug(slug);

  if (!video) {
    notFound();
  }

  // Fetch stats and filter related videos
  const stats = await getChannelStats();

  const isCurrentShort = video.category === 'Shorts';
  const relatedVideos = videos
    .filter((v) => v.slug !== video.slug && (isCurrentShort ? v.category === 'Shorts' : v.category !== 'Shorts'))
    .slice(0, 3);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "VideoObject",
    "name": video.title,
    "description": video.description,
    "thumbnailUrl": [video.thumbnail],
    "uploadDate": parseDateToISO8601(video.publishedAt),
    "duration": video.duration,
    "contentUrl": `https://www.youtube.com/watch?v=${video.youtubeId}`,
    "embedUrl": `https://www.youtube.com/embed/${video.youtubeId}`,
    "publisher": {
      "@type": "Organization",
      "name": "Property Saraansh",
      "logo": {
        "@type": "ImageObject",
        "url": `${FRONTEND_URL}/logo.png`
      }
    }
  };

  return (
    <>
      {/* Schema Markup for search engines */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="min-h-screen bg-brand-pale flex flex-col pt-0">
        {/* Navigation Breadcrumb Banner */}
        <section className="bg-brand-dark pt-28 pb-8 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-4 relative z-10">
            <Link 
              href={video.category === 'Shorts' ? "/our-shorts" : "/our-videos"} 
              className="flex items-center gap-2 text-brand-accent hover:text-brand-accent-light transition-colors text-sm font-semibold uppercase tracking-wider group"
            >
              <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
              {video.category === 'Shorts' ? "Back to Property Shorts" : "Back to Video Reviews"}
            </Link>
            
            <div className="flex items-center gap-4 text-xs text-brand-pale/70">
              <span className="bg-brand-primary/50 text-brand-accent border border-brand-accent/30 px-3 py-1 rounded-full uppercase tracking-wider font-bold">
                {stats.subscriberCount} Subscribers
              </span>
            </div>
          </div>
        </section>

        {/* Watch Interface Grid */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex-grow w-full">
          <div className="flex flex-col lg:flex-row gap-10 items-start">
            
            {/* Left Column: Player and Video Details */}
            <div className="w-full lg:w-8/12 space-y-8">
              {/* Responsive 16:9 Video Player Card */}
              <div className="bg-brand-dark p-3 rounded-2xl shadow-xl border border-brand-primary">
                <VideoPlayer videoId={video.youtubeId} title={video.title} isShort={video.category === 'Shorts'} />
              </div>

              {/* Video Title and Metadata */}
              <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-brand-light/10 space-y-4">
                <div className="flex flex-wrap gap-2.5">
                  <span className="bg-brand-pale text-brand-primary text-[10px] uppercase tracking-wider font-bold px-3 py-1 rounded">
                    {video.category}
                  </span>
                  <span className="bg-brand-accent/10 text-brand-accent border border-brand-accent/20 text-[10px] uppercase tracking-wider font-bold px-3 py-1 rounded">
                    {video.category === 'Shorts' ? '0:59 Mins' : video.duration.replace('PT', '').replace('M', ' Mins ').replace('S', ' Secs')}
                  </span>
                </div>

                <h1 className="heading-playfair text-2xl md:text-3xl font-bold text-brand-ink leading-tight">
                  {video.title}
                </h1>

                <div className="flex items-center gap-6 text-xs text-brand-light pt-2 border-t border-brand-pale font-light">
                  <span className="flex items-center gap-1.5">
                    <Calendar size={14} className="text-brand-primary" />
                    {video.publishedAt}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Eye size={14} className="text-brand-primary" />
                    {video.views}
                  </span>
                </div>
              </div>
            </div>

            {/* Right Column: Sticky Lead Capture and Stats */}
            <div className="w-full lg:w-4/12 lg:sticky lg:top-28 space-y-6">
              
              {/* Consultation Lead Form Component */}
              <WatchSidebarForm videoTitle={video.title} />

              {/* Video Fact Sheet */}
              <div className="bg-brand-dark text-white p-6 rounded-2xl border border-brand-primary shadow-md">
                <h3 className="heading-playfair text-base font-bold text-brand-accent border-b border-brand-light/20 pb-3 mb-4">
                  Review Fact Sheet
                </h3>
                <table className="w-full text-xs font-light space-y-3">
                  <tbody>
                    <tr className="border-b border-brand-light/10">
                      <td className="py-2.5 text-brand-accent/80 font-medium">Channel</td>
                      <td className="py-2.5 text-right font-normal">Property Saraansh</td>
                    </tr>
                    <tr className="border-b border-brand-light/10">
                      <td className="py-2.5 text-brand-accent/80 font-medium">Presenter</td>
                      <td className="py-2.5 text-right font-normal">Saraansh Seth</td>
                    </tr>
                    <tr className="border-b border-brand-light/10">
                      <td className="py-2.5 text-brand-accent/80 font-medium">Category</td>
                      <td className="py-2.5 text-right font-normal">{video.category}</td>
                    </tr>
                    <tr className="border-b border-brand-light/10">
                      <td className="py-2.5 text-brand-accent/80 font-medium">Review Date</td>
                      <td className="py-2.5 text-right font-normal">{video.publishedAt}</td>
                    </tr>
                    <tr>
                      <td className="py-2.5 text-brand-accent/80 font-medium">Focus Area</td>
                      <td className="py-2.5 text-right font-normal">Noida & Greater Noida</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* RERA Warning Badge */}
              <div className="border border-brand-primary/40 bg-brand-primary/10 rounded-2xl p-5 text-center">
                <span className="inline-block bg-brand-accent/20 border border-brand-accent/30 text-brand-accent text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider mb-2">
                  RERA Compliant Advisory
                </span>
                <p className="text-[11px] text-brand-ink/80 font-light leading-relaxed">
                  We verify all projects on the UP RERA portal before filing video reviews. Always consult our advisors to verify registrations, pricing sheets, and payment plans.
                </p>
              </div>
            </div>
          </div>

          {/* Related Videos Section */}
          {relatedVideos.length > 0 && (
            <div className="mt-20 pt-10 border-t border-brand-light/10">
              <h2 className="heading-playfair text-2xl md:text-3xl text-brand-ink font-bold mb-10 text-center inline-block relative left-1/2 -translate-x-1/2">
                Related Video Reviews
                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-brand-accent -mb-2"></span>
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {relatedVideos.map((item) => (
                  <div 
                    key={item.slug} 
                    className="group bg-white rounded-xl overflow-hidden border border-brand-pale hover:shadow-lg transition-all duration-300 flex flex-col h-full relative"
                  >
                    <Link 
                      href={`/our-videos/${item.slug}`}
                      className="relative aspect-video overflow-hidden bg-brand-dark block"
                    >
                      <img 
                        src={item.thumbnail} 
                        alt={item.title} 
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
                        loading="lazy" 
                      />
                      <div className="absolute top-3 left-3 bg-brand-primary text-white text-[9px] uppercase tracking-wider font-bold px-2.5 py-1 rounded">
                        {item.category}
                      </div>
                      <div className="absolute inset-0 bg-brand-primary/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                        <svg className="w-12 h-12 text-brand-accent transform scale-50 group-hover:scale-100 transition-all" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5v-9l6 4.5-6 4.5z"/>
                        </svg>
                      </div>
                    </Link>
                    
                    <div className="p-4 flex-grow flex flex-col justify-between">
                      <Link 
                        href={`/our-videos/${item.slug}`}
                        className="text-xs font-semibold text-brand-ink line-clamp-2 leading-relaxed hover:text-brand-primary transition-colors"
                      >
                        {item.title}
                      </Link>
                      <div className="text-[10px] text-brand-light/80 mt-3 pt-2.5 border-t border-brand-pale font-light flex justify-between">
                        <span>{item.publishedAt}</span>
                        <span>{item.views}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
