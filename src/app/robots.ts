import { MetadataRoute } from 'next';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.propertysaraansh.com';

export default function robots(): MetadataRoute.Robots {
  // Preview / branch deployments must never be indexed. Without this, every
  // *.vercel.app host is a fully crawlable duplicate of the production site,
  // which splits crawl budget and creates duplicate-content candidates.
  const isProduction = process.env.VERCEL_ENV
    ? process.env.VERCEL_ENV === 'production'
    : process.env.NODE_ENV === 'production';

  if (!isProduction) {
    return {
      rules: {
        userAgent: '*',
        disallow: '/',
      },
    };
  }

  return {
    rules: {
      userAgent: '*',
      allow: '/',
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
