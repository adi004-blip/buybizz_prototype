import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { db } from "@/lib/db";

/**
 * GET /api/debug/user
 * Debug endpoint to check user authentication and role
 */
export async function GET(req: NextRequest) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json({
        authenticated: false,
        message: "User not authenticated",
      });
    }

    // Double check database
    const dbUser = await db.user.findUnique({
      where: { id: user.id },
      select: {
        id: true,
        email: true,
        role: true,
        fullName: true,
      },
    });

    return NextResponse.json({
      authenticated: true,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        fullName: user.fullName,
      },
      dbUser: dbUser,
      rolesMatch: user.role === dbUser?.role,
    });
  } catch (error: any) {
    console.error("[Debug] Error:", error);
    return NextResponse.json(
      {
        error: error.message,
        stack: error.stack,
      },
      { status: 500 }
    );
  }
}

