import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { auth } from "@clerk/nextjs/server";

/**
 * GET /api/debug/vendor-layout
 * Debug endpoint to test vendor layout logic
 */
export async function GET(req: NextRequest) {
  try {
    // Check Clerk auth
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({
        success: false,
        step: "clerk_auth",
        message: "User not authenticated via Clerk",
        userId: null,
      });
    }

    // Try to get user from database
    const user = await getCurrentUser();
    
    if (!user) {
      return NextResponse.json({
        success: false,
        step: "get_user",
        message: "getCurrentUser() returned null",
        userId: userId,
        clerkAuth: true,
      });
    }

    // Check role
    const isVendor = user.role === "VENDOR";
    
    return NextResponse.json({
      success: true,
      step: "all_checks",
      message: isVendor ? "User is VENDOR - should have access" : "User is not VENDOR - should be redirected",
      userId: userId,
      clerkAuth: true,
      userExists: true,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        fullName: user.fullName,
      },
      isVendor: isVendor,
      shouldHaveAccess: isVendor,
    });
  } catch (error: any) {
    console.error("[DebugVendorLayout] Error:", error);
    return NextResponse.json(
      {
        success: false,
        step: "error",
        message: "An error occurred",
        error: {
          message: error.message,
          code: error.code,
          meta: error.meta,
          stack: error.stack,
        },
      },
      { status: 500 }
    );
  }
}

