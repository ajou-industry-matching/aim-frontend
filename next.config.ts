import type { NextConfig } from "next";
import { PHASE_DEVELOPMENT_SERVER } from "next/constants";

export default (phase: string): NextConfig => {
  const isDev = phase === PHASE_DEVELOPMENT_SERVER;

  const nextConfig: NextConfig = {
    reactStrictMode: true,
    // @ts-ignore: custom property that might not exist in NextConfig type
    allowedDevOrigins: ["10.250.174.185", "10.250.203.166"],
    output: "export",
    trailingSlash: true,
    images: {
      unoptimized: true, // static export 환경에서 next/image 사용 시 필요
    },
    ...(isDev && {
      async rewrites() {
        return [
          {
            source: "/api/:path*",
            destination: `${process.env.DEV_BACKEND_PROXY_TARGET || "http://127.0.0.1:8080"}/api/:path*`,
          },
        ];
      },
    }),
  };

  return nextConfig;
};
