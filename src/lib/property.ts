/**
 * Property Saraansh — data layer for the property detail page (v2 fields)
 * Fetches from WordPress REST (new SCF field structure) and normalizes
 * everything the page needs, resolving media IDs → URLs in ONE batched
 * /media request.
 *
 * NOTE: unlike lib/wordpress.ts, responses are NOT hostname-rewritten —
 * next/image remotePatterns allows the WP host (login.propertysaraansh.com),
 * and rewriting image URLs to the frontend host breaks image optimization.
 */

const API = process.env.NEXT_PUBLIC_WORDPRESS_API_URL || "https://login.propertysaraansh.com/wp-json/wp/v2";
export const SITE = (process.env.NEXT_PUBLIC_SITE_URL || "https://www.propertysaraansh.com").replace(/\/$/, "");

async function wpFetch(endpoint: string): Promise<unknown> {
  try {
    const res = await fetch(`${API}${endpoint}`, { next: { revalidate: 300 } });
    if (!res.ok) return null;
    return await res.json();
  } catch (err) {
    console.error("property.ts fetch error:", err);
    return null;
  }
}

/* ---------------- types ---------------- */

export interface Img { url: string; alt: string; width?: number; height?: number }

export interface Property {
  id: number;
  slug: string;
  title: string;
  hero: Img | null;
  tagline: string;
  rera: string;
  launchDate: string;
  possessionDate: string;
  basePrice: string;
  priceDisplay: string;
  priceMin: number | null;
  priceMax: number | null;
  configuration: string;
  city: string;
  sector: string;
  builder: string;
  status: string;
  overviewHtml: string;
  quickFacts: { label: string; value: string }[];
  youtubeId: string;
  verdict: string;
  highlights: string[];
  masterPlan: Img | null;
  sitePlan: Img | null;
  floorPlans: { title: string; description: string; image: Img | null; pdf: string }[];
  floorPlanNote: string;
  amenities: { icon: string; name: string }[];
  priceList: { type: string; size: string; base: string; total: string }[];
  priceNote: string;
  priceListPdf: string;
  paymentSteps: { percentage: string; title: string; description: string }[];
  paymentMilestones: { milestone: string; demand: string; cumulative: string }[];
  eoiNote: string;
  address: string;
  lat: string;
  lng: string;
  locationAdv: { category: string; name: string; distance: string }[];
  mapEmbedSrc: string;
  gallery: Img[];
  logo: Img | null;
  brochurePdf: string;
  currentPhase: string;
  timeline: { stage: string; date: string; done: boolean }[];
  faqs: { question: string; answer: string }[];
  metaTitle: string;
  metaDescription: string;
  seoJson: unknown;
  publishedDate: string;
  modifiedDate: string;
}

/* ---------------- helpers ---------------- */

export const ytId = (url: string): string =>
  url?.match(/(?:v=|youtu\.be\/|embed\/)([\w-]{11})/)?.[1] ?? "";

const iframeSrc = (html: string): string =>
  html?.match(/src="([^"]+)"/)?.[1] ?? "";

type RawImg = number | string | { ID?: number; id?: number; url?: string; alt?: string } | null | false;

function collectId(v: RawImg): number | null {
  if (typeof v === "number") return v;
  if (typeof v === "string" && /^\d+$/.test(v)) return parseInt(v, 10);
  if (v && typeof v === "object") return v.ID ?? v.id ?? null;
  return null;
}

interface WPMedia { id: number; source_url: string; alt_text?: string; media_details?: { width?: number; height?: number } }

async function resolveMedia(ids: number[]): Promise<Record<number, Img>> {
  if (!ids.length) return {};
  const uniq = [...new Set(ids)];
  const items = (await wpFetch(
    `/media?include=${uniq.join(",")}&per_page=${uniq.length}&_fields=id,source_url,alt_text,media_details`
  )) as WPMedia[] | null;
  const map: Record<number, Img> = {};
  for (const m of items ?? []) {
    map[m.id] = { url: m.source_url, alt: m.alt_text || "", width: m.media_details?.width, height: m.media_details?.height };
  }
  return map;
}

function toImg(v: RawImg, media: Record<number, Img>, altFallback: string): Img | null {
  const id = collectId(v);
  if (id && media[id]) return { ...media[id], alt: media[id].alt || altFallback };
  if (v && typeof v === "object" && v.url) return { url: v.url, alt: v.alt || altFallback };
  if (typeof v === "string" && v.startsWith("http")) return { url: v, alt: altFallback };
  return null;
}

/* eslint-disable @typescript-eslint/no-explicit-any */
const termName = (p: any, tax: string): string =>
  p._embedded?.["wp:term"]?.flat().find((t: any) => t.taxonomy === tax)?.name ?? "";

// City-level slugs in the ps_location taxonomy. Everything else on a property
// (Sector 94, Omicron 1A, C1 Jaypee Greens, …) is treated as the sector/area.
const CITY_SLUGS = new Set([
  "noida", "greater-noida", "noida-extension", "yamuna-expressway",
  "ghaziabad", "delhi", "gurgaon", "gurugram", "faridabad",
]);

