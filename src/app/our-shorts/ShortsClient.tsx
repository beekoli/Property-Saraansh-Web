"use client";

import { useState } from 'react';
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
}

interface Props {
  initialVideos: ClientVideo[];
  stats: {
    subscriberCount: string;
    videoCount: string;
  };
}

export default function ShortsClient({ initialVideos, stats }: Props) {
  const [visibleCount, setVisibleCount] = useState(12); // Display 12 shorts initially

  return (
    <div className="min-h-screen bg-brand-pale flex flex-col pt-0">
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
            Property Shorts
          </h1>
          <div className="w-24 h-0.5 bg-brand-accent mx-auto rounded"></div>
          <p className="text-brand-pale/80 mt-6 text-base md:text-lg font-light leading-relaxed max-w-2xl mx-auto">
            Quick real estate insights, RERA alerts, and micro-market project reviews in under 60 seconds.
          </p>
        </div>
      </section>

      {/* Top statistics and subscribe bar */}
      <div className="bg-white border-b border-brand-light/10 shadow-sm py-4 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-4 text-brand-ink">
            <div className="flex items-center gap-2">
              <span className="font-bold text-xl">{initialVideos.length}+</span>
              <span className="text-brand-primary text-sm font-medium">Quick Shorts</span>
            </div>
            <div className="w-px h-6 bg-brand-light/20"></div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-xl">{stats.subscriberCount}</span>
              <span className="text-brand-primary text-sm font-medium">Subscribers</span>
            </div>
          </div>
          
          <a 
            href="https://www.youtube.com/@PropertySaraansh" 
            target="_blank" 
            rel="noreferrer" 
            className="bg-[#FF0000] text-white font-bold px-6 py-2.5 rounded shadow-md hover:bg-red-700 transition-all duration-300 flex items-center gap-2 text-sm hover:scale-105"
          >
            <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
              <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
            </svg>
            Subscribe on YouTube
          </a>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex-grow w-full">
        {/* Shorts Grid */}
        {initialVideos.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">
            {initialVideos.slice(0, visibleCount).map((video) => (
              <div 
                key={video.id} 
                className="group bg-white rounded-2xl overflow-hidden border border-brand-pale hover:shadow-xl transition-all duration-300 flex flex-col h-full relative"
              >
                {/* 9:16 Portrait Thumbnail Container */}
                <Link 
                  href={`/our-videos/${video.slug}`}
                  className="relative aspect-[9/16] overflow-hidden bg-brand-dark block"
                >
                  <img 
                    src={video.thumbnail} 
                    alt={video.title} 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
                    loading="lazy" 
                  />
                  {/* Category Pill Top-Left */}
                  <div className="absolute top-3 left-3 bg-brand-accent text-brand-dark text-[9px] uppercase tracking-wider font-bold px-2.5 py-1 rounded shadow-md">
                    Shorts
                  </div>
                  {/* Hover overlay with sand gold play circle */}
                  <div className="absolute inset-0 bg-brand-primary/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <svg className="w-14 h-14 text-brand-accent transform scale-50 group-hover:scale-100 transition-all duration-300" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5v-9l6 4.5-6 4.5z"/>
                    </svg>
                  </div>
                </Link>
                
                <div className="p-4 flex-grow flex flex-col justify-between bg-white text-brand-ink">
                  <Link href={`/our-videos/${video.slug}`} className="block group">
                    <h3 className="text-xs font-semibold text-brand-ink line-clamp-2 leading-relaxed group-hover:text-brand-primary transition-colors cursor-pointer">
                      {video.title}
                    </h3>
                  </Link>
                  <div className="text-[10px] text-brand-light mt-3 pt-2 border-t border-brand-pale font-light flex justify-between">
                    <span>{video.publishedAt}</span>
                    <span>{video.views}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 text-brand-ink/60">
            <p className="text-lg">No YouTube shorts found on this channel.</p>
          </div>
        )}

        {/* Load More Button */}
        {visibleCount < initialVideos.length && (
          <div className="text-center mt-16">
            <button 
              onClick={() => setVisibleCount(prev => prev + 12)}
              className="btn-primary inline-block font-bold transition-all shadow-md hover:shadow-lg cursor-pointer"
            >
              Load More Shorts
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
