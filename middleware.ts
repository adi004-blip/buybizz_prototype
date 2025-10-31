import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isPublicRoute = createRouteMatcher([
  "/",
  "/shop(.*)",
  "/product(.*)",
  "/creators(.*)",
  "/vendors(.*)",
  "/about(.*)",
  "/api/webhooks(.*)", // Webhooks must be public for Clerk to call
]);

export default clerkMiddleware(async (auth, req) => {
  // Protect all routes except public ones
  if (!isPublicRoute(req)) {
    await auth.protect();
  }
});

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};

