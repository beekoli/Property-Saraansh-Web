"use client";

import { useState } from 'react';
import Link from 'next/link';
import BlogCard from '@/components/BlogCard';
import { WPPost, getFeaturedImage } from '@/lib/wordpress';

interface Props {
  initialNews: WPPost[];
}

// Nicely capitalise a WordPress term name for display.
const titleCase = (s: string) =>
  s.replace(/\w\S*/g, (w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase());

// Decode common WordPress HTML entities in title.rendered / excerpt.rendered.
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

// Label a news item by its most specific WordPress category (prefer something
// other than the generic "News"/"Blog" buckets, e.g. "Launches", "Policy").
const getItemCategory = (post: WPPost): string => {
  const terms = post._embedded?.['wp:term']?.[0] || [];
  const names = terms.map((t) => decodeHtml(t.name)).filter(Boolean);
  const specific =
    names.find((n) => !['news', 'blog'].includes(n.toLowerCase())) || 'News';
  return titleCase(specific);
};

export default function NewsClient({ initialNews }: Props) {
  const [activeCategory, setActiveCategory] = useState('All');

  const hasNews = initialNews.length > 0;

  // Build filter tabs from the sub-categories actually present.
  const subCategories = Array.from(new Set(initialNews.map(getItemCategory)));
  const categories = ['All', ...subCategories];
  const showFilters = subCategories.length > 1;

  const filteredNews =
    activeCategory === 'All'
      ? initialNews
      : initialNews.filter(
          (post) => getItemCategory(post).toLowerCase() === activeCategory.toLowerCase()
        );

  const featuredPost = activeCategory === 'All' ? filteredNews[0] : undefined;
  const gridPosts =
    activeCategory === 'All' ? filteredNews.slice(1) : filteredNews;

  // "Updated" line — the date of the newest item in the feed.
  const latestDate = hasNews
    ? new Date(initialNews[0].date).toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      })
    : null;

  return (
    <div className="min-h-screen bg-brand-pale flex flex-col">
      {/* Page Header */}
      <section className="bg-brand-dark pt-32 pb-12 px-4 sm:px-6 lg:px-8 text-center relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: `
              linear-gradient(rgba(212, 169, 106, 0.15) 1px, transparent 1px),
              linear-gradient(90deg, rgba(212, 169, 106, 0.15) 1px, transparent 1px)
            `,
            backgroundSize: '30px 30px',
          }}
        ></div>
        <div className="relative z-10 max-w-4xl mx-auto">
          <span className="inline-flex items-center gap-2 text-brand-accent uppercase tracking-widest text-[10px] md:text-xs font-bold bg-brand-primary/40 px-4 py-2 rounded-full border border-brand-accent/30 mb-5 shadow-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-brand-accent animate-pulse"></span>
            Updated Daily
          </span>
          <h1 className="heading-playfair text-4xl md:text-5xl text-brand-accent mb-4 font-bold">
            Noida Real Estate News
          </h1>
          <div className="w-24 h-0.5 bg-brand-accent mx-auto rounded"></div>
          <p className="text-brand-pale/80 mt-6 text-base md:text-lg font-light leading-relaxed max-w-2xl mx-auto">
            Daily updates on new launches, price movements, RERA &amp; policy changes, and
            infrastructure across Noida, Greater Noida, Noida Extension &amp; the Yamuna Expressway.
          </p>
          {latestDate && (
            <p className="text-brand-pale/50 mt-3 text-xs uppercase tracking-wider">
              Last updated {latestDate}
            </p>
          )}
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex-grow w-full">
        {!hasNews ? (
          /* Empty state — shown until the first news post is published in WordPress */
          <div className="text-center py-24 max-w-xl mx-auto">
            <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-brand-dark flex items-center justify-center">
              <svg className="w-8 h-8 text-brand-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m0 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
              </svg>
            </div>
            <h2 className="heading-playfair text-2xl text-brand-dark font-bold mb-3">
              Daily news is on its way
            </h2>
            <p className="text-brand-ink/70 leading-relaxed mb-8">
              We&apos;re preparing today&apos;s Noida real-estate briefing — new launches, price
              movements and policy updates. Check back shortly, or explore our in-depth analysis in
              the meantime.
            </p>
            <Link
              href="/blog"
              className="btn-primary inline-block text-xs px-8 py-3.5 rounded font-bold shadow-md uppercase tracking-wider"
            >
              Read Our Insights
            </Link>
          </div>
        ) : (
          <>
            {/* Featured (latest) story */}
            {featuredPost && (
              <div className="mb-16">
                <h2 className="text-brand-ink font-bold uppercase tracking-wider text-xs mb-6 flex items-center">
                  <span className="w-8 h-px bg-brand-primary mr-3"></span>
                  Top Story
                </h2>

                <div className="bg-white rounded-2xl overflow-hidden shadow-lg border border-brand-pale flex flex-col lg:flex-row group hover:shadow-xl transition-all">
                  <Link
                    href={`/news/${featuredPost.slug}`}
                    className="lg:w-1/2 relative h-64 lg:h-auto overflow-hidden bg-brand-pale block"
                  >
                    <img
                      src={getFeaturedImage(featuredPost)}
                      alt={decodeHtml(featuredPost.title.rendered)}
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute top-4 left-4 bg-brand-primary text-white text-[10px] uppercase tracking-wider font-bold px-3 py-1 rounded-full shadow">
                      {getItemCategory(featuredPost)}
                    </div>
                  </Link>

                  <div className="lg:w-1/2 p-8 md:p-12 flex flex-col justify-between text-brand-ink">
                    <div>
                      <Link href={`/news/${featuredPost.slug}`} className="block group/link">
                        <h3 className="heading-playfair text-2xl md:text-3xl text-brand-dark mb-4 font-bold leading-tight group-hover/link:text-brand-primary transition-colors">
                          {decodeHtml(featuredPost.title.rendered)}
                        </h3>
                      </Link>
                      <p className="text-brand-dark/70 text-sm md:text-base mb-8 leading-relaxed font-light">
                        {featuredPost.excerpt.rendered.replace(/<[^>]*>?/gm, '').slice(0, 250)}...
                      </p>
                    </div>

                    <div className="flex items-center justify-between mt-auto pt-6 border-t border-brand-pale">
                      <div className="flex items-center">
                        <div className="w-10 h-10 rounded-full bg-brand-pale border border-brand-light mr-3 overflow-hidden">
                          <img src="/saraansh_seth.png" alt="Saraansh Seth" className="w-full h-full object-cover" />
                        </div>
                        <div>
                          <p className="text-xs font-bold text-brand-ink">Property Saraansh Desk</p>
                          <p className="text-[10px] text-brand-light">
                            {new Date(featuredPost.date).toLocaleDateString('en-IN', {
                              day: 'numeric',
                              month: 'long',
                              year: 'numeric',
                            })}
                          </p>
                        </div>
                      </div>
                      <Link
                        href={`/news/${featuredPost.slug}`}
                        className="btn-primary text-xs px-6 py-3 rounded font-bold shadow-md"
                      >
                        Read Full Story
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Category filters (only if there are real sub-categories) */}
            {showFilters && (
              <div className="flex flex-wrap gap-2.5 mb-10 justify-center">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setActiveCategory(category)}
                    className={`px-5 py-2.5 rounded-full text-xs uppercase tracking-wider font-bold transition-all duration-300 shadow-sm ${
                      activeCategory === category
                        ? 'bg-brand-primary text-white shadow-md'
                        : 'bg-white text-brand-primary border border-brand-light/10 hover:border-brand-light'
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            )}

            {/* News grid */}
            {gridPosts.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {gridPosts.map((post) => (
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
            ) : (
              !featuredPost && (
                <div className="text-center py-20 text-brand-ink/60 bg-white border border-brand-light/10 rounded-2xl shadow-sm">
                  <p className="text-lg">
                    No stories found in the &quot;{activeCategory}&quot; category.
                  </p>
                </div>
              )
            )}
          </>
        )}
      </div>
    </div>
  );
}
