import { Metadata } from 'next';
import { getPageBySlug } from '@/lib/wordpress';
import ContactClient from './ContactClient';
import { buildPageMetadata } from '@/lib/seo';

export const revalidate = 60; // Revalidate every minute

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPageBySlug('contact');
  // Previously this early return skipped buildPageMetadata entirely, so /contact
  // shipped with no canonical tag at all whenever WordPress had no Yoast data
  // for it — which is the state it has been in. Go through the same builder so
  // the canonical is always present and only the words differ.
  if (!page || !page.yoast_head_json) {
    return buildPageMetadata({
      path: '/contact',
      title: 'Contact Us | Property Saraansh Noida',
      description: 'Get in touch with Saraansh Seth for honest, RERA-backed property guidance in Noida, Greater Noida and Noida Extension.',
    });
  }

  return buildPageMetadata({
    path: '/contact',
    title: page.yoast_head_json.title || 'Contact Us | Property Saraansh Noida',
    description: page.yoast_head_json.description || 'Get in touch with Saraansh Seth today.',
  });
}

export default async function Contact() {
  const page = await getPageBySlug('contact');

  // Fallback defaults
  const address = page?.acf?.address || "Office no 1604, Tower-A,<br/>ATS BOUQUET, Block B, Sector 132,<br/>Noida, Uttar Pradesh 201301";
  const phone = page?.acf?.phone || "+91 80761 78189";
  const email = page?.acf?.email || "info@propertysaraansh.com";

  return <ContactClient address={address} phone={phone} email={email} />;
}
