import { Metadata } from 'next';
import { generateRankMathMetadata, getRewrittenSchema, FRONTEND_URL, parseDateToISO8601, durationToISO8601 } from '@/lib/seo';
import { getBlogBySlug, getLatestBlogs, getFeaturedImage } from '@/lib/wordpress';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import VideoPlayer from '@/components/VideoPlayer';
import { getVideoByYoutubeId } from '@/lib/videos';
import BlogCard from '@/components/BlogCard';
import FAQSection from '@/components/blog/FAQSection';
import TableOfContents from '@/components/blog/TableOfContents';
import { blogFAQs, generateFAQSchema } from '@/lib/blogFaqs';

export const revalidate = 60; // Revalidate every minute

interface PageProps {
  params: Promise<{ slug: string }>;
}

// Decode common WordPress HTML entities (e.g. &amp; -> &) so titles don't show raw entity codes.
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

// Label a post by its actual WordPress category (prefer a specific one over the generic "Blog").
const titleCaseCat = (s: string) => s.replace(/\w\S*/g, w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase());
function getPostCategory(post: { _embedded?: { 'wp:term'?: Array<Array<{ name: string }>> } }): string {
  const terms = post._embedded?.['wp:term']?.[0] || [];
  const names = terms.map(t => t.name).filter(Boolean);
  const specific = names.find(n => n.toLowerCase() !== 'blog') || names[0] || 'Insights';
  return titleCaseCat(specific);
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const blog = await getBlogBySlug(slug);

  if (!blog) {
    return {
      title: 'Article Not Found',
    };
  }

  const fallbackTitle = `${blog.title.rendered.replace(/&#038;|&amp;/g, '&')} | Property Saraansh`;
  const fallbackDesc = blog.excerpt?.rendered?.replace(/<[^>]*>?/gm, '').slice(0, 150) || `Read ${blog.title.rendered}`;

  // Prefer RankMath JSON, fallback to Yoast
  const seoJson = blog.rank_math_json || blog.yoast_head_json;

  const meta = generateRankMathMetadata(seoJson, fallbackTitle, fallbackDesc);

  // Force og:type = "article" for all blog posts (SEO plugins sometimes return "website")
  // Also initialise openGraph if generateRankMathMetadata returned none (e.g. rank_math_json is null)
  if (!meta.openGraph) {
    meta.openGraph = { title: fallbackTitle, description: fallbackDesc, siteName: 'Property Saraansh', locale: 'en_IN' };
  }
  (meta.openGraph as { type?: string }).type = 'article';

  // Ensure the canonical URL points to the correct frontend route /blog/[slug]
  // and has NO trailing slash (Next.js serves without trailing slash by default).
  if (meta.alternates?.canonical) {
    const canonicalStr = typeof meta.alternates.canonical === 'string'
      ? meta.alternates.canonical
      : meta.alternates.canonical.toString();

    if (!canonicalStr.includes('/blog/')) {
      try {
        const urlObj = new URL(canonicalStr);
        // Strip trailing slash from pathname before constructing the canonical
        const cleanPath = urlObj.pathname.replace(/\/$/, '');
        meta.alternates.canonical = `${urlObj.origin}/blog${cleanPath}${urlObj.search}`;
      } catch (e) {
        meta.alternates.canonical = `${FRONTEND_URL}/blog/${slug}`;
      }
    } else {
      // Already has /blog/ — just strip any trailing slash
      meta.alternates.canonical = canonicalStr.replace(/\/$/, '');
    }
  } else {
    meta.alternates = {
      ...meta.alternates,
      canonical: `${FRONTEND_URL}/blog/${slug}`,
    };
  }

  return meta;
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params;
  const blog = await getBlogBySlug(slug);

  if (!blog) {
    notFound();
  }

  // Fetch related posts (exclude current)
  const allBlogs = await getLatestBlogs(4);
  const relatedBlogs = allBlogs.filter(b => b.slug !== slug).slice(0, 3);

  // Dynamically resolve video ID from post ACF field, falling back to slug-based or a signature review video
  // Video ID priority: WordPress backend field (ps_video_id) → ACF field → slug rule → default.
  const acfVideoId = blog.ps_video_id?.trim().replace(/[?&].*$/, '') || blog.acf?.video_id?.trim().replace(/[?&].*$/, '');
  let relatedVideoId = acfVideoId || "xicR-MeU77g"; // Noida Property Market 2025 as fallback
  // Slug-based overrides — always apply to correct known-wrong ACF values
  if (slug.includes('noida-residents') || slug.includes('nobody-talks')) {
    relatedVideoId = "z-nxbCBtffY"; // Things Nobody Talks About Noida Residents
  } else if (slug === 'noida-real-estate-2026-dasnac-arc-fairfox-eon') {
    relatedVideoId = "LJo0YtPpTnY"; // Commercial: Builder Lease vs Self Lease
  } else if (slug.includes('godrej-arden-detailed-review')) {
    relatedVideoId = "tWk2i0WUqiY"; // Godrej Arden Sigma 3 Review
  } else if (!acfVideoId) {
    if (slug.includes('noida-real-estate-market-2026-slowdown') || slug.includes('slowdown-investment-opportunities') || slug === 'noida-real-estate-slowdown-2026') {
      relatedVideoId = "g2dN6stL3i0"; // Noida Market Slowdown 2026
    } else if (slug.includes('yamuna-expressway')) {
      relatedVideoId = "qWAgkIW6Mj0"; // Yamuna Expressway Investment 2030
    } else if (slug.includes('commercial')) {
      relatedVideoId = "41xfVmmczUA"; // Commercial: Builder Lease vs Self Lease
    } else if (slug.includes('eldeco')) {
      relatedVideoId = "hCyx0D2_RzE"; // Eldeco 7 Peaks Residences
    } else if (slug.includes('why-exit') || slug.includes('exit-has-become')) {
      relatedVideoId = "9iAnowOVwjo"; // Exit Advice: Ace Terra, Godrej Tropical Isle, Ace Hanei
    } else if (slug.includes('2025-conclusion') || slug.includes('reality-check')) {
      relatedVideoId = "xicR-MeU77g"; // Noida Property Market 2025: What Worked & What Failed
    } else if (slug.includes('dasnac') || slug.includes('fairfox')) {
      relatedVideoId = "YKWtYdh_4dQ"; // Noida Property Market Reality
    }
  }

  // Resolve the canonical watch page for the embedded video (if it exists in
  // our video library) so we can add an internal link to its canonical home.
  const watchPageVideo = getVideoByYoutubeId(relatedVideoId);
  const watchPageHref = watchPageVideo ? `/our-videos/${watchPageVideo.slug}` : null;

  // VideoObject schema for the embedded video guide so Google can surface a
  // video rich result (thumbnail) for this blog. We build it from our video
  // library when the video exists there (real title/description/duration),
  // and fall back to blog + YouTube data otherwise.
  const videoThumb = watchPageVideo?.thumbnail || `https://i.ytimg.com/vi/${relatedVideoId}/maxresdefault.jpg`;
  const videoJsonLd: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "VideoObject",
    "name": watchPageVideo?.title || decodeHtml(blog.title.rendered),
    "description":
      watchPageVideo?.description ||
      blog.excerpt?.rendered?.replace(/<[^>]*>?/gm, '').trim().slice(0, 200) ||
      decodeHtml(blog.title.rendered),
    "thumbnailUrl": [videoThumb],
    "uploadDate": parseDateToISO8601(watchPageVideo?.publishedAt || blog.date),
    ...(watchPageVideo?.duration ? { "duration": durationToISO8601(watchPageVideo.duration) } : {}),
    "contentUrl": `https://www.youtube.com/watch?v=${relatedVideoId}`,
    "embedUrl": `https://www.youtube.com/embed/${relatedVideoId}`,
    "url": `${FRONTEND_URL}/blog/${slug}`,
    "publisher": {
      "@type": "Organization",
      "name": "Property Saraansh",
      "url": FRONTEND_URL,
      "logo": { "@type": "ImageObject", "url": `${FRONTEND_URL}/logo.png` }
    },
    "author": { "@type": "Person", "name": "Saraansh Seth", "url": `${FRONTEND_URL}/about-us` }
  };

  // BlogPosting (Article) schema — signals editorial authorship, date, publisher.
  const featuredImg = getFeaturedImage(blog);
  const articleJsonLd: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": decodeHtml(blog.title.rendered).slice(0, 110),
    "description":
      blog.excerpt?.rendered?.replace(/<[^>]*>?/gm, '').trim().slice(0, 200) ||
      decodeHtml(blog.title.rendered),
    ...(featuredImg ? { "image": [featuredImg] } : {}),
    "datePublished": parseDateToISO8601(blog.date),
    "dateModified": parseDateToISO8601(blog.modified || blog.date),
    "author": { "@type": "Person", "name": "Saraansh Seth", "url": `${FRONTEND_URL}/about-us` },
    "publisher": {
      "@type": "Organization",
      "name": "Property Saraansh",
      "url": FRONTEND_URL,
      "logo": { "@type": "ImageObject", "url": `${FRONTEND_URL}/logo.png` }
    },
    "mainEntityOfPage": { "@type": "WebPage", "@id": `${FRONTEND_URL}/blog/${slug}` }
  };

  const seoJson = blog.rank_math_json || blog.yoast_head_json;
  let rankMathSchema = getRewrittenSchema(seoJson);
  if (rankMathSchema) {
    const oldUrl = `${FRONTEND_URL}/${slug}`;
    const newUrl = `${FRONTEND_URL}/blog/${slug}`;
    rankMathSchema = rankMathSchema.replace(new RegExp(oldUrl.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), newUrl);
  }

  // FAQs for this blog post (if any)
  const faqs = blogFAQs[slug] || [];
  const faqSchema = faqs.length > 0 ? generateFAQSchema(faqs) : null;

  // BreadcrumbList schema for all blog posts
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Home", "item": FRONTEND_URL },
      { "@type": "ListItem", "position": 2, "name": "Blog", "item": `${FRONTEND_URL}/blog` },
      { "@type": "ListItem", "position": 3, "name": blog.title.rendered.replace(/<[^>]*>/g, ''), "item": `${FRONTEND_URL}/blog/${slug}` }
    ]
  };

  return (
    <>
      {rankMathSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: rankMathSchema }}
        />
      )}
      {faqSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      )}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(videoJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />
      <div className="bg-brand-pale/40 min-h-screen pb-20">

        {/* Modern Premium Hero Banner */}
        <section className="bg-brand-dark text-white pt-32 pb-16 px-4 text-center relative overflow-hidden border-b border-brand-accent/20">
          {/* Subtle Background Pattern */}
          <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
          <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-brand-light/10 rounded-full blur-[120px] pointer-events-none"></div>

          <div className="max-w-4xl mx-auto relative z-10">
            <span className="text-brand-accent uppercase tracking-widest text-[10px] md:text-xs font-bold bg-brand-primary/40 px-4 py-2 rounded-full border border-brand-accent/30 inline-block mb-6 shadow-sm backdrop-blur-sm">
              {getPostCategory(blog)}
            </span>
            <h1 className="text-2xl md:text-4xl lg:text-5xl font-bold heading-playfair leading-tight mb-6 text-white uppercase tracking-tight max-w-4xl mx-auto">
              {decodeHtml(blog.title.rendered)}
            </h1>
            <div className="flex items-center justify-center gap-3 text-xs md:text-sm text-brand-pale/80 font-semibold uppercase tracking-wider">
              <span className="text-brand-accent font-bold">By Saraansh Seth</span>
              <span className="w-1.5 h-1.5 rounded-full bg-brand-accent/40"></span>
              <span>{blog.date}</span>
              <span className="w-1.5 h-1.5 rounded-full bg-brand-accent/40"></span>
              <span>6 min read</span>
            </div>
          </div>
        </section>

        {/* Article Content Container */}
        <div className="max-w-4xl mx-auto px-4 py-12 relative z-20">
          <div className="bg-white rounded-3xl p-6 md:p-12 shadow-xl border border-brand-light/10">

            {/* Conversion CTA Banner (Above the Fold) */}
            <div className="mb-8 p-6 md:p-8 rounded-2xl bg-gradient-to-br from-brand-dark to-brand-primary border border-brand-accent/30 shadow-lg text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-brand-accent/5 rounded-full blur-2xl pointer-events-none"></div>
              <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                  <span className="inline-block bg-brand-accent text-brand-dark px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider mb-2">
                    Free Strategy Session
                  </span>
                  <h3 className="heading-playfair text-lg md:text-xl font-bold text-white mb-2">
                    Confused About Noida Real Estate?
                  </h3>
                  <p className="text-xs md:text-sm text-brand-pale/90 max-w-xl font-light leading-relaxed">
                    Get unbiased, RERA-backed advice directly from Noida&apos;s real estate expert, Saraansh Seth.
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row gap-3 shrink-0">
                  <a
                    href={`https://wa.me/918076178189?text=Hi%20Saraansh,%20I%20read%20your%20blog%20about%20${encodeURIComponent(blog.title.rendered)}%20and%20want%20to%20book%20a%20free%20consultation.`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-glossy-whatsapp px-5 py-3 text-center rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2"
                  >
                    <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                    </svg>
                    WhatsApp Chat
                  </a>
                  <a
                    href="tel:+918076178189"
                    className="px-5 py-3 text-center border border-brand-accent/60 hover:bg-brand-accent hover:text-brand-dark rounded-xl text-xs font-bold uppercase tracking-wider transition-colors duration-200 flex items-center justify-center gap-2"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.94.725l.548 2.2a1 1 0 01-.321.988l-1.305.98a10.582 10.582 0 004.872 4.872l.98-1.305a1 1 0 01.988-.321l2.2.548a1 1 0 01.725.94V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    Call Now
                  </a>
                </div>
              </div>
            </div>

            {/* Video Guide — placed FIRST (above TOC) so the video is the
                prominent lead element for engagement and video SEO */}
            <div className="mb-10 bg-brand-dark text-white rounded-3xl p-6 md:p-8 shadow-xl border border-brand-primary">
              <h2 className="heading-playfair text-xl md:text-2xl font-bold text-brand-accent mb-6 flex items-center gap-2.5 border-b border-brand-light/20 pb-3 uppercase tracking-wide">
                <span className="w-1.5 h-6 bg-brand-accent rounded-full"></span>
                ▶ Watch the Video Guide
              </h2>
              <div className="bg-[#09221D] p-2 rounded-xl shadow-inner border border-brand-primary/30 overflow-hidden">
                <VideoPlayer videoId={relatedVideoId} title={blog.title.rendered} />
              </div>
              <div className="mt-5 bg-brand-primary/40 border-l-4 border-brand-accent p-4 rounded-r-xl">
                <p className="text-brand-pale text-xs md:text-sm font-light italic leading-relaxed">
                  Watch the full site analysis and ground reality review. Subscribe to Property Saraansh for more project walk-throughs in Noida.
                </p>
                {watchPageHref && (
                  <Link
                    href={watchPageHref}
                    className="inline-flex items-center gap-1.5 mt-3 text-brand-accent hover:text-white font-semibold text-xs md:text-sm uppercase tracking-wider transition-colors"
                  >
                    Watch the full review on its page
                    <span aria-hidden="true">→</span>
                  </Link>
                )}
              </div>
            </div>

            {/* Table of Contents — below the video */}
            <TableOfContents htmlContent={blog.content.rendered} />

            <article className="prose prose-lg max-w-none text-brand-ink leading-relaxed">
              {/* Main Content with Custom Class overrides */}
              <div
                className="blog-content font-normal text-base md:text-lg space-y-6 md:space-y-8
                  text-[#2C3E50] leading-[1.75] md:leading-[1.85]

                  /* Responsive Images */
                  [&_img]:max-w-full [&_img]:h-auto [&_img]:rounded-xl md:[&_img]:rounded-2xl [&_img]:shadow-lg [&_img]:my-8 [&_figure]:max-w-full [&_figure]:mx-0 [&_figure]:my-8 [&_iframe]:max-w-full

                  prose-headings:heading-playfair prose-headings:text-[#1A252F] prose-headings:font-extrabold prose-headings:mt-10 prose-headings:md:mt-12 prose-headings:mb-4 prose-headings:md:mb-6
                  prose-h2:text-2xl prose-h2:md:text-3xl lg:prose-h2:text-4xl prose-h2:border-b-2 prose-h2:border-brand-accent/20 prose-h2:pb-3 md:prose-h2:pb-4
                  prose-h3:text-xl prose-h3:md:text-2xl lg:prose-h3:text-3xl prose-h3:text-brand-primary
                  prose-p:mb-6 md:prose-p:mb-8 prose-p:tracking-normal md:prose-p:tracking-wide
                  prose-strong:font-bold prose-strong:text-[#111827] prose-strong:bg-brand-pale/40 prose-strong:px-1 prose-strong:rounded-sm

                  /* Blockquote fixes for mobile */
                  prose-blockquote:border-l-[4px] md:prose-blockquote:border-l-[6px] prose-blockquote:border-brand-accent prose-blockquote:pl-4 md:prose-blockquote:pl-8 prose-blockquote:text-[#34495E] prose-blockquote:italic prose-blockquote:font-serif prose-blockquote:text-lg md:prose-blockquote:text-xl lg:prose-blockquote:text-2xl prose-blockquote:my-8 md:prose-blockquote:my-10 prose-blockquote:bg-gradient-to-r prose-blockquote:from-brand-pale/50 prose-blockquote:to-transparent prose-blockquote:py-4 md:prose-blockquote:py-6 prose-blockquote:pr-4 md:prose-blockquote:pr-6 prose-blockquote:rounded-r-2xl md:prose-blockquote:rounded-r-3xl

                  prose-a:text-brand-accent prose-a:font-semibold prose-a:underline prose-a:decoration-2 prose-a:underline-offset-4 hover:prose-a:text-brand-primary hover:prose-a:decoration-brand-primary transition-all

                  /* List formatting */
                  prose-ul:list-none prose-ul:pl-0 prose-ul:mb-6 md:prose-ul:mb-8 prose-ul:space-y-3 md:prose-ul:space-y-4
                  prose-ul>li:relative prose-ul>li:pl-6 md:prose-ul>li:pl-8 prose-ul>li:before:content-[''] prose-ul>li:before:absolute prose-ul>li:before:left-1 md:prose-ul>li:before:left-2 prose-ul>li:before:top-2.5 md:prose-ul>li:before:top-3 prose-ul>li:before:w-1.5 md:prose-ul>li:before:w-2 prose-ul>li:before:h-1.5 md:prose-ul>li:before:h-2 prose-ul>li:before:bg-brand-accent prose-ul>li:before:rounded-full
                  prose-ol:list-decimal prose-ol:pl-6 md:prose-ol:pl-8 prose-ol:mb-6 md:prose-ol:mb-8 prose-ol:space-y-3 md:prose-ol:space-y-4 prose-ol:marker:text-brand-primary prose-ol:marker:font-bold

                  /* Figure & Captions */
                  prose-figcaption:text-center prose-figcaption:text-xs md:prose-figcaption:text-sm prose-figcaption:text-brand-light prose-figcaption:mt-2 md:prose-figcaption:mt-3 prose-figcaption:italic
                "
                dangerouslySetInnerHTML={{ __html: blog.content.rendered }}
              />


              {/* Author Bio Card (End of Article) */}
              <div className="bg-brand-pale/30 border border-brand-light/10 rounded-2xl p-6 md:p-8 flex flex-col sm:flex-row items-center gap-6 mt-16 shadow-inner">
                <div className="w-20 h-20 md:w-24 md:h-24 rounded-full overflow-hidden border-2 border-brand-accent shrink-0 shadow-md">
                  <img src="/saraansh_seth.png" alt="Saraansh Seth" className="w-full h-full object-cover" />
                </div>
                <div className="text-center sm:text-left">
                  <h4 className="heading-playfair text-lg font-bold text-brand-dark leading-none mb-1.5">Saraansh Seth</h4>
                  <p className="text-xs text-brand-primary uppercase tracking-widest font-semibold mb-3">Founder & Noida Real Estate Expert</p>
                  <p className="text-xs text-brand-ink/80 font-light leading-relaxed mb-4">
                    I physically visit project sites, RERA hearings, and analyze developer balance sheets to bring homebuyers Noida&apos;s most trusted real estate advice on YouTube.
                  </p>

                  <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 mt-2">
                    <a
                      href="https://www.youtube.com/@PropertySaraansh"
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex bg-[#FF0000] hover:bg-red-700 text-white font-bold px-6 py-2.5 rounded-lg text-xs transition-colors shadow-md items-center gap-2 uppercase tracking-wider active:scale-95 duration-200"
                    >
                      <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                      </svg>
                      YouTube
                    </a>
                    <a
                      href="https://www.linkedin.com/in/saraansh-seth/"
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex bg-[#0077b5] hover:bg-[#005582] text-white font-bold px-6 py-2.5 rounded-lg text-xs transition-colors shadow-md items-center gap-2 uppercase tracking-wider active:scale-95 duration-200"
                    >
                      <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
                      LinkedIn
                    </a>
                  </div>
                </div>
              </div>

              {/* FAQ Section */}
              {faqs.length > 0 && (
                <FAQSection faqs={faqs} />
              )}

              {/* Tags Strip */}
              {(() => {
                const postTags: Array<{ id: number; name: string; slug: string }> = blog._embedded?.['wp:term']?.[1] || [];
                return postTags.length > 0 ? (
                  <div className="mt-10 pt-6 border-t border-brand-light/10">
                    <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-brand-light mb-3">Tags</p>
                    <div className="flex flex-wrap gap-2">
                      {postTags.map(tag => (
                        <span
                          key={tag.id}
                          className="inline-block text-xs font-medium text-brand-ink/70 bg-brand-pale border border-brand-light/20 rounded-full px-3 py-1 hover:border-brand-accent/40 hover:text-brand-dark transition-colors duration-200"
                        >
                          #{tag.name}
                        </span>
                      ))}
                    </div>
                  </div>
                ) : null;
              })()}

            </article>

          </div>
        </div>

        {/* Related Posts: Grid of 3 */}
        {relatedBlogs.length > 0 && (
          <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-20 pt-16 border-t border-brand-light/20">
            <h2 className="heading-playfair text-2xl md:text-3xl font-bold mb-10 text-brand-dark text-center">
              Related Insights You Might Like
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {relatedBlogs.map((post) => (
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
          </section>
        )}

      </div>
    </>
  );
}

export async function generateStaticParams() {
  const blogs = await getLatestBlogs(100);
  return blogs.map((post) => ({
    slug: post.slug,
  }));
}
