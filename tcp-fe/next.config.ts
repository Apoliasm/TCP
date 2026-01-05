import type { NextConfig } from "next";
const isDev = process.env.NODE_ENV === "development";
const nextConfig: NextConfig = {
  /* config options here */
  async rewrites() {
    if (!isDev) return [];
    return [
      {
        source: "/api/:path*",
        destination: "http://localhost:3000/:path*",
      },
      {
        source: "/api/uploads/:path*",
        destination: "http://localhost:3000/uploads/:path*",
      },
    ];
  },
};

export default nextConfig;
