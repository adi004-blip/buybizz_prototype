import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { db } from "@/lib/db";
import { UserRole } from "@prisma/client";

/**
 * PATCH /api/admin/users/[userId]/role
 * Update a user's role (Admin only)
 */
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    // Require admin authentication
    await requireAdmin();

    const { userId } = await params;
    const { role } = await req.json();

    // Validate role
    if (!["CUSTOMER", "VENDOR", "ADMIN"].includes(role)) {
      return NextResponse.json(
        { error: "Invalid role. Must be CUSTOMER, VENDOR, or ADMIN" },
        { status: 400 }
      );
    }

    // Update user role
    const updatedUser = await db.user.update({
      where: { id: userId },
      data: { role: role as UserRole },
    });

    return NextResponse.json({
      success: true,
      user: {
        id: updatedUser.id,
        email: updatedUser.email,
        role: updatedUser.role,
        fullName: updatedUser.fullName,
      },
    });
  } catch (error: any) {
    if (error.message === "Unauthorized" || error.message.includes("Forbidden")) {
      return NextResponse.json({ error: error.message }, { status: 403 });
    }

    if (error.code === "P2025") {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    console.error("Error updating user role:", error);
    return NextResponse.json(
      { error: "Failed to update user role" },
      { status: 500 }
    );
  }
}

