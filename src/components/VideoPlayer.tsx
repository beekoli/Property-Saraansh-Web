"use client";

import { useState, useEffect } from 'react';
// Aliased: this file also uses the DOM `new Image()` constructor below to
// probe the HD thumbnail, and importing the component as `Image` shadows it.
import NextImage from 'next/image';
import { parseTimeParam } from '@/lib/videoChapters';

/**
 * YouTube player with two modes.
 *
 * `eager` — the real <iframe> is in the markup from the first render, before
 * any interaction. Use this on every page that emits VideoObject schema.
 * Googlebot does not click, so a click-to-play facade means the page it
 * renders contains no player at all: Search Console processed a VideoObject on
 * only 7 of ~92 video pages while the facade was universal, despite the markup
 * being valid on all of them. Google's video indexing guidance requires the
 * player to "load at its actual size and position when the page is loaded,
 * without requiring any user interaction". Do not reintroduce the facade on
 * those pages — serving a different page to Googlebot would be cloaking.
 *
 * default (facade) — thumbnail plus a play button, iframe mounted on click.
 * The YouTube embed ships a large amount of cross-origin JS and blocks the
 * main thread, which hurts INP, so pages with no VideoObject to earn keep the
 * cheap version.
 *
 * Thumbnail strategy — IMPORTANT: `maxresdefault.jpg` does not exist for every
 * video, and YouTube returns a 120x90 grey PLACEHOLDER with HTTP 200 (not a
 * 404) when it's missing. So we can't rely on an <img> onError fallback.
 * Instead we default to `hqdefault.jpg`, which always exists at real
 * resolution (480x360), then upgrade only after confirming genuine HD.
 */
export default function VideoPlayer({
  videoId,
  title,
  isShort = false,
  startSeconds,
  eager = false,
}: {
  videoId: string;
  title?: string;
  isShort?: boolean;
  /** Start position in seconds. Overridden by a ?t= value in the URL. */
  startSeconds?: number;
  /** Render the iframe immediately. Required wherever VideoObject is emitted. */
  eager?: boolean;
}) {
  const [playing, setPlaying] = useState(eager);
  const [autoplay, setAutoplay] = useState(false);
  const [start, setStart] = useState(startSeconds ?? 0);
  const [thumb, setThumb] = useState(`https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`);
  const label = title || 'YouTube video player';

  /**
   * Key-moments support. The Clip markup on the watch page points each chapter
   * at /our-videos/<slug>?t=<seconds>, and Google requires those URLs to
   * genuinely seek — a clip URL that lands at 0:00 makes the markup
   * non-compliant.
   *
   * Read from window rather than useSearchParams() on purpose: this page is
   * statically generated with ISR, and useSearchParams() would force the route
   * to render dynamically on every request.
   */
  useEffect(() => {
    const seconds = parseTimeParam(new URLSearchParams(window.location.search).get('t') ?? undefined);
    if (seconds === undefined || seconds < 0) return;
    setStart(seconds);
    setPlaying(true);
    setAutoplay(true);
  }, [videoId]);

  useEffect(() => {
    // The facade is the only thing that uses the poster; skip the probe when
    // the iframe is rendered from the start.
    if (eager) return;

    setThumb(`https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`);

    const hi = new Image();
    hi.onload = () => {
      if (hi.naturalWidth > 120) {
        setThumb(`https://i.ytimg.com/vi/${videoId}/maxresdefault.jpg`);
      }
    };
    hi.src = `https://i.ytimg.com/vi/${videoId}/maxresdefault.jpg`;
  }, [videoId, eager]);

  // Autoplay only when playback was asked for — a timestamp link or a click.
  // A cold eager load renders the player without starting it: browsers block
  // autoplay anyway and it is poor UX.
  const params = new URLSearchParams({ rel: '0', enablejsapi: '1' });
  if (autoplay) params.set('autoplay', '1');
  if (start > 0) params.set('start', String(Math.floor(start)));

  return (
    <div
      className={`relative w-full rounded-xl overflow-hidden shadow-2xl border border-brand-light/30 ${
        isShort ? 'aspect-[9/16] max-w-[340px] mx-auto' : 'aspect-video'
      }`}
    >
      {playing ? (
        <iframe
          key={`${start}-${autoplay}`}
          className="absolute inset-0 h-full w-full"
          src={`https://www.youtube-nocookie.com/embed/${videoId}?${params.toString()}`}
          title={label}
          loading="eager"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
        />
      ) : (
        <button
          type="button"
          onClick={() => {
            setPlaying(true);
            setAutoplay(true);
          }}
          aria-label={`Play video: ${label}`}
          className="group absolute inset-0 h-full w-full cursor-pointer"
        >
          {/* priority: this poster is the LCP element where the facade is used. */}
          <NextImage
            src={thumb}
            alt={label}
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 70vw"
            className="object-cover"
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
