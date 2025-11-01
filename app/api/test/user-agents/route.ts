import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAuth } from "@/lib/auth";

/**
 * GET /api/test/user-agents
 * Test endpoint to check user agents and potential issues
 */
export async function GET(req: NextRequest) {
  try {
    const user = await requireAuth();

    // Check if user has any orders
    const orders = await db.order.findMany({
      where: { userId: user.id },
      include: {
        orderItems: true,
        userAgents: true,
      },
    });

    // Get user agents directly
    const userAgents = await db.userAgent.findMany({
      where: { userId: user.id },
      include: {
        agent: {
          select: {
            id: true,
            name: true,
          },
        },
        order: {
          select: {
            id: true,
            amount: true,
          },
        },
      },
    });

    // Check for duplicate user+agent combinations
    const duplicates = userAgents.reduce((acc, ua) => {
      const key = `${ua.userId}-${ua.agentId}`;
      if (!acc[key]) {
        acc[key] = [];
      }
      acc[key].push(ua);
      return acc;
    }, {} as Record<string, typeof userAgents>);

    const duplicateCounts = Object.entries(duplicates)
      .filter(([_, records]) => records.length > 1)
      .map(([key, records]) => ({
        key,
        count: records.length,
        agentId: records[0].agentId,
        agentName: records[0].agent.name,
      }));

    return NextResponse.json({
      userId: user.id,
      userEmail: user.email || "No email",
      totalOrders: orders.length,
      totalUserAgents: userAgents.length,
      orders: orders.map(o => ({
        id: o.id,
        amount: o.amount.toString(),
        status: o.status,
        orderItemsCount: o.orderItems.length,
        userAgentsCount: o.userAgents.length,
      })),
      userAgents: userAgents.map(ua => ({
        id: ua.id,
        agentId: ua.agentId,
        agentName: ua.agent.name,
        apiKey: ua.apiKey.substring(0, 20) + "...",
        orderId: ua.orderId,
        purchasedAt: ua.purchasedAt.toISOString(),
      })),
      duplicates: duplicateCounts,
      hasDuplicates: duplicateCounts.length > 0,
    });
  } catch (error: any) {
    if (error.message?.includes("Unauthorized")) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 });
    }

    console.error("Error in test endpoint:", error);
    return NextResponse.json(
      { error: "Failed to test", message: error.message },
      { status: 500 }
    );
  }
}

