import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Include Prisma binaries in the deployment for all server-side code
  outputFileTracingIncludes: {
    "/**": [
      "./node_modules/.prisma/client/**/*",
      "./node_modules/@prisma/client/**/*",
      "./node_modules/.prisma/client/libquery_engine-rhel-openssl-3.0.x.so.node",
    ],
  },
  // Ensure server components can access Prisma
  experimental: {
    outputFileTracingExcludes: {
      "*": [
        "node_modules/@swc/core-*/**/*",
      ],
    },
  },
};

export default nextConfig;
