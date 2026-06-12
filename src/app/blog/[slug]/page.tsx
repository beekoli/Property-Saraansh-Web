import { Metadata } from 'next';
import { getBlogBySlug, getLatestBlogs, getFeaturedImage } from '@/lib/wordpress';
import { getVideoById } from '@/lib/youtube';
import { notFound } from 'next/navigation';
import VideoPlayer from '@/components/VideoPlayer';
import BlogCard from '@/components/BlogCard';

export const revalidate = 60; // Revalidate every minute

interface PageProps {
  params: Promise<{ slug: string }>;
}

function convertDurationToIso(duration: string): string {
  if (!duration) return 'PT10M0S';
  if (duration.startsWith('PT')) return duration;
  const parts = duration.split(':').map(Number);
  if (parts.length === 3) {
    const [h, m, s] = parts;
    return `PT${h}H${m}M${s}S`;
  } else if (parts.length === 2) {
    const [m, s] = parts;
    return `PT${m}M${s}S`;
  }
  return 'PT10M0S';
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const blog = await getBlogBySlug(slug);

  if (!blog) {
    return {
      title: 'Article Not Found',
    };
  }

  return {
    title: `${blog.title.rendered} | Property Saraansh`,
    description: blog.excerpt?.rendered?.replace(/<[^>]*>?/gm, '').slice(0, 150) || `Read ${blog.title.rendered}`,
  };
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

  // We can choose a related video ID based on post title/slug keywords
  let relatedVideoId = "dQw4w9WgXcQ"; // Default general update
  if (slug.includes('commercial')) {
    relatedVideoId = "video-7"; // Sector 129 commercial
  } else if (slug.includes('residential') || slug.includes('eldeco')) {
    relatedVideoId = "e-WJp9zY7o8"; // Eldeco 7 Peaks
  }

  const video = await getVideoById(relatedVideoId);
  const videoSchema = video ? {
    "@context": "https://schema.org",
    "@type": "VideoObject",
    "name": video.title,
    "description": video.description || `Watch real estate guide video review related to ${blog.title.rendered}.`,
    "thumbnailUrl": [video.thumbnail],
    "uploadDate": (() => {
      if (!video.publishedAt) return "2026-06-11";
      const d = new Date(video.publishedAt);
      return isNaN(d.getTime()) ? "2026-06-11" : d.toISOString().split('T')[0];
    })(),
    "duration": convertDurationToIso(video.duration),
    "embedUrl": `https://www.youtube.com/embed/${video.id}`
  } : null;

  return (
    <>
      {videoSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(videoSchema) }}
        />
      )}
      <div className="bg-[#E8F5F2] min-h-screen pt-24 pb-20">
      
      {/* Blog Hero Heading */}
      <header className="max-w-4xl mx-auto px-4 text-center mt-8 mb-12 text-[#0D2921]">
        <span className="text-brand-primary uppercase tracking-widest text-xs font-bold bg-white px-3.5 py-1.5 rounded-full border border-brand-light/10 shadow-sm inline-block mb-4">
          Real Estate Insights
        </span>
        <h1 className="text-3xl md:text-5xl font-bold heading-playfair leading-tight mb-6 text-brand-dark">
          {blog.title.rendered}
        </h1>
        <div className="flex items-center justify-center gap-3 text-xs text-brand-light font-medium uppercase tracking-wider">
          <span>By Saraansh Seth</span>
          <span className="w-1.5 h-1.5 rounded-full bg-brand-light/40"></span>
          <span>{blog.date}</span>
          <span className="w-1.5 h-1.5 rounded-full bg-brand-light/40"></span>
          <span>6 min read</span>
        </div>
      </header>

      {/* Featured Image Banner */}
      <div className="max-w-4xl mx-auto px-4 mb-12">
        <div className="aspect-[21/9] rounded-2xl overflow-hidden shadow-md border border-brand-pale">
          <img src={getFeaturedImage(blog)} alt={blog.title.rendered} className="w-full h-full object-cover" />
        </div>
      </div>

      {/* Blog Article Body: Max-width 720px Centered */}
      <article className="max-w-[720px] mx-auto px-4 text-[#0D2921] leading-relaxed">
        
        {/* Main Content with Custom Class overrides */}
        <div 
          className="blog-content font-light text-base md:text-lg space-y-6 
            prose prose-lg max-w-none text-[#0D2921]
            prose-headings:heading-playfair prose-headings:text-brand-dark prose-headings:font-bold prose-headings:mt-8 prose-headings:mb-4
            prose-h2:text-2xl prose-h2:md:text-3xl
            prose-p:mb-6 prose-p:leading-relaxed
            prose-blockquote:border-l-[3px] prose-blockquote:border-brand-accent prose-blockquote:pl-6 prose-blockquote:text-brand-primary prose-blockquote:italic prose-blockquote:font-serif prose-blockquote:text-lg prose-blockquote:my-8 prose-blockquote:bg-white/40 prose-blockquote:py-4 prose-blockquote:pr-4 prose-blockquote:rounded-r-xl
            prose-a:text-brand-primary prose-a:underline hover:prose-a:text-brand-accent transition-colors
          " 
          dangerouslySetInnerHTML={{ __html: blog.content.rendered }} 
        />

        {/* Related YouTube Embed (inline, full-width) */}
        <div className="my-12">
          <h3 className="heading-playfair text-xl font-bold text-brand-dark mb-4 flex items-center gap-2 uppercase tracking-wide">
            <span className="w-1 h-5 bg-brand-accent"></span>
            Related Video Guide
          </h3>
          <div className="bg-brand-dark p-2 rounded-xl shadow-lg border border-brand-primary/20 overflow-hidden w-full">
            <VideoPlayer videoId={relatedVideoId} title="Noida Real Estate Analysis Video" />
          </div>
        </div>

        {/* Author Bio Card (End of Article) */}
        <div className="bg-white border border-brand-light/10 rounded-2xl p-6 md:p-8 shadow-sm flex flex-col sm:flex-row items-center gap-6 mt-16">
          <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-brand-accent shrink-0 shadow-md">
            <img src="/saraansh_seth.png" alt="Saraansh Seth" className="w-full h-full object-cover" />
          </div>
          <div className="text-center sm:text-left">
            <h4 className="heading-playfair text-lg font-bold text-brand-dark leading-none mb-1">Saraansh Seth</h4>
            <p className="text-xs text-brand-primary uppercase tracking-widest font-semibold mb-3">Founder & Noida Real Estate Expert</p>
            <p className="text-xs text-brand-dark/70 font-light leading-relaxed mb-4">
              I physically visit project sites, RERA hearings, and analyze developer balance sheets to bring homebuyers Noida&apos;s most trusted real estate advice on YouTube.
            </p>
            
            <a 
              href="https://www.youtube.com/@PropertySaraansh" 
              target="_blank" 
              rel="noreferrer" 
              className="inline-flex bg-[#FF0000] text-white font-bold px-6 py-2 rounded text-xs hover:bg-red-700 transition-colors shadow-md items-center gap-2 uppercase tracking-wider"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
              </svg>
              Subscribe on YouTube
            </a>
          </div>
        </div>

      </article>

      {/* Related Posts: Grid of 3 */}
      {relatedBlogs.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-20 pt-16 border-t border-brand-light/20">
          <h2 className="heading-playfair text-2xl font-bold mb-10 text-brand-dark text-center">
            Related Insights You Might Like
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {relatedBlogs.map((post) => (
              <BlogCard 
                key={post.id} 
                id={post.slug}
                title={post.title.rendered}
                excerpt={post.excerpt.rendered.replace(/<[^>]*>?/gm, '')}
                category="Market Insights"
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
