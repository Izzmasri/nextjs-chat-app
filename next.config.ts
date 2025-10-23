import type { NextConfig } from "next";

const nextConfig = {
  experimental: {
    serverExternalPackages: ["ably"],
  },
};

export default nextConfig;
