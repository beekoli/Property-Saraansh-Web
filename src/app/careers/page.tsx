import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, CheckCircle2 } from 'lucide-react';
import SlideUp from '@/components/animations/SlideUp';
import StaggerContainer from '@/components/animations/StaggerContainer';
import StaggerItem from '@/components/animations/StaggerItem';

export const metadata: Metadata = {
  title: 'Careers | Property Saraansh',
  description: 'Join our team to transform the Noida real estate industry with transparency and data-driven insights.',
};

const benefits = [
  "Competitive compensation structure",
  "Mentorship from industry veterans",
  "Performance-based bonuses",
  "Flexible working hours",
  "Dynamic, transparency-first culture",
  "Continuous learning and growth"
];

const positions = [
  {
    title: "Senior Sales Consultant",
    type: "Full-Time",
    location: "Noida, UP",
    description: "We are looking for an experienced consultant to guide clients through complex commercial and residential investments."
  },
  {
    title: "Real Estate Analyst",
    type: "Full-Time",
    location: "Noida, UP",
    description: "Join our research team to analyze developer portfolios, track RERA approvals, and identify high-yield investment zones."
  },
  {
    title: "Video Editor / Content Creator",
    type: "Full-Time / Part-Time",
    location: "Noida / Remote",
    description: "Help us edit our YouTube site visits and market analyses. Must have a sharp eye for real estate storytelling."
  }
];

export default function Careers() {
  return (
    <div className="min-h-screen bg-brand-pale flex flex-col">
      {/* Hero Section */}
      <section className="bg-brand-primary pt-36 pb-24 px-4 sm:px-6 lg:px-8 text-center relative overflow-hidden border-b border-brand-light/20">
        <div className="absolute inset-0 bg-brand-dark opacity-50 transform -skew-y-3 origin-top-left"></div>
        <StaggerContainer className="relative z-10 max-w-4xl mx-auto" delayChildren={0.1} staggerChildren={0.15}>
          <StaggerItem>
            <span className="text-brand-accent uppercase tracking-widest text-xs font-bold bg-brand-dark/40 px-4 py-2 rounded-full border border-brand-accent/30 inline-block mb-6 backdrop-blur-md">
              Careers at Property Saraansh
            </span>
          </StaggerItem>
          <StaggerItem>
            <h1 className="heading-playfair text-4xl md:text-5xl lg:text-6xl text-brand-accent mb-6 font-bold uppercase tracking-tight">
              Build the Future of Real Estate
            </h1>
          </StaggerItem>
          <StaggerItem>
            <p className="text-brand-pale text-lg md:text-xl font-light max-w-2xl mx-auto leading-relaxed">
              Join a fast-growing team dedicated to bringing absolute transparency and trust back into the property market.
            </p>
          </StaggerItem>
        </StaggerContainer>
      </section>

      {/* Culture & Benefits */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full text-brand-ink">
        <div className="flex flex-col md:flex-row gap-16 items-center">
          <SlideUp className="w-full md:w-1/2 space-y-6">
            <h2 className="heading-playfair text-3xl md:text-4xl text-brand-dark font-bold leading-tight">
              Why Work With Us?
            </h2>
            <div className="prose prose-lg text-brand-dark/80 font-light leading-relaxed">
              <p>
                Property Saraansh isn&apos;t a traditional brokerage. We are a media-first, data-driven consultancy where our primary tool is the truth. 
              </p>
              <p>
                When you join us, you aren&apos;t just pushing sales. You are actively analyzing market trends, visiting sites, understanding RERA compliance, and protecting our clients&apos; investments. We empower our team members to become respected market experts in their own right.
              </p>
            </div>
          </SlideUp>
          
          <SlideUp className="w-full md:w-1/2">
            <div className="bg-white rounded-3xl p-8 shadow-xl border border-brand-light/10">
              <h3 className="text-brand-dark font-bold uppercase tracking-widest text-sm mb-6 border-b border-brand-pale pb-4">Our Perks</h3>
              <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {benefits.map((benefit, idx) => (
                  <StaggerItem key={idx} className="flex items-start gap-3 text-sm text-brand-dark/80 font-medium">
                    <CheckCircle2 className="text-brand-accent shrink-0" size={18} />
                    <span>{benefit}</span>
                  </StaggerItem>
                ))}
              </StaggerContainer>
            </div>
          </SlideUp>
        </div>
      </section>

      {/* Open Positions */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-brand-light/10 w-full flex-grow">
        <div className="max-w-5xl mx-auto">
          <SlideUp className="text-center mb-16">
            <h2 className="heading-playfair text-3xl md:text-4xl text-brand-dark font-bold mb-4">
              Open Positions
            </h2>
            <p className="text-brand-dark/70">
              Find your next role and help us redefine real estate consulting.
            </p>
          </SlideUp>

          <StaggerContainer className="space-y-6">
            {positions.map((job, idx) => (
              <StaggerItem key={idx}>
                <div className="bg-white rounded-2xl p-6 md:p-8 shadow-lg border border-brand-light/20 flex flex-col md:flex-row md:items-center justify-between gap-6 group hover:border-brand-accent/50 hover:-translate-y-1 transition-all duration-300">
                  <div className="flex-1">
                    <div className="flex flex-wrap gap-3 mb-3">
                      <span className="bg-brand-primary text-brand-accent text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full">
                        {job.type}
                      </span>
                      <span className="bg-brand-pale text-brand-dark text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full border border-brand-light/20">
                        {job.location}
                      </span>
                    </div>
                    <h3 className="heading-playfair text-2xl font-bold text-brand-dark mb-2 group-hover:text-brand-primary transition-colors">
                      {job.title}
                    </h3>
                    <p className="text-brand-dark/70 text-sm md:text-base font-light leading-relaxed max-w-2xl">
                      {job.description}
                    </p>
                  </div>
                  <div>
                    <Link href="/contact" className="btn-primary whitespace-nowrap px-8 py-3 rounded-xl shadow-md font-bold inline-flex items-center gap-2 w-full md:w-auto justify-center group-hover:shadow-lg transition-all">
                      Apply Now
                      <ArrowRight size={16} />
                    </Link>
                  </div>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
          
          <div className="mt-16 text-center text-brand-dark/70 font-light text-sm">
            <p>Don&apos;t see a role that fits? We are always on the lookout for talent. <br/> Send your resume to <a href="mailto:careers@propertysaraansh.com" className="text-brand-primary font-semibold hover:underline">careers@propertysaraansh.com</a></p>
          </div>
        </div>
      </section>
    </div>
  );
}
