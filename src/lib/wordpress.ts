import { decodeHtml } from '@/lib/decodeHtml';

const API_URL = process.env.NEXT_PUBLIC_WORDPRESS_API_URL;

export interface WPPost {
  id: number;
  date: string;
  modified?: string;
  slug: string;
  title: {
    rendered: string;
  };
  excerpt: {
    rendered: string;
  };
  content: {
    rendered: string;
  };
  acf?: {
    video_id?: string;
  };
  /** YouTube video ID set per-post in the WordPress backend (Custom Field key: ps_video_id). */
  ps_video_id?: string;
  yoast_head?: string;
  yoast_head_json?: Record<string, unknown>;
  rank_math_json?: Record<string, unknown>;
  _embedded?: {
    'wp:featuredmedia'?: Array<{
      source_url: string;
    }>;
    'wp:term'?: Array<Array<{
      id: number;
      name: string;
      slug: string;
    }>>;
  };
}

export interface WPPage {
  id: number;
  slug: string;
  title: {
    rendered: string;
  };
  content: {
    rendered: string;
  };
  acf?: Record<string, string>;
  yoast_head?: string;
  yoast_head_json?: {
    title?: string;
    description?: string;
    og_title?: string;
    og_description?: string;
    og_image?: Array<{ url: string }>;
  };
}

export interface WPProperty {
  id: number;
  slug: string;
  title: {
    rendered: string;
  };
  content: {
    rendered: string;
  };
  excerpt?: {
    rendered: string;
  };
  /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
  acf: any;
  _embedded?: {
    'wp:featuredmedia'?: Array<{
      source_url: string;
    }>;
    'wp:term'?: Array<Array<{
      id: number;
      name: string;
      slug: string;
      taxonomy?: string;
    }>>;
  };
  property_gallery?: string[];
  yoast_head?: string;
  yoast_head_json?: {
    title?: string;
    description?: string;
    og_title?: string;
    og_description?: string;
    og_image?: Array<{ url: string }>;
    canonical?: string;
  };
  rank_math_json?: Record<string, unknown>;
}

// --- Builder Taxonomy Integration ---
// WordPress taxonomy: ps_builder (attached to the "properties" CPT, REST base "builder")
// ACF field group "Builder Profile" (see ps-core.php) on each builder term:
//   builder_logo, builder_description, builder_experience,
//   builder_delivered_projects, builder_ongoing_projects
export interface WPBuilderTerm {
  id: number;
  name: string;
  slug: string;
  count: number;
  acf?: {
    builder_logo?: string | false;
    builder_description?: string;
    builder_experience?: string;
    builder_delivered_projects?: string;
    builder_ongoing_projects?: string;
  };
}

export async function getBuilders(): Promise<WPBuilderTerm[]> {
  const data = await fetchAPI(`/builder?per_page=100&_fields=id,name,slug,count,acf`);
  return data && Array.isArray(data)
    ? (data as WPBuilderTerm[]).map((b) => ({ ...b, name: decodeHtml(b.name) }))
    : [];
}

export async function getBuilderBySlug(slug: string): Promise<WPBuilderTerm | null> {
  const data = await fetchAPI(`/builder?slug=${slug}&_fields=id,name,slug,count,acf`);
  if (data && Array.isArray(data) && data.length > 0) {
    const b = data[0] as WPBuilderTerm;
    return { ...b, name: decodeHtml(b.name) };
  }
  return null;
}

export async function getPropertiesByBuilder(termId: number, limit = 50): Promise<WPProperty[]> {
  const data = await fetchAPI(`/properties?_embed&per_page=${limit}&builder=${termId}`);
  return data && Array.isArray(data) && data.length > 0 ? data : [];
}

// --- Video CPT Integration ---
// WordPress CPT slug: ps_video
export interface WPVideo {
  id: number;
  slug: string;
  title: { rendered: string };
  acf: {
    short_description?: string;
    about_this_video?: string;
    meta_title?: string;
    meta_description?: string;
    youtube_id?: string;
  };
}

export async function getWPVideoBySlug(slug: string): Promise<WPVideo | null> {
  const data = await fetchAPI(
    `/ps_video?slug=${slug}&acf_format=standard&_fields=id,slug,title,acf`
  );
  if (data && Array.isArray(data) && data.length > 0) return data[0] as WPVideo;
  return null;
}

export async function getWPVideos(limit = 100): Promise<WPVideo[]> {
  const data = await fetchAPI(
    `/ps_video?acf_format=standard&per_page=${limit}&_fields=id,slug,title,acf`
  );
  return data && Array.isArray(data) ? (data as WPVideo[]) : [];
}

import propertiesData from '@/data/properties.json';
import blogsData from '@/data/blogs.json';
import newsData from '@/data/news.json';

