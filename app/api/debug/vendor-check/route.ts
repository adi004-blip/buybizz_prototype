import { getCurrentUser } from "@/lib/auth";

/**
 * GET /api/debug/vendor-check
 * Debug endpoint specifically for vendor access check
 */
export async function GET() {
  try {
    const user = await getCurrentUser();
    
    if (!user) {
      return Response.json({
        canAccess: false,
        reason: "Not authenticated",
        user: null,
      });
    }

    const isVendor = user.role === "VENDOR";
    const roleCheck = {
      userRole: user.role,
      expectedRole: "VENDOR",
      matches: isVendor,
      roleType: typeof user.role,
    };

    return Response.json({
      canAccess: isVendor,
      reason: isVendor ? "User is VENDOR" : `User role is ${user.role}, not VENDOR`,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        fullName: user.fullName,
      },
      roleCheck,
    });
  } catch (error: any) {
    return Response.json(
      {
        canAccess: false,
        reason: "Error checking access",
        error: error.message,
        stack: error.stack,
      },
      { status: 500 }
    );
  }
}

