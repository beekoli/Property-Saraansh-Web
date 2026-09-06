"use client";

import type { Chapter } from '@/lib/videoChapters';

/**
 * On-page key moments. Each row is a real link to ?t=<seconds> so it can be
 * copied, opened in a new tab and crawled — the same URLs the Clip markup
 * advertises. A plain click is intercepted and turned into an in-place seek so
 * the visitor is not sent through a full page load.
 */
export default function VideoChapters({
  chapters,
  slug,
}: {
  chapters: Chapter[];
  slug: string;
}) {
  if (chapters.length === 0) return null;

  const seek = (seconds: number) => {
    window.dispatchEvent(new CustomEvent('ps:seek', { detail: { seconds } }));
    window.history.replaceState(null, '', `/our-videos/${slug}?t=${seconds}`);
    document.getElementById('video-player')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };

  return (
    <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-brand-light/10">
      <h2 className="heading-playfair text-xl md:text-2xl font-bold text-brand-ink mb-5">
        Key Moments in This Video
      </h2>
      <ol className="space-y-1">
        {chapters.map((chapter) => (
          <li key={chapter.startOffset}>
            <a
              href={`/our-videos/${slug}?t=${chapter.startOffset}`}
              onClick={(event) => {
                // Let modified clicks (new tab, new window) behave normally.
                if (event.metaKey || event.ctrlKey || event.shiftKey || event.button !== 0) return;
                event.preventDefault();
                seek(chapter.startOffset);
              }}
              className="group flex items-baseline gap-3 rounded-lg px-3 py-2.5 -mx-3 transition-colors hover:bg-brand-pale/40"
            >
              <span className="shrink-0 font-mono text-xs font-semibold text-brand-primary tabular-nums">
                {chapter.label}
              </span>
              <span className="text-sm text-brand-ink/80 group-hover:text-brand-ink">
                {chapter.name}
              </span>
            </a>
          </li>
        ))}
      </ol>
    </div>
  );
}
