import { Metadata } from 'next';
import Link from 'next/link';
import SlideUp from '@/components/animations/SlideUp';
import StaggerContainer from '@/components/animations/StaggerContainer';
import StaggerItem from '@/components/animations/StaggerItem';

export const metadata: Metadata = {
  title: 'Our Team | Property Saraansh',
  description: 'Meet the expert real estate consultants and portfolio managers at Property Saraansh.',
};

const teamMembers = [
  {
    name: "Saraansh Seth",
    role: "Founder & Principal Consultant",
    bio: "With years of deep-dive market analysis and physical project visits, Saraansh built this platform to bring radical transparency to Noida real estate.",
    image: "/saraansh_seth.png",
    linkedin: "https://www.linkedin.com/in/saraansh-seth/"
  },
  {
    name: "Placeholder Name",
    role: "Senior Real Estate Analyst",
    bio: "Specializes in commercial property investments and long-term portfolio growth. (This is a placeholder that you can update later).",
    image: "https://ui-avatars.com/api/?name=Senior+Analyst&background=183630&color=dcb46a",
    linkedin: "#"
  },
  {
    name: "Placeholder Name",
    role: "Client Success Manager",
    bio: "Ensures that every buyer's journey from initial consultation to final registry is smooth and stress-free. (This is a placeholder).",
    image: "https://ui-avatars.com/api/?name=Client+Success&background=183630&color=dcb46a",
    linkedin: "#"
  }
];

export default function OurTeam() {
  return (
    <div className="min-h-screen bg-brand-pale flex flex-col">
      {/* Hero Section */}
      <section className="bg-brand-dark pt-36 pb-24 px-4 sm:px-6 lg:px-8 text-center relative overflow-hidden border-b border-brand-accent/20">
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
        <StaggerContainer className="relative z-10 max-w-4xl mx-auto" delayChildren={0.1} staggerChildren={0.15}>
          <StaggerItem>
            <span className="text-brand-accent uppercase tracking-widest text-xs font-bold bg-brand-primary/40 px-4 py-2 rounded-full border border-brand-accent/30 inline-block mb-6">
              The Experts Behind The Data
            </span>
          </StaggerItem>
          <StaggerItem>
            <h1 className="heading-playfair text-4xl md:text-5xl lg:text-6xl text-white mb-6 font-bold uppercase tracking-tight">
              Meet Our Team
            </h1>
          </StaggerItem>
          <StaggerItem>
            <p className="text-brand-pale/80 text-lg md:text-xl font-light max-w-2xl mx-auto leading-relaxed">
              A dedicated group of researchers, analysts, and market veterans working together to bring you Noida&apos;s most trusted real estate advice.
            </p>
          </StaggerItem>
        </StaggerContainer>
      </section>

      {/* Main Content */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full flex-grow text-brand-ink">
        <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {teamMembers.map((member, idx) => (
            <StaggerItem key={idx} yOffset={25}>
              <div className="bg-white rounded-3xl overflow-hidden shadow-xl border border-brand-light/10 group hover:-translate-y-2 transition-all duration-300 flex flex-col h-full">
                <div className="aspect-[4/3] bg-brand-light/20 relative overflow-hidden">
                  <img 
                    src={member.image} 
                    alt={member.name} 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
                  />
                </div>
                <div className="p-8 flex-grow flex flex-col">
                  <h3 className="heading-playfair text-2xl font-bold text-brand-dark mb-1">{member.name}</h3>
                  <p className="text-brand-primary uppercase tracking-wider text-xs font-bold mb-4">{member.role}</p>
                  <p className="text-brand-dark/70 font-light leading-relaxed text-sm flex-grow mb-6">
                    {member.bio}
                  </p>
                  
                  <div className="pt-4 border-t border-brand-light/20 mt-auto">
                    <a 
                      href={member.linkedin} 
                      target="_blank" 
                      rel="noreferrer" 
                      className="inline-flex bg-[#0077b5] hover:bg-[#005582] text-white font-bold px-6 py-3 rounded-lg text-xs transition-colors shadow-md items-center justify-center gap-2 uppercase tracking-wider active:scale-95 duration-200 w-full"
                    >
                      <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
                      Connect on LinkedIn
                    </a>
                  </div>
                </div>
              </div>
            </StaggerItem>
          ))}
        </StaggerContainer>

        {/* Join CTA */}
        <SlideUp className="mt-24 bg-brand-primary rounded-3xl p-10 md:p-16 text-center text-white relative overflow-hidden shadow-2xl" yOffset={30}>
          <div className="absolute inset-0 bg-brand-dark opacity-40 transform -skew-y-3 origin-top-left"></div>
          <div className="relative z-10 max-w-2xl mx-auto">
            <h2 className="heading-playfair text-3xl md:text-4xl font-bold text-brand-accent mb-6">Want to join our team?</h2>
            <p className="text-brand-pale/80 text-lg font-light mb-10 leading-relaxed">
              We are always looking for passionate individuals who value transparency and data-driven real estate analysis. 
            </p>
            <Link href="/careers" className="btn-glossy-whatsapp px-8 py-4 text-sm uppercase tracking-widest font-bold shadow-xl inline-block rounded-xl mx-auto w-auto">
              View Open Positions
            </Link>
          </div>
        </SlideUp>
      </section>
    </div>
  );
}
