import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

/**
 * GET /api/creators/[id]
 * Get a specific creator/vendor with their products and stats
 */
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Find vendor by ID
    const vendor = await db.user.findUnique({
      where: { id },
      include: {
        agents: {
          where: {
            status: "ACTIVE",
          },
          include: {
            vendor: {
              select: {
                id: true,
                fullName: true,
                companyName: true,
              },
            },
            _count: {
              select: {
                orderItems: true,
              },
            },
          },
          orderBy: {
            createdAt: "desc",
          },
        },
        _count: {
          select: {
            agents: true,
            orders: true,
          },
        },
      },
    });

    if (!vendor) {
      return NextResponse.json(
        { error: "Creator not found" },
        { status: 404 }
      );
    }

    if (vendor.role !== "VENDOR" && vendor.role !== "ADMIN") {
      return NextResponse.json(
        { error: "User is not a creator" },
        { status: 404 }
      );
    }

    // Calculate stats
    const vendorAgentIds = vendor.agents.map((a) => a.id);
    
    // Get total sales
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

    // Calculate average rating (placeholder - can be from reviews later)
    const rating = 4.5;
    const totalReviews = 0;

    return NextResponse.json({
      id: vendor.id,
      name: vendor.companyName || vendor.fullName,
      email: vendor.email,
      fullName: vendor.fullName,
      companyName: vendor.companyName,
      bio: null, // Can be added later
      slug: vendor.id,
      rating,
      totalReviews,
      totalProducts: vendor._count.agents,
      totalSales,
      totalRevenue: totalRevenue.toFixed(2),
      verified: vendor.role === "VENDOR",
      joinedDate: vendor.createdAt.toISOString(),
      website: null, // Can be added later
      products: vendor.agents.map((agent) => ({
        id: agent.id,
        name: agent.name,
        description: agent.description,
        shortDescription: agent.shortDescription,
        price: agent.price.toString(),
        originalPrice: agent.originalPrice?.toString() || null,
        imageUrl: agent.imageUrl,
        category: agent.category,
        tags: agent.tags,
        features: agent.features,
        rating: rating, // Placeholder
        sales: agent._count.orderItems,
        createdAt: agent.createdAt.toISOString(),
      })),
    });
  } catch (error: any) {
    console.error("Error fetching creator:", error);
    return NextResponse.json(
      { error: "Failed to fetch creator", message: error.message },
      { status: 500 }
    );
  }
}

