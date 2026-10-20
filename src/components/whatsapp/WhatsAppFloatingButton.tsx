'use client';

import WhatsAppIcon from '@/components/icons/WhatsAppIcon';
import { waLink } from '@/lib/whatsapp';
import { useWhatsAppMessage } from './WhatsAppContext';

/**
 * Site-wide WhatsApp button, bottom-right.
 *
 * The message follows the page: a project page sends the project enquiry, an
 * article page sends the article question, everything else sends the general
 * one. Sits above the property pages' sticky mobile bar rather than on top of
 * it — that bar is the only fixed bottom element on the site.
 */
export default function WhatsAppFloatingButton() {
  const { message, project } = useWhatsAppMessage();

  return (
    <a
      href={waLink(message)}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat on WhatsApp"
      data-wa-location="floating"
      data-wa-project={project || 'general'}
      className="fixed right-4 bottom-[86px] z-[55] flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-[0_6px_20px_rgba(0,0,0,.28)] transition hover:brightness-110 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#25D366] lg:bottom-6 lg:right-6"
    >
      <WhatsAppIcon className="h-7 w-7" />
    </a>
  );
}
