import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Privacy Policy | Property Saraansh',
  description: 'Our Privacy Policy outlines how we collect, use, and protect your personal information.',
};

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-brand-pale flex flex-col pb-20">
      {/* Hero Section */}
      <section className="bg-brand-dark pt-36 pb-24 px-4 sm:px-6 lg:px-8 text-center relative overflow-hidden border-b border-brand-accent/20">
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
        <div className="relative z-10 max-w-4xl mx-auto">
          <h1 className="heading-playfair text-3xl md:text-5xl lg:text-6xl text-white mb-6 font-bold uppercase tracking-tight">
            Privacy Policy
          </h1>
          <p className="text-brand-pale/80 text-sm md:text-base font-light max-w-2xl mx-auto uppercase tracking-widest">
            Last Updated: June 13, 2026
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 w-full -mt-10 relative z-20">
        <div className="bg-white rounded-3xl p-8 md:p-14 shadow-2xl border border-brand-light/10">
          <div 
            className="prose prose-lg max-w-none text-brand-ink leading-relaxed
              font-normal text-lg md:text-xl space-y-8 
              text-[#2C3E50] leading-[1.85]
              prose-headings:heading-playfair prose-headings:text-[#1A252F] prose-headings:font-extrabold prose-headings:mt-12 prose-headings:mb-6
              prose-h2:text-2xl prose-h2:md:text-3xl prose-h2:border-b-2 prose-h2:border-brand-accent/20 prose-h2:pb-4
              prose-h3:text-xl prose-h3:md:text-2xl prose-h3:text-brand-primary
              prose-p:mb-8 prose-p:leading-[1.85] prose-p:tracking-wide
              prose-strong:font-bold prose-strong:text-[#111827] prose-strong:bg-brand-pale/40 prose-strong:px-1 prose-strong:rounded-sm
              prose-a:text-brand-accent prose-a:font-semibold prose-a:underline hover:prose-a:text-brand-primary transition-all
              prose-ul:list-disc prose-ul:pl-8 prose-ul:mb-8 prose-ul:space-y-4 prose-li:marker:text-brand-accent
            "
          >
            <p>
              Welcome to <strong>Property Saraansh</strong>. We respect your privacy and are committed to protecting your personal data. This Privacy Policy will inform you as to how we look after your personal data when you visit our website and tell you about your privacy rights and how the law protects you.
            </p>

            <h2>1. Information We Collect</h2>
            <p>
              We may collect, use, store and transfer different kinds of personal data about you which we have grouped together as follows:
            </p>
            <ul>
              <li><strong>Identity Data</strong> includes first name, last name, username or similar identifier.</li>
              <li><strong>Contact Data</strong> includes email address and telephone numbers.</li>
              <li><strong>Technical Data</strong> includes internet protocol (IP) address, your login data, browser type and version, time zone setting and location, browser plug-in types and versions, operating system and platform, and other technology on the devices you use to access this website.</li>
              <li><strong>Usage Data</strong> includes information about how you use our website, products and services.</li>
            </ul>

            <h2>2. How We Use Your Personal Data</h2>
            <p>
              We will only use your personal data when the law allows us to. Most commonly, we will use your personal data in the following circumstances:
            </p>
            <ul>
              <li>Where we need to perform the contract we are about to enter into or have entered into with you (e.g., providing consultancy services).</li>
              <li>Where it is necessary for our legitimate interests (or those of a third party) and your interests and fundamental rights do not override those interests.</li>
              <li>Where we need to comply with a legal obligation.</li>
            </ul>

            <h2>3. Data Security</h2>
            <p>
              We have put in place appropriate security measures to prevent your personal data from being accidentally lost, used or accessed in an unauthorized way, altered or disclosed. In addition, we limit access to your personal data to those employees, agents, contractors and other third parties who have a business need to know.
            </p>

            <h2>4. Third-Party Links</h2>
            <p>
              This website may include links to third-party websites (such as YouTube), plug-ins and applications. Clicking on those links or enabling those connections may allow third parties to collect or share data about you. We do not control these third-party websites and are not responsible for their privacy statements.
            </p>

            <h2>5. Contact Us</h2>
            <p>
              If you have any questions about this Privacy Policy or our privacy practices, please contact us by visiting our <Link href="/contact">Contact Page</Link> or emailing us directly at <a href="mailto:info@propertysaraansh.in">info@propertysaraansh.in</a>.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
