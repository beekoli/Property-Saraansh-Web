/**
 * Conversion signal for website lead forms.
 *
 * GTM (GTM-TWS3H2JB) listens for the `ps_lead_submitted` dataLayer event and
 * fires the GA4 `generate_lead` tag and the Meta Lead event from it.
 *
 * Only call this with the parsed body of a 2xx /api/leads response. A 2xx alone
 * is not proof the lead arrived: the route answers 200 to silently dropped
 * spam, and to real leads whose Sheet, CRM and email forwarding all failed.
 * So the event fires only when the lead reached at least one destination.
 * Call it once per submission (forms disable themselves after submitting, and
 * the /thank-you page pushes nothing), so one submit = one generate_lead.
 */
export function trackLeadSubmitted(
  response: { loggedToSheet?: boolean; loggedToCRM?: boolean; emailed?: boolean } | null,
  source: 'contact' | 'watch_sidebar' | 'new_launch_alert'
): void {
  if (!response || !(response.loggedToSheet || response.loggedToCRM || response.emailed)) return;
  try {
    const w = window as unknown as { dataLayer?: unknown[] };
    w.dataLayer = w.dataLayer || [];
    w.dataLayer.push({ event: 'ps_lead_submitted', lead_source: source });
  } catch {
    /* never let tracking break the form */
  }
}
