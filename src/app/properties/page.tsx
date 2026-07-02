import { Metadata } from 'next';
import { getProperties } from '@/lib/wordpress';
import PropertiesClient from './PropertiesClient';

export const revalidate = 60; // Revalidate every minute

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: `Premium Real Estate Projects in Noida | Property Saraansh`,
    description: `Discover luxury apartments, builder floors, commercial shops, and plots in Noida, Greater Noida, and Yamuna Expressway. Verified reviews and direct site reports.`,
  };
}

export default async function Properties() {
  const properties = await getProperties(50); // Fetch up to 50 projects

  return <PropertiesClient properties={properties} />;
}
