import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireVendor } from "@/lib/auth";

/**
 * GET /api/vendor/orders
 * Get orders for vendor's products
 */
export async function GET(req: NextRequest) {
  try {
    const user = await requireVendor();

    // Get vendor's agent IDs
    const vendorAgents = await db.agent.findMany({
      where: { vendorId: user.id },
      select: { id: true },
    });

    const agentIds = vendorAgents.map(agent => agent.id);

    if (agentIds.length === 0) {
      return NextResponse.json({
        orders: [],
        totalOrders: 0,
        totalRevenue: "0.00",
      });
    }

    // Get orders that contain vendor's agents
    const orders = await db.order.findMany({
      where: {
        orderItems: {
          some: {
            agentId: { in: agentIds },
          },
        },
      },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            fullName: true,
          },
        },
        orderItems: {
          where: {
            agentId: { in: agentIds },
          },
          include: {
            agent: {
              select: {
                id: true,
                name: true,
                imageUrl: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    // Calculate revenue per order for vendor's items
    const ordersWithRevenue = orders.map(order => {
      const vendorRevenue = order.orderItems.reduce((sum, item) => {
        return sum + Number(item.price) * item.quantity;
      }, 0);

      return {
        id: order.id,
        userId: order.userId,
        customer: {
          id: order.user.id,
          email: order.user.email,
          name: order.user.fullName,
        },
        items: order.orderItems.map(item => ({
          id: item.id,
          agentId: item.agentId,
          agentName: item.agent.name,
          agentImage: item.agent.imageUrl,
          quantity: item.quantity,
          price: item.price.toString(),
        })),
        totalAmount: order.amount.toString(),
        vendorRevenue: vendorRevenue.toFixed(2),
        status: order.status,
        createdAt: order.createdAt.toISOString(),
        updatedAt: order.updatedAt.toISOString(),
      };
    });

    // Calculate totals
    const totalRevenue = ordersWithRevenue.reduce(
      (sum, order) => sum + parseFloat(order.vendorRevenue),
      0
    );

    const totalOrders = ordersWithRevenue.length;
    const completedOrders = ordersWithRevenue.filter(
      order => order.status === "COMPLETED"
    ).length;
    const pendingOrders = ordersWithRevenue.filter(
      order => order.status === "PENDING"
    ).length;

    return NextResponse.json({
      orders: ordersWithRevenue,
      summary: {
        totalOrders,
        completedOrders,
        pendingOrders,
        totalRevenue: totalRevenue.toFixed(2),
      },
    });
  } catch (error: any) {
    if (error.message?.includes("Unauthorized") || error.message?.includes("vendor")) {
      return NextResponse.json(
        { error: "Vendor access required" },
        { status: 403 }
      );
    }

    console.error("Error fetching vendor orders:", error);
    return NextResponse.json(
      { error: "Failed to fetch orders", message: error.message },
      { status: 500 }
    );
  }
}

