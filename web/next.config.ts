import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  distDir: "build",
  cacheComponents: true,
  partialPrefetching: true,
};

export default nextConfig;
