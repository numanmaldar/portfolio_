import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  basePath: "/portfolio_",
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
