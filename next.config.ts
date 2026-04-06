import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  allowedDevOrigins: ["10.250.174.185", "10.250.203.166"],
  output: "export",
  trailingSlash: true,
  images: {
    unoptimized: true, // static export 환경에서 next/image 사용 시 필요
  },
};

export default nextConfig;
