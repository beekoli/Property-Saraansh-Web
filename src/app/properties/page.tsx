import { Metadata } from 'next';
import { getProperties } from '@/lib/wordpress';
import PropertiesClient from './PropertiesClient';
import { buildPageMetadata } from '@/lib/seo';

export const revalidate = 60; // Revalidate every minute

export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata({
    path: '/properties',
    title: `Premium Real Estate Projects in Noida | Property Saraansh`,
    description: `Discover luxury apartments, builder floors, commercial shops, and plots in Noida, Greater Noida, and Yamuna Expressway. Verified reviews and direct site reports.`,
  });
}

export default async function Properties() {
  // 100 is the WordPress REST per_page ceiling. This was 50, which silently
  // dropped the 4 oldest-published projects — including two 2026 launches —
  // once the catalogue grew past 50.
  const properties = await getProperties(100);

  return <PropertiesClient properties={properties} />;
}
