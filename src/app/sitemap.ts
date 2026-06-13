import { MetadataRoute } from 'next';
import { getLatestBlogs, getProperties } from '@/lib/wordpress';
import { videos } from '@/lib/videos';

export const revalidate = 3600; // Revalidate sitemap every hour

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.propertysaraansh.in';

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
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'daily',
    priority: route === '' ? 1.0 : 0.8,
  }));

  // 2. Dynamic Property Routes
  let propertyRoutes: MetadataRoute.Sitemap = [];
  try {
    const properties = await getProperties(100);
    propertyRoutes = properties.map((property) => ({
      url: `${baseUrl}/properties/${property.slug}`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.7,
    }));
  } catch (err) {
    console.error('Error generating sitemap property routes:', err);
  }

  // 3. Dynamic Blog Routes
  let blogRoutes: MetadataRoute.Sitemap = [];
  try {
    const blogs = await getLatestBlogs(100);
    blogRoutes = blogs.map((blog) => ({
      url: `${baseUrl}/blog/${blog.slug}`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.6,
    }));
  } catch (err) {
    console.error('Error generating sitemap blog routes:', err);
  }

  // 4. Dynamic Video Watch Routes
  const videoRoutes: MetadataRoute.Sitemap = videos.map((video) => ({
    url: `${baseUrl}/our-videos/${video.slug}`,
    lastModified: new Date(video.publishedAt),
    changeFrequency: 'monthly',
    priority: 0.8,
  }));

  return [...staticRoutes, ...propertyRoutes, ...blogRoutes, ...videoRoutes];
}
