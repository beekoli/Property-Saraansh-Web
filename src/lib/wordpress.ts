const API_URL = process.env.NEXT_PUBLIC_WORDPRESS_API_URL;

export interface WPPost {
  id: number;
  date: string;
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
  _embedded?: {
    'wp:featuredmedia'?: Array<{
      source_url: string;
    }>;
    'wp:term'?: Array<Array<{
      name: string;
    }>>;
  };
}

export interface WPProperty {
  id: number;
  slug: string;
  title: {
    rendered: string;
  };
  acf: {
    price: string;
    location: string;
    property_type: string;
  };
  _embedded?: {
    'wp:featuredmedia'?: Array<{
      source_url: string;
    }>;
  };
}

/**
 * Helper to fetch data with caching
 */
async function fetchAPI(endpoint: string) {
  if (!API_URL) {
    console.warn("WORDPRESS_API_URL is not defined.");
    return null;
  }
  const res = await fetch(`${API_URL}${endpoint}`, {
    next: { revalidate: 60 }, // Revalidate every minute
  });

  if (!res.ok) {
    console.error(`Failed to fetch API: ${API_URL}${endpoint}`);
    return null;
  }

  return res.json();
}

/**
 * Fetch latest blog posts
 */
export async function getLatestBlogs(limit = 3): Promise<WPPost[]> {
  const data = await fetchAPI(`/posts?_embed&per_page=${limit}`);
  return data || [];
}

/**
 * Fetch a single blog post by slug
 */
export async function getBlogBySlug(slug: string): Promise<WPPost | null> {
  const data = await fetchAPI(`/posts?_embed&slug=${slug}`);
  return data && data.length > 0 ? data[0] : null;
}

/**
 * Fetch properties (custom post type)
 */
export async function getProperties(limit = 10, propertyType?: string): Promise<WPProperty[]> {
  // Assuming the CPT slug is 'properties' and we are using ACF for custom fields
  // In a real scenario, you might filter by a custom taxonomy for "property_type" (commercial/residential)
  // Example endpoint: /properties?_embed
  const endpoint = `/properties?_embed&per_page=${limit}`;
  
  // Note: Filtering by ACF fields or taxonomies via REST API might require specific plugins 
  // or custom endpoints depending on how the WP backend is set up.
  // For now, we fetch them and filter if needed, or rely on a taxonomy if it exists.
  
  const data = await fetchAPI(endpoint);
  
  if (!data) return [];
  
  // Client-side filtering as a fallback if the API doesn't support complex taxonomy queries directly yet
  if (propertyType) {
    return data.filter((p: WPProperty) => p.acf?.property_type?.toLowerCase().includes(propertyType.toLowerCase()));
  }
  
  return data;
}

/**
 * Get featured image URL from embedded data
 */
export function getFeaturedImage(post: WPPost | WPProperty): string {
  if (post._embedded && post._embedded['wp:featuredmedia'] && post._embedded['wp:featuredmedia'].length > 0) {
    return post._embedded['wp:featuredmedia'][0].source_url;
  }
  return "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80"; // Fallback placeholder
}

/**
 * Strip HTML tags from excerpt
 */
export function stripHtml(html: string) {
  return html.replace(/<[^>]*>?/gm, '');
}
