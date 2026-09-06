"use client";

import { useState, useEffect } from 'react';
import { parseTimeParam } from '@/lib/videoChapters';

/**
 * YouTube "facade": render the thumbnail + a play button instead of the real
 * <iframe>. The YouTube embed ships a large amount of cross-origin JS and blocks
 * the main thread, which delays interactions (poor INP). Mounting the iframe
 * only on click keeps that cost off initial page load.
 *
 * Thumbnail strategy — IMPORTANT: `maxresdefault.jpg` does not exist for every
 * video, and YouTube returns a 120x90 grey PLACEHOLDER with HTTP 200 (not a 404)
 * when it's missing. So we can't rely on an <img> onError fallback. Instead we
 * default to `hqdefault.jpg`, which always exists at real resolution (480x360),
 * then upgrade to `maxresdefault.jpg` only after confirming it's genuine HD.
 */
export default function VideoPlayer({
  videoId,
  title,
  isShort = false,
  startSeconds,
}: {
  videoId: string;
  title?: string;
  isShort?: boolean;
  /** Start position in seconds. Overridden by a ?t= value in the URL. */
  startSeconds?: number;
}) {
  const [playing, setPlaying] = useState(false);
  const [start, setStart] = useState(startSeconds ?? 0);
  const [thumb, setThumb] = useState(`https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`);
  const label = title || 'YouTube video player';

  /**
   * Key-moments support. The Clip markup on the watch page points each chapter
   * at /our-videos/<slug>?t=<seconds>, and Google requires those URLs to
   * genuinely seek — a clip URL that lands at 0:00 makes the markup
   * non-compliant. So on mount we read ?t= and open the player there directly,
   * skipping the click-to-play facade.
   *
   * Read from window rather than useSearchParams() on purpose: this page is
   * statically generated with ISR, and useSearchParams() would force the route
   * to render dynamically on every request.
   */
  useEffect(() => {
    const apply = (seconds: number | undefined) => {
      if (seconds === undefined || seconds < 0) return;
      setStart(seconds);
      setPlaying(true);
    };

    apply(parseTimeParam(new URLSearchParams(window.location.search).get('t') ?? undefined));

    // Chapter buttons on the page seek without a reload.
    const onSeek = (event: Event) => {
      const detail = (event as CustomEvent<{ seconds?: number }>).detail;
      apply(detail?.seconds);
    };
    window.addEventListener('ps:seek', onSeek);
    return () => window.removeEventListener('ps:seek', onSeek);
  }, [videoId]);

  useEffect(() => {
    // Reset to the always-present thumbnail when the video changes.
    setThumb(`https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`);

    // Probe the HD thumbnail; only upgrade if it's a real image (not the
    // 120x90 grey placeholder YouTube serves when maxres is unavailable).
    const hi = new Image();
    hi.onload = () => {
      if (hi.naturalWidth > 120) {
        setThumb(`https://i.ytimg.com/vi/${videoId}/maxresdefault.jpg`);
      }
    };
    hi.src = `https://i.ytimg.com/vi/${videoId}/maxresdefault.jpg`;
  }, [videoId]);

  return (
    <div className={`relative w-full rounded-xl overflow-hidden shadow-2xl border border-brand-light/30 ${
      isShort ? 'aspect-[9/16] max-w-[340px] mx-auto' : 'aspect-video'
    }`}>
      {playing ? (
        <iframe
          className="w-full h-full"
          src={`https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0${start > 0 ? `&start=${Math.floor(start)}` : ''}`}
          key={start}
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
            src={thumb}
            alt={label}
            className="absolute inset-0 h-full w-full object-cover"
           decoding="async" fetchPriority="high" />
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
