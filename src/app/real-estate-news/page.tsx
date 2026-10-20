import { Metadata } from 'next';
import { getNewsPageByCity } from '@/lib/wordpress';
import { FRONTEND_URL } from '@/lib/seo';
import { buildNewsListingJsonLd } from '@/lib/newsListingSchema';
import NewsListing from '@/components/NewsListing';

export const revalidate = 60; // Revalidate every minute — news updates daily

const PER_PAGE = 12;
const CITY_SLUG = 'real-estate-news';
const PAGE_NAME = 'Real Estate News';
const DESCRIPTION =
  'Real estate news from across India and beyond — Gurugram, Mumbai, Bengaluru, Dubai and national policy, RERA rulings, new launches, price movements and infrastructure shaping property markets outside Noida and Pune.';

interface PageProps {
  searchParams: Promise<{ page?: string }>;
}

function parsePage(raw?: string): number {
  const n = Number.parseInt(raw ?? '1', 10);
  return Number.isFinite(n) && n > 0 ? n : 1;
}

export async function generateMetadata({ searchParams }: PageProps): Promise<Metadata> {
  const page = parsePage((await searchParams).page);

  const baseTitle = `${PAGE_NAME} — India & Global Property Updates | Property Saraansh`;
  const canonical =
    page > 1 ? `${FRONTEND_URL}/real-estate-news?page=${page}` : `${FRONTEND_URL}/real-estate-news`;

  return {
    title: page > 1 ? `${baseTitle} — Page ${page}` : baseTitle,
    description: DESCRIPTION,
    alternates: { canonical },
    openGraph: {
      title: 'Real Estate News — India & Global Property Updates',
      description:
        'New launches, price movements, RERA/policy updates and infrastructure news from property markets across India and overseas — updated daily.',
      type: 'website',
      siteName: 'Property Saraansh',
      locale: 'en_IN',
      url: canonical,
      images: [`${FRONTEND_URL}/logo.png`],
    },
  };
}

export default async function RealEstateNews({ searchParams }: PageProps) {
  const page = parsePage((await searchParams).page);
  const { posts, totalPages, total } = await getNewsPageByCity(CITY_SLUG, page, PER_PAGE);

  const jsonLd = buildNewsListingJsonLd({
    path: '/real-estate-news',
    cityLabel: 'Real Estate',
    name: PAGE_NAME,
    description: DESCRIPTION,
    posts,
    page,
    perPage: PER_PAGE,
  });

  return (
    <>
      {jsonLd.map((obj, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(obj) }}
        />
      ))}
      <NewsListing
        initialNews={posts}
        page={page}
        totalPages={totalPages}
        total={total}
        heading={PAGE_NAME}
        intro="Property news from beyond Noida and Pune — Gurugram, Mumbai, Bengaluru, Dubai and the national picture, covering new launches, price movements, RERA & policy decisions and the infrastructure reshaping these markets."
        paginationBasePath="/real-estate-news"
      />
    </>
  );
}
