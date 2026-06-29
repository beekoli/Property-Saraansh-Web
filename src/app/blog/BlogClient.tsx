"use client";

import { useState } from 'react';
import Link from 'next/link';
import BlogCard from '@/components/BlogCard';
import { WPPost, getFeaturedImage } from '@/lib/wordpress';

interface Props {
  initialBlogs: WPPost[];
}

const CATEGORIES = ['All', 'Market Trends', 'Investment Tips', 'Area Guides', 'Project Reviews', 'Legal Advice'];

export default function BlogClient({ initialBlogs }: Props) {
  const [activeCategory, setActiveCategory] = useState('All');

  // Filter posts based on category
  // In mock data and WP post embedding, let's categorize them appropriately
  const getPostCategory = (post: WPPost): string => {
    // Check if category name is in title or content for fallbacks
    const text = (post.title.rendered + post.content.rendered).toLowerCase();
    if (text.includes('rera') || text.includes('guideline') || text.includes('legal')) return 'Legal Advice';
    if (text.includes('expressway') || text.includes('project review') || text.includes('residential')) return 'Project Reviews';
    if (text.includes('commercial') || text.includes('investment')) return 'Investment Tips';
    return 'Market Trends';
  };

  const filteredBlogs = activeCategory === 'All'
    ? initialBlogs
    : initialBlogs.filter(post => getPostCategory(post).toLowerCase() === activeCategory.toLowerCase());

  // Use the first post in the full list as the featured article when 'All' is active
  const featuredPost = initialBlogs[0];
  const displayGridPosts = activeCategory === 'All'
    ? filteredBlogs.slice(1) // exclude featured post from the grid
    : filteredBlogs;

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
            backgroundSize: '30px 30px'
          }}
        ></div>
        <div className="relative z-10 max-w-4xl mx-auto">
          <h1 className="heading-playfair text-4xl md:text-5xl text-brand-accent mb-4 font-bold">
            Real Estate Insights & News
          </h1>
          <div className="w-24 h-0.5 bg-brand-accent mx-auto rounded"></div>
          <p className="text-brand-pale/80 mt-6 text-base md:text-lg font-light leading-relaxed max-w-2xl mx-auto">
            Expert analysis, market trends, and legal updates to help you navigate the Noida property market.
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex-grow w-full">
        {/* Featured Post (Only show if 'All' is selected and we have posts) */}
        {activeCategory === 'All' && featuredPost && (
          <div className="mb-16">
            <h2 className="text-brand-ink font-bold uppercase tracking-wider text-xs mb-6 flex items-center">
              <span className="w-8 h-px bg-brand-primary mr-3"></span>
              Featured Article
            </h2>

            <div className="bg-white rounded-2xl overflow-hidden shadow-lg border border-brand-pale flex flex-col lg:flex-row group hover:shadow-xl transition-all">
              <div className="lg:w-1/2 relative h-64 lg:h-auto overflow-hidden bg-brand-pale">
                <img
                  src={getFeaturedImage(featuredPost)}
                  alt={featuredPost.title.rendered}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute top-4 left-4 bg-brand-primary text-white text-[10px] uppercase tracking-wider font-bold px-3 py-1 rounded-full shadow">
                  {getPostCategory(featuredPost)}
                </div>
              </div>

              <div className="lg:w-1/2 p-8 md:p-12 flex flex-col justify-between text-brand-ink">
                <div>
                  <Link href={`/blog/${featuredPost.slug}`} className="block group/link">
                    <h3 className="heading-playfair text-2xl md:text-3xl text-brand-dark mb-4 font-bold leading-tight group-hover/link:text-brand-primary transition-colors">
                      {featuredPost.title.rendered}
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
                      <p className="text-xs font-bold text-brand-ink">Saraansh Seth</p>
                      <p className="text-[10px] text-brand-light">{new Date(featuredPost.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })} • 10 min read</p>
                    </div>
                  </div>
                  <Link
                    href={`/blog/${featuredPost.slug}`}
                    className="btn-primary text-xs px-6 py-3 rounded font-bold shadow-md"
                  >
                    Read Article
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Category Filters */}
        <div className="flex flex-wrap gap-2.5 mb-10 justify-center">
          {CATEGORIES.map(category => (
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

        {/* Blog Grid */}
        {displayGridPosts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {displayGridPosts.map((post) => (
              <BlogCard
                key={post.id}
                id={post.slug}
                title={post.title.rendered}
                excerpt={post.excerpt.rendered.replace(/<[^>]*>?/gm, '')}
                category={getPostCategory(post)}
                author="Saraansh Seth"
                date={post.date}
                readTime="6 min read"
                thumbnail={getFeaturedImage(post)}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 text-brand-ink/60 bg-white border border-brand-light/10 rounded-2xl shadow-sm">
            <p className="text-lg">No articles found matching the &quot;{activeCategory}&quot; category.</p>
          </div>
        )}
      </div>
    </div>
  );
}
