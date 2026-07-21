import Link from 'next/link';

interface NewsCardProps {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  date: string;
  thumbnail: string;
}

// Decode common WordPress HTML entities in title.rendered / excerpt.rendered
const decodeHtml = (str: string) =>
  str
    .replace(/&#038;/g, '&')
    .replace(/&amp;/g, '&')
    .replace(/&#8211;/g, '–')
    .replace(/&#8212;/g, '—')
    .replace(/&#8216;/g, '‘')
    .replace(/&#8217;/g, '’')
    .replace(/&#8220;/g, '“')
    .replace(/&#8221;/g, '”');

/**
 * Compact card for daily news items. Deliberately denser than BlogCard
 * (no author/read-time) so the News and Insights sections stay visually distinct.
 */
export default function NewsCard({ slug, title, excerpt, category, date, thumbnail }: NewsCardProps) {
  const published = new Date(date);
  const formattedDate = published.toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

  // Freshness badge for very recent items.
  const dayMs = 24 * 60 * 60 * 1000;
  const daysOld = Math.floor((Date.now() - published.getTime()) / dayMs);
  const relative =
    daysOld <= 0 ? 'Today' : daysOld === 1 ? 'Yesterday' : daysOld < 7 ? `${daysOld} days ago` : null;

  return (
    <Link
      href={`/news/${slug}`}
      className="group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 border border-brand-pale flex flex-col h-full"
    >
      <div className="relative h-40 overflow-hidden bg-brand-pale">
        <div
          className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
          style={{ backgroundImage: `url(${thumbnail})` }}
        ></div>
        <span className="absolute top-3 left-3 bg-brand-dark/90 text-brand-accent text-[10px] uppercase tracking-wider font-bold px-2.5 py-1 rounded shadow-sm">
          {category}
        </span>
      </div>

      <div className="p-4 flex flex-col flex-grow">
        <div className="flex items-center gap-2 mb-2 text-[11px]">
          {relative && (
            <span className="inline-flex items-center gap-1 text-brand-primary font-bold">
              <span className="w-1.5 h-1.5 rounded-full bg-brand-accent animate-pulse"></span>
              {relative}
            </span>
          )}
          <time dateTime={date} className="text-brand-light">
            {formattedDate}
          </time>
        </div>

        <h3 className="text-base font-bold text-brand-ink leading-snug line-clamp-3 mb-2 group-hover:text-brand-primary transition-colors">
          {decodeHtml(title)}
        </h3>

        <p className="text-brand-dark/60 text-xs leading-relaxed line-clamp-2">
          {decodeHtml(excerpt)}
        </p>
      </div>
    </Link>
  );
}
