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
  acf: {
    price?: string;
    location?: string;
    property_type?: string;
    developer?: string;
    developer_description?: string;
    developer_experience?: string;
    developer_delivered_projects?: string;
    developer_ongoing_projects?: string;
    project_overview?: string;
    total_land?: string;
    rera_number?: string;
    configuration?: string;
    total_units?: string;
    possession_date?: string;
    launch_date?: string;
    total_floors?: string;
    units_per_floor?: string;
    lifts_per_floor?: string;
    price_list_desc?: string;
    location_advantages?: string;
    base_price?: string;
    video_id?: string;
    video_review_text?: string;
    highlights?: string;
    google_map_embed?: string;
    project_logo?: string;
    floor_plan_footer_text?: string;
    site_plan_image?: string | false;
    master_layout_image?: string | false;
    price_range?: string;
    tagline?: string;
    // SEO fields
    seo_title?: string;
    seo_description?: string;
    // About project
    about_project?: string;
    about_project_image?: string | false;
    // Site plan caption
    site_plan_caption?: string;
    // Payment Plan (optional — section only renders when at least one step is filled in)
    payment_step_1_pct?: string;
    payment_step_1_label?: string;
    payment_step_1_desc?: string;
    payment_step_2_pct?: string;
    payment_step_2_label?: string;
    payment_step_2_desc?: string;
    payment_step_3_pct?: string;
    payment_step_3_label?: string;
    payment_step_3_desc?: string;
    payment_step_4_pct?: string;
    payment_step_4_label?: string;
    payment_step_4_desc?: string;
    payment_step_5_pct?: string;
    payment_step_5_label?: string;
    payment_step_5_desc?: string;
    payment_step_6_pct?: string;
    payment_step_6_label?: string;
    payment_step_6_desc?: string;
    payment_eoi_note?: string;
    [key: `amenity_${number}_icon`]: string | false;
    [key: `amenity_${number}_name`]: string;
    [key: `floor_plan_${number}_title`]: string;
    [key: `floor_plan_${number}_desc`]: string;
    [key: `floor_plan_${number}_image`]: string | false;
    [key: `gallery_image_${number}`]: string | false;
    [key: `price_list_row_${number}_type`]: string;
    [key: `price_list_row_${number}_size`]: string;
    [key: `price_list_row_${number}_base`]: string;
    [key: `price_list_row_${number}_total`]: string;
    [key: `payment_milestone_${number}_name`]: string;
    [key: `payment_milestone_${number}_demand`]: string;
    [key: `payment_milestone_${number}_cumulative`]: string;
    [key: `faq_${number}_question`]: string;
    [key: `faq_${number}_answer`]: string;
  };
  _embedded?: {
    'wp:featuredmedia'?: Array<{
      source_url: string;
    }>;
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
}

// --- Video CPT Integration ---
// WordPress CPT slug: ps_video
// ACF fields to create in WordPress (see setup instructions):
//   short_description  (Textarea) — shown below video title + used as meta description
//   about_this_video   (Textarea) — "About This Video" body; separate paragraphs with ||
//   meta_title         (Text)     — optional SEO page title override
//   meta_description   (Text)     — optional SEO meta description override
//   youtube_id         (Text)     — YouTube video ID (optional override)
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
    if (wpHost && frontendHost) {
      rewrittenText = rawText.replace(new RegExp(wpHost.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), frontendHost);
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
      p.acf?.property_type?.toLowerCase().includes(propertyType.toLowerCase())
    );
  }
  return list.slice(0, limit);
}

/**
 * Fetch properties filtered server-side by the `ps_property_type` WordPress
 * taxonomy (term id), instead of fetching everything and filtering client-side
 * on an ACF text field. This gives each type-specific listing page (residential,
 * commercial) its own distinct fetch/cache key, and lets WordPress do the
 * filtering — so a stale cache on one listing page can no longer mask newly
 * published or re-tagged properties on another.
 *
 * Known term ids (see WordPress Properties > Property Type):
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

export function getFeaturedImage(post: WPPost | WPProperty): string {
  if ('acf' in post && post.acf) {
    const acf = post.acf as WPProperty['acf'];
    if (acf.gallery_image_1) {
      return acf.gallery_image_1;
    }
  }

  if ('property_gallery' in post && post.property_gallery && post.property_gallery.length > 0) {
    return post.property_gallery[0];
  }

  if (post._embedded && post._embedded['wp:featuredmedia'] && post._embedded['wp:featuredmedia'].length > 0) {
    return post._embedded['wp:featuredmedia'][0].source_url;
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
