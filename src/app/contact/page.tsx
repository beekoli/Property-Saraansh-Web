import { Metadata } from 'next';
import { getPageBySlug } from '@/lib/wordpress';
import ContactClient from './ContactClient';

export const revalidate = 60; // Revalidate every minute

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPageBySlug('contact');
  if (!page || !page.yoast_head_json) {
    return { title: 'Contact Us | Property Saraansh Noida' };
  }

  return {
    title: page.yoast_head_json.title || 'Contact Us | Property Saraansh Noida',
    description: page.yoast_head_json.description || 'Get in touch with Saraansh Seth today.',
  };
}

export default async function Contact() {
  const page = await getPageBySlug('contact');

  // Fallback defaults
  const address = page?.acf?.address || "Office no 1604, Tower-A,<br/>ATS BOUQUET, Block B, Sector 132,<br/>Noida, Uttar Pradesh 201301";
  const phone = page?.acf?.phone || "+91 80761 78189";
  const email = page?.acf?.email || "info@propertysaraansh.com";

  return <ContactClient address={address} phone={phone} email={email} />;
}
