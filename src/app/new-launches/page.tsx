import { Metadata } from 'next';
import { getLaunchAlerts } from '@/lib/launchAlerts';
import { getManagedPage, preferWP } from '@/lib/managedContent';
import { buildPageMetadata, FRONTEND_URL } from '@/lib/seo';
import NewLaunchesClient from './NewLaunchesClient';

export const revalidate = 300; // New launches arrive daily at most.

const FALLBACK_HEADING = 'New Launch Alerts';
const FALLBACK_INTRO =
  'Every new residential launch across the Noida corridor — verified RERA filings and freshly advertised projects, with the fine print read for you.';
const FALLBACK_META_TITLE = 'New Launch Alerts — Noida, Greater Noida & YEIDA | Property Saraansh';
const FALLBACK_META_DESC =
  'New residential launches across Noida, Greater Noida and the Yamuna Expressway, with RERA numbers, real prices and the fine print most listings leave out.';

export async function generateMetadata(): Promise<Metadata> {
  const managed = await getManagedPage('new-launches');
  return buildPageMetadata({
    path: '/new-launches',
    title: managed?.metaTitle || FALLBACK_META_TITLE,
    description: managed?.metaDescription || FALLBACK_META_DESC,
  });
}

export default async function NewLaunchesPage() {
  // WordPress owns the words, the frontend owns the machinery — the heading and
  // intro come from the Page with slug "new-launches" when one exists.
  const [alerts, managed] = await Promise.all([
    getLaunchAlerts(),
    getManagedPage('new-launches'),
  ]);

  const heading = preferWP(managed?.heading, FALLBACK_HEADING);
  const intro = preferWP(managed?.intro, FALLBACK_INTRO);

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: FRONTEND_URL },
      { '@type': 'ListItem', position: 2, name: heading, item: `${FRONTEND_URL}/new-launches` },
    ],
  };

  // An ItemList of the projects currently listed. It describes exactly what is
  // visible on the page, which is the condition for marking anything up.
  const itemListJsonLd =
    alerts.length > 0
      ? {
          '@context': 'https://schema.org',
          '@type': 'ItemList',
          name: heading,
          numberOfItems: alerts.length,
          itemListElement: alerts.map((a, i) => ({
            '@type': 'ListItem',
            position: i + 1,
            name: a.title,
          })),
        }
      : null;

  return (
    <main className="min-h-screen bg-[#f6f3ee] px-4 pb-16 pt-10 sm:pt-14">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      {itemListJsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListJsonLd) }}
        />
      )}

      <div className="mx-auto w-full max-w-[680px]">
        <p className="heading-playfair text-[15px] font-semibold text-brand-accent">
          Property Saraansh
        </p>
        <h1 className="heading-playfair mt-2.5 text-[34px] font-semibold leading-[1.1] tracking-[-0.01em] text-brand-dark">
          {heading}
        </h1>
        <p className="mt-2 max-w-[52ch] text-[15px] text-[#66788c]">{intro}</p>

        <div className="mt-7">
          <NewLaunchesClient alerts={alerts} />
        </div>

        <p className="mt-6 text-center text-[12px] italic text-[#9aa4b0]">
          Prices and dates are as filed or as advertised on the date shown. Always verify against the
          RERA filing before booking.
        </p>
      </div>
    </main>
  );
}
