import { FRONTEND_URL } from '@/lib/seo';
import { decodeHtml } from '@/lib/decodeHtml';
import type { WPPost } from '@/lib/wordpress';

/**
 * Structured data for a city News listing page (/noida-news, /pune-news).
 *
 * Returns a CollectionPage whose mainEntity is an ItemList of the news stories
 * on the page (each pointing at its /news/{slug} article), plus a BreadcrumbList
 * (Home > {City} News). The individual article pages already emit NewsArticle
 * schema; this gives the listing pages their own structured data so Google can
 * understand them as curated news collections.
 */
export function buildNewsListingJsonLd(opts: {
  path: string; // e.g. '/noida-news'
  cityLabel: string; // e.g. 'Noida'
  name: string;
  description: string;
  posts: WPPost[];
  page: number;
  perPage: number;
}): Record<string, unknown>[] {
  const { path, cityLabel, name, description, posts, page, perPage } = opts;
  const url = `${FRONTEND_URL}${path}`;

  const collection: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name,
    description,
    url,
    isPartOf: { '@type': 'WebSite', name: 'Property Saraansh', url: FRONTEND_URL },
  };

  if (posts.length > 0) {
    collection.mainEntity = {
      '@type': 'ItemList',
      itemListElement: posts.map((p, i) => ({
        '@type': 'ListItem',
        position: (page - 1) * perPage + i + 1,
        url: `${FRONTEND_URL}/news/${p.slug}`,
        name: decodeHtml(p.title?.rendered || ''),
      })),
    };
  }

  const breadcrumb: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: FRONTEND_URL },
      { '@type': 'ListItem', position: 2, name: `${cityLabel} News`, item: url },
    ],
  };

  return [collection, breadcrumb];
}
