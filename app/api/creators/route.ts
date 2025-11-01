import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

/**
 * GET /api/creators
 * Get all vendors/creators with their stats
 */
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search"); // Search by name/email

    // Build where clause
    const where: any = {
      role: "VENDOR",
    };

    if (search) {
      where.OR = [
        { fullName: { contains: search, mode: "insensitive" } },
        { companyName: { contains: search, mode: "insensitive" } },
        { email: { contains: search, mode: "insensitive" } },
      ];
    }

    // Get vendors with their products
    const vendors = await db.user.findMany({
      where,
      include: {
        agents: {
          where: {
            status: "ACTIVE",
          },
          select: {
            id: true,
            name: true,
            price: true,
            imageUrl: true,
            shortDescription: true,
          },
        },
        _count: {
          select: {
            agents: true,
            orders: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    // Calculate stats for each vendor
    const vendorsWithStats = await Promise.all(
      vendors.map(async (vendor) => {
        // Get total sales (orders containing vendor's products)
        const vendorAgentIds = vendor.agents.map((a) => a.id);
        const totalSales = await db.orderItem.count({
          where: {
            agentId: { in: vendorAgentIds },
          },
        });

        // Calculate total revenue
        const orderItems = await db.orderItem.findMany({
          where: {
            agentId: { in: vendorAgentIds },
          },
          select: {
            price: true,
            quantity: true,
          },
        });

        const totalRevenue = orderItems.reduce(
          (sum, item) => sum + Number(item.price) * item.quantity,
          0
        );

        return {
          id: vendor.id,
          name: vendor.companyName || vendor.fullName,
          email: vendor.email,
          fullName: vendor.fullName,
          companyName: vendor.companyName,
          bio: null, // Can be added later
          slug: vendor.id, // Use ID as slug for now, can be changed to a proper slug later
          rating: 4.5, // Placeholder - can be calculated from reviews later
          totalReviews: 0, // Placeholder
          totalProducts: vendor._count.agents,
          totalSales,
          totalRevenue: totalRevenue.toFixed(2),
          verified: vendor.role === "VENDOR",
          joinedDate: vendor.createdAt.toISOString(),
          products: vendor.agents.slice(0, 6), // Show first 6 products
        };
      })
    );

    return NextResponse.json({
      creators: vendorsWithStats,
      total: vendorsWithStats.length,
    });
  } catch (error: any) {
    console.error("Error fetching creators:", error);
    return NextResponse.json(
      { error: "Failed to fetch creators", message: error.message },
      { status: 500 }
    );
  }
}

