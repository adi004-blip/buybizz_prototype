import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";

/**
 * GET /api/admin/vendor-applications
 * Get all vendor applications
 */
export async function GET(req: NextRequest) {
  try {
    await requireAdmin();

    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status"); // Filter by status

    const where: any = {};
    if (status && ["PENDING", "APPROVED", "REJECTED"].includes(status)) {
      where.status = status;
    }

    const applications = await db.vendorApplication.findMany({
      where,
      include: {
        user: {
          select: {
            id: true,
            email: true,
            fullName: true,
            companyName: true,
            createdAt: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json({
      applications: applications.map(app => ({
        id: app.id,
        userId: app.userId,
        user: {
          id: app.user.id,
          email: app.user.email,
          fullName: app.user.fullName,
          companyName: app.user.companyName,
          createdAt: app.user.createdAt.toISOString(),
        },
        companyName: app.companyName,
        description: app.description,
        status: app.status,
        reviewedBy: app.reviewedBy,
        reviewedAt: app.reviewedAt?.toISOString() || null,
        rejectionReason: app.rejectionReason,
        createdAt: app.createdAt.toISOString(),
        updatedAt: app.updatedAt.toISOString(),
      })),
    });
  } catch (error: any) {
    if (error.message?.includes("Unauthorized") || error.message?.includes("Admin")) {
      return NextResponse.json(
        { error: "Admin access required" },
        { status: 403 }
      );
    }

    console.error("Error fetching vendor applications:", error);
    return NextResponse.json(
      { error: "Failed to fetch vendor applications", message: error.message },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/admin/vendor-applications
 * Approve or reject a vendor application
 */
export async function PATCH(req: NextRequest) {
  try {
    const admin = await requireAdmin();

    const { applicationId, action, rejectionReason } = await req.json();

    if (!applicationId || !action) {
      return NextResponse.json(
        { error: "applicationId and action are required" },
        { status: 400 }
      );
    }

    if (!["approve", "reject"].includes(action)) {
      return NextResponse.json(
        { error: "Action must be 'approve' or 'reject'" },
        { status: 400 }
      );
    }

    // Get the application
    const application = await db.vendorApplication.findUnique({
      where: { id: applicationId },
      include: { user: true },
    });

    if (!application) {
      return NextResponse.json(
        { error: "Vendor application not found" },
        { status: 404 }
      );
    }

    if (application.status !== "PENDING") {
      return NextResponse.json(
        { error: `Application is already ${application.status}` },
        { status: 400 }
      );
    }

    // Update application and user role
    if (action === "approve") {
      await db.$transaction([
        // Update application
        db.vendorApplication.update({
          where: { id: applicationId },
          data: {
            status: "APPROVED",
            reviewedBy: admin.id,
            reviewedAt: new Date(),
          },
        }),
        // Promote user to VENDOR
        db.user.update({
          where: { id: application.userId },
          data: {
            role: "VENDOR",
            ...(application.companyName && { companyName: application.companyName }),
          },
        }),
      ]);
    } else {
      // Reject
      await db.vendorApplication.update({
        where: { id: applicationId },
        data: {
          status: "REJECTED",
          reviewedBy: admin.id,
          reviewedAt: new Date(),
          rejectionReason: rejectionReason || null,
        },
      });
    }

    return NextResponse.json({
      success: true,
      message: `Vendor application ${action === "approve" ? "approved" : "rejected"}`,
    });
  } catch (error: any) {
    if (error.message?.includes("Unauthorized") || error.message?.includes("Admin")) {
      return NextResponse.json(
        { error: "Admin access required" },
        { status: 403 }
      );
    }

    console.error("Error updating vendor application:", error);
    return NextResponse.json(
      { error: "Failed to update vendor application", message: error.message },
      { status: 500 }
    );
  }
}

