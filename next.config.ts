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
};

export default nextConfig;
