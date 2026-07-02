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
              <div className="flex flex-col gap-3 mt-8">
                <a 
                  href="https://www.youtube.com/@PropertySaraansh" 
                  target="_blank" 
                  rel="noreferrer" 
                  className="w-full inline-block bg-[#FF0000] text-white font-bold py-3.5 rounded-lg hover:bg-red-700 transition-all text-sm uppercase tracking-wider shadow-md hover:shadow-red-500/20"
                >
                  Subscribe on YouTube
                </a>
                <a 
                  href="https://www.linkedin.com/in/saraansh-seth/" 
                  target="_blank" 
                  rel="noreferrer" 
                  className="w-full inline-block bg-[#0077b5] text-white font-bold py-3.5 rounded-lg hover:bg-[#005582] transition-all text-sm uppercase tracking-wider shadow-md hover:shadow-blue-500/20"
                >
                  Connect on LinkedIn
                </a>
              </div>
            </div>
          </div>

          {/* Bio Column */}
          <div className="w-full md:w-7/12 space-y-12">
            
            {/* The Journey */}
            <div>
              <span className="text-brand-primary font-bold uppercase tracking-widest text-xs mb-3 block">The Journey</span>
              <h2 className="heading-playfair text-3xl md:text-4xl text-brand-dark mb-6 leading-tight font-bold">
                Empowering homebuyers through transparent insights.
              </h2>
              <div className="prose prose-lg text-brand-dark/80 font-light leading-relaxed text-sm md:text-base space-y-4">
                <p>
                  I started Property Saraansh with a simple mission: to demystify the complex real estate market of Noida and Greater Noida for the common homebuyer. Before investing life savings, buyers deserve to know the ground reality, not just the glossy brochures.
                </p>
                <p>
                  Through our YouTube channel, we bring you unfiltered project reviews, construction updates, legal analysis, and market trends. We physically visit sites, analyze RERA details, and interact with developers to bring you the truth.
                </p>
              </div>
            </div>

            {/* Expertise */}
            <div>
              <h3 className="heading-playfair text-2xl text-brand-dark mb-4 font-bold border-b border-brand-accent/20 pb-2">
                Expertise You Can Trust
              </h3>
              <p className="prose prose-lg text-brand-dark/80 font-light leading-relaxed text-sm md:text-base">
                Backed by a team of seasoned real estate professionals, we have a proven track record of success in the ever-evolving real estate market. Whether you are buying, selling, or investing, our expertise and insights will guide you toward optimal outcomes.
              </p>
            </div>

            {/* Mission */}
            <div>
              <h3 className="heading-playfair text-2xl text-brand-dark mb-4 font-bold border-b border-brand-accent/20 pb-2">
                Our Mission
              </h3>
              <p className="prose prose-lg text-brand-dark/80 font-light leading-relaxed text-sm md:text-base mb-6">
                At Property Saraansh, our mission is to empower our clients with the knowledge and expertise needed to make informed real estate decisions. We strive to deliver unparalleled service, ensuring a seamless and rewarding experience in every transaction.
              </p>
              {/* Mission Statement Pull Quote */}
              <blockquote className="border-l-4 border-brand-accent pl-8 py-4 bg-white rounded-r-2xl border-y border-r border-brand-light/10 shadow-sm">
                <p className="heading-playfair text-lg md:text-xl text-brand-primary italic leading-relaxed font-bold">
                  &ldquo;Our mission is simple – to guide you in building, optimizing, and protecting your property portfolio, while keeping you updated with market insights and investment tips.&rdquo;
                </p>
              </blockquote>
            </div>

            {/* Why Choose Us */}
            <div>
              <h3 className="heading-playfair text-2xl text-brand-dark mb-4 font-bold border-b border-brand-accent/20 pb-2">
                Why Choose Property Saraansh
              </h3>
              <div className="prose prose-lg text-brand-dark/80 font-light leading-relaxed text-sm md:text-base space-y-4">
                <p>
                  At Property Saraansh, we believe real estate decisions should be informed, strategic, and stress-free. That&apos;s why we combine our expertise in property portfolio management with the power of engaging YouTube content to help investors, homeowners, and first-time buyers make smart choices.
                </p>
                <p>
                  Every video we create is designed to give you clear, actionable information, whether you&apos;re looking to buy your first home, expand your real estate investments, or restructure your portfolio for better returns. With years of industry experience and a finger on the pulse of the ever-changing property market, we&apos;re here to:
                </p>
                <ul className="list-disc pl-5 space-y-2 text-brand-dark/90 marker:text-brand-accent font-medium">
                  <li>Suggest high-potential projects and investment opportunities.</li>
                  <li>Share expert strategies for portfolio diversification.</li>
                  <li>Keep you informed about market trends, legal updates, and financing options.</li>
                  <li>Offer location deep dives and project walkthroughs for better decision-making.</li>
                </ul>
                <p>
                  On our YouTube channel, you&apos;ll find everything from project comparisons and floor plan breakdowns to step-by-step investment strategies — all presented in a way that&apos;s easy to understand and apply.
                </p>
                <p className="font-semibold text-brand-dark">
                  Whether you&apos;re a seasoned investor or just starting your journey, Property Saraansh is here to be your trusted partner, helping you grow your property portfolio with confidence.
                </p>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-8 border border-brand-light/15 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-6">
              <div>
                <h4 className="text-brand-dark font-bold text-lg mb-2">Ready to start your journey?</h4>
                <p className="text-brand-dark/70 text-xs font-light">Book a free 1-on-1 consultation call with me.</p>
              </div>
              <Link href="/contact" className="w-full sm:w-auto btn-primary whitespace-nowrap px-8 py-3 rounded shadow-md font-bold text-center">
                Book Free Call
              </Link>
            </div>
          </div>

        </div>
      </section>
    </div>
  );
}
