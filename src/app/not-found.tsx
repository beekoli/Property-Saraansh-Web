import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Page Not Found | Property Saraansh',
  description: 'The page you are looking for could not be found.',
  robots: { index: false, follow: true },
};

const LINKS = [
  { href: '/properties', label: 'All Projects', hint: 'Residential & commercial in Noida' },
  { href: '/blog', label: 'Insights', hint: 'Honest project reviews & analysis' },
  { href: '/news', label: 'Market News', hint: 'Daily Noida real estate updates' },
  { href: '/our-videos', label: 'Video Reviews', hint: 'On-ground walkthroughs' },
  { href: '/builders', label: 'Builders', hint: 'Developer track records' },
  { href: '/contact', label: 'Free Consultation', hint: 'Talk to Saraansh Seth' },
];

/**
 * Custom 404.
 *
 * Next's default not-found page returns the right status but is a dead end with
 * no outbound links, so crawl paths terminate there. This keeps link equity
 * flowing back into the main hubs.
 */
export default function NotFound() {
  return (
    <div className="min-h-screen bg-brand-pale flex flex-col">
      <section className="bg-brand-dark pt-32 pb-16 px-4 sm:px-6 lg:px-8 text-center">
        <div className="max-w-3xl mx-auto">
          <p className="text-brand-accent font-bold tracking-[0.2em] text-xs uppercase mb-4">
            Error 404
          </p>
          <h1 className="heading-playfair text-4xl md:text-5xl text-brand-accent mb-4 font-bold">
            This page has moved on
          </h1>
          <p className="text-brand-pale/80 mt-4 text-base md:text-lg font-light leading-relaxed">
            The page you were looking for does not exist or has been renamed. Here is where
            most people go next.
          </p>
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-14 flex-grow w-full">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="bg-white rounded-2xl p-6 border border-brand-light/15 shadow-sm hover:shadow-lg hover:border-brand-light transition-all group"
            >
              <p className="font-bold text-brand-dark text-lg mb-1 group-hover:text-brand-primary transition-colors">
                {link.label}
              </p>
              <p className="text-sm text-brand-ink/60 font-light">{link.hint}</p>
            </Link>
          ))}
        </div>

        <div className="text-center mt-12">
          <Link href="/" className="btn-primary text-xs px-8 py-3.5 rounded font-bold shadow-md">
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
