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
  return data && Array.isArray(data) ? (data as WPBuilderTerm[]) : [];
}

export async function getBuilderBySlug(slug: string): Promise<WPBuilderTerm | null> {
  const data = await fetchAPI(`/builder?slug=${slug}&_fields=id,name,slug,count,acf`);
  if (data && Array.isArray(data) && data.length > 0) return data[0] as WPBuilderTerm;
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

// Fallback Mock Blog Data
export const MOCK_BLOGS: WPPost[] = blogsData as WPPost[];

// Fallback Mock Property Data (Matches mockup exactly)
export const MOCK_PROPERTIES: WPProperty[] = propertiesData as WPProperty[];

async function fetchAPI(endpoint: string) {
  if (!API_URL) {
    return null;
  }
  try {
    const res = await fetch(`${API_URL}${endpoint}`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) return null;
    const rawText = await res.text();

    const wpUrl = process.env.NEXT_PUBLIC_WORDPRESS_URL || 'https://login.propertysaraansh.com';
    const frontendUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.propertysaraansh.com';

    const wpHost = wpUrl.replace(/^https?:\/\//, '').replace(/\/$/, '');
    const frontendHost = frontendUrl.replace(/^https?:\/\//, '').replace(/\/$/, '');

    let rewrittenText = rawText;
    if (wpHost && frontendHost && wpHost !== frontendHost) {
      const wpHostEscaped = wpHost.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

      // Rewrite the WordPress host -> frontend host for page/post links, but NEVER
      // for media (/wp-content, /wp-includes). Media must keep pointing at
      // WordPress: next.config's images.remotePatterns already allows that host,
      // and the /wp-content proxy rewrite does not actually resolve — so a
      // rewritten image URL 404s. The negative lookahead also tolerates
      // JSON-escaped slashes (\/), which is how WordPress encodes URLs.
      const hostRegex = new RegExp(
        wpHostEscaped + '(?!\\\\?/wp-content|\\\\?/wp-includes)',
        'g'
      );
      rewrittenText = rawText.replace(hostRegex, frontendHost);
    }

    return JSON.parse(rewrittenText);
  } catch (err) {
    console.error("WordPress Fetch Error:", err);
    return null;
  }
}

export async function getLatestBlogs(limit = 3): Promise<WPPost[]> {
  const data = await fetchAPI(`/posts?_embed&per_page=${limit}`);
  return data && data.length > 0 ? data : MOCK_BLOGS.slice(0, limit);
}

export async function getBlogBySlug(slug: string): Promise<WPPost | null> {
  const data = await fetchAPI(`/posts?_embed&slug=${slug}`);
  if (data && data.length > 0) return data[0];
  const local = MOCK_BLOGS.find(b => b.slug === slug);
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
    developer: term('ps_builder', 'builder') || acf.developer_name || acf.developer || '',
    location: acf.address || acf.location || term('location') || 'Noida',
    price: acf.price_display || acf.price || 'Price on Request',
    type: term('ps_property_type', 'property_type') || acf.property_type || 'Residential',
    videoId,
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
