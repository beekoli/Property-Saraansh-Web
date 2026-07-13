"use client";

import { useState } from 'react';

/**
 * YouTube "facade": we render the thumbnail + a play button instead of the real
 * <iframe>. The YouTube embed ships a large amount of cross-origin JS and blocks
 * the main thread (measured: 442ms and 347ms long tasks on the homepage), which
 * delays any click the user makes — the INP problem. Mounting the iframe only on
 * click keeps that cost off initial page load entirely.
 */
export default function VideoPlayer({ videoId, title, isShort = false }: { videoId: string; title?: string; isShort?: boolean }) {
  const [playing, setPlaying] = useState(false);
  const label = title || 'YouTube video player';

  return (
    <div className={`relative w-full rounded-xl overflow-hidden shadow-2xl border border-brand-light/30 ${
      isShort ? 'aspect-[9/16] max-w-[340px] mx-auto' : 'aspect-video'
    }`}>
      {playing ? (
        <iframe
          className="w-full h-full"
          src={`https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`}
          title={label}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      ) : (
        <button
          type="button"
          onClick={() => setPlaying(true)}
          aria-label={`Play video: ${label}`}
          className="group absolute inset-0 h-full w-full cursor-pointer"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={`https://i.ytimg.com/vi/${videoId}/maxresdefault.jpg`}
            onError={(e) => {
              // maxresdefault doesn't exist for every video — fall back.
              const img = e.currentTarget as HTMLImageElement;
              if (!img.dataset.fallback) {
                img.dataset.fallback = '1';
                img.src = `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`;
              }
            }}
            alt={label}
            loading="lazy"
            className="absolute inset-0 h-full w-full object-cover"
          />
          <span className="absolute inset-0 bg-black/25 transition-colors group-hover:bg-black/10" />
          <span className="absolute left-1/2 top-1/2 flex h-16 w-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-[#FF0000] shadow-lg transition-transform duration-200 group-hover:scale-110">
            <svg viewBox="0 0 24 24" className="ml-1 h-7 w-7 fill-white" aria-hidden="true">
              <path d="M8 5v14l11-7z" />
            </svg>
          </span>
        </button>
      )}
    </div>
  );
}
