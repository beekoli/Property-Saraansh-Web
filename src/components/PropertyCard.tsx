import Link from 'next/link';
import Image from 'next/image';
import WhatsAppIcon from '@/components/icons/WhatsAppIcon';
import { decodeHtml } from '@/lib/decodeHtml';

interface PropertyCardProps {
  id: string;
  title: string;
  developer?: string;
  location: string;
  price: string;
  type: string;
  imageUrl: string;
  bhk?: string[];
  videoId?: string;
  /** True when the embedded video is the developer's walkthrough, not a Property Saraansh review. */
  isWalkthrough?: boolean;
  reraNumber?: string;
  possessionDate?: string;
  /**
   * Pre-formatted "Launched Oct 2025". Null whenever the WordPress value is
   * missing or is prose rather than a clean date — the card simply omits the
   * line rather than printing something the data does not support.
   */
  launchLine?: string | null;
  /**
   * Renders the pre-launch variant: a PRE-LAUNCH badge, the expected-launch
   * line in place of a launch date, price withheld, and the WhatsApp button
   * reframed as Register Interest. Used only for projects with no RERA
   * registration, so the card must not assert a price or a firm date.
   */
  preLaunch?: boolean;
  nearbyLine?: string;
  /**
   * Set on the first row of cards. next/image lazy-loads by default, which
   * delays the LCP element on /properties and the homepage until after
   * hydration; priority preloads it instead.
   */
  priority?: boolean;
}

// Brand green pill — all informational badges share one consistent style
const BADGE_CLS = 'bg-[#0B3038] text-white px-2.5 py-1 rounded text-[10px] font-bold tracking-wide shadow-md uppercase';

function getStatusBadge(possessionDate?: string): { label: string } | null {
  if (!possessionDate) return null;
  const p = possessionDate.toLowerCase();
  if (p.includes('ready')) return { label: 'READY TO MOVE' };
  if (p.includes('launch')) return { label: 'NEW LAUNCH' };
  if (/20\d{2}/.test(p) || p.includes('construction')) return { label: 'UNDER CONSTRUCTION' };
  return null;
}

function getVideoHref(id: string, videoId?: string): string {
  if (!videoId) return `/properties/${id}?video=1`;
  if (videoId.includes('youtube.com/watch?v=')) return `https://www.youtube.com/watch?v=${videoId.split('v=')[1].split('&')[0]}`;
  if (videoId.includes('youtu.be/')) return `https://www.youtube.com/watch?v=${videoId.split('youtu.be/')[1].split('?')[0]}`;
  return `https://www.youtube.com/watch?v=${videoId}`;
}

