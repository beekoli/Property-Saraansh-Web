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
    ];
  },
};

export default nextConfig;
