/**
 * WhatsApp Business API links.
 *
 * One number, one message format. The pre-filled text is what the visitor sends,
 * so it reads like a natural first message — no codes. The Audience Hub picks the
 * project auto-reply from the project name, so it must appear exactly as on the page.
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
  return `Hi Property Saraansh, I'm interested in ${projectName}. Please share the price, floor plans and availability.`;
}

/**
 * Everything that is not a project page asks the same simple question and is
 * routed to a human. The wording differs by page type, so the team can see at a
 * glance whether the enquiry came from a video, a news story or an article.
 */
export function videoMessage(videoTitle: string): string {
  return `Hi Property Saraansh, I just watched your video "${videoTitle}" and have a question.`;
}

export function newsMessage(headline: string): string {
  return `Hi Property Saraansh, I read your news "${headline}" and have a question.`;
}

export function blogMessage(articleTitle: string): string {
  return `Hi Property Saraansh, I read your article "${articleTitle}" and have a question.`;
}

export const GENERAL_MESSAGE = "Hi Property Saraansh, I'm looking for a property and would like your guidance.";

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
