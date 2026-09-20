import type { NextConfig } from "next";
import packageJson from "./package.json";

const nextConfig: NextConfig = {
  env: {
    NEXT_PUBLIC_APP_VERSION:
      process.env.NEXT_PUBLIC_APP_VERSION || packageJson.version,
  },
  experimental: {
    serverActions: {
      bodySizeLimit: "11mb",
    },
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**.amazonaws.com",
      },
    ],
  },
};

export default nextConfig;
