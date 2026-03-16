import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      { source: '/feed.xml', destination: '/api/rss' },
      { source: '/rss.xml', destination: '/api/rss' },
      { source: '/feed', destination: '/api/rss' },
    ];
  },
};

export default nextConfig;
