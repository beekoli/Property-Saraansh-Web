import Link from 'next/link';
import Image from 'next/image';

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
  reraNumber?: string;
  possessionDate?: string;
  nearbyLine?: string;
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
  reraNumber,
  possessionDate,
  nearbyLine,
}: PropertyCardProps) {
  const statusBadge = getStatusBadge(possessionDate);
  const videoHref = getVideoHref(id, videoId);

  return (
    <div className="group bg-white rounded-xl overflow-hidden border border-brand-pale hover:border-brand-light transition-all duration-300 hover:-translate-y-1.5 shadow-sm hover:shadow-xl flex flex-col h-full relative">
      {/* Image + Badges */}
      <div className="relative aspect-video overflow-hidden w-full bg-brand-pale">
        <Image
          src={imageUrl}
          alt={title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
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

        {/* Video review badge (bottom-right) */}
        {videoId && (
          <a
            href={videoHref}
            target="_blank"
            rel="noopener noreferrer"
            className="absolute bottom-3 right-3 bg-red-600/90 hover:bg-red-600 text-white px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wide shadow-md flex items-center gap-1 transition-colors"
          >
            ▶ Video Review
          </a>
        )}
      </div>

      {/* Body */}
      <div className="p-5 flex-grow flex flex-col justify-between">
        <div>
          <p className="text-[11px] text-brand-primary font-bold uppercase tracking-wider mb-1 leading-none">{developer}</p>
          <h3 className="text-base font-bold heading-playfair text-brand-ink mb-2 line-clamp-1">{title}</h3>

          <div className="flex items-center text-brand-dark/70 mb-3 text-xs">
            <svg className="w-4 h-4 mr-1 text-brand-light flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span className="line-clamp-1">{location}</span>
          </div>

          <div className="text-base font-bold text-brand-accent mb-3">{price}</div>

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

        <div className="border-t border-brand-pale pt-4 mt-2">
          <div className="flex gap-2">
            <Link
              href={`/properties/${id}`}
              className="flex-[1.4] bg-brand-dark text-white text-center text-xs py-2 px-0 flex items-center justify-center hover:bg-brand-primary transition-colors rounded font-bold shadow-sm"
            >
              View Details
            </Link>
            <a
              href={`https://wa.me/918076178189?text=${encodeURIComponent(`Hi, I am interested in ${title}. Please share more details.`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 bg-[#25D366] hover:bg-[#1ebd59] text-white text-center text-xs py-2 px-0 flex items-center justify-center hover:!text-white transition-colors rounded font-bold shadow-sm"
              aria-label="Chat on WhatsApp"
            >
              WhatsApp
            </a>
            <a
              href="tel:+918076178189"
              className="flex-1 bg-brand-pale text-brand-primary text-center text-xs py-2 px-0 flex items-center justify-center hover:bg-brand-light/10 transition-colors rounded font-bold shadow-sm border border-brand-light/20"
              aria-label="Call now"
            >
              Call
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
