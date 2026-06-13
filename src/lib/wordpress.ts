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
  acf?: {
    video_id?: string;
  };
  yoast_head?: string;
  yoast_head_json?: Record<string, unknown>;
  rank_math_json?: Record<string, unknown>;
  _embedded?: {
    'wp:featuredmedia'?: Array<{
      source_url: string;
    }>;
    'wp:term'?: Array<Array<{
      name: string;
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
    highlights?: string; // Semicolon-separated list of highlights
    google_map_embed?: string;
    project_logo?: string;
    floor_plan_footer_text?: string;
    site_plan_image?: string | false;
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

// Fallback Mock Blog Data
export const MOCK_BLOGS: WPPost[] = [
  {
    id: 1,
    date: "Jun 10, 2026",
    slug: "is-commercial-real-estate-in-noida-a-good-investment",
    title: { rendered: "Is Commercial Real Estate in Noida a Good Investment in 2026?" },
    excerpt: { rendered: "Analyzing the ROI, rental yields, and upcoming commercial hubs in Noida and Greater Noida..." },
    content: { 
      rendered: `
        <p>Noida's commercial real estate is experiencing an unprecedented boom in 2026. With major infrastructural drivers like the Jewar International Airport nearing completion and massive corporate relocations, investors are looking closely at high-street retail shops and office spaces.</p>
        
        <h2>Why Noida Commercial?</h2>
        <p>Unlike residential properties which typically yield a 2-3% rental return, commercial spaces in prime Noida sectors like Sector 62, 129, and 132 are delivering rental yields of 7-9%. Furthermore, the capital appreciation along the Noida-Greater Noida Expressway has averaged 15% annually over the last three years.</p>
        
        <blockquote>"Investing in commercial retail shops along the Expressway is currently the highest-yielding real estate play in the entire NCR region, backed by rapid corporate density."</blockquote>
        
        <h2>Key Areas to Watch</h2>
        <p>Keep a close eye on Sector 94, Sector 129, and Greater Noida West. These micro-markets have high residential catchment populations, which is essential to drive footfall for commercial retail ventures.</p>
      ` 
    },
    _embedded: {
      'wp:featuredmedia': [{ source_url: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=800" }]
    }
  },
  {
    id: 2,
    date: "Jun 05, 2026",
    slug: "top-5-upcoming-residential-projects-noida-expressway",
    title: { rendered: "Top 5 Upcoming Residential Projects in Noida Expressway" },
    excerpt: { rendered: "A comprehensive review of the most anticipated premium and luxury projects launching this year..." },
    content: {
      rendered: `
        <p>The Noida Expressway remains the hotbed for luxury residential developments in Delhi NCR. With low-density project approvals and green corridors, developers are offering world-class living standards.</p>
        
        <h2>Top Pick: Eldeco 7 Peaks Residences</h2>
        <p>Located in Sector 150, Eldeco 7 Peaks Residences is a prime example of premium living. Spanning 7.5 Acres, it features G+30 standalone towers with only 4 apartments per floor. Its proximity to the upcoming Jewar Airport makes it a highly sought-after investment.</p>
        
        <blockquote>"The expressway projects are no longer just apartments; they are lifestyle enclaves with sky clubs, private pools, and double-height lobbies."</blockquote>
        
        <h2>Other Notable Launches</h2>
        <p>Other major luxury projects include M3M The Cullinan in Sector 94 and County 107 in Sector 107. Both projects are pushing the envelope of luxury with fully air-conditioned residences, private golf courses, and high-street retail below.</p>
      `
    },
    _embedded: {
      'wp:featuredmedia': [{ source_url: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&q=80&w=800" }]
    }
  },
  {
    id: 3,
    date: "May 28, 2026",
    slug: "understanding-rera-guidelines-homebuyers",
    title: { rendered: "Understanding the RERA Guidelines for Homebuyers" },
    excerpt: { rendered: "Don't invest before reading this! Protect your investment with these crucial RERA rules and checks." },
    content: {
      rendered: `
        <p>The Real Estate Regulatory Authority (RERA) has transformed how property transactions occur in India. As a homebuyer in Noida, understanding RERA regulations is your biggest safeguard against builder delays and project defaults.</p>
        
        <h2>What to Check First?</h2>
        <p>Every builder must advertise their RERA registration number. You should always visit the UP-RERA portal and cross-verify the project details. Look for construction timelines, land ownership approvals, and escrow account records.</p>
        
        <blockquote>"A registered RERA number is your legal armor. Never sign an allotment letter or pay a booking amount for a project that does not have active UP-RERA approval."</blockquote>
        
        <h2>Key Protections under RERA</h2>
        <p>Under RERA, builders cannot charge more than 10% of the property cost as an advance booking fee before signing a registered builder-buyer agreement. Additionally, 70% of the money collected from buyers must be deposited in a separate escrow account dedicated solely to construction costs for that project.</p>
      `
    },
    _embedded: {
      'wp:featuredmedia': [{ source_url: "https://images.unsplash.com/photo-1589829085413-56de8ae18c73?auto=format&fit=crop&q=80&w=800" }]
    }
  }
];

// Fallback Mock Property Data (Matches mockup exactly)
export const MOCK_PROPERTIES: WPProperty[] = [];

async function fetchAPI(endpoint: string) {
  if (!API_URL) {
    return null;
  }
  try {
    const res = await fetch(`${API_URL}${endpoint}`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) return null;
    return res.json();
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

export async function getPropertyBySlug(slug: string): Promise<WPProperty | null> {
  const data = await fetchAPI(`/properties?_embed&slug=${slug}`);
  if (data && data.length > 0) return data[0];
  const local = MOCK_PROPERTIES.find(p => p.slug === slug);
  return local || null;
}

export function getFeaturedImage(post: WPPost | WPProperty): string {
  // 1. If it's a property CPT and has custom gallery images in ACF, prioritize gallery_image_1
  if ('acf' in post && post.acf) {
    const acf = post.acf as WPProperty['acf'];
    if (acf.gallery_image_1) {
      return acf.gallery_image_1;
    }
  }

  // 2. If it has a property_gallery array, use the first element
  if ('property_gallery' in post && post.property_gallery && post.property_gallery.length > 0) {
    return post.property_gallery[0];
  }

  // 3. Fall back to standard WordPress featured media
  if (post._embedded && post._embedded['wp:featuredmedia'] && post._embedded['wp:featuredmedia'].length > 0) {
    return post._embedded['wp:featuredmedia'][0].source_url;
  }
  
  // 4. Default placeholder
  return "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80";
}

export function stripHtml(html: string) {
  return html.replace(/<[^>]*>?/gm, '');
}

export async function getPageBySlug(slug: string): Promise<WPPage | null> {
  const data = await fetchAPI(`/pages?slug=${slug}&_embed`);
  return data && data.length > 0 ? data[0] : null;
}