/* ---------------- fetch + normalize ---------------- */

export async function getAllPropertySlugs(): Promise<string[]> {
  const posts = (await wpFetch(`/properties?per_page=100&_fields=slug`)) as { slug: string }[] | null;
  return (posts ?? []).map((p) => p.slug);
}

export async function getProperty(slug: string): Promise<Property | null> {
  const posts = (await wpFetch(`/properties?slug=${encodeURIComponent(slug)}&_embed`)) as any[] | null;
  const p = posts?.[0];
  if (!p) return null;
  const a = p.acf ?? {};

  // City + sector from the single ps_location taxonomy: the term whose slug is
  // a known city becomes the city, the remaining term becomes the sector.
  // Non-ps `location` taxonomy + old flat fields stay as fallbacks.
  const psLocTerms: any[] = (p._embedded?.["wp:term"]?.flat() ?? []).filter((t: any) => t.taxonomy === "ps_location");
  const cityTerm = psLocTerms.find((t: any) => CITY_SLUGS.has(t.slug));
  const sectorTerm = psLocTerms.find((t: any) => !CITY_SLUGS.has(t.slug));

  const rawImgs: RawImg[] = [
    a.master_plan, a.site_plan, a.logo_image,
    ...(Array.isArray(a.gallery) ? a.gallery : []),
    ...(Array.isArray(a.floor_plans) ? a.floor_plans.map((f: any) => f.image) : []),
  ];
  const media = await resolveMedia(rawImgs.map(collectId).filter((n): n is number => !!n));

  const heroUrl: string | null = p._embedded?.["wp:featuredmedia"]?.[0]?.source_url ?? null;
  const title: string = p.title?.rendered ?? "";

  // fallbacks to old flat fields keep the page rendering even before a
  // property is fully migrated to the new structure
  const highlights: string[] = Array.isArray(a.highlights_list) && a.highlights_list.length
    ? a.highlights_list.map((h: any) => h.text).filter(Boolean)
    : String(a.highlights || "").split(";").map((s: string) => s.trim()).filter(Boolean);

  const gallery: Img[] = (Array.isArray(a.gallery) && a.gallery.length
    ? a.gallery.map((g: RawImg, i: number) => toImg(g, media, `${title} gallery image ${i + 1}`))
    : Array.from({ length: 10 }, (_, i) => toImg(a[`gallery_image_${i + 1}`], media, `${title} gallery image ${i + 1}`))
  ).filter((g: Img | null): g is Img => !!g);

  return {
    id: p.id,
    slug: p.slug,
    title,
    hero: heroUrl ? { url: heroUrl, alt: title } : (gallery[0] ?? null),
    tagline: a.tagline || a.property_tagline || "",
    rera: a.rera_number || "",
    launchDate: a.launch_date || "",
    possessionDate: a.possession_date || "",
    basePrice: a.base_price || "",
    priceDisplay: a.price_display || a.price || "",
    priceMin: a.price_min_numeric ? Number(a.price_min_numeric) : null,
    priceMax: a.price_max_numeric ? Number(a.price_max_numeric) : null,
    configuration: a.configuration || "",
    city: cityTerm?.name || termName(p, "location") || a.location_city || "Noida",
    sector: sectorTerm?.name || a.location_sector || "",
    builder: termName(p, "ps_builder") || termName(p, "builder") || a.developer_name || a.developer || "",
    status: termName(p, "ps_project_status") || termName(p, "project_status") || a.property_status || "",
    overviewHtml: a.project_overview || p.content?.rendered || "",
    quickFacts: ([
      ["Total Land", a.quick_facts?.total_land || a.total_land],
      ["Towers", a.quick_facts?.total_towers],
      ["Total Units", a.quick_facts?.total_units || a.total_units],
      ["Total Floors", a.quick_facts?.total_floors || a.total_floors],
      ["Units / Floor", a.quick_facts?.units_per_floor || a.units_per_floor],
      ["Lifts / Floor", a.quick_facts?.lifts_per_floor || a.lifts_per_floor],
      ["Configuration", a.configuration],
      ["Launch", a.launch_date],
      ["Possession", a.possession_date],
      ["RERA No.", a.rera_number],
      ["Base Price", a.base_price],
    ] as [string, string | undefined][]).filter(([, v]) => v).map(([label, value]) => ({ label, value: value as string })),
    youtubeId: ytId(a.youtube_url || "") || a.video_id || "",
    verdict: a.video_review_text || "",
    highlights,
    masterPlan: toImg(a.master_plan, media, `${title} master layout plan`),
    sitePlan: toImg(a.site_plan, media, `${title} site plan map`),
    floorPlans: (Array.isArray(a.floor_plans) ? a.floor_plans : []).map((f: any) => ({
      title: f.title || "", description: f.description || "",
      image: toImg(f.image, media, `${title} floor plan — ${f.title}`), pdf: f.pdf || "",
    })),
    floorPlanNote: a.floor_plan_note || a.floor_plan_footer_text || "",
    amenities: (Array.isArray(a.amenities) ? a.amenities : []).map((m: any) => ({ icon: m.icon || "✨", name: m.name || "" })),
    priceList: Array.isArray(a.price_list) ? a.price_list : [],
    priceNote: a.price_note || a.price_list_desc || "",
    priceListPdf: a.price_list_pdf || "",
    paymentSteps: Array.isArray(a.payment_steps) ? a.payment_steps : [],
    paymentMilestones: Array.isArray(a.payment_milestones) ? a.payment_milestones : [],
    eoiNote: a.eoi_note || a.payment_eoi_note || "",
    address: a.address || [a.location, a.location_city].filter(Boolean).join(", "),
    lat: a.latitude || "",
    lng: a.longitude || "",
    locationAdv: Array.isArray(a.location_adv) ? a.location_adv : [],
    mapEmbedSrc: iframeSrc(a.google_map_embed || ""),
    gallery,
    logo: toImg(a.logo_image, media, `${a.developer_name || ""} — ${title} logo`),
    brochurePdf: a.brochure_pdf || "",
    currentPhase: a.current_phase || "launch",
    timeline: Array.isArray(a.construction_timeline) ? a.construction_timeline : [],
    faqs: Array.isArray(a.faqs) ? a.faqs : [],
    metaTitle: a.meta_title || a.seo_title || "",
    metaDescription: a.meta_description || a.seo_description || "",
    seoJson: p.rank_math_json || p.yoast_head_json || null,
    publishedDate: p.date,
    modifiedDate: p.modified,
  };
}

