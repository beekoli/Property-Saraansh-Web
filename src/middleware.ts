import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const REDIRECTS: Record<string, string> = {
  '/blog/crc-the-peridona-jaypee-greens-an-honest-review-investment-analysis':
    '/blog/crc-peridona-jaypee-greens-review-noida',
  '/our-videos/lt-green-reserve-sector-128-noida':
    '/our-videos/lt-green-reserve-sector-128-buying-guide',
  '/commercial-property-in-noida-the-complete-guide':
    '/our-videos/noida-commercial-builder-vs-self-lease',
};

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (REDIRECTS[pathname]) {
    const url = request.nextUrl.clone();
    url.pathname = REDIRECTS[pathname];
    return NextResponse.redirect(url, { status: 301 });
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/blog/:path*', '/our-videos/:path*', '/commercial-property-in-noida-the-complete-guide'],
};
