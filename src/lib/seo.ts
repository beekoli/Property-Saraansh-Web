export interface LocalBusinessSchemaProps {
  name: string;
  url: string;
  logo: string;
  image: string;
  description: string;
  telephone: string;
  addressLocality: string;
  addressRegion: string;
  postalCode: string;
  streetAddress: string;
  youtubeUrl?: string;
}

export interface RealEstateListingSchemaProps {
  name: string;
  description: string;
  image: string;
  priceMin: number;
  priceMax: number;
  priceCurrency: string;
  addressLocality: string;
  addressRegion: string;
  propertyType: string;
  developer: string;
}

/**
 * Generate JSON-LD Schema for LocalBusiness
 */
export function generateLocalBusinessSchema(props: LocalBusinessSchemaProps) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "RealEstateAgent",
    "name": props.name,
    "url": props.url,
    "logo": props.logo,
    "image": props.image,
    "description": props.description,
    "telephone": props.telephone,
    "priceRange": "$$$$",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": props.streetAddress,
      "addressLocality": props.addressLocality,
      "addressRegion": props.addressRegion,
      "postalCode": props.postalCode,
      "addressCountry": "IN"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": 28.5355,
      "longitude": 77.3910
    },
    "sameAs": [
      props.youtubeUrl || "https://www.youtube.com",
      "https://www.instagram.com/propertysaraansh",
      "https://www.facebook.com/propertysaraansh"
    ]
  };

  return JSON.stringify(schema);
}

/**
 * Generate JSON-LD Schema for RealEstateListing
 */
export function generateRealEstateListingSchema(props: RealEstateListingSchemaProps) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "RealEstateListing",
    "name": props.name,
    "description": props.description,
    "url": `https://propertysaraansh.com/properties/${props.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`,
    "image": props.image,
    "about": {
      "@type": "SingleFamilyResidence",
      "name": props.name,
      "address": {
        "@type": "PostalAddress",
        "addressLocality": props.addressLocality,
        "addressRegion": props.addressRegion,
        "addressCountry": "IN"
      },
      "offers": {
        "@type": "AggregateOffer",
        "priceCurrency": props.priceCurrency || "INR",
        "lowPrice": props.priceMin,
        "highPrice": props.priceMax,
        "offerCount": 1
      }
    }
  };

  return JSON.stringify(schema);
}

const FRONTEND_URL = 'https://www.propertysaraansh.in';

export function getWPBaseUrl() {
  const apiUrl = process.env.NEXT_PUBLIC_WORDPRESS_API_URL || '';
  return apiUrl.replace('/wp-json', '').replace(/\/$/, '');
}

/**
 * Replaces any occurrence of the WordPress backend URL with the Next.js frontend URL
 * inside strings or stringified objects.
 */
export function rewriteUrlToFrontend(text: string): string {
  if (!text) return text;
  const wpBaseUrl = getWPBaseUrl();
  if (!wpBaseUrl) return text;

  // Replace backend URL with frontend URL globally
  const regex = new RegExp(wpBaseUrl.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g');
  return text.replace(regex, FRONTEND_URL);
}

import { Metadata } from 'next';

export interface SEOJson {
  title?: string;
  description?: string;
  og_title?: string;
  og_description?: string;
  og_url?: string;
  og_site_name?: string;
  og_image?: Array<{ url: string; width?: number; height?: number; type?: string }>;
  og_locale?: string;
  og_type?: string;
  twitter_card?: string;
  twitter_title?: string;
  twitter_description?: string;
  twitter_image?: string;
  canonical?: string;
  robots?: { index?: string; follow?: string; 'max-image-preview'?: string; 'max-snippet'?: string; 'max-video-preview'?: string };
  schema?: unknown;
}

/**
 * Generates a Next.js Metadata object from RankMath/Yoast JSON data.
 * The raw JSON object is usually exposed in the REST API as `yoast_head_json` or `rank_math_json`.
 */
export function generateRankMathMetadata(seoJson: SEOJson | null | undefined, fallbackTitle: string, fallbackDescription: string): Metadata {
  if (!seoJson) {
    return {
      title: fallbackTitle,
      description: fallbackDescription,
    };
  }

  return {
    title: seoJson.title || fallbackTitle,
    description: seoJson.description || fallbackDescription,
    openGraph: {
      title: seoJson.og_title || seoJson.title || fallbackTitle,
      description: seoJson.og_description || seoJson.description || fallbackDescription,
      url: seoJson.og_url ? rewriteUrlToFrontend(seoJson.og_url) : undefined,
      siteName: seoJson.og_site_name || 'Property Saraansh',
      images: seoJson.og_image?.map((img) => ({
        url: rewriteUrlToFrontend(img.url),
        width: img.width,
        height: img.height,
        type: img.type,
      })) || [],
      locale: seoJson.og_locale || 'en_IN',
      type: (seoJson.og_type as "website" | "article") || 'website',
    },
    twitter: {
      card: (seoJson.twitter_card as "summary_large_image" | "summary" | "player" | "app") || 'summary_large_image',
      title: seoJson.twitter_title || seoJson.title || fallbackTitle,
      description: seoJson.twitter_description || seoJson.description || fallbackDescription,
      images: seoJson.twitter_image ? [rewriteUrlToFrontend(seoJson.twitter_image)] : undefined,
    },
    alternates: {
      canonical: seoJson.canonical ? rewriteUrlToFrontend(seoJson.canonical) : undefined,
    },
    robots: {
      index: seoJson.robots?.index !== 'noindex',
      follow: seoJson.robots?.follow !== 'nofollow',
    }
  };
}

/**
 * Extracts and rewrites the Schema (JSON-LD) object provided by RankMath/Yoast.
 */
export function getRewrittenSchema(seoJson: SEOJson | null | undefined): string | null {
  if (!seoJson || !seoJson.schema) return null;
  
  // Convert the schema object to string
  const rawSchema = JSON.stringify(seoJson.schema);
  
  // Rewrite backend URLs to frontend URLs
  const rewrittenSchema = rewriteUrlToFrontend(rawSchema);
  
  return rewrittenSchema;
}
