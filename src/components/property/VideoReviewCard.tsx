import Link from 'next/link';
import type { PropertyVideoCta } from '@/lib/propertyVideoCta';

const BRAND_GREEN = '#0B3038';

/**
 * "We visited this project" — the property page's one route to the review.
 *
 * Deliberately a link to our own watch page rather than to youtube.com. A
 * visitor reading price and payment plan is the most commercially valuable one
 * on the site, and on a phone a YouTube link opens the app and ends the
 * session. The watch page carries the enquiry form, the Saraansh Verdict and
 * the key moments, and an embedded player still counts the view.
 *
 * Renders nothing when `cta` is null — see getPropertyVideoCta for when that
 * happens. There is deliberately no "video coming soon" placeholder.
 */
export default function VideoReviewCard({ cta }: { cta: PropertyVideoCta | null }) {
  if (!cta) return null;

  const meta = [cta.views, cta.chapterCount > 0 ? `${cta.chapterCount} key moments` : '']
    .filter(Boolean)
    .join(' · ');

  return (
    <section className="pt-9">
      <Link
        href={cta.href}
        aria-label={`Watch our review: ${cta.title}`}
        className="group flex flex-col overflow-hidden rounded-2xl border border-white/10 shadow-sm transition hover:shadow-lg sm:flex-row"
        style={{ background: BRAND_GREEN }}
      >
        <div className="relative w-full shrink-0 overflow-hidden sm:w-[42%]">
          <div className="relative aspect-video w-full sm:h-full">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={cta.thumbnail}
              alt=""
              loading="lazy"
              decoding="async"
              className="absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]"
            />
            <span className="absolute inset-0 bg-[#082126]/25" />
            <span className="absolute left-1/2 top-1/2 flex h-[54px] w-[54px] -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-[#FF0000] shadow-lg transition duration-200 group-hover:scale-110">
              <svg viewBox="0 0 24 24" className="ml-[3px] h-[22px] w-[22px] fill-white" aria-hidden="true">
                <path d="M8 5v14l11-7z" />
              </svg>
            </span>
            {cta.duration && (
              <span className="absolute bottom-2.5 right-2.5 rounded bg-black/80 px-1.5 py-0.5 text-[11.5px] font-bold tabular-nums text-white">
                {cta.duration}
              </span>
            )}
          </div>
        </div>

        <div className="flex flex-1 flex-col justify-center gap-1.5 p-5 sm:p-6">
          <span className="text-[10.5px] font-extrabold uppercase tracking-[0.1em] text-[#D5B37C]">
            We visited this project
          </span>
          {/* A few titles run past 80 characters because they carry no pipe to
              trim at, so clamp rather than let the card grow four lines tall. */}
          <h2 className="heading-playfair line-clamp-2 text-[19px] font-bold leading-snug text-white">
            {cta.title}
          </h2>
          <p className="line-clamp-2 text-[13px] leading-relaxed text-white/80">
            Our honest review — what works, what does not, and the Saraansh Verdict on whether it is
            worth the price.
          </p>
          {meta && <span className="text-[12px] tabular-nums text-white/60">{meta}</span>}
          <span className="mt-1 inline-flex items-center gap-1.5 text-[13.5px] font-extrabold text-[#D5B37C]">
            Watch the full review
            <span aria-hidden="true" className="transition-transform duration-200 group-hover:translate-x-1">
              →
            </span>
          </span>
        </div>
      </Link>
    </section>
  );
}
