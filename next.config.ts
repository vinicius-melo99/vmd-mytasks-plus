import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: false,
  images: {
    remotePatterns: [{
      protocol: 'https',
      hostname: 'lh3.googleusercontent.com'
    }],
  },

  env: {
    BASE_URL: process.env.NEXTAUTH_URL
  }
};

export default nextConfig;
