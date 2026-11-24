import { getLatestNews } from '@/lib/wordpress';
import { FRONTEND_URL, wpDateToISO8601 } from '@/lib/seo';

/**
 * Google News sitemap — lists news articles published in the last 48 hours
 * (Google News only reads that window). Listed in robots.ts alongside the
 * main sitemap; new WordPress News posts appear here within the revalidate window.
 */
export const revalidate = 600;

const esc = (s: string) =>
  s
    .replace(/&#x([0-9a-fA-F]+);/g, (_, h) => String.fromCodePoint(parseInt(h, 16)))
    .replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(parseInt(n, 10)))
    .replace(/&nbsp;/g, ' ')
    .replace(/<[^>]*>/g, '')
    .replace(/&(?!amp;|lt;|gt;|quot;|apos;)/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

export async function GET() {
  const cutoff = Date.now() - 48 * 60 * 60 * 1000;
  let items: string[] = [];
  try {
    const news = await getLatestNews(100);
    items = news
      .filter((n) => new Date(wpDateToISO8601(n.date_gmt, n.date)).getTime() >= cutoff)
      .map(
        (n) => `  <url>
    <loc>${FRONTEND_URL}/news/${n.slug}</loc>
    <news:news>
      <news:publication><news:name>Property Saraansh</news:name><news:language>en</news:language></news:publication>
      <news:publication_date>${wpDateToISO8601(n.date_gmt, n.date)}</news:publication_date>
      <news:title>${esc(n.title.rendered)}</news:title>
    </news:news>
  </url>`
      );
  } catch (err) {
    console.error('Error generating news sitemap:', err);
  }

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:news="http://www.google.com/schemas/sitemap-news/0.9">
${items.join('\n')}
</urlset>`;

  return new Response(xml, {
    headers: { 'Content-Type': 'application/xml; charset=utf-8', 'Cache-Control': 'public, s-maxage=600, stale-while-revalidate=3600' },
  });
}
