import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      'pdfjs-dist/build/pdf': 'pdfjs-dist/build/pdf.esm.js', // Use ESM for modern browsers
    };
    return config;
  },
  turbopack: {},
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'rrjceacgpemebgmooeny.supabase.co',
        port: '',
      },
    ],
  },
};

export default nextConfig;
