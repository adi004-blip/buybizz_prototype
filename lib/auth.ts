import { auth, currentUser } from "@clerk/nextjs/server";
import { db } from "./db";

/**
 * Get current user from Clerk and sync with database
 */
export async function getCurrentUser() {
  try {
    const { userId } = await auth();
    
    console.log("[getCurrentUser] Clerk userId:", userId);
    
    if (!userId) {
      console.log("[getCurrentUser] No userId from Clerk");
      return null;
    }

    // Try to get user from database using Clerk ID
    let user = await db.user.findUnique({
      where: { id: userId },
    });

    console.log("[getCurrentUser] Database query result:", {
      userExists: !!user,
      userId: user?.id,
      userRole: user?.role,
      roleType: typeof user?.role,
    });

    // If user doesn't exist in DB, create it (this should be handled by webhook, but fallback)
    if (!user) {
      console.log("[getCurrentUser] User not found in DB, attempting to create");
      try {
        const clerkUser = await currentUser();
        if (clerkUser) {
          user = await db.user.create({
            data: {
              id: userId,
              email: clerkUser.emailAddresses[0]?.emailAddress || `${userId}@clerk.user`,
              fullName: clerkUser.firstName && clerkUser.lastName 
                ? `${clerkUser.firstName} ${clerkUser.lastName}`
                : clerkUser.username || "User",
              role: "CUSTOMER",
            },
          });
          console.log("[getCurrentUser] User created:", {
            id: user.id,
            role: user.role,
          });
        } else {
          console.log("[getCurrentUser] Could not get Clerk user data");
        }
      } catch (createError: any) {
        // If user creation fails, log but don't throw - might be a race condition
        console.error("[getCurrentUser] Error creating user:", {
          message: createError.message,
          code: createError.code,
          meta: createError.meta,
        });
        // Return null if we can't create the user
        return null;
      }
    }

    console.log("[getCurrentUser] Returning user:", {
      id: user?.id,
      role: user?.role,
      roleType: typeof user?.role,
    });
    return user;
  } catch (error: any) {
    // Log error but don't throw - return null instead
    console.error("[getCurrentUser] Error:", {
      message: error.message,
      code: error.code,
      meta: error.meta,
      stack: error.stack,
    });
    return null;
  }
}

/**
 * Check if user is a vendor
 */
export async function isVendor(): Promise<boolean> {
  const user = await getCurrentUser();
  return user?.role === "VENDOR";
}

/**
 * Check if user is admin
 */
export async function isAdmin(): Promise<boolean> {
  const user = await getCurrentUser();
  return user?.role === "ADMIN";
}

/**
 * Require authentication - throws if not authenticated
 */
export async function requireAuth() {
  const user = await getCurrentUser();
  if (!user) {
    throw new Error("Unauthorized");
  }
  return user;
}

/**
 * Require vendor role - throws if not vendor or admin
 * Admins can access vendor features
 */
export async function requireVendor() {
  const user = await requireAuth();
  if (user.role !== "VENDOR" && user.role !== "ADMIN") {
    throw new Error("Forbidden: Vendor access required");
  }
  return user;
}

/**
 * Require admin role - throws if not admin
 */
export async function requireAdmin() {
  const user = await requireAuth();
  if (user.role !== "ADMIN") {
    throw new Error("Forbidden: Admin access required");
  }
  return user;
}
