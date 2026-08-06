"use client";

import { useState, type ReactNode } from 'react';
import Link from 'next/link';
interface ClientVideo {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  publishedAt: string;
  duration: string;
  category: string;
  views: string;
  slug: string;
  // Set for auto-fetched YouTube uploads that don't have an internal detail
  // page yet — the card links straight to YouTube instead of /our-videos/[slug].
  watchUrl?: string;
}

// Links to the internal detail page for curated videos, or out to YouTube for
// freshly fetched uploads that don't have an SEO detail page yet.
function CardLink({ video, className, children }: { video: ClientVideo; className?: string; children: ReactNode }) {
  if (video.watchUrl) {
    return (
      <a href={video.watchUrl} target="_blank" rel="noopener noreferrer" className={className}>
        {children}
      </a>
    );
  }
  return (
    <Link href={`/our-videos/${video.slug}`} className={className}>
      {children}
    </Link>
  );
}

interface Props {
  initialVideos: ClientVideo[];
  stats: {
    subscriberCount: string;
    videoCount: string;
  };
  /**
   * Heading and intro copy, resolved on the server: WordPress first, then the
   * wording that used to be hard-coded here. Always supplied, so this component
   * never needs to know where the words came from.
   */
  heading: string;
  intro: string;
}

export default function VideosClient({ initialVideos, stats, heading, intro }: Props) {
  const [visibleCount, setVisibleCount] = useState(9);

  return (
    <div className="min-h-screen bg-brand-pale flex flex-col">
      {/* Page Header */}
      <section className="bg-brand-dark pt-32 pb-12 px-4 sm:px-6 lg:px-8 text-center relative overflow-hidden">
        <div 
          className="absolute inset-0 opacity-[0.04]" 
          style={{ 
            backgroundImage: `
              linear-gradient(rgba(212, 169, 106, 0.15) 1px, transparent 1px), 
              linear-gradient(90deg, rgba(212, 169, 106, 0.15) 1px, transparent 1px)
            `, 
            backgroundSize: '30px 30px' 
          }}
        ></div>
        <div className="relative z-10 max-w-4xl mx-auto">
          <div className="inline-block bg-brand-primary text-white text-xs font-bold px-4 py-1.5 rounded-full mb-4 uppercase tracking-widest border border-brand-accent/25">
            {stats.subscriberCount} Subscribers
          </div>
          <h1 className="heading-playfair text-4xl md:text-5xl text-brand-accent mb-4 font-bold">
            {heading}
          </h1>
          <div className="w-24 h-0.5 bg-brand-accent mx-auto rounded"></div>
          <p className="text-brand-pale/80 mt-6 text-base md:text-lg font-light leading-relaxed max-w-2xl mx-auto">
            {intro}
          </p>
        </div>
      </section>

      {/* Top statistics and subscribe bar */}
      <div className="bg-white border-b border-brand-light/10 shadow-sm py-4 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="font-bold text-brand-ink text-xl">{stats.videoCount}</span>
              <span className="text-brand-primary text-sm font-medium">Uploaded Videos</span>
            </div>
            <div className="w-px h-6 bg-brand-light/20"></div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-brand-ink text-xl">{stats.subscriberCount}</span>
              <span className="text-brand-primary text-sm font-medium">Subscribers</span>
            </div>
          </div>
          
          <a 
            href="https://www.youtube.com/@PropertySaraansh" 
            target="_blank" 
            rel="noreferrer" 
            className="bg-[#FF0000] text-white font-bold px-6 py-2.5 rounded shadow-md hover:bg-red-700 transition-all duration-300 flex items-center gap-2 text-sm hover:scale-105 hover:shadow-red-500/20"
          >
            <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
              <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
            </svg>
            Subscribe on YouTube
          </a>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex-grow w-full">
        {/* Video Grid */}
        {initialVideos.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {/*
              Every card is rendered into the HTML and the ones past
              visibleCount are only visually hidden. "Load More" is a button, and
              Googlebot does not click buttons — slicing the array here meant 46
              of 55 video pages had no internal link anywhere on the site and were
              discoverable via the sitemap alone. Thumbnails are lazy-loaded, so
              rendering the full list costs nothing up front.
            */}
            {initialVideos.map((video, index) => (
              <div 
                key={video.id} 
                className={`group bg-white rounded-xl overflow-hidden border border-brand-pale hover:shadow-xl transition-all duration-300 flex-col h-full relative ${
                  index >= visibleCount ? 'hidden' : 'flex'
                }`}
              >
                {/* Thumbnail Container */}
                <CardLink
                  video={video}
                  className="relative aspect-video overflow-hidden bg-brand-dark block"
                >
                  <img 
                    src={video.thumbnail} 
                    alt={video.title} 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
                    loading="lazy" 
                  />
                  {/* Category Pill Top-Left */}
                  <div className="absolute top-3 left-3 bg-brand-primary text-white text-[9px] uppercase tracking-wider font-bold px-2.5 py-1 rounded shadow-md">
                    {video.category}
                  </div>
                  {/* Duration Badge Bottom-Right */}
                  <div className="absolute bottom-3 right-3 bg-brand-accent text-brand-dark text-[10px] font-bold px-2 py-0.5 rounded shadow">
                    {video.duration}
                  </div>
                  {/* Hover overlay with sand gold play circle */}
                  <div className="absolute inset-0 bg-brand-primary/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <svg className="w-14 h-14 text-brand-accent transform scale-50 group-hover:scale-100 transition-all duration-300" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5v-9l6 4.5-6 4.5z"/>
                    </svg>
                  </div>
                </CardLink>

                <div className="p-5 flex-grow flex flex-col justify-between">
                  <CardLink video={video} className="block group">
                    <h3 className="text-sm font-semibold text-brand-ink line-clamp-2 leading-relaxed group-hover:text-brand-primary transition-colors cursor-pointer">
                      {video.title}
                    </h3>
                  </CardLink>
                  <div className="flex items-center justify-between text-brand-light text-[11px] mt-4 pt-3 border-t border-brand-pale font-light">
                    <span className="flex items-center">
                      <svg className="w-3.5 h-3.5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      {video.publishedAt}
                    </span>
                    <span>{video.views}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 text-brand-ink/60">
            <p className="text-lg">No video reviews found on this channel.</p>
          </div>
        )}

        {/* Load More Button */}
        {visibleCount < initialVideos.length && (
          <div className="text-center mt-16">
            <button 
              onClick={() => setVisibleCount(prev => prev + 9)}
              className="btn-primary inline-block font-bold transition-all shadow-md hover:shadow-lg cursor-pointer"
            >
              Load More Videos
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