export default function PropertyCard({
  id,
  title,
  developer,
  location,
  price,
  type,
  imageUrl,
  bhk = [],
  videoId,
  isWalkthrough = false,
  reraNumber,
  possessionDate,
  launchLine,
  preLaunch = false,
  nearbyLine,
  priority = false,
}: PropertyCardProps) {
  // A pre-launch project has no registration, so possession-derived status
  // ("Ready to Move", "Under Construction") would be misleading.
  const statusBadge = preLaunch ? { label: 'PRE-LAUNCH' } : getStatusBadge(possessionDate);
  const videoHref = getVideoHref(id, videoId);
  const displayTitle = decodeHtml(title);
  const displayDeveloper = decodeHtml(developer || '');
  // Nothing about an unregistered project is firm enough to quote a price on.
  const displayPrice = preLaunch ? 'Price on Request' : price;
  const enquiryText = preLaunch
    ? `Hi, I would like to register my interest in ${displayTitle}. Please keep me updated on the launch.`
    : `Hi, I am interested in ${displayTitle}. Please share more details.`;

  return (
    <div className="group isolate bg-white rounded-xl overflow-hidden border border-brand-pale hover:border-brand-light transition-all duration-300 hover:-translate-y-1.5 shadow-sm hover:shadow-xl flex flex-col h-full relative">
      {/* Full-card click target → property detail page.
          Non-interactive areas (image, text) have pointer-events-none so clicks
          fall through to this overlay; the action buttons re-enable pointer events. */}
      <Link
        href={`/properties/${id}`}
        aria-label={`View details for ${displayTitle}`}
        className="absolute inset-0 z-0"
      />

      {/* Image + Badges */}
      <div className="relative aspect-video overflow-hidden w-full bg-brand-pale pointer-events-none">
        <Image
          src={imageUrl}
          alt={displayTitle}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          priority={priority}
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />

        {/* Top-left badge stack: Type + Status + RERA — unified brand green */}
        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5 max-w-[85%]">
          <span className={BADGE_CLS}>
            {type}
          </span>
          {statusBadge && (
            <span className={BADGE_CLS}>
              {statusBadge.label}
            </span>
          )}
          {reraNumber && (
            <span className={BADGE_CLS}>
              RERA ✓
            </span>
          )}
        </div>

        {/* Video review badge (bottom-right) — independent action, above the overlay */}
        {videoId && (
          <a
            href={videoHref}
            target="_blank"
            rel="noopener noreferrer"
            className="pointer-events-auto absolute bottom-3 right-3 z-10 bg-red-600/90 hover:bg-red-600 text-white px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wide shadow-md flex items-center gap-1 transition-colors"
          >
            ▶ {isWalkthrough ? 'Walkthrough' : 'Video Review'}
          </a>
        )}
      </div>

      {/* Body */}
      <div className="p-5 flex-grow flex flex-col justify-between pointer-events-none">
        <div>
          <p className="text-[11px] text-brand-primary font-bold uppercase tracking-wider mb-1 leading-none">{displayDeveloper}</p>
          <h3 className="text-base font-bold heading-playfair text-brand-ink mb-2 line-clamp-1">{displayTitle}</h3>

          <div className="flex items-center text-brand-dark/70 mb-3 text-xs">
            <svg className="w-4 h-4 mr-1 text-brand-light flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span className="line-clamp-1">{location}</span>
          </div>

          <div className="text-base font-bold text-brand-accent mb-3">{displayPrice}</div>

          {launchLine && (
            <div className="flex items-center text-brand-dark/60 mb-3 text-[11px]">
              <svg className="w-3.5 h-3.5 mr-1 text-brand-light flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span>{launchLine}</span>
            </div>
          )}

          <div className="flex flex-wrap gap-1.5 mb-3">
            {bhk.map((item, index) => (
              <span key={index} className="bg-brand-pale text-brand-primary text-[10px] px-2.5 py-1 rounded-full font-bold uppercase tracking-wider">
                {item}
              </span>
            ))}
          </div>

          {nearbyLine && (
            <div className="text-[11px] text-brand-dark/60 border-t border-dashed border-brand-pale pt-2 mb-1 line-clamp-1">
              {nearbyLine}
            </div>
          )}
        </div>

        {/* Actions — independent of the card link (pointer events re-enabled, above overlay) */}
        <div className="border-t border-brand-pale pt-4 mt-2">
          <div className="pointer-events-auto relative z-10 flex gap-2">
            <a
              href={`https://wa.me/918076178189?text=${encodeURIComponent(enquiryText)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 bg-[#25D366] hover:bg-[#1ebd59] text-white text-center text-xs py-2.5 px-0 flex items-center justify-center gap-1.5 hover:!text-white transition-colors rounded font-bold shadow-sm"
              aria-label={preLaunch ? `Register interest in ${displayTitle}` : 'Chat on WhatsApp'}
            >
              <WhatsAppIcon className="w-4 h-4" />
              {preLaunch ? 'Register Interest' : 'WhatsApp'}
            </a>
            <a
              href="tel:+918076178189"
              className="flex-1 bg-brand-pale text-brand-primary text-center text-xs py-2.5 px-0 flex items-center justify-center hover:bg-brand-light/10 transition-colors rounded font-bold shadow-sm border border-brand-light/20"
              aria-label="Call now"
            >
              📞 Call
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
