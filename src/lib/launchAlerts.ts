import { decodeHtml } from '@/lib/decodeHtml';

/**
 * The /new-launches feed.
 *
 * WordPress owns every word here — the project, the price and, above all, the
 * fine print, which is the only reason to read this page instead of a portal.
 * The frontend owns the grouping, the tabs and the machinery. See
 * `claude/content-ownership-rule.md`.
 *
 * Entries live in the `launch_alert` post type. There is deliberately no page
 * per alert: sixty thin pages that each repeat one card would be a liability,
 * not an asset, so the feed is a single indexable URL.
 */

const API_URL = process.env.NEXT_PUBLIC_WORDPRESS_API_URL;

export const CITIES = [
  { key: 'noida', label: 'Noida' },
  { key: 'greater-noida', label: 'Greater Noida' },
  { key: 'greater-noida-west', label: 'Greater Noida West' },
  { key: 'yeida', label: 'YEIDA' },
] as const;

export type CityKey = (typeof CITIES)[number]['key'];

export interface LaunchAlert {
  id: number;
  title: string;
  builder: string;
  location: string;
  city: CityKey;
  /** Which badge the card shows. */
  registered: boolean;
  price: string;
  priceNote: string;
  finePrint: string;
  sourceNote: string;
  /** Set only when we have a full property page for this project. */
  propertyHref: string | null;
  /** ISO date the alert was published, for ordering and display. */
  date: string;
}

interface WPLaunchAlert {
  id?: number;
  date?: string;
  title?: { rendered?: string };
  acf?: Record<string, unknown>;
}

const text = (value: unknown): string =>
  typeof value === 'string' ? decodeHtml(value.replace(/<[^>]*>/g, '')).trim() : '';

function toAlert(item: WPLaunchAlert): LaunchAlert | null {
  const acf = item.acf || {};
  const title = text(item.title?.rendered);
  const finePrint = text(acf.fine_print);

  // An entry without a project name or without the honest read is half-written.
  // Showing it would put an empty card on the page, so it is skipped instead.
  if (!title || !finePrint) return null;

  const city = String(acf.city || 'noida') as CityKey;
  const slug = text(acf.property_slug);

  return {
    id: item.id || 0,
    title,
    builder: text(acf.builder),
    location: text(acf.location),
    city: CITIES.some((c) => c.key === city) ? city : 'noida',
    registered: String(acf.status || 'rera_registered') === 'rera_registered',
    price: text(acf.price),
    priceNote: text(acf.price_note),
    finePrint,
    sourceNote: text(acf.source_note),
    propertyHref: slug ? `/properties/${slug}` : null,
    date: item.date || '',
  };
}

/**
 * Published alerts, newest first. Never throws: an empty feed is a far smaller
 * problem than a page that fails to render, so any failure degrades to [].
 */
export async function getLaunchAlerts(limit = 60): Promise<LaunchAlert[]> {
  if (!API_URL) return [];

  try {
    const res = await fetch(
      `${API_URL}/launch_alert?per_page=${limit}&orderby=date&order=desc&_fields=id,date,title,acf`,
      { next: { revalidate: 300 } }
    );
    if (!res.ok) return [];

    const data = (await res.json()) as WPLaunchAlert[];
    if (!Array.isArray(data)) return [];

    return data.map(toAlert).filter((a): a is LaunchAlert => a !== null);
  } catch (err) {
    console.error('Failed to load launch alerts:', err);
    return [];
  }
}

/** Cities that actually have an alert, so the tabs never offer an empty view. */
export function citiesWithAlerts(alerts: LaunchAlert[]) {
  return CITIES.filter((c) => alerts.some((a) => a.city === c.key));
}
