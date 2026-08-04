import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  typedRoutes: true,
  poweredByHeader: false,
  experimental: {
    optimizePackageImports: ["firebase"]
  }
};

export default nextConfig;
