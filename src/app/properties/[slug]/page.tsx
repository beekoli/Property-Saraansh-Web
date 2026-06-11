import { getPropertyBySlug, getProperties } from '@/lib/wordpress';
import { notFound } from 'next/navigation';
import PropertyClient from './PropertyClient';

export const revalidate = 60; // Revalidate every minute

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function PropertyPage({ params }: PageProps) {
  const { slug } = await params;
  const property = await getPropertyBySlug(slug);

  if (!property) {
    notFound();
  }

  return <PropertyClient property={property} />;
}

export async function generateStaticParams() {
  const properties = await getProperties(100); // Fetch up to 100 properties to pre-render
  return properties.map((prop) => ({
    slug: prop.slug,
  }));
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const property = await getPropertyBySlug(slug);

  if (!property) {
    return {
      title: 'Property Not Found',
    };
  }

  return {
    title: `${property.title.rendered} | Property Saraansh`,
    description: property.excerpt?.rendered?.replace(/<[^>]*>?/gm, '') || `View details for ${property.title.rendered}`,
  };
}
