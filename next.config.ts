import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  typedRoutes: true,
  poweredByHeader: false,
  serverExternalPackages: ["firebase-admin"],
  experimental: {
    optimizePackageImports: ["firebase"]
  }
};

export default nextConfig;
