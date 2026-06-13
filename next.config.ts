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
        destination: '/our-videos/jacob-co-noida-indias-first-branded-residence-in-noida-m3m-x-jacob-co-ultra-luxu',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
