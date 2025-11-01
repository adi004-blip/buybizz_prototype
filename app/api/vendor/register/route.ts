import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAuth } from "@/lib/auth";

/**
 * POST /api/vendor/register
 * Register user as a vendor (self-registration)
 * For MVP: Auto-approves and promotes to VENDOR
 */
export async function POST(req: NextRequest) {
  try {
    const user = await requireAuth();

    // Check if user is already a vendor or admin
    if (user.role === "VENDOR" || user.role === "ADMIN") {
      return NextResponse.json(
        { 
          success: true, 
          message: "Already a vendor",
          user: {
            id: user.id,
            role: user.role,
          }
        },
        { status: 200 }
      );
    }

    // Get request body (optional - for future use like application details)
    const body = await req.json().catch(() => ({}));
    const { companyName, reason } = body;

    // For MVP: Auto-approve and promote to VENDOR
    // In production, this would create a vendor application for admin review
    const updatedUser = await db.user.update({
      where: { id: user.id },
      data: { 
        role: "VENDOR",
        // Optionally save company name if provided
        ...(companyName && { companyName }),
      },
    });

    return NextResponse.json({
      success: true,
      message: "Successfully registered as vendor",
      user: {
        id: updatedUser.id,
        email: updatedUser.email,
        role: updatedUser.role,
        fullName: updatedUser.fullName,
        companyName: updatedUser.companyName,
      },
    });
  } catch (error: any) {
    if (error.message?.includes("Unauthorized")) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    console.error("Error registering as vendor:", error);
    return NextResponse.json(
      { error: "Failed to register as vendor", message: error.message },
      { status: 500 }
    );
  }
}

