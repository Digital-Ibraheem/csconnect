import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "api.dicebear.com",
        pathname: "/9.x/shapes/svg",
      },
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
        pathname: "/**",
      },
    ],
    domains: ["randomuser.me", "lh3.googleusercontent.com"],
    dangerouslyAllowSVG: true, // Allow SVG images
  },
};

export default nextConfig;
