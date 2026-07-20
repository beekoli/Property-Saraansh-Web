import { Metadata } from 'next';
import { generateRankMathMetadata, FRONTEND_URL, parseDateToISO8601 } from '@/lib/seo';
import { getNewsBySlug, getLatestNews, getFeaturedImage } from '@/lib/wordpress';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import BlogCard from '@/components/BlogCard';
import WhatsAppIcon from '@/components/icons/WhatsAppIcon';

export const revalidate = 60; // Revalidate every minute — news updates daily

interface PageProps {
  params: Promise<{ slug: string }>;
}

// Decode common WordPress HTML entities (e.g. &amp; -> &).
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

const titleCaseCat = (s: string) =>
  s.replace(/\w\S*/g, (w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase());

function getItemCategory(post: { _embedded?: { 'wp:term'?: Array<Array<{ name: string }>> } }): string {
  const terms = post._embedded?.['wp:term']?.[0] || [];
  const names = terms.map((t) => t.name).filter(Boolean);
  const specific = names.find((n) => !['news', 'blog'].includes(n.toLowerCase())) || 'News';
  return titleCaseCat(specific);
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const news = await getNewsBySlug(slug);

  if (!news) {
    return { title: 'Story Not Found' };
  }

  const fallbackTitle = `${news.title.rendered.replace(/&#038;|&amp;/g, '&')} | Property Saraansh News`;
  const fallbackDesc =
    news.excerpt?.rendered?.replace(/<[^>]*>?/gm, '').slice(0, 150) || `Read ${news.title.rendered}`;

  const seoJson = news.rank_math_json || news.yoast_head_json;
  const meta = generateRankMathMetadata(seoJson, fallbackTitle, fallbackDesc);

  if (!meta.openGraph) {
    meta.openGraph = { title: fallbackTitle, description: fallbackDesc, siteName: 'Property Saraansh', locale: 'en_IN' };
  }
  (meta.openGraph as { type?: string }).type = 'article';

  // News is a brand-new route with no legacy URLs, so the canonical is simply
  // the /news/[slug] path (no trailing slash).
  meta.alternates = {
    ...meta.alternates,
    canonical: `${FRONTEND_URL}/news/${slug}`,
  };

  return meta;
}

export default async function NewsArticlePage({ params }: PageProps) {
  const { slug } = await params;
  const news = await getNewsBySlug(slug);

  if (!news) {
    notFound();
  }

  // Related news (exclude current).
  const allNews = await getLatestNews(4);
  const relatedNews = allNews.filter((n) => n.slug !== slug).slice(0, 3);

  const featuredImg = getFeaturedImage(news);
  const displayDate = new Date(news.date).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  // NewsArticle schema — signals timely, editorial reporting to Google.
  const newsJsonLd: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'NewsArticle',
    headline: decodeHtml(news.title.rendered).slice(0, 110),
    description:
      news.excerpt?.rendered?.replace(/<[^>]*>?/gm, '').trim().slice(0, 200) ||
      decodeHtml(news.title.rendered),
    ...(featuredImg ? { image: [featuredImg] } : {}),
    datePublished: parseDateToISO8601(news.date),
    dateModified: parseDateToISO8601(news.modified || news.date),
    author: { '@type': 'Organization', name: 'Property Saraansh', url: FRONTEND_URL },
    publisher: {
      '@type': 'Organization',
      name: 'Property Saraansh',
      url: FRONTEND_URL,
      logo: { '@type': 'ImageObject', url: `${FRONTEND_URL}/logo.png` },
    },
    mainEntityOfPage: { '@type': 'WebPage', '@id': `${FRONTEND_URL}/news/${slug}` },
  };

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: FRONTEND_URL },
      { '@type': 'ListItem', position: 2, name: 'News', item: `${FRONTEND_URL}/news` },
      {
        '@type': 'ListItem',
        position: 3,
        name: news.title.rendered.replace(/<[^>]*>/g, ''),
        item: `${FRONTEND_URL}/news/${slug}`,
      },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(newsJsonLd) }} />

      <div className="bg-brand-pale/40 min-h-screen pb-20">
        {/* Hero */}
        <section className="bg-brand-dark text-white pt-32 pb-16 px-4 text-center relative overflow-hidden border-b border-brand-accent/20">
          <div
            className="absolute inset-0 opacity-[0.03]"
            style={{ backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)', backgroundSize: '20px 20px' }}
          ></div>
          <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-brand-light/10 rounded-full blur-[120px] pointer-events-none"></div>

          <div className="max-w-4xl mx-auto relative z-10">
            <div className="flex items-center justify-center gap-3 mb-6">
              <span className="text-brand-accent uppercase tracking-widest text-[10px] md:text-xs font-bold bg-brand-primary/40 px-4 py-2 rounded-full border border-brand-accent/30 inline-block shadow-sm backdrop-blur-sm">
                {getItemCategory(news)}
              </span>
            </div>
            <h1 className="text-2xl md:text-4xl lg:text-5xl font-bold heading-playfair leading-tight mb-6 text-white uppercase tracking-tight max-w-4xl mx-auto">
              {decodeHtml(news.title.rendered)}
            </h1>
            <div className="flex items-center justify-center gap-3 text-xs md:text-sm text-brand-pale/80 font-semibold uppercase tracking-wider">
              <span className="text-brand-accent font-bold">Property Saraansh Desk</span>
              <span className="w-1.5 h-1.5 rounded-full bg-brand-accent/40"></span>
              <span>{displayDate}</span>
            </div>
          </div>
        </section>

        {/* Article */}
        <div className="max-w-4xl mx-auto px-4 py-12 relative z-20">
          <div className="bg-white rounded-3xl p-6 md:p-12 shadow-xl border border-brand-light/10">
            {/* Back to all news */}
            <Link
              href="/news"
              className="inline-flex items-center gap-1.5 text-brand-primary hover:text-brand-accent text-xs font-bold uppercase tracking-wider mb-8 transition-colors"
            >
              <span aria-hidden="true">←</span> All News
            </Link>

            {featuredImg && (
              <div className="mb-10 -mx-6 md:-mx-12 -mt-6 md:-mt-12">
                <img
                  src={featuredImg}
                  alt={decodeHtml(news.title.rendered)}
                  className="w-full h-56 md:h-96 object-cover rounded-t-3xl"
                />
              </div>
            )}

            <article className="prose prose-lg max-w-none text-brand-ink leading-relaxed">
              <div
                className="blog-content font-normal text-base md:text-lg space-y-6 md:space-y-8
                  text-[#2C3E50] leading-[1.75] md:leading-[1.85]
                  [&_img]:max-w-full [&_img]:h-auto [&_img]:rounded-xl md:[&_img]:rounded-2xl [&_img]:shadow-lg [&_img]:my-8 [&_figure]:max-w-full [&_figure]:mx-0 [&_figure]:my-8 [&_iframe]:max-w-full
                  prose-headings:heading-playfair prose-headings:text-[#1A252F] prose-headings:font-extrabold prose-headings:mt-10 prose-headings:md:mt-12 prose-headings:mb-4 prose-headings:md:mb-6
                  prose-h2:text-2xl prose-h2:md:text-3xl lg:prose-h2:text-4xl prose-h2:border-b-2 prose-h2:border-brand-accent/20 prose-h2:pb-3 md:prose-h2:pb-4
                  prose-h3:text-xl prose-h3:md:text-2xl lg:prose-h3:text-3xl prose-h3:text-brand-primary
                  prose-p:mb-6 md:prose-p:mb-8 prose-p:tracking-normal md:prose-p:tracking-wide
                  prose-strong:font-bold prose-strong:text-[#111827]
                  prose-blockquote:border-l-[4px] md:prose-blockquote:border-l-[6px] prose-blockquote:border-brand-accent prose-blockquote:pl-4 md:prose-blockquote:pl-8 prose-blockquote:text-[#34495E] prose-blockquote:italic prose-blockquote:my-8
                  prose-a:text-brand-accent prose-a:font-semibold prose-a:underline prose-a:decoration-2 prose-a:underline-offset-4 hover:prose-a:text-brand-primary hover:prose-a:decoration-brand-primary transition-all
                  prose-ol:list-decimal prose-ol:pl-6 md:prose-ol:pl-8 prose-ol:mb-6 md:prose-ol:mb-8 prose-ol:space-y-3 md:prose-ol:space-y-4 prose-ol:marker:text-brand-primary prose-ol:marker:font-bold
                  prose-figcaption:text-center prose-figcaption:text-xs md:prose-figcaption:text-sm prose-figcaption:text-brand-light prose-figcaption:mt-2 md:prose-figcaption:mt-3 prose-figcaption:italic
                "
                dangerouslySetInnerHTML={{ __html: news.content.rendered }}
              />

              {/* Consultation CTA */}
              <div className="not-prose mt-12 p-6 md:p-8 rounded-2xl bg-gradient-to-br from-brand-dark to-brand-primary border border-brand-accent/30 shadow-lg text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-brand-accent/5 rounded-full blur-2xl pointer-events-none"></div>
                <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                  <div>
                    <h3 className="heading-playfair text-lg md:text-xl font-bold text-white mb-2">
                      Want the full picture on this project or micro-market?
                    </h3>
                    <p className="text-xs md:text-sm text-brand-pale/90 max-w-xl font-light leading-relaxed">
                      Get unbiased, RERA-backed guidance directly from Noida&apos;s real estate expert, Saraansh Seth.
                    </p>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-3 shrink-0">
                    <a
                      href={`https://wa.me/918076178189?text=Hi%20Saraansh,%20I%20read%20your%20news%20update%20"${encodeURIComponent(
                        news.title.rendered
                      )}"%20and%20want%20a%20free%20consultation.`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-glossy-whatsapp px-5 py-3 text-center rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2"
                    >
                      <WhatsAppIcon className="w-4 h-4" />
                      WhatsApp Chat
                    </a>
                    <a
                      href="tel:+918076178189"
                      className="px-5 py-3 text-center border border-brand-accent/60 hover:bg-brand-accent hover:text-brand-dark rounded-xl text-xs font-bold uppercase tracking-wider transition-colors duration-200 flex items-center justify-center gap-2"
                    >
                      Call Now
                    </a>
                  </div>
                </div>
              </div>
            </article>
          </div>
        </div>

        {/* Related news */}
        {relatedNews.length > 0 && (
          <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-20 pt-16 border-t border-brand-light/20">
            <h2 className="heading-playfair text-2xl md:text-3xl font-bold mb-10 text-brand-dark text-center">
              More Noida Real Estate News
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {relatedNews.map((post) => (
                <BlogCard
                  key={post.id}
                  id={post.slug}
                  basePath="news"
                  title={post.title.rendered}
                  excerpt={post.excerpt.rendered.replace(/<[^>]*>?/gm, '')}
                  category={getItemCategory(post)}
                  author="Property Saraansh Desk"
                  date={post.date}
                  readTime="2 min read"
                  thumbnail={getFeaturedImage(post)}
                />
              ))}
            </div>
          </section>
        )}
      </div>
    </>
  );
}

export async function generateStaticParams() {
  const news = await getLatestNews(100);
  return news.map((post) => ({ slug: post.slug }));
}
