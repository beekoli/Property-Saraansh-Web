import { Metadata } from 'next';
import { generateRankMathMetadata, getRewrittenSchema } from '@/lib/seo';
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

  const allProperties = await getProperties(100);

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

  const productSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": property.title.rendered,
    "image": getFeaturedImage(property),
    "description": stripHtml(property.excerpt?.rendered || property.content.rendered).substring(0, 200).trim() + "...",
    "brand": {
      "@type": "Brand",
      "name": property.acf?.developer || "Property Saraansh"
    },
    "offers": {
      "@type": "AggregateOffer",
      "priceCurrency": "INR",
      "lowPrice": priceMin,
      "highPrice": priceMax,
      "offerCount": 1,
      "priceValidUntil": "2027-12-31",
      "availability": "https://schema.org/InStock",
      "url": `https://www.propertysaraansh.in/properties/${property.slug}`
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

  // Extract FAQs for Schema
  const faqs: Array<{ question: string; answer: string }> = [];
  for (let i = 1; i <= 5; i++) {
    const q = property.acf?.[`faq_${i}_question` as keyof typeof property.acf];
    const a = property.acf?.[`faq_${i}_answer` as keyof typeof property.acf];
    if (q && typeof q === 'string' && q.trim() && a && typeof a === 'string' && a.trim()) {
      faqs.push({
        question: q.trim(),
        answer: a.trim()
      });
    }
  }

  const faqSchema = faqs.length > 0 ? {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map(faq => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
  } : null;

  const seoJson = (property as unknown as Record<string, unknown>).rank_math_json || property.yoast_head_json;
  const rankMathSchema = getRewrittenSchema(seoJson);

  return (
    <>
      {/* Real Estate Listing Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(realEstateSchema) }}
      />
      
      {/* Product Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
      />
      
      {/* Video Schema if property has review video */}
      {videoSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(videoSchema) }}
        />
      )}

      {/* FAQ Schema if FAQs are present */}
      {faqSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      )}
      {rankMathSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: rankMathSchema }}
        />
      )}
      
      <PropertyClient property={property} allProperties={allProperties} />
    </>
  );
}

export async function generateStaticParams() {
  const properties = await getProperties(100); // Fetch up to 100 properties to pre-render
  return properties.map((prop) => ({
    slug: prop.slug,
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const property = await getPropertyBySlug(slug);

  if (!property) {
    return {
      title: 'Property Not Found',
    };
  }

  const fallbackTitle = `${property.title.rendered} | Property Saraansh`;
  const fallbackDesc = property.excerpt?.rendered?.replace(/<[^>]*>?/gm, '') || `View details for ${property.title.rendered}`;
  
  // Prefer RankMath JSON, fallback to Yoast
  const seoJson = (property as unknown as Record<string, unknown>).rank_math_json || property.yoast_head_json;

  return generateRankMathMetadata(seoJson, fallbackTitle, fallbackDesc);
}
