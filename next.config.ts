import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  allowedDevOrigins: ["10.250.174.185", "10.250.203.166"],
  output: "export",
  trailingSlash: true,
};

export default nextConfig;
