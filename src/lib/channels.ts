/**
 * The Property Saraansh YouTube channels, in one place.
 *
 * The brand publishes from more than one channel: the main channel carries
 * market analysis and long-form comparisons, and the Reviews channel carries
 * the per-project reviews that people search by project name. Both are the same
 * business, so both feed /our-videos, both appear in the footer, and both are
 * listed in the Organization schema's sameAs — which is what tells Google the
 * two channels and this site are one entity rather than three strangers.
 *
 * Ids can be overridden per environment; the defaults are the live channels so
 * a preview deployment without env vars still renders the real site.
 */

export interface Channel {
  /** YouTube channel id, "UC…". */
  id: string;
  /** Display name, as shown on the watch page. */
  name: string;
  /** Public @handle URL — what a visitor should land on. */
  url: string;
  /** One line on what this channel is for, used where the two need telling apart. */
  blurb: string;
}

const MAIN_ID =
  process.env.YOUTUBE_CHANNEL_ID ||
  process.env.NEXT_PUBLIC_YOUTUBE_CHANNEL_ID ||
  'UC5eDcgQ_bYCzNrJUm34C4_w';

const REVIEWS_ID =
  process.env.YOUTUBE_REVIEWS_CHANNEL_ID ||
  process.env.NEXT_PUBLIC_YOUTUBE_REVIEWS_CHANNEL_ID ||
  'UChOfCm-Xo4NABiBfKuw7H0g';

export const MAIN_CHANNEL: Channel = {
  id: MAIN_ID,
  name: 'Property Saraansh',
  url: 'https://www.youtube.com/@PropertySaraansh',
  blurb: 'Market analysis, investment strategy and long-form project comparisons.',
};

export const REVIEWS_CHANNEL: Channel = {
  id: REVIEWS_ID,
  name: 'Property Saraansh Reviews',
  url: 'https://www.youtube.com/@PropertySaraanshReviews',
  blurb: 'Honest, project-by-project reviews across Noida, Greater Noida and the expressways.',
};

/** Every channel the site pulls video from, newest-first merging happens later. */
export const CHANNELS: Channel[] = [MAIN_CHANNEL, REVIEWS_CHANNEL];

/** The channel a video belongs to, or undefined when it is not one of ours. */
export function channelById(id?: string | null): Channel | undefined {
  if (!id) return undefined;
  return CHANNELS.find((c) => c.id === id);
}

/** True when this id is one of the brand's own channels. */
export function isOwnChannel(id?: string | null): boolean {
  return Boolean(channelById(id));
}

/** The uploads playlist for a channel — "UC…" becomes "UU…". */
export function uploadsPlaylistId(channelId: string): string {
  return channelId.startsWith('UC') ? 'UU' + channelId.substring(2) : channelId;
}

/** Channel URLs for schema.org sameAs. */
export const CHANNEL_URLS: string[] = CHANNELS.map((c) => c.url);

/** A one-click subscribe link for a channel. */
export function subscribeUrl(channel: Channel): string {
  return `${channel.url}?sub_confirmation=1`;
}
