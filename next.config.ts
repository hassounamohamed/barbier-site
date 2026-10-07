import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  devIndicators: false,
  images: {
    remotePatterns: [{ protocol: "https", hostname: "scontent.ftun14-1.fna.fbcdn.net" }],
  },
};

export default nextConfig;
