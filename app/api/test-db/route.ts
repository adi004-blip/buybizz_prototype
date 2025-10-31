import { db } from "@/lib/db";
import { NextResponse } from "next/server";

/**
 * GET /api/test-db
 * Test database connection and basic operations
 */
export async function GET() {
  try {
    // Test 1: Count users
    const userCount = await db.user.count();
    
    // Test 2: Try to query a user
    const users = await db.user.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
    });

    // Test 3: Check DATABASE_URL is set
    const hasDbUrl = !!process.env.DATABASE_URL;

    return NextResponse.json({
      success: true,
      message: "Database connection successful",
      data: {
        userCount,
        recentUsers: users.map((u) => ({
          id: u.id,
          email: u.email,
          role: u.role,
          createdAt: u.createdAt,
        })),
        databaseUrlConfigured: hasDbUrl,
        databaseUrlPrefix: hasDbUrl
          ? process.env.DATABASE_URL?.substring(0, 30) + "..."
          : "NOT SET",
      },
    });
  } catch (error: any) {
    console.error("[Test DB] Error:", {
      message: error.message,
      code: error.code,
      meta: error.meta,
    });

    return NextResponse.json(
      {
        success: false,
        error: "Database connection failed",
        details: {
          message: error.message,
          code: error.code,
          meta: error.meta,
          databaseUrlConfigured: !!process.env.DATABASE_URL,
        },
      },
      { status: 500 }
    );
  }
}

