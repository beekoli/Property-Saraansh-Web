import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { generateRankMathMetadata } from '@/lib/seo';
import { getProperty, getAllPropertySlugs, buildSchemas, SITE } from '@/lib/property';
import PropertyDetail from '@/components/property/PropertyDetail';

export const revalidate = 300;

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const slugs = await getAllPropertySlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const p = await getProperty(slug);
  if (!p) return { title: 'Property Not Found' };

  const fallbackTitle = `${p.title} | Price, Floor Plan & Review — Property Saraansh`;
  const fallbackDesc = p.tagline || `View price, floor plans, payment plan and our video review of ${p.title}.`;
  const url = `${SITE}/properties/${p.slug}`;

  // Priority: new ACF SEO tab (meta_title/meta_description, with seo_title
  // fallback inside lib) → RankMath/Yoast JSON → fallbacks
  const metadata = generateRankMathMetadata(p.seoJson, fallbackTitle, fallbackDesc);

  if (p.metaTitle) {
    metadata.title = p.metaTitle;
    if (metadata.openGraph) (metadata.openGraph as Record<string, unknown>).title = p.metaTitle;
    if (metadata.twitter) (metadata.twitter as Record<string, unknown>).title = p.metaTitle;
  }
  if (p.metaDescription) {
    metadata.description = p.metaDescription;
    if (metadata.openGraph) (metadata.openGraph as Record<string, unknown>).description = p.metaDescription;
    if (metadata.twitter) (metadata.twitter as Record<string, unknown>).description = p.metaDescription;
  }

  metadata.alternates = { ...(metadata.alternates ?? {}), canonical: url };
  if (p.hero) {
    metadata.openGraph = {
      ...(metadata.openGraph ?? {}),
      url,
      images: [{ url: p.hero.url, width: 1200, height: 630, alt: p.title }],
    } as Metadata['openGraph'];
  }

  return metadata;
}

export default async function PropertyPage({ params }: PageProps) {
  const { slug } = await params;
  const property = await getProperty(slug);
  if (!property) notFound();

  return (
    <>
      {buildSchemas(property).map((schema, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}
      <PropertyDetail p={property} />
    </>
  );
}
