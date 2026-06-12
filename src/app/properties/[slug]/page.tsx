import { getPropertyBySlug, getProperties, getFeaturedImage, stripHtml } from '@/lib/wordpress';
import { getVideoById } from '@/lib/youtube';
import { notFound } from 'next/navigation';
import PropertyClient from './PropertyClient';

export const revalidate = 60; // Revalidate every minute

interface PageProps {
  params: Promise<{ slug: string }>;
}

function convertDurationToIso(duration: string): string {
  if (!duration) return 'PT10M0S';
  if (duration.startsWith('PT')) return duration;
  const parts = duration.split(':').map(Number);
  if (parts.length === 3) {
    const [h, m, s] = parts;
    return `PT${h}H${m}M${s}S`;
  } else if (parts.length === 2) {
    const [m, s] = parts;
    return `PT${m}M${s}S`;
  }
  return 'PT10M0S';
}

export default async function PropertyPage({ params }: PageProps) {
  const { slug } = await params;
  const property = await getPropertyBySlug(slug);

  if (!property) {
    notFound();
  }

  // Parse prices from string like "₹1.45 Cr - ₹3.10 Cr"
  const priceStr = property.acf?.price || "";
  let priceMin = 5000000; // default 50 Lakhs
  let priceMax = 20000000; // default 2 Crores
  const priceMatches = priceStr.match(/(\d+\.?\d*)\s*(Cr|Lakh|L)/g);
  if (priceMatches) {
    const values = priceMatches.map(val => {
      const num = parseFloat(val.replace(/[^\d\.]/g, ''));
      if (val.includes('Cr')) return num * 10000000;
      if (val.includes('L') || val.includes('Lakh')) return num * 100000;
      return num;
    });
    if (values.length > 0) {
      priceMin = values[0];
      priceMax = values[values.length - 1];
    }
  }

  // Fetch video metadata if available
  const videoId = property.acf?.video_id;
  const video = videoId ? await getVideoById(videoId) : null;

  const realEstateSchema = {
    "@context": "https://schema.org",
    "@type": "RealEstateListing",
    "name": property.title.rendered,
    "description": stripHtml(property.excerpt?.rendered || property.content.rendered).substring(0, 200).trim() + "...",
    "url": `https://www.propertysaraansh.in/properties/${property.slug}`,
    "image": getFeaturedImage(property),
    "about": {
      "@type": "SingleFamilyResidence",
      "name": property.title.rendered,
      "address": {
        "@type": "PostalAddress",
        "addressLocality": property.acf?.location || "Noida",
        "addressRegion": "Uttar Pradesh",
        "addressCountry": "IN"
      },
      "offers": {
        "@type": "AggregateOffer",
        "priceCurrency": "INR",
        "lowPrice": priceMin,
        "highPrice": priceMax,
        "offerCount": 1
      }
    }
  };

  const videoSchema = video ? {
    "@context": "https://schema.org",
    "@type": "VideoObject",
    "name": video.title,
    "description": video.description || `Watch honest video review of ${property.title.rendered} by Property Saraansh.`,
    "thumbnailUrl": [video.thumbnail],
    "uploadDate": (() => {
      if (!video.publishedAt) return "2026-06-11";
      const d = new Date(video.publishedAt);
      return isNaN(d.getTime()) ? "2026-06-11" : d.toISOString().split('T')[0];
    })(),
    "duration": convertDurationToIso(video.duration),
    "embedUrl": `https://www.youtube.com/embed/${video.id}`
  } : null;

  return (
    <>
      {/* Real Estate Listing Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(realEstateSchema) }}
      />
      
      {/* Video Schema if property has review video */}
      {videoSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(videoSchema) }}
        />
      )}
      
      <PropertyClient property={property} />
    </>
  );
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
