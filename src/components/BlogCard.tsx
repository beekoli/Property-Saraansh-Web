import Link from 'next/link';

interface BlogCardProps {
  id: string;
  title: string;
  excerpt: string;
  category: string;
  author: string;
  date: string;
  readTime: string;
  thumbnail: string;
  /** Route segment the card links into. Defaults to "blog"; pass "news" for the News section. */
  basePath?: string;
}

// Decode WordPress HTML entities (numeric + common named) in title/excerpt.
const decodeHtml = (str: string) =>
  str
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&nbsp;/g, ' ')
    .replace(/&#x([0-9a-fA-F]+);/g, (_, h) => String.fromCodePoint(parseInt(h, 16)))
    .replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(parseInt(n, 10)));

export default function BlogCard({ id, title, excerpt, category, author, date, readTime, thumbnail, basePath = 'blog' }: BlogCardProps) {
  const formattedDate = new Date(date).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });
  const cleanTitle = decodeHtml(title);
  const cleanExcerpt = decodeHtml(excerpt);
  const href = `/${basePath}/${id}`;

  return (
    <div className="group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 border border-brand-pale flex flex-col h-full">
      <Link href={href} className="relative h-48 overflow-hidden block">
        <div
          className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
          style={{ backgroundImage: `url(${thumbnail})` }}
        ></div>
        <div className="absolute top-4 left-4 bg-brand-primary text-white text-[10px] uppercase tracking-wider font-bold px-3 py-1 rounded-full shadow">
          {category}
        </div>
      </Link>

      <div className="p-5 flex-grow flex flex-col">
        <Link href={href} className="block flex-grow">
          <h3 className="text-xl heading-playfair text-brand-ink mb-2 line-clamp-2 group-hover:text-brand-primary transition-colors">{cleanTitle}</h3>
          <p className="text-brand-dark/70 text-sm line-clamp-2 mb-4 leading-relaxed">
            {cleanExcerpt}
          </p>
        </Link>

        <div className="flex items-center justify-between border-t border-brand-pale pt-4 mt-auto">
          <div className="flex items-center">
            {/* Author avatar — Property Saraansh logo */}
            <div className="w-8 h-8 rounded-full bg-white border border-brand-light mr-2 flex items-center justify-center overflow-hidden">
              <img src="/logo.png" alt="Property Saraansh" className="w-full h-full object-contain p-0.5" loading="lazy" decoding="async" />
            </div>
            <div>
              <p className="text-xs font-semibold text-brand-ink">{author}</p>
              <p className="text-[10px] text-brand-light">{formattedDate}</p>
            </div>
          </div>
          <div className="bg-brand-pale text-brand-primary text-[10px] font-bold px-2 py-1 rounded">
            {readTime}
          </div>
        </div>
      </div>
    </div>
  );
}
