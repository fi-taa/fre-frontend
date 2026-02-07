import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: ["http://10.50.168.151:3000", "http://10.50.168.151"],
  experimental: {
    optimizePackageImports: ["lucide-react"],
  },
};

export default nextConfig;
