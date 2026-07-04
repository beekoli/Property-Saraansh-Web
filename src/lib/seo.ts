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
    "url": `${FRONTEND_URL}/properties/${props.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`,
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

export const FRONTEND_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.propertysaraansh.com';

export function getWPBaseUrl() {
  const wpUrl = process.env.NEXT_PUBLIC_WORDPRESS_URL;
  if (wpUrl) {
    return wpUrl.replace(/\/$/, '');
  }
  const apiUrl = process.env.NEXT_PUBLIC_WORDPRESS_API_URL || '';
  const idx = apiUrl.indexOf('/wp-json');
  if (idx !== -1) {
    return apiUrl.substring(0, idx);
  }
  return apiUrl.replace(/\/$/, '');
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
 * Decode common WordPress HTML entities so metadata doesn't show raw entity codes.
 * WordPress stores titles/descriptions with HTML-encoded special chars (e.g. &amp; for &).
 * If passed through to Next.js Metadata as-is, Next.js re-encodes them → &amp;amp; double-encoding.
 */
function decodeWPEntities(str: string): string {
  if (!str) return str;
  return str
    .replace(/&amp;/g, '&')
    .replace(/&#038;/g, '&')
    .replace(/&#8211;/g, '–')
    .replace(/&#8212;/g, '—')
    .replace(/&#8216;/g, '‘')
    .replace(/&#8217;/g, '’')
    .replace(/&#8220;/g, '“')
    .replace(/&#8221;/g, '”')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'");
}

/**
 * Generates a Next.js Metadata object from RankMath/Yoast JSON data.
 * The raw JSON object is usually exposed in the REST API as `yoast_head_json` or `rank_math_json`.
 */
export function generateRankMathMetadata(seoJson: SEOJson | null | undefined, fallbackTitle: string, fallbackDescription: string): Metadata {
  if (!seoJson) {
    // No SEO plugin data — still emit full OG/Twitter so social shares work
    return {
      title: fallbackTitle,
      description: fallbackDescription,
      openGraph: {
        title: fallbackTitle,
        description: fallbackDescription,
        siteName: 'Property Saraansh',
        locale: 'en_IN',
        type: 'article',
      },
      twitter: {
        card: 'summary_large_image',
        title: fallbackTitle,
        description: fallbackDescription,
      },
    };
  }

  const title = decodeWPEntities(seoJson.title || fallbackTitle);
  const description = decodeWPEntities(seoJson.description || fallbackDescription);
  const ogTitle = decodeWPEntities(seoJson.og_title || seoJson.title || fallbackTitle);
  const ogDescription = decodeWPEntities(seoJson.og_description || seoJson.description || fallbackDescription);
  const twitterTitle = decodeWPEntities(seoJson.twitter_title || seoJson.title || fallbackTitle);
  const twitterDescription = decodeWPEntities(seoJson.twitter_description || seoJson.description || fallbackDescription);

  return {
    title,
    description,
    openGraph: {
      title: ogTitle,
      description: ogDescription,
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
      title: twitterTitle,
      description: twitterDescription,
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

/**
 * Ensures a date string is parsed and formatted as a valid ISO 8601 string
 * WITH timezone, as required by Google Search Console for VideoObject schema.
 * Output format: "2026-06-16T00:00:00+05:30"
 */
export function parseDateToISO8601(dateStr: string | undefined | null): string {
  const fallback = "2026-06-11T00:00:00+05:30";
  if (!dateStr) return fallback;

  const str = dateStr.toLowerCase();
  const now = new Date();

  const formatDate = (d: Date) => {
    const pad = (n: number) => n.toString().padStart(2, '0');
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T00:00:00+05:30`;
  };

  // If already has timezone info, return as-is
  if (dateStr.includes('T') && (dateStr.includes('+') || dateStr.includes('Z'))) {
    return dateStr;
  }

  // If it's a date with T but no timezone, append IST
  if (dateStr.includes('T')) {
    return dateStr + '+05:30';
  }

  if (str.includes('ago') || str === 'recently') {
    if (str.includes('day')) {
      const match = str.match(/\d+/);
      if (match) now.setDate(now.getDate() - parseInt(match[0], 10));
    } else if (str.includes('week')) {
      const match = str.match(/\d+/);
      if (match) now.setDate(now.getDate() - parseInt(match[0], 10) * 7);
    } else if (str.includes('month')) {
      const match = str.match(/\d+/);
      if (match) now.setMonth(now.getMonth() - parseInt(match[0], 10));
    } else if (str.includes('year')) {
      const match = str.match(/\d+/);
      if (match) now.setFullYear(now.getFullYear() - parseInt(match[0], 10));
    }
    return formatDate(now);
  }

  const parsed = new Date(dateStr);
  if (!isNaN(parsed.getTime())) {
    return formatDate(parsed);
  }

  return fallback;
}

/**
 * Converts a display duration (e.g. "14:39" or "1:19:35") to ISO 8601 format (e.g. "PT14M39S").
 * Also handles durations already in ISO format (e.g. "PT14M39S").
 */
export function durationToISO8601(duration: string | undefined | null): string {
  if (!duration) return 'PT10M0S';
  // Already ISO 8601
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
