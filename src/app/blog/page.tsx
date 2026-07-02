import { Metadata } from 'next';
import { getLatestBlogs } from '@/lib/wordpress';
import BlogClient from './BlogClient';

export const revalidate = 60; // Revalidate every minute

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Noida Real Estate Blogs & Investment Advice | Property Saraansh',
    description: 'Read the latest trends, regulatory updates, RERA guidelines, and micro-market analysis for Noida Expressway and Greater Noida properties by Saraansh Seth.',
  };
}

export default async function Blog() {
  const blogs = await getLatestBlogs(20); // Fetch up to 20 posts

  return <BlogClient initialBlogs={blogs} />;
}
