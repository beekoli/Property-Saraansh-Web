import { Metadata } from 'next';
import { getBlogsPage } from '@/lib/wordpress';
import { FRONTEND_URL } from '@/lib/seo';
import BlogClient from './BlogClient';

export const revalidate = 60; // Revalidate every minute

const PER_PAGE = 12;

interface PageProps {
  searchParams: Promise<{ page?: string }>;
}

function parsePage(raw?: string): number {
  const n = Number.parseInt(raw ?? '1', 10);
  return Number.isFinite(n) && n > 0 ? n : 1;
}

export async function generateMetadata({ searchParams }: PageProps): Promise<Metadata> {
  const page = parsePage((await searchParams).page);

  const baseTitle = 'Noida Real Estate Blogs & Investment Advice | Property Saraansh';
  const baseDescription =
    'Read the latest trends, regulatory updates, RERA guidelines, and micro-market analysis for Noida Expressway and Greater Noida properties by Saraansh Seth.';

  // Page 1 canonicalises to the bare /blog URL; deeper pages self-canonicalise
  // so they stay indexable as distinct listing pages rather than folding into
  // page 1 and taking their outbound links with them.
  const canonical = page > 1 ? `${FRONTEND_URL}/blog?page=${page}` : `${FRONTEND_URL}/blog`;

  return {
    title: page > 1 ? `${baseTitle} — Page ${page}` : baseTitle,
    description: baseDescription,
    alternates: { canonical },
  };
}

export default async function Blog({ searchParams }: PageProps) {
  const page = parsePage((await searchParams).page);
  const { posts, totalPages, total } = await getBlogsPage(page, PER_PAGE);

  return (
    <BlogClient
      initialBlogs={posts}
      page={page}
      totalPages={totalPages}
      total={total}
    />
  );
}