// Fallback Mock Blog Data
export const MOCK_BLOGS: WPPost[] = blogsData as WPPost[];

// Fallback Mock Property Data (Matches mockup exactly)
export const MOCK_PROPERTIES: WPProperty[] = propertiesData as WPProperty[];

// Fallback Daily-News Data. Empty by default — the real news comes from the
// WordPress "News" category (see getLatestNews). This exists only so the /news
// route still renders (an empty state) when the WordPress API is unreachable.
export const MOCK_NEWS: WPPost[] = newsData as WPPost[];

/**
 * Rewrite the WordPress host -> frontend host for page/post links, but NEVER
 * for media (/wp-content, /wp-includes). Media must keep pointing at
 * WordPress: next.config's images.remotePatterns already allows that host,
 * and the /wp-content proxy rewrite does not actually resolve — so a
 * rewritten image URL 404s. The negative lookahead also tolerates
 * JSON-escaped slashes (\/), which is how WordPress encodes URLs.
 */
function rewriteWordPressHost(rawText: string): string {
  const wpUrl = process.env.NEXT_PUBLIC_WORDPRESS_URL || 'https://login.propertysaraansh.com';
  const frontendUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.propertysaraansh.com';

  const wpHost = wpUrl.replace(/^https?:\/\//, '').replace(/\/$/, '');
  const frontendHost = frontendUrl.replace(/^https?:\/\//, '').replace(/\/$/, '');

  if (!wpHost || !frontendHost || wpHost === frontendHost) return rawText;

  const wpHostEscaped = wpHost.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const hostRegex = new RegExp(
    wpHostEscaped + '(?!\\\\?/wp-content|\\\\?/wp-includes)',
    'g'
  );
  return rawText.replace(hostRegex, frontendHost);
}

async function fetchAPI(endpoint: string) {
  if (!API_URL) {
    return null;
  }
  try {
    const res = await fetch(`${API_URL}${endpoint}`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) return null;
    return JSON.parse(rewriteWordPressHost(await res.text()));
  } catch (err) {
    console.error("WordPress Fetch Error:", err);
    return null;
  }
}

/**
 * Same as fetchAPI, but also surfaces the WordPress pagination headers.
 * WordPress returns the collection size in X-WP-Total and the number of
 * available pages in X-WP-TotalPages; we need those to render real pagination
 * links on /blog so that no post is left without an internal link.
 *
 * Kept separate from fetchAPI so that fetchAPI's loose return type (JSON.parse
 * yields `any`) stays intact for its many existing callers.
 */
async function fetchAPIWithMeta(
  endpoint: string
): Promise<{ data: unknown; total: number; totalPages: number } | null> {
  if (!API_URL) {
    return null;
  }
  try {
    const res = await fetch(`${API_URL}${endpoint}`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) return null;

    return {
      data: JSON.parse(rewriteWordPressHost(await res.text())),
      total: Number(res.headers.get('x-wp-total') || 0),
      totalPages: Number(res.headers.get('x-wp-totalpages') || 0),
    };
  } catch (err) {
    console.error("WordPress Fetch Error:", err);
    return null;
  }
}

/**
 * Resolve the WordPress term id of the "News" category (slug: news).
 * The daily Real Estate News section is a normal WordPress "post" filed under
 * this category. We look the id up by slug so nothing is hard-coded — if the
 * category has not been created in WordPress yet this returns null and callers
 * fall back gracefully (blog behaves as before, /news shows its empty state).
 */
export async function getNewsCategoryId(): Promise<number | null> {
  const data = await fetchAPI(`/categories?slug=news&_fields=id`);
  if (data && Array.isArray(data) && data.length > 0 && typeof data[0]?.id === 'number') {
    return data[0].id as number;
  }
  return null;
}

export async function getLatestBlogs(limit = 3): Promise<WPPost[]> {
  // Keep daily news OUT of the evergreen blog feed. If the News category
  // exists, exclude it; otherwise behave exactly as before.
  const newsCatId = await getNewsCategoryId();
  const exclude = newsCatId ? `&categories_exclude=${newsCatId}` : '';
  // orderby/order are pinned explicitly. Relying on the WordPress default made
  // ordering vulnerable to sticky posts and plugin filters, which silently
  // pushed recent articles off the listing and left them without any internal
  // link (orphan pages Google then declines to index).
  const data = await fetchAPI(
    `/posts?_embed&per_page=${limit}&orderby=date&order=desc${exclude}`
  );
  return data && data.length > 0 ? data : MOCK_BLOGS.slice(0, limit);
}

export interface BlogPage {
  posts: WPPost[];
  page: number;
  perPage: number;
  totalPages: number;
  total: number;
}

/**
 * One page of the evergreen blog feed, newest first.
 *
 * /blog previously rendered a fixed slice of 20 posts with no pagination, so
 * every article past the 20th had zero inbound internal links. Paginating means
 * each post stays reachable from a crawlable <a href>, no matter how much the
 * archive grows.
 */
export async function getBlogsPage(page = 1, perPage = 12): Promise<BlogPage> {
  const safePage = Number.isFinite(page) && page > 0 ? Math.floor(page) : 1;
  const newsCatId = await getNewsCategoryId();
  const exclude = newsCatId ? `&categories_exclude=${newsCatId}` : '';

  const result = await fetchAPIWithMeta(
    `/posts?_embed&per_page=${perPage}&page=${safePage}&orderby=date&order=desc${exclude}`
  );

  const posts = (result?.data as WPPost[] | null) ?? null;

  if (!posts || posts.length === 0) {
    // Fall back to the bundled snapshot so the page still renders if WordPress
    // is unreachable, paginating the local list the same way.
    const start = (safePage - 1) * perPage;
    return {
      posts: MOCK_BLOGS.slice(start, start + perPage),
      page: safePage,
      perPage,
      totalPages: Math.max(1, Math.ceil(MOCK_BLOGS.length / perPage)),
      total: MOCK_BLOGS.length,
    };
  }

  return {
    posts,
    page: safePage,
    perPage,
    totalPages: Math.max(1, result?.totalPages || 1),
    total: result?.total || posts.length,
  };
}

/**
 * True when a WordPress post is filed under the "News" category.
 *
 * /blog/[slug] and /news/[slug] used to run the exact same slug lookup with no
 * category constraint, so EVERY post resolved under BOTH routes with a 200 and
 * its own self-referencing canonical. That is duplicate content across the
 * whole archive. Callers now use this to decide which route owns a post and
 * redirect the other one.
 */
export function isNewsPost(post: WPPost, newsCatId: number | null): boolean {
  if (!newsCatId) return false;

  const terms = post._embedded?.['wp:term']?.[0] || [];
  if (terms.length > 0) {
    return terms.some((t) => t.id === newsCatId || t.slug === 'news');
  }

  // _embed missing (e.g. the bundled snapshot): fall back to the raw ids.
  const categories = (post as WPPost & { categories?: number[] }).categories;
  return Array.isArray(categories) ? categories.includes(newsCatId) : false;
}

export type PostSection = 'blog' | 'news';

/**
 * Resolve a post by slug together with the section that owns it, so the route
 * handlers can 301 a request that arrived on the wrong path.
 */
export async function getPostBySlugWithSection(
  slug: string
): Promise<{ post: WPPost; section: PostSection } | null> {
  const [data, newsCatId] = await Promise.all([
    fetchAPI(`/posts?_embed&slug=${slug}`),
    getNewsCategoryId(),
  ]);

  const post: WPPost | undefined =
    data && data.length > 0
      ? data[0]
      : MOCK_BLOGS.find((b) => b.slug === slug) || MOCK_NEWS.find((n) => n.slug === slug);

  if (!post) return null;

  return { post, section: isNewsPost(post, newsCatId) ? 'news' : 'blog' };
}

export async function getBlogBySlug(slug: string): Promise<WPPost | null> {
  const data = await fetchAPI(`/posts?_embed&slug=${slug}`);
  if (data && data.length > 0) return data[0];
  const local = MOCK_BLOGS.find(b => b.slug === slug);
  return local || null;
}

/**
 * Latest daily Real Estate News — WordPress posts in the "News" category,
 * newest first. Falls back to MOCK_NEWS (empty by default) when the category
 * doesn't exist yet or the API is unreachable.
 */
export async function getLatestNews(limit = 20): Promise<WPPost[]> {
  const newsCatId = await getNewsCategoryId();
  if (!newsCatId) return MOCK_NEWS.slice(0, limit);
  const data = await fetchAPI(`/posts?_embed&per_page=${limit}&categories=${newsCatId}&orderby=date&order=desc`);
  return data && data.length > 0 ? data : MOCK_NEWS.slice(0, limit);
}

/**
 * One page of the News feed, newest first. Mirrors getBlogsPage — /news was
 * capped at 24 items with no pagination, so older news articles had no inbound
 * internal link once they fell off the listing.
 */
export async function getNewsPage(page = 1, perPage = 12): Promise<BlogPage> {
  const safePage = Number.isFinite(page) && page > 0 ? Math.floor(page) : 1;
  const newsCatId = await getNewsCategoryId();

  const emptyFallback = (): BlogPage => {
    const start = (safePage - 1) * perPage;
    return {
      posts: MOCK_NEWS.slice(start, start + perPage),
      page: safePage,
      perPage,
      totalPages: Math.max(1, Math.ceil(MOCK_NEWS.length / perPage)),
      total: MOCK_NEWS.length,
    };
  };

  if (!newsCatId) return emptyFallback();

  const result = await fetchAPIWithMeta(
    `/posts?_embed&per_page=${perPage}&page=${safePage}&categories=${newsCatId}&orderby=date&order=desc`
  );

  const posts = (result?.data as WPPost[] | null) ?? null;
  if (!posts || posts.length === 0) return emptyFallback();

  return {
    posts,
    page: safePage,
    perPage,
    totalPages: Math.max(1, result?.totalPages || 1),
    total: result?.total || posts.length,
  };
}

export async function getNewsBySlug(slug: string): Promise<WPPost | null> {
  const data = await fetchAPI(`/posts?_embed&slug=${slug}`);
  if (data && data.length > 0) return data[0];
  const local = MOCK_NEWS.find(n => n.slug === slug);
  return local || null;
}

export async function getProperties(limit = 10, propertyType?: string): Promise<WPProperty[]> {
  const data = await fetchAPI(`/properties?_embed&per_page=${limit}`);
  const list = data && data.length > 0 ? data : MOCK_PROPERTIES;

  if (propertyType) {
    return list.filter((p: WPProperty) =>
      getCardData(p).type.toLowerCase().includes(propertyType.toLowerCase())
    );
  }
  return list.slice(0, limit);
}

/**
 * Fetch properties filtered server-side by the property-type taxonomy term id.
 *   Residential = 74, Commercial = 75
 */
export async function getPropertiesByTypeTerm(limit = 20, termId: number): Promise<WPProperty[]> {
  const data = await fetchAPI(`/properties?_embed&per_page=${limit}&property-type=${termId}`);
  return data && data.length > 0 ? data : [];
}

export async function getPropertyBySlug(slug: string): Promise<WPProperty | null> {
  const data = await fetchAPI(`/properties?_embed&slug=${slug}`);
  if (data && data.length > 0) return data[0];
  const local = MOCK_PROPERTIES.find(p => p.slug === slug);
  return local || null;
}

/* -----------------------------------------------------------------------
 * getCardData — single source of truth for listing-card fields.
 * Prefers the NEW field structure + taxonomy terms; old flat fields remain
 * only as fallbacks so nothing breaks while old data is being cleaned up.
 * --------------------------------------------------------------------- */
const YT_ID_RE = /(?:v=|youtu\.be\/|embed\/)([\w-]{11})/;

export function getCardData(prop: WPProperty) {
  /* eslint-disable @typescript-eslint/no-explicit-any */
  const acf: any = prop.acf || {};
  const terms: any[] = (prop._embedded?.['wp:term'] ?? []).flat();
  const term = (...taxes: string[]) => {
    for (const tax of taxes) {
      const t = terms.find((x: any) => x?.taxonomy === tax);
      if (t?.name) return t.name as string;
    }
    return '';
  };

  const videoId: string =
    (typeof acf.youtube_url === 'string' && (acf.youtube_url.match(YT_ID_RE)?.[1] ?? '')) ||
    (typeof acf.video_id === 'string' ? (acf.video_id.match(YT_ID_RE)?.[1] ?? acf.video_id) : '') ||
    '';

  return {
    developer: decodeHtml(term('ps_builder', 'builder') || acf.developer_name || acf.developer || ''),
    location: acf.address || acf.location || term('location') || 'Noida',
    price: acf.price_display || acf.price || 'Price on Request',
    type: term('ps_property_type', 'property_type') || acf.property_type || 'Residential',
    videoId,
    // No Saraansh Verdict means the video is the developer's walkthrough,
    // not our review — the card badge must say so.
    isWalkthrough: !String(acf.video_review_text || "").trim(),
    bhk: acf.configuration ? String(acf.configuration).split(', ') : [],
    reraNumber: (acf.rera_number as string) || '',
    possessionDate: (acf.possession_date as string) || '',
  };
}

export function getFeaturedImage(post: WPPost | WPProperty): string {
  // Prefer the real featured image (works with the new field structure)
  if (post._embedded && post._embedded['wp:featuredmedia'] && post._embedded['wp:featuredmedia'].length > 0) {
    return post._embedded['wp:featuredmedia'][0].source_url;
  }

  if ('acf' in post && post.acf) {
    /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
    const acf = post.acf as any;
    if (acf.gallery_image_1) {
      return acf.gallery_image_1;
    }
  }

  if ('property_gallery' in post && post.property_gallery && post.property_gallery.length > 0) {
    return post.property_gallery[0];
  }

  return "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80";
}

export function stripHtml(html: string) {
  return html.replace(/<[^>]*>?/gm, '');
}

export async function getPageBySlug(slug: string): Promise<WPPage | null> {
  const data = await fetchAPI(`/pages?slug=${slug}&_embed`);
  return data && data.length > 0 ? data[0] : null;
}
