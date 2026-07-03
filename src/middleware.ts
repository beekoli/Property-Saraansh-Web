import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const BLOG_REDIRECTS: Record<string, string> = {
  '/blog/crc-the-peridona-jaypee-greens-an-honest-review-investment-analysis':
    '/blog/crc-peridona-jaypee-greens-review-noida',
};

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (BLOG_REDIRECTS[pathname]) {
    const url = request.nextUrl.clone();
    url.pathname = BLOG_REDIRECTS[pathname];
    return NextResponse.redirect(url, { status: 301 });
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/blog/:path*'],
};
