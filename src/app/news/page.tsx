import { Metadata } from 'next';
import { getNewsPage } from '@/lib/wordpress';
import { FRONTEND_URL } from '@/lib/seo';
import NewsClient from './NewsClient';

export const revalidate = 60; // Revalidate every minute — news updates daily

const PER_PAGE = 12;

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
    'Daily real estate news for Noida, Greater Noida, Noida Extension & the Yamuna Expressway — new launches, price movements, RERA & policy updates, and infrastructure developments, tracked by Property Saraansh.';

  // Page 1 canonicalises to the bare /news URL; deeper pages self-canonicalise
  // so they remain indexable listing pages in their own right.
  const canonical = page > 1 ? `${FRONTEND_URL}/news?page=${page}` : `${FRONTEND_URL}/news`;

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
    },
  };
}

export default async function News({ searchParams }: PageProps) {
  const page = parsePage((await searchParams).page);
  const { posts, totalPages, total } = await getNewsPage(page, PER_PAGE);

  return (
    <NewsClient
      initialNews={posts}
      page={page}
      totalPages={totalPages}
      total={total}
    />
  );
}
