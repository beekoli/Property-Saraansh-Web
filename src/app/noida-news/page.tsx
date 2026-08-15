import { Metadata } from 'next';
import { getNewsPageByCity } from '@/lib/wordpress';
import { FRONTEND_URL } from '@/lib/seo';
import NewsListing from '@/components/NewsListing';

export const revalidate = 60; // Revalidate every minute — news updates daily

const PER_PAGE = 12;
const CITY_SLUG = 'noida-news';

interface PageProps {
  searchParams: Promise<{ page?: string }>;
}

function parsePage(raw?: string): number {
  const n = Number.parseInt(raw ?? '1', 10);
  return Number.isFinite(n) && n > 0 ? n : 1;
}

export async function generateMetadata({ searchParams }: PageProps): Promise<Metadata> {
  const page = parsePage((await searchParams).page);

  const baseTitle = 'Noida Real Estate News — Daily Market Updates | Property Saraansh';
  const description =
    'Daily real estate news for Noida, Greater Noida, Noida Extension & the Yamuna Expressway — new launches, price movements, RERA & policy updates, and infrastructure, tracked by Property Saraansh.';

  const canonical =
    page > 1 ? `${FRONTEND_URL}/noida-news?page=${page}` : `${FRONTEND_URL}/noida-news`;

  return {
    title: page > 1 ? `${baseTitle} — Page ${page}` : baseTitle,
    description,
    alternates: { canonical },
    openGraph: {
      title: 'Noida Real Estate News — Daily Market Updates',
      description:
        'New launches, price movements, RERA/policy updates and infrastructure news across the Noida property market — updated daily.',
      type: 'website',
      siteName: 'Property Saraansh',
      locale: 'en_IN',
      url: canonical,
      images: [`${FRONTEND_URL}/logo.png`],
    },
  };
}

export default async function NoidaNews({ searchParams }: PageProps) {
  const page = parsePage((await searchParams).page);
  const { posts, totalPages, total } = await getNewsPageByCity(CITY_SLUG, page, PER_PAGE);

  return (
    <NewsListing
      initialNews={posts}
      page={page}
      totalPages={totalPages}
      total={total}
      heading="Noida Real Estate News"
      intro="Daily updates on new launches, price movements, RERA & policy changes, and infrastructure across Noida, Greater Noida, Noida Extension & the Yamuna Expressway."
      paginationBasePath="/noida-news"
    />
  );
}
