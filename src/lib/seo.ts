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
