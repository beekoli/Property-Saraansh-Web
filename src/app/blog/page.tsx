import Link from 'next/link';
import { getLatestBlogs, stripHtml } from '@/lib/wordpress';

export const revalidate = 60;

export default async function Blog() {
  const blogs = await getLatestBlogs(12); // Fetch up to 12 latest posts

  return (
    <div className="bg-[#0A1A1C] min-h-screen pt-20 pb-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-serif text-[#E5C099] mb-4">Our Blogs</h1>
          <p className="text-[#A0B2B4] max-w-2xl mx-auto">
            Insights, market trends, and investment guides from the experts at Property Saraansh.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogs.length > 0 ? (
            blogs.map((blog) => (
              <div key={blog.id} className="bg-[#06282B] rounded-xl p-6 border border-[#1A3E42] hover:border-[#E5C099] transition-colors flex flex-col h-full">
                <div className="flex justify-between items-start mb-3">
                  {/* Category would normally be fetched via taxonomy expansion, using 'Insight' as placeholder */}
                  <span className="text-[#E5C099] text-xs font-bold uppercase tracking-wider bg-[#0A1A1C] px-2 py-1 rounded">Insight</span>
                  <span className="text-[#A0B2B4] text-xs">{new Date(blog.date).toLocaleDateString()}</span>
                </div>
                <h3 className="text-xl font-serif text-white mb-3" dangerouslySetInnerHTML={{ __html: blog.title.rendered }}></h3>
                <p className="text-[#A0B2B4] mb-6 flex-grow line-clamp-3" dangerouslySetInnerHTML={{ __html: stripHtml(blog.excerpt.rendered) }}></p>
                <Link href={`/blog/${blog.slug}`} className="text-[#E5C099] hover:text-white text-sm font-semibold flex items-center transition-colors mt-auto">
                  Read Full Article
                  <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </Link>
              </div>
            ))
          ) : (
            <div className="col-span-1 md:col-span-3 text-center py-12 text-[#A0B2B4]">
              <p>No blog posts found. Please add some posts in your WordPress dashboard.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

