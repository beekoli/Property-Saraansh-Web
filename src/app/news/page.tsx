import { Metadata } from 'next';
import { getLatestNews } from '@/lib/wordpress';
import NewsClient from './NewsClient';

export const revalidate = 60; // Revalidate every minute — news updates daily

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Noida Real Estate News — Daily Market Updates | Property Saraansh',
    description:
      'Daily real estate news for Noida, Greater Noida, Noida Extension & the Yamuna Expressway — new launches, price movements, RERA & policy updates, and infrastructure developments, tracked by Property Saraansh.',
    alternates: { canonical: 'https://www.propertysaraansh.com/news' },
    openGraph: {
      title: 'Noida Real Estate News — Daily Market Updates',
      description:
        'New launches, price movements, RERA/policy updates and infrastructure news across the Noida property market — updated daily.',
      type: 'website',
      siteName: 'Property Saraansh',
      locale: 'en_IN',
    },
  };
}

export default async function News() {
  const news = await getLatestNews(24);
  return <NewsClient initialNews={news} />;
}