/* ---------------- JSON-LD ---------------- */

export function buildSchemas(prop: Property) {
  const url = `${SITE}/properties/${prop.slug}`;
  const citySlug = prop.city.toLowerCase().replace(/\s+/g, "-");

  const apartmentComplex = {
    "@context": "https://schema.org",
    "@type": "ApartmentComplex",
    "@id": `${url}#project`,
    name: prop.title,
    url,
    image: prop.hero?.url,
    description: prop.metaDescription || prop.tagline,
    address: {
      "@type": "PostalAddress",
      streetAddress: prop.address,
      addressLocality: prop.city,
      addressRegion: "Uttar Pradesh",
      addressCountry: "IN",
    },
    ...(prop.lat && prop.lng ? { geo: { "@type": "GeoCoordinates", latitude: prop.lat, longitude: prop.lng } } : {}),
    amenityFeature: prop.amenities.map((m) => ({ "@type": "LocationFeatureSpecification", name: m.name, value: true })),
    ...(prop.builder ? { brand: { "@type": "Organization", name: prop.builder } } : {}),
  };

  const product = prop.priceMin || prop.priceMax ? {
    "@context": "https://schema.org",
    "@type": "Product",
    "@id": `${url}#offer`,
    name: `${prop.title} — ${prop.configuration}`.trim(),
    image: prop.hero?.url,
    description: prop.tagline || prop.metaDescription,
    brand: { "@type": "Brand", name: prop.builder || "Property Saraansh" },
    offers: {
      "@type": "AggregateOffer",
      priceCurrency: "INR",
      ...(prop.priceMin ? { lowPrice: prop.priceMin } : {}),
      ...(prop.priceMax ? { highPrice: prop.priceMax } : {}),
      offerCount: prop.priceList.length || 1,
      availability: "https://schema.org/InStock",
      url,
    },
  } : null;

  const faqPage = prop.faqs.length ? {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: prop.faqs.map((f) => ({
      "@type": "Question", name: f.question,
      acceptedAnswer: { "@type": "Answer", text: f.answer },
    })),
  } : null;

  const breadcrumbs = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE },
      { "@type": "ListItem", position: 2, name: "Projects", item: `${SITE}/properties` },
      { "@type": "ListItem", position: 3, name: prop.city, item: `${SITE}/property-in-${citySlug}` },
      { "@type": "ListItem", position: 4, name: prop.title, item: url },
    ],
  };

  const video = prop.youtubeId ? {
    "@context": "https://schema.org",
    "@type": "VideoObject",
    name: `${prop.title} — Property Saraansh Review`,
    description: prop.verdict.slice(0, 300) || `${prop.title} on-ground video review by Property Saraansh`,
    thumbnailUrl: `https://i.ytimg.com/vi/${prop.youtubeId}/hqdefault.jpg`,
    uploadDate: prop.publishedDate,
    embedUrl: `https://www.youtube.com/embed/${prop.youtubeId}`,
    publisher: { "@type": "Organization", name: "Property Saraansh", logo: { "@type": "ImageObject", url: `${SITE}/logo.png` } },
  } : null;

  return [apartmentComplex, product, faqPage, breadcrumbs, video].filter(Boolean);
}
