
/** @type {import('next').NextConfig} */
import 'dotenv/config';

const nextConfig = {
  async rewrites() {
    return [
      {
        source: '/studio/:path*',
        destination: '/studio', // This ensures requests to /studio are routed correctly
      },
    ];
  },
  images: {
    domains: ['cdn.sanity.io'], // Add Sanity's image CDN domain here
  },
  env: {
    NEXT_PUBLIC_SANITY_API_VERSION: process.env.NEXT_PUBLIC_SANITY_API_VERSION,
    NEXT_PUBLIC_SANITY_DATASET: process.env.NEXT_PUBLIC_SANITY_DATASET,
    NEXT_PUBLIC_SANITY_PROJECT_ID: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
    SANITY_API_TOKEN: process.env.SANITY_API_TOKEN,
  },

};

export default nextConfig;
