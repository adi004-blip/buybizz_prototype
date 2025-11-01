import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAuth } from "@/lib/auth";

/**
 * GET /api/orders/[id]
 * Get a single order with API keys
 */
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await requireAuth();
    const { id } = await params;

    const order = await db.order.findUnique({
      where: { id },
      include: {
        orderItems: {
          include: {
            agent: {
              select: {
                id: true,
                name: true,
                imageUrl: true,
                shortDescription: true,
                vendor: {
                  select: {
                    id: true,
                    fullName: true,
                    companyName: true,
                  },
                },
              },
            },
          },
        },
        userAgents: {
          include: {
            agent: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
    });

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    // Check if user owns this order
    if (order.userId !== user.id) {
      return NextResponse.json(
        { error: "You don't have permission to view this order" },
        { status: 403 }
      );
    }

    // Group API keys by agent
    const apiKeysByAgent = order.userAgents.reduce((acc, ua) => {
      if (!acc[ua.agentId]) {
        acc[ua.agentId] = [];
      }
      acc[ua.agentId].push({
        apiKey: ua.apiKey,
        purchasedAt: ua.purchasedAt,
      });
      return acc;
    }, {} as Record<string, { apiKey: string; purchasedAt: Date }[]>);

    // Format order items with API keys
    const itemsWithApiKeys = order.orderItems.map((item) => ({
      id: item.id,
      agentId: item.agent.id,
      name: item.agent.name,
      vendor: item.agent.vendor.companyName || item.agent.vendor.fullName,
      price: Number(item.price),
      quantity: item.quantity,
      apiKeys: apiKeysByAgent[item.agentId] || [],
    }));

    return NextResponse.json({
      order: {
        id: order.id,
        amount: Number(order.amount),
        status: order.status,
        createdAt: order.createdAt,
      },
      items: itemsWithApiKeys,
    });
  } catch (error: any) {
    if (error.message?.includes("Unauthorized")) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 });
    }

    console.error("Error fetching order:", error);
    return NextResponse.json(
      { error: "Failed to fetch order", message: error.message },
      { status: 500 }
    );
  }
}

