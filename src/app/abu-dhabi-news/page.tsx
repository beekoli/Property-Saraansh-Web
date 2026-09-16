import { Metadata } from 'next';
import { getNewsPageByCity } from '@/lib/wordpress';
import { FRONTEND_URL } from '@/lib/seo';
import { buildNewsListingJsonLd } from '@/lib/newsListingSchema';
import NewsListing from '@/components/NewsListing';

export const revalidate = 60; // Revalidate every minute — news updates daily

const PER_PAGE = 12;
const CITY_SLUG = 'abu-dhabi-news';
const PAGE_NAME = 'Abu Dhabi Real Estate News';
const DESCRIPTION =
  'Daily Abu Dhabi real estate news — new project launches, price movements, off-plan and freehold updates, regulations and infrastructure across Abu Dhabi and the wider UAE market.';

interface PageProps {
  searchParams: Promise<{ page?: string }>;
}

function parsePage(raw?: string): number {
  const n = Number.parseInt(raw ?? '1', 10);
  return Number.isFinite(n) && n > 0 ? n : 1;
}

export async function generateMetadata({ searchParams }: PageProps): Promise<Metadata> {
  const page = parsePage((await searchParams).page);

  const baseTitle = `${PAGE_NAME} — Daily Market Updates | Property Saraansh`;
  const canonical =
    page > 1 ? `${FRONTEND_URL}/abu-dhabi-news?page=${page}` : `${FRONTEND_URL}/abu-dhabi-news`;

  return {
    title: page > 1 ? `${baseTitle} — Page ${page}` : baseTitle,
    description: DESCRIPTION,
    alternates: { canonical },
    openGraph: {
      title: 'Abu Dhabi Real Estate News — Daily Market Updates',
      description:
        'New launches, price movements, off-plan and freehold updates, regulations and infrastructure news across the Abu Dhabi property market — updated daily.',
      type: 'website',
      siteName: 'Property Saraansh',
      locale: 'en_IN',
      url: canonical,
      images: [`${FRONTEND_URL}/logo.png`],
    },
  };
}

export default async function AbuDhabiNews({ searchParams }: PageProps) {
  const page = parsePage((await searchParams).page);
  const { posts, totalPages, total } = await getNewsPageByCity(CITY_SLUG, page, PER_PAGE);

  const jsonLd = buildNewsListingJsonLd({
    path: '/abu-dhabi-news',
    cityLabel: 'Abu Dhabi',
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
        intro="Your daily briefing on the Abu Dhabi property market — new project launches, off-plan and freehold price movements, regulatory updates, and the infrastructure shaping Abu Dhabi and the wider UAE."
        paginationBasePath="/abu-dhabi-news"
      />
    </>
  );
}
