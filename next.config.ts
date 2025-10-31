import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Include Prisma binaries in the deployment
  outputFileTracingIncludes: {
    "/api/**/*": [
      "./node_modules/.prisma/client/**/*",
      "./node_modules/@prisma/client/**/*",
    ],
  },
};

export default nextConfig;
