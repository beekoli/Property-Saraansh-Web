import Link from 'next/link';
import { CheckCircle2, ArrowRight, Play, Calendar, Eye } from 'lucide-react';
import { videos } from '@/lib/videos';

export const metadata = {
  title: 'Thank You | Property Saraansh',
  description: 'Thank you for your enquiry. We will get back to you shortly.',
};

export default function ThankYouPage() {
  const longVideos = videos.filter((v) => v.category !== 'Shorts');
  const latestVideo = longVideos[0] || {
    slug: "yamuna-expressway-investment-2030-who-should-buy-who-should-avoid-future-price-p",
    youtubeId: "qWAgkIW6Mj0",
    title: "Yamuna Expressway Noida Investment 2030: Should You Buy Property Near Jewar Airport?",
    description: "Watch the latest video update for Yamuna Expressway Noida Investment 2030.",
    thumbnail: "https://img.youtube.com/vi/qWAgkIW6Mj0/hqdefault.jpg",
    publishedAt: "2026-06-11",
    views: "25K views"
  };

  return (
    <div className="min-h-screen bg-brand-dark text-white flex items-center justify-center pt-28 pb-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Decorative background grids & gradients */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:30px_30px]" />
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-brand-primary/10 rounded-full blur-3xl -z-10" />
      <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-brand-accent/5 rounded-full blur-3xl -z-10" />

      <div className="max-w-5xl w-full grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 relative z-10">
        
        {/* Left Column: Thank You Confirmation (lg:span-7) */}
        <div className="lg:col-span-7 bg-white/5 backdrop-blur-md border border-brand-light/10 p-8 md:p-10 rounded-2xl shadow-2xl space-y-6 flex flex-col justify-between">
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <div className="bg-brand-primary/20 p-3 rounded-full border border-brand-accent/20">
                <CheckCircle2 size={36} className="text-brand-accent" />
              </div>
              <div>
                <h1 className="text-3xl font-bold heading-playfair text-brand-accent leading-tight">Thank You!</h1>
                <p className="text-brand-accent-light text-[10px] uppercase tracking-widest font-bold font-sans mt-0.5">
                  Inquiry Captured Successfully
                </p>
              </div>
            </div>

            <p className="text-brand-pale/80 text-sm font-light leading-relaxed">
              Your requirements have been successfully recorded in our secure Google Sheets database. 
              Saraansh Seth or one of our lead real estate experts will analyze your requirements 
              and reach out to you within 24 hours.
            </p>

            {/* YouTube Subscribe Section */}
            <div className="bg-red-600/10 border border-red-600/20 rounded-xl p-5 space-y-3">
              <div className="flex items-center gap-2 text-red-500 font-bold text-sm uppercase tracking-wider">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                </svg>
                <span>Join Our Community</span>
              </div>
              <p className="text-brand-pale/90 text-xs font-light leading-relaxed">
                Subscribe to Mr. Saraansh Seth&apos;s YouTube channel for daily project reviews, construction updates, and deep real estate market analyses.
              </p>
              <a 
                href="https://www.youtube.com/@PropertySaraansh?sub_confirmation=1"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center gap-2 bg-[#FF0000] hover:bg-[#CC0000] text-white px-5 py-2.5 rounded font-bold text-xs uppercase tracking-wider font-sans transition-all duration-300 shadow-md cursor-pointer"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                </svg>
                Subscribe Now
              </a>
            </div>
          </div>

          <div className="border-t border-brand-light/10 pt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Link 
              href="/"
              className="w-full btn-primary py-3 rounded-lg text-xs uppercase tracking-wider font-bold font-sans flex items-center justify-center gap-2 cursor-pointer shadow-lg hover:shadow-brand-accent/10"
            >
              Back to Home
            </Link>
            
            <Link 
              href="/properties"
              className="w-full btn-outline py-3 rounded-lg text-xs uppercase tracking-wider font-bold font-sans flex items-center justify-center gap-2 cursor-pointer border-brand-light/35 text-brand-pale hover:bg-brand-light hover:text-white"
            >
              Explore Projects
              <ArrowRight size={14} />
            </Link>
          </div>
        </div>

        {/* Right Column: Latest Video Card (lg:span-5) */}
        <div className="lg:col-span-5 bg-white/5 backdrop-blur-md border border-brand-light/10 p-6 md:p-8 rounded-2xl shadow-2xl flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-brand-accent font-bold text-xs uppercase tracking-widest">
              <span className="w-1.5 h-4 bg-brand-accent rounded-full"></span>
              Our Latest Video
            </div>
            
            {/* Interactive Video Card */}
            <Link 
              href={`/our-videos/${latestVideo.slug}`}
              className="group block relative aspect-video rounded-xl overflow-hidden bg-brand-dark border border-brand-light/20 shadow-md"
            >
              <img 
                src={latestVideo.thumbnail} 
                alt={latestVideo.title} 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
              />
              <div className="absolute inset-0 bg-brand-dark/40 group-hover:bg-brand-dark/20 transition-colors duration-300" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="bg-brand-accent text-brand-dark p-3.5 rounded-full shadow-lg transform group-hover:scale-110 transition-all duration-300">
                  <Play size={20} fill="currentColor" className="translate-x-0.5" />
                </div>
              </div>
            </Link>

            <div className="space-y-2">
              <Link 
                href={`/our-videos/${latestVideo.slug}`}
                className="block text-sm font-semibold text-brand-accent hover:text-brand-accent-light transition-colors leading-relaxed line-clamp-2"
              >
                {latestVideo.title}
              </Link>
              <p className="text-brand-pale/70 text-xs font-light leading-relaxed line-clamp-2">
                {latestVideo.description}
              </p>
            </div>
          </div>

          <div className="border-t border-brand-light/10 pt-4 mt-6 flex justify-between items-center text-[10px] text-brand-pale/50 font-light">
            <span className="flex items-center gap-1">
              <Calendar size={12} className="text-brand-accent" />
              {latestVideo.publishedAt}
            </span>
            <span className="flex items-center gap-1">
              <Eye size={12} className="text-brand-accent" />
              {latestVideo.views}
            </span>
          </div>
        </div>

      </div>
    </div>
  );
}
