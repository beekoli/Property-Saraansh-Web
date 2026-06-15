import Link from 'next/link';
import PropertyCard from '@/components/PropertyCard';
import VideoPlayer from '@/components/VideoPlayer';
import BlogCard from '@/components/BlogCard';
import { getChannelStats } from '@/lib/youtube';
import { getProperties, getLatestBlogs, getFeaturedImage } from '@/lib/wordpress';
import { videos } from '@/lib/videos';
import SlideUp from '@/components/animations/SlideUp';
import FadeIn from '@/components/animations/FadeIn';
import StaggerContainer from '@/components/animations/StaggerContainer';
import StaggerItem from '@/components/animations/StaggerItem';
import { parseDateToISO8601 } from '@/lib/seo';


export const revalidate = 60; // Revalidate every minute

export default async function Home() {
  // Concurrent fetching of server-side data
  const [properties, latestBlogs, channelStats] = await Promise.all([
    getProperties(3),
    getLatestBlogs(3),
    getChannelStats()
  ]);

  const longVideos = videos.filter((v) => v.category !== 'Shorts');
  const featuredVideo = longVideos[0] || {
    slug: "yamuna-expressway-investment-2030",
    youtubeId: "qWAgkIW6Mj0",
    title: "Yamuna Expressway Noida Investment 2030: Should You Buy Property Near Jewar Airport?",
    description: "Watch the latest video update for Yamuna Expressway Noida Investment 2030."
  };

  return (
    <>
      {/* Homepage Featured Video Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "VideoObject",
            "name": featuredVideo.title,
            "description": featuredVideo.description,
            "thumbnailUrl": [
              featuredVideo.thumbnail || `https://img.youtube.com/vi/${featuredVideo.youtubeId}/maxresdefault.jpg`
            ],
            "uploadDate": parseDateToISO8601(featuredVideo.publishedAt),
            "duration": featuredVideo.duration || "PT19M35S",
            "embedUrl": `https://www.youtube.com/embed/${featuredVideo.youtubeId}`
          })
        }}
      />
      {/* 1. Hero Section */}
      <section className="relative bg-brand-dark pt-32 pb-24 overflow-hidden">
        {/* Subtle architectural wireframe at 6% opacity */}
        <div 
          className="absolute inset-0 opacity-[0.06]" 
          style={{ 
            backgroundImage: `
              linear-gradient(rgba(212, 169, 106, 0.15) 1px, transparent 1px), 
              linear-gradient(90deg, rgba(212, 169, 106, 0.15) 1px, transparent 1px)
            `, 
            backgroundSize: '40px 40px' 
          }}
        ></div>
        <StaggerContainer className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center" delayChildren={0.2} staggerChildren={0.15}>
          <StaggerItem>
            <h1 className="heading-playfair text-4xl md:text-5xl lg:text-6xl mb-6 font-bold tracking-tight">
              <span className="gold-glossy-text pb-1">India&apos;s Finest Real Estate Portfolio Management Company</span>
            </h1>
          </StaggerItem>
          <StaggerItem>
            <p className="text-brand-pale text-lg md:text-xl max-w-2xl mx-auto mb-10 font-light leading-relaxed">
              Expert property reviews, market insights & investment guidance — all on YouTube.
            </p>
          </StaggerItem>
          <StaggerItem>
            <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
              <Link 
                href="/properties" 
                className="btn-primary w-full sm:w-auto text-center"
              >
                Explore Noida Projects
              </Link>
              <a 
                href="https://www.youtube.com/@PropertySaraansh"
                target="_blank"
                rel="noreferrer"
                className="btn-outline w-full sm:w-auto flex items-center justify-center gap-2"
              >
                <svg className="w-3 h-3 fill-brand-accent" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z"/>
                </svg>
                Watch Latest Video
              </a>
            </div>
          </StaggerItem>
        </StaggerContainer>
      </section>

      {/* 2. Stats Bar */}
      <section className="bg-brand-pale py-10 border-y border-brand-light/20 shadow-inner">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <StaggerContainer className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center divide-x divide-brand-light/30">
            <StaggerItem className="px-4">
              <div className="text-[32px] font-bold text-brand-accent font-sans">{channelStats.subscriberCount}</div>
              <div className="text-[13px] text-brand-primary uppercase tracking-wider font-semibold mt-1">YouTube Subscribers</div>
            </StaggerItem>
            <StaggerItem className="px-4">
              <div className="text-[32px] font-bold text-brand-accent font-sans">{channelStats.videoCount}</div>
              <div className="text-[13px] text-brand-primary uppercase tracking-wider font-semibold mt-1">Total Videos</div>
            </StaggerItem>
            <StaggerItem className="px-4">
              <div className="text-[32px] font-bold text-brand-accent font-sans">120+</div>
              <div className="text-[13px] text-brand-primary uppercase tracking-wider font-semibold mt-1">Projects Listed</div>
            </StaggerItem>
            <StaggerItem className="px-4">
              <div className="text-[32px] font-bold text-brand-accent font-sans">4</div>
              <div className="text-[13px] text-brand-primary uppercase tracking-wider font-semibold mt-1">Cities Covered</div>
            </StaggerItem>
          </StaggerContainer>
        </div>
      </section>

      {/* 3. Featured Video */}
      <section className="py-12 md:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <StaggerContainer className="flex flex-col lg:flex-row items-center gap-12" staggerChildren={0.2}>
            <StaggerItem className="w-full lg:w-3/5" yOffset={30}>
              <div className="bg-brand-dark p-3 rounded-2xl shadow-2xl border border-brand-primary">
                <VideoPlayer videoId={featuredVideo.youtubeId} title={featuredVideo.title} />
              </div>
            </StaggerItem>
            <StaggerItem className="w-full lg:w-2/5 text-brand-ink" yOffset={20}>
              <span className="text-brand-primary uppercase tracking-widest text-xs font-bold block mb-2">Our Latest Video</span>
              <Link href={`/our-videos/${featuredVideo.slug}`} className="text-black hover:text-brand-primary transition-colors group block">
                <h2 className="heading-playfair text-xl md:text-2xl lg:text-3xl font-bold mb-4 leading-tight text-justify text-black group-hover:text-brand-primary transition-colors cursor-pointer">
                  {featuredVideo.title}
                </h2>
              </Link>
              <p className="text-zinc-600 text-justify mb-6 leading-relaxed text-sm font-light">
                {featuredVideo.description}
              </p>
              <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                <Link href={`/our-videos/${featuredVideo.slug}`} className="text-brand-primary font-bold hover:text-brand-accent transition-colors flex items-center gap-2 group text-base">
                  Read review details 
                  <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"/>
                  </svg>
                </Link>
                <span className="hidden sm:inline text-brand-light/30">|</span>
                <Link href="/our-videos" className="text-brand-primary hover:text-brand-accent transition-colors text-sm font-medium">
                  Browse all videos
                </Link>
              </div>
            </StaggerItem>
          </StaggerContainer>
        </div>
      </section>

      {/* 4. Featured Projects */}
      <section className="py-12 md:py-20 bg-brand-pale">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SlideUp className="text-center mb-12">
            <h2 className="heading-playfair text-3xl md:text-4xl text-brand-ink inline-block relative font-bold">
              Explore Our Projects
              <span className="absolute bottom-0 left-0 w-full h-0.5 bg-brand-accent -mb-3"></span>
            </h2>
          </SlideUp>
          
          <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {properties.map((project) => (
              <StaggerItem key={project.id}>
                <PropertyCard 
                  id={project.slug}
                  title={project.title.rendered}
                  developer={project.acf?.developer || ""}
                  location={project.acf?.location || "Noida"}
                  price={project.acf?.price || "Price on Request"}
                  type={project.acf?.property_type || "Residential"}
                  imageUrl={getFeaturedImage(project)}
                  bhk={project.acf?.configuration ? project.acf.configuration.split(', ') : []}
                  videoId={project.acf?.video_id}
                />
              </StaggerItem>
            ))}
          </StaggerContainer>
          <SlideUp className="text-center mt-12" delay={0.2}>
            <Link href="/properties" className="btn-primary px-8 py-3 rounded shadow-md inline-block">
              View All Projects
            </Link>
          </SlideUp>
        </div>
      </section>

      {/* 5. Why Us */}
      <section className="py-12 md:py-20 bg-brand-pale border-t border-brand-light/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SlideUp className="text-center mb-16">
            <h2 className="heading-playfair text-3xl md:text-4xl text-brand-ink inline-block relative font-bold mb-8">
              Why Property Saraansh?
              <span className="absolute bottom-0 left-0 w-full h-0.5 bg-brand-accent -mb-4"></span>
            </h2>
            <p className="text-brand-dark/80 text-lg max-w-4xl mx-auto font-light leading-relaxed text-justify md:text-center">
              Experience the art of Property Portfolio Management, where exclusivity meets precision. We curate premium real estate assets tailored to your lifestyle and investment goals, ensuring unmatched growth and prestige. With our bespoke strategies, your portfolio becomes more than an investment—it becomes a legacy of luxury and lasting value.
            </p>
          </SlideUp>
          <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <StaggerItem className="text-center flex flex-col items-center p-6 bg-white rounded-xl shadow-sm border border-brand-light/10">
              <div className="w-16 h-16 rounded-full bg-brand-primary flex items-center justify-center text-brand-accent mb-4 shadow-md">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-brand-ink font-bold text-base">Strong & Experienced Team</h3>
              <p className="text-brand-dark/60 text-xs mt-2 leading-relaxed">A trusted team of real estate professionals with years of proven expertise.</p>
            </StaggerItem>
            <StaggerItem className="text-center flex flex-col items-center p-6 bg-white rounded-xl shadow-sm border border-brand-light/10">
              <div className="w-16 h-16 rounded-full bg-brand-primary flex items-center justify-center text-brand-accent mb-4 shadow-md">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
                </svg>
              </div>
              <h3 className="text-brand-ink font-bold text-base">Customer-Centric Approach</h3>
              <p className="text-brand-dark/60 text-xs mt-2 leading-relaxed">Personalized guidance to match every client’s unique needs.</p>
            </StaggerItem>
            <StaggerItem className="text-center flex flex-col items-center p-6 bg-white rounded-xl shadow-sm border border-brand-light/10">
              <div className="w-16 h-16 rounded-full bg-brand-primary flex items-center justify-center text-brand-accent mb-4 shadow-md">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                </svg>
              </div>
              <h3 className="text-brand-ink font-bold text-base">In-Depth Market Analysis</h3>
              <p className="text-brand-dark/60 text-xs mt-2 leading-relaxed">Data-driven insights to identify the best opportunities.</p>
            </StaggerItem>
            <StaggerItem className="text-center flex flex-col items-center p-6 bg-white rounded-xl shadow-sm border border-brand-light/10">
              <div className="w-16 h-16 rounded-full bg-brand-primary flex items-center justify-center text-brand-accent mb-4 shadow-md">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-brand-ink font-bold text-base">End-to-End Support</h3>
              <p className="text-brand-dark/60 text-xs mt-2 leading-relaxed">Complete assistance from site visits to RERA documentation.</p>
            </StaggerItem>
          </StaggerContainer>
        </div>
      </section>

      {/* 6. About Saraansh */}
      <section className="py-12 md:py-20 bg-brand-dark relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-brand-primary opacity-15 transform skew-x-12 translate-x-32"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <StaggerContainer className="flex flex-col md:flex-row items-center gap-16" staggerChildren={0.2}>
            <StaggerItem className="w-full md:w-5/12" yOffset={30}>
              <div className="relative aspect-[3/2] rounded-2xl overflow-hidden border-4 border-brand-accent/30 shadow-2xl bg-brand-pale/10">
                <img 
                  src="/saraansh_seth.png" 
                  alt="Saraansh Seth" 
                  className="w-full h-full object-cover" 
                  loading="lazy"
                />
              </div>
            </StaggerItem>
            <StaggerItem className="w-full md:w-7/12 text-white" yOffset={20}>
              <span className="text-brand-accent uppercase tracking-widest text-xs font-bold block mb-2">Founder & Consultant</span>
              <h2 className="heading-playfair text-3xl md:text-4xl text-brand-accent mb-6 font-bold">Who is Saraansh Seth ?</h2>
              <p className="text-brand-pale text-lg mb-8 leading-relaxed font-light">
                Founded by Mr. Saraansh Seth, Property Saraansh is your trusted guide to smart real estate investments. With practical insights and project reviews, we help you buy the right property at the right price.
              </p>
              
              <div className="flex gap-8 mb-10 border-l-2 border-brand-accent pl-6">
                <div>
                  <div className="text-3xl font-bold text-white">{channelStats.subscriberCount}</div>
                  <div className="text-sm text-brand-accent/80 uppercase tracking-widest mt-1">Subscribers</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-white">{channelStats.videoCount}</div>
                  <div className="text-sm text-brand-accent/80 uppercase tracking-widest mt-1">Videos</div>
                </div>
              </div>
              
              <Link href="/about-us" className="btn-primary px-8 py-3 rounded font-bold shadow-md inline-block">
                Know More
              </Link>
            </StaggerItem>
          </StaggerContainer>
        </div>
      </section>

      {/* 7. Latest Insights */}
      <section className="py-12 md:py-20 bg-brand-pale border-t border-brand-light/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SlideUp className="flex justify-between items-end mb-12">
            <h2 className="heading-playfair text-3xl md:text-4xl text-brand-ink inline-block relative font-bold">
              Latest Insights
              <span className="absolute bottom-0 left-0 w-full h-0.5 bg-brand-accent -mb-3"></span>
            </h2>
            <Link href="/blog" className="hidden md:flex text-brand-primary font-bold hover:text-brand-accent transition-colors items-center gap-1 group">
              Read all articles
              <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"/>
              </svg>
            </Link>
          </SlideUp>
          
          <StaggerContainer className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8 md:mb-0">
            {latestBlogs.map((blog) => (
              <StaggerItem key={blog.id}>
                <BlogCard 
                  id={blog.slug}
                  title={blog.title.rendered}
                  excerpt={blog.excerpt.rendered.replace(/<[^>]*>?/gm, '')}
                  category="Market Insights"
                  author="Saraansh Seth"
                  date={blog.date}
                  readTime="6 min read"
                  thumbnail={blog._embedded?.['wp:featuredmedia']?.[0]?.source_url || "https://images.unsplash.com/photo-1589829085413-56de8ae18c73?auto=format&fit=crop&q=80&w=800"}
                />
              </StaggerItem>
            ))}
          </StaggerContainer>
          
          <SlideUp className="md:hidden text-center mt-8">
             <Link href="/blog" className="text-brand-primary font-bold hover:text-brand-accent transition-colors flex items-center justify-center gap-1 group">
              Read all articles
              <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"/>
              </svg>
            </Link>
          </SlideUp>
        </div>
      </section>
    </>
  );
}
