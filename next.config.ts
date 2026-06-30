import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'linen-gorilla-480120.hostingersite.com',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'cdn-icons-png.flaticon.com',
      },
    ],
  },
  async redirects() {
    return [
      {
        source: '/:path*',
        has: [
          {
            type: 'host',
            value: 'propertysaraansh.in',
          },
        ],
        destination: 'https://www.propertysaraansh.com/:path*',
        permanent: true,
      },
      {
        source: '/:path*',
        has: [
          {
            type: 'host',
            value: 'www.propertysaraansh.in',
          },
        ],
        destination: 'https://www.propertysaraansh.com/:path*',
        permanent: true,
      },
      {
        source: '/our-videos/experion-saatori-sector-151-noida-premium-3-4-bhk-review',
        destination: '/our-videos/experion-saatori-sector-151-noida-honest-review-investment-analysis',
        permanent: true,
      },
      {
        source: '/our-videos/jacob-co-noida-first-branded-residence',
        destination: '/our-videos/m3m-jacob-co-noida',
        permanent: true,
      },
      {
        source: '/our-videos/jacob-co-noida-indias-first-branded-residence-in-noida-m3m-x-jacob-co-ultra-luxu',
        destination: '/our-videos/m3m-jacob-co-noida',
        permanent: true,
      },
      {
        source: '/why-exit-has-become-the-biggest-problem-in-noida-real-estate/:path*',
        destination: '/blog/why-exit-has-become-the-biggest-problem-in-noida-real-estate/:path*',
        permanent: true,
      },
      {
        source: '/jacob-co-noida-first-branded-residences-in-noida',
        destination: '/our-videos/m3m-jacob-co-noida',
        permanent: true,
      },
      {
        source: '/our-videos/noida-market-slowdown-effects-on-builders-sellers-buyers-in-2026',
        destination: '/our-videos/noida-market-slowdown-2026',
        permanent: true,
      },
      {
        source: '/our-videos/noida-real-estate-market-slowdown-2026',
        destination: '/our-videos/noida-market-slowdown-2026',
        permanent: true,
      },
      {
        source: '/our-videos/max-estates-105-vs-max-estates-128-which-one-is-better',
        destination: '/our-videos/max-estates-105-vs-128',
        permanent: true,
      },
      {
        source: '/our-videos/max-estates-105-noida-price-floor-plan-review-investment-analysis',
        destination: '/our-videos/max-estates-105-vs-128',
        permanent: true,
      },
      {
        source: '/max-estates-105-noida-price-floor-plan',
        destination: '/our-videos/max-estates-105-vs-128',
        permanent: true,
      },
      {
        source: '/our-videos/noida-property-market-reality-authority-builder-broker-buyer-truth',
        destination: '/our-videos/noida-property-market-reality',
        permanent: true,
      },
      {
        source: '/noida-real-estate-reality-illegal-plotting',
        destination: '/our-videos/noida-property-market-reality',
        permanent: true,
      },
      {
        source: '/our-videos/eldeco-7-peaks-residences-omicron-1-greater-noida-3bhk-layout-analysis-investmen',
        destination: '/our-videos/eldeco-7-peaks-omicron-1',
        permanent: true,
      },
      {
        source: '/eldeco-7-peaks-residences-greater-noida',
        destination: '/our-videos/eldeco-7-peaks-omicron-1',
        permanent: true,
      },
      {
        source: '/our-videos/yamuna-expressway-investment-2030-who-should-buy-who-should-avoid-future-price-p',
        destination: '/our-videos/yamuna-expressway-investment-2030',
        permanent: true,
      },
      {
        source: '/our-videos/yamuna-expressway-noida-investment-2030-should-you-buy-property-near-jewar-airport',
        destination: '/our-videos/yamuna-expressway-investment-2030',
        permanent: true,
      },
      {
        source: '/our-videos/eldeco-7-peaks-greater-noida',
        destination: '/our-videos/eldeco-7-peaks-omicron-1',
        permanent: true,
      },
      {
        source: '/our-videos/crc-the-peridona-jaypee-greens-noida-why-this-is-noidas-most-exclusive-project',
        destination: '/our-videos/crc-the-peridona-jaypee-greens',
        permanent: true,
      },
      {
        source: '/crc-the-peridona-jaypee-greens-noida',
        destination: '/our-videos/crc-the-peridona-jaypee-greens',
        permanent: true,
      },
      {
        source: '/eldeco-greater-noida-detailed-review-of-eldeco-7-peaks-residences',
        destination: '/our-videos/eldeco-7-peaks-omicron-1',
        permanent: true,
      },
      {
        source: '/our-videos/commercial-property-in-noida-builder-lease-vs-self-lease',
        destination: '/our-videos/commercial-property-in-noida',
        permanent: true,
      },
      {
        source: '/our-videos/builder-lease-vs-self-lease-noida',
        destination: '/our-videos/commercial-property-in-noida',
        permanent: true,
      },
      {
        source: '/our-videos/commercial-real-estate-in-noida',
        destination: '/our-videos/commercial-property-in-noida',
        permanent: true,
      },
      {
        source: '/our-videos/noida-property-market-2025-what-worked-what-failed',
        destination: '/our-videos/noida-property-market-2025',
        permanent: true,
      },
      {
        source: '/noida-real-estate-2025-conclusion-project-by-project-reality-check-by-property-saraansh',
        destination: '/our-videos/noida-property-market-2025',
        permanent: true,
      },
      {
        source: '/our-shorts/elie-saab-noida-vs-jacob-co-noida-vs-m3m-cullinan',
        destination: '/our-videos/elie-saab-jacob-co-noida-vs-m3m-cullinan-resale-m3mnoida',
        permanent: true,
      },
      {
                  source: '/blog/crc-the-peridona-jaypee-greens-an-honest-review-investment-analysis',
                  destination: '/blog/crc-peridona-jaypee-greens-review-noida',
                  permanent: true,
      },
    ];
  },
};

export default nextConfig;
