import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAuth } from "@/lib/auth";

/**
 * POST /api/vendor/register
 * Create vendor application (requires admin approval)
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

    // Check if user already has a pending application
    const existingApplication = await db.vendorApplication.findUnique({
      where: { userId: user.id },
    });

    if (existingApplication) {
      if (existingApplication.status === "PENDING") {
        return NextResponse.json(
          { error: "You already have a pending vendor application" },
          { status: 400 }
        );
      }
      if (existingApplication.status === "APPROVED") {
        return NextResponse.json(
          { error: "Your vendor application was already approved" },
          { status: 400 }
        );
      }
      // If rejected, allow them to reapply
    }

    // Get request body
    const body = await req.json();
    const { companyName, reason } = body;

    if (!reason || reason.trim().length < 10) {
      return NextResponse.json(
        { error: "Please provide a description of your AI agents (at least 10 characters)" },
        { status: 400 }
      );
    }

    // Create vendor application
    const application = await db.vendorApplication.upsert({
      where: { userId: user.id },
      update: {
        companyName: companyName || null,
        description: reason,
        status: "PENDING",
        reviewedBy: null,
        reviewedAt: null,
        rejectionReason: null,
      },
      create: {
        userId: user.id,
        companyName: companyName || null,
        description: reason,
        status: "PENDING",
      },
    });

    // Update user's company name if provided
    if (companyName) {
      await db.user.update({
        where: { id: user.id },
        data: { companyName },
      });
    }

    return NextResponse.json({
      success: true,
      message: "Vendor application submitted successfully. Awaiting admin approval.",
      application: {
        id: application.id,
        status: application.status,
        createdAt: application.createdAt.toISOString(),
      },
    });
  } catch (error: any) {
    if (error.message?.includes("Unauthorized")) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    console.error("Error creating vendor application:", error);
    return NextResponse.json(
      { error: "Failed to submit vendor application", message: error.message },
      { status: 500 }
    );
  }
}

