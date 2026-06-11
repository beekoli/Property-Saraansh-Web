import { Metadata } from 'next';
import Link from 'next/link';
import { getChannelStats } from '@/lib/youtube';

export const revalidate = 60; // Revalidate every minute

export async function generateMetadata(): Promise<Metadata> {
  const stats = await getChannelStats();
  return {
    title: 'About Saraansh Seth | Property Saraansh',
    description: `Noida's most trusted real estate consultant and YouTube educator with over ${stats.subscriberCount} subscribers. Learn about our mission and transparency guidelines.`,
  };
}

export default async function AboutUs() {
  const stats = await getChannelStats();

  return (
    <div className="min-h-screen bg-brand-pale flex flex-col">
      {/* Hero Section */}
      <section className="bg-brand-primary pt-36 pb-20 px-4 sm:px-6 lg:px-8 text-center relative overflow-hidden border-b border-brand-light/20">
        <div className="absolute inset-0 bg-brand-dark opacity-50 transform -skew-y-3 origin-top-left"></div>
        <div className="relative z-10 max-w-4xl mx-auto">
          <h1 className="heading-playfair text-4xl md:text-5xl lg:text-6xl text-brand-accent mb-6 font-bold uppercase tracking-tight">
            About Saraansh Seth
          </h1>
          <p className="text-brand-pale text-lg md:text-xl font-light max-w-xl mx-auto leading-relaxed">
            Noida&apos;s most trusted real estate consultant and YouTube educator.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full flex-grow text-brand-ink">
        <div className="flex flex-col md:flex-row gap-16 items-start">
          
          {/* Photo Column */}
          <div className="w-full md:w-5/12">
            <div className="relative aspect-[3/4] rounded-2xl overflow-hidden shadow-2xl border-4 border-brand-accent bg-white">
              <img 
                src="/saraansh_seth.png" 
                alt="Saraansh Seth" 
                className="w-full h-full object-cover" 
                loading="lazy"
              />
            </div>
            
            {/* YouTube Stats Card */}
            <div className="mt-8 bg-brand-dark rounded-xl p-8 shadow-xl text-center border-b-4 border-brand-accent text-white relative overflow-hidden border border-brand-light/10">
              <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)', backgroundSize: '15px 15px' }}></div>
              <h3 className="text-brand-accent font-bold mb-6 uppercase tracking-widest text-xs">Community Impact</h3>
              <div className="flex justify-around relative z-10">
                <div>
                  <div className="text-4xl font-bold text-white mb-1 font-sans">{stats.subscriberCount}</div>
                  <div className="text-[10px] text-brand-accent uppercase tracking-wider font-bold">Subscribers</div>
                </div>
                <div className="w-px bg-brand-light/20"></div>
                <div>
                  <div className="text-4xl font-bold text-white mb-1 font-sans">{stats.videoCount}</div>
                  <div className="text-[10px] text-brand-accent uppercase tracking-wider font-bold">Videos</div>
                </div>
              </div>
              <a 
                href="https://youtube.com" 
                target="_blank" 
                rel="noreferrer" 
                className="mt-8 inline-block w-full bg-[#FF0000] text-white font-bold py-3.5 rounded-lg hover:bg-red-700 transition-all text-sm uppercase tracking-wider shadow-md hover:shadow-red-500/20"
              >
                Subscribe on YouTube
              </a>
            </div>
          </div>

          {/* Bio Column */}
          <div className="w-full md:w-7/12">
            <span className="text-brand-primary font-bold uppercase tracking-widest text-xs mb-3 block">The Journey</span>
            <h2 className="heading-playfair text-3xl md:text-4xl text-brand-dark mb-8 leading-tight font-bold">
              Empowering homebuyers through transparent insights.
            </h2>
            
            <div className="prose prose-lg text-brand-dark/80 mb-12 font-light leading-relaxed text-sm md:text-base space-y-6">
              <p>
                I started Property Saraansh with a simple mission: to demystify the complex real estate market of Noida and Greater Noida for the common homebuyer. Before investing life savings, buyers deserve to know the ground reality, not just the glossy brochures.
              </p>
              <p>
                Through our YouTube channel, we bring you unfiltered project reviews, construction updates, legal analysis, and market trends. We physically visit sites, analyze RERA details, and interact with developers to bring you the truth.
              </p>
              <p>
                Today, Property Saraansh is not just a consultancy; it&apos;s a community of informed investors making smart, secure, and profitable real estate decisions.
              </p>
            </div>

            {/* Mission Statement Pull Quote */}
            <blockquote className="border-l-4 border-[#D4A96A] pl-8 py-4 my-12 bg-white rounded-r-2xl border-y border-r border-brand-light/10 shadow-sm">
              <p className="heading-playfair text-xl md:text-2xl text-brand-primary italic leading-relaxed font-bold">
                &ldquo;Our mission is to create a transparent real estate ecosystem where every buyer makes a confident, data-backed decision without the fear of misrepresentation.&rdquo;
              </p>
            </blockquote>

            <div className="bg-white rounded-2xl p-8 border border-brand-light/15 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-6">
              <div>
                <h4 className="text-brand-dark font-bold text-lg mb-2">Ready to start your journey?</h4>
                <p className="text-brand-dark/70 text-xs font-light">Book a free 1-on-1 consultation call with me.</p>
              </div>
              <Link href="/contact" className="w-full sm:w-auto btn-primary bg-brand-accent hover:bg-brand-accent-light text-brand-dark whitespace-nowrap px-8 py-3 rounded shadow-md font-bold text-center">
                Book Free Call
              </Link>
            </div>
          </div>

        </div>
      </section>
    </div>
  );
}
