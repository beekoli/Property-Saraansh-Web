/**
 * WhatsApp Business API links.
 *
 * One number, one message format. The pre-filled text is not decoration — the
 * Audience Hub reads it to pick an auto-reply, so the project name must appear
 * exactly as it does on the page and the (Ref: …) tag must survive encoding.
 */

export const WHATSAPP_NUMBER = '916388693937';

export type WhatsAppLocation = 'floating' | 'project_cta' | 'below_form' | 'content_cta';

/** "Eldeco 7 Peaks" -> "ELDECO7PEAKS". Letters and digits only, uppercased. */
export function projectKey(projectName: string): string {
  return (projectName || '')
    .normalize('NFKD')
    .replace(/[^a-zA-Z0-9]/g, '')
    .toUpperCase();
}

export function projectMessage(projectName: string): string {
  return `Hi, I'm interested in ${projectName}. Please share the details. (Ref: ${projectKey(projectName)}-WEB)`;
}

/**
 * Everything that is not a project page asks the same simple question and is
 * routed to a human. Only the Ref changes, so the Hub can tell video, news and
 * blog enquiries apart without a separate auto-reply for each.
 */
export function videoMessage(videoTitle: string): string {
  return `Hi, I have a question about your video "${videoTitle}". (Ref: PS-VIDEO)`;
}

export function newsMessage(headline: string): string {
  return `Hi, I have a question about this news "${headline}". (Ref: PS-NEWS)`;
}

export function blogMessage(articleTitle: string): string {
  return `Hi, I have a question about this blog "${articleTitle}". (Ref: PS-BLOG)`;
}

export const GENERAL_MESSAGE = "Hi, I'd like help finding a property. (Ref: PS-WEB)";

export function waLink(message: string): string {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

export const waProjectLink = (projectName: string) => waLink(projectMessage(projectName));
export const waVideoLink = (videoTitle: string) => waLink(videoMessage(videoTitle));
export const waNewsLink = (headline: string) => waLink(newsMessage(headline));
export const waBlogLink = (articleTitle: string) => waLink(blogMessage(articleTitle));
export const waGeneralLink = () => waLink(GENERAL_MESSAGE);

/**
 * Attributes every WhatsApp anchor should carry. The global click handler in
 * WhatsAppDeepLink reads them to fire one `whatsapp_click` analytics event, so
 * no page needs its own tracking code.
 */
export function waTracking(location: WhatsAppLocation, project?: string | null) {
  return {
    'data-wa-location': location,
    'data-wa-project': project || 'general',
  };
}
