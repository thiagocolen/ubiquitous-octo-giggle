import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // compoment level caching
  // instead of page level caching
  cacheComponents: true,

  // performance optimization
  partialPrefetching: true,

  // how turbopack should handle tailwindcss
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
