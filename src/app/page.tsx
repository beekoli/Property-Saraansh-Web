import Link from 'next/link';
import VideoPlayer from '@/components/VideoPlayer';
import PropertyCard from '@/components/PropertyCard';
import { getLatestBlogs, getProperties, getFeaturedImage, stripHtml, getPageBySlug } from '@/lib/wordpress';
import { Metadata } from 'next';

export const revalidate = 60; // Revalidate every minute

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPageBySlug('home');
  if (!page || !page.yoast_head_json) return { title: 'Property Saraansh | Real Estate Consultancy' };

  return {
    title: page.yoast_head_json.title || 'Property Saraansh | Real Estate Consultancy',
    description: page.yoast_head_json.description || 'Expert advisory, comprehensive YouTube reviews, and exclusive property deals in commercial and residential sectors.',
    openGraph: {
      title: page.yoast_head_json.og_title,
      description: page.yoast_head_json.og_description,
      images: page.yoast_head_json.og_image?.map(img => img.url) || [],
    }
  };
}

export default async function Home() {
  // Fetch data in parallel
  const [blogs, properties, homePage] = await Promise.all([
    getLatestBlogs(3),
    getProperties(3),
    getPageBySlug('home')
  ]);

  // Fallback defaults if WordPress is not yet configured
  const hero_title_part1 = homePage?.acf?.hero_title_part1 || "Noida's Premier";
  const hero_title_part2 = homePage?.acf?.hero_title_part2 || "Real Estate Consultancy";
  const hero_subtitle = homePage?.acf?.hero_subtitle || "Expert advisory, comprehensive YouTube reviews, and exclusive property deals in commercial and residential sectors.";

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-[#06282B] text-white py-32 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-10">
          <div className="absolute inset-0 bg-gradient-to-r from-[#06282B] to-transparent"></div>
        </div>
        <div className="relative z-10 max-w-7xl mx-auto flex flex-col items-center text-center">
          <h1 className="text-5xl md:text-7xl font-serif font-bold mb-6 leading-tight">
            {hero_title_part1} <br/>
            <span className="text-[#E5C099]">{hero_title_part2}</span>
          </h1>
          <p className="text-xl md:text-2xl text-[#A0B2B4] mb-10 max-w-3xl">
            {hero_subtitle}
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link href="/our-videos" className="btn-primary text-lg">
              Watch Market Updates
            </Link>
            <Link href="/commercial-properties" className="btn-outline text-lg">
              Explore Properties
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Video Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-[#0A1A1C]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-serif text-white mb-4">Latest Insights on YouTube</h2>
            <div className="w-24 h-1 bg-[#E5C099] mx-auto rounded"></div>
          </div>
          
          <div className="max-w-4xl mx-auto">
            <VideoPlayer videoId="dQw4w9WgXcQ" title="Noida Real Estate Market Update" />
            <div className="mt-8 text-center">
              <Link href="/our-videos" className="text-[#E5C099] hover:text-white font-semibold transition-colors">
                View All Videos →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Properties Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-[#06282B]">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-end mb-12 border-b border-[#1A3E42] pb-6">
            <div>
              <h2 className="text-4xl font-serif text-white mb-2">Featured Properties</h2>
              <p className="text-[#A0B2B4]">Handpicked premium listings in Noida</p>
            </div>
            <Link href="/commercial-properties" className="hidden md:block text-[#E5C099] hover:text-white font-semibold transition-colors">
              View All →
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {properties.length > 0 ? (
              properties.map((prop) => (
                <PropertyCard 
                  key={prop.id}
                  id={prop.slug}
                  title={prop.title.rendered}
                  location={prop.acf?.location || 'Noida'}
                  price={prop.acf?.price || 'Price on Request'}
                  type={prop.acf?.property_type || 'Property'}
                  imageUrl={getFeaturedImage(prop)}
                />
              ))
            ) : (
              // Fallback placeholders if API fails or is empty
              <>
                <PropertyCard 
                  id="ace-estate" title="ACE Estate" location="Sector 150, Noida" price="₹ 2.5 Cr*" type="Premium Residential" imageUrl="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80"
                />
                <PropertyCard 
                  id="spectrum-metro" title="Spectrum Metro" location="Sector 75, Noida" price="₹ 1.2 Cr*" type="Commercial Retail" imageUrl="https://images.unsplash.com/photo-1577495508048-b635879837f1?auto=format&fit=crop&w=800&q=80"
                />
                <PropertyCard 
                  id="m3m-the-cullinan" title="M3M The Cullinan" location="Sector 94, Noida" price="₹ 6.5 Cr*" type="Ultra Luxury" imageUrl="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=800&q=80"
                />
              </>
            )}
          </div>
          
          <div className="mt-8 text-center md:hidden">
            <Link href="/commercial-properties" className="text-[#E5C099] hover:text-white font-semibold transition-colors">
              View All Properties →
            </Link>
          </div>
        </div>
      </section>

      {/* Latest Insights / Blog Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-[#0A1A1C]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-serif text-white mb-4">Real Estate Insights</h2>
            <div className="w-24 h-1 bg-[#E5C099] mx-auto rounded"></div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogs.length > 0 ? (
              blogs.map((blog) => (
                <div key={blog.id} className="bg-[#06282B] rounded-xl p-6 border border-[#1A3E42] hover:border-[#E5C099] transition-colors flex flex-col h-full">
                  <div className="flex justify-between items-start mb-3">
                    <span className="text-[#E5C099] text-xs font-bold uppercase tracking-wider bg-[#0A1A1C] px-2 py-1 rounded">Insight</span>
                    <span className="text-[#A0B2B4] text-xs">{new Date(blog.date).toLocaleDateString()}</span>
                  </div>
                  <h3 className="text-xl font-serif text-white mb-3" dangerouslySetInnerHTML={{ __html: blog.title.rendered }}></h3>
                  <p className="text-[#A0B2B4] mb-4 line-clamp-3" dangerouslySetInnerHTML={{ __html: stripHtml(blog.excerpt.rendered) }}></p>
                  <Link href={`/blog/${blog.slug}`} className="text-[#E5C099] hover:text-white text-sm font-semibold flex items-center transition-colors mt-auto">
                    Read More
                    <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </Link>
                </div>
              ))
            ) : (
              // Fallback placeholders
              [1, 2, 3].map((i) => (
                <div key={i} className="bg-[#06282B] rounded-xl p-6 border border-[#1A3E42] hover:border-[#E5C099] transition-colors">
                  <div className="text-[#E5C099] text-sm font-bold mb-3 uppercase tracking-wider">Market Analysis</div>
                  <h3 className="text-xl font-serif text-white mb-3">Why Noida is the best investment destination in 2026?</h3>
                  <p className="text-[#A0B2B4] mb-4 line-clamp-3">Discover the key infrastructure developments and market trends that make Noida a hotspot for real estate investors...</p>
                  <Link href="/blog" className="text-[#E5C099] hover:text-white text-sm font-semibold flex items-center transition-colors mt-auto">
                    Read More
                    <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </Link>
                </div>
              ))
            )}
          </div>
        </div>
      </section>
    </div>
  );
}

