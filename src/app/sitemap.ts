import { MetadataRoute } from 'next';
import { getLatestBlogs, getLatestNews, getProperties, getBuilders } from '@/lib/wordpress';
import { getCities } from '@/lib/property';
import { videos } from '@/lib/videos';

export const revalidate = 3600; // Revalidate sitemap every hour

const BLOG_LIMIT = 100;
const BLOG_PER_PAGE = 12; // must match PER_PAGE in src/app/blog/page.tsx

/**
 * Resolve a trustworthy lastmod for a WordPress item.
 *
 * Previously every blog and property URL was stamped with `new Date()`, which
 * meant the whole sitemap claimed to have changed on every hourly regeneration.
 * Google detects that pattern and stops trusting lastmod altogether, which
 * suppresses recrawl priority across the entire site. Always prefer the real
 * modified/published timestamp and only fall back to "now" when neither exists.
 */
function resolveLastModified(item: { modified?: string; date?: string }): Date {
  const raw = item.modified || item.date;
  if (!raw) return new Date();
  const parsed = new Date(raw);
  return Number.isNaN(parsed.getTime()) ? new Date() : parsed;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.propertysaraansh.com';

  // 1. Static Routes
  const staticRoutes: MetadataRoute.Sitemap = [
    '',
    '/about-us',
    '/contact',
    '/properties',
    '/commercial-properties',
    '/residential-properties',
    '/our-videos',
    '/our-shorts',
    '/blog',
    // News is split into two city listings (/news itself 308-redirects to
    // /noida-news, so it is intentionally omitted here).
    '/noida-news',
    '/pune-news',
    // Previously absent from the sitemap entirely: /builders is a hub linking
    // 20 developer pages, and these two are legitimate indexable content.
    '/builders',
    '/our-team',
    '/careers',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'daily',
    priority: route === '' ? 1.0 : 0.8,
  }));

  // 1b. Builder detail pages — 20 URLs Google could previously only reach by
  // crawling, with no sitemap signal at all.
  let builderRoutes: MetadataRoute.Sitemap = [];
  try {
    const builders = await getBuilders();
    builderRoutes = builders.map((builder) => ({
      url: `${baseUrl}/builders/${builder.slug}`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.6,
    }));
  } catch (err) {
    console.error('Error generating sitemap builder routes:', err);
  }

  // 1c. City landing pages (/property-in/[city]) — high-intent local pages that
  // were also missing from the sitemap.
  let cityRoutes: MetadataRoute.Sitemap = [];
  try {
    const cities = await getCities();
    cityRoutes = cities.map((city) => ({
      url: `${baseUrl}/property-in/${city.slug}`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.7,
    }));
  } catch (err) {
    console.error('Error generating sitemap city routes:', err);
  }

  // 2. Dynamic Property Routes
  let propertyRoutes: MetadataRoute.Sitemap = [];
  try {
    const properties = await getProperties(100);
    propertyRoutes = properties.map((property) => ({
      url: `${baseUrl}/properties/${property.slug}`,
      lastModified: resolveLastModified(property as { modified?: string; date?: string }),
      changeFrequency: 'weekly',
      priority: 0.7,
    }));
  } catch (err) {
    console.error('Error generating sitemap property routes:', err);
  }

  // 3. Dynamic Blog Routes
  let blogRoutes: MetadataRoute.Sitemap = [];
  // 3a. Paginated /blog listing pages. These are the crawl paths that keep
  // older articles linked, so they belong in the sitemap alongside the posts.
  const blogListingRoutes: MetadataRoute.Sitemap = [];
  try {
    const blogs = await getLatestBlogs(BLOG_LIMIT);
    blogRoutes = blogs.map((blog) => ({
      url: `${baseUrl}/blog/${blog.slug}`,
      lastModified: resolveLastModified(blog),
      changeFrequency: 'weekly',
      priority: 0.6,
    }));

    const totalListingPages = Math.ceil(blogs.length / BLOG_PER_PAGE);
    for (let page = 2; page <= totalListingPages; page++) {
      blogListingRoutes.push({
        url: `${baseUrl}/blog?page=${page}`,
        lastModified: new Date(),
        changeFrequency: 'daily',
        priority: 0.5,
      });
    }
  } catch (err) {
    console.error('Error generating sitemap blog routes:', err);
  }

  // 3b. Dynamic News Routes
  let newsRoutes: MetadataRoute.Sitemap = [];
  try {
    const news = await getLatestNews(100);
    newsRoutes = news.map((item) => ({
      url: `${baseUrl}/news/${item.slug}`,
      lastModified: resolveLastModified(item),
      changeFrequency: 'daily',
      priority: 0.7,
    }));
  } catch (err) {
    console.error('Error generating sitemap news routes:', err);
  }

  // 4. Dynamic Video Watch Routes
  const videoRoutes: MetadataRoute.Sitemap = videos.map((video) => ({
    url: `${baseUrl}/our-videos/${video.slug}`,
    lastModified: new Date(video.publishedAt),
    changeFrequency: 'monthly',
    priority: 0.8,
  }));

  return [
    ...staticRoutes,
    ...blogListingRoutes,
    ...cityRoutes,
    ...builderRoutes,
    ...propertyRoutes,
    ...blogRoutes,
    ...newsRoutes,
    ...videoRoutes,
  ];
}
