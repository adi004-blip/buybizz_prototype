import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAuth } from "@/lib/auth";

/**
 * GET /api/user/agents
 * Get user's purchased agents with API keys
 */
export async function GET(req: NextRequest) {
  try {
    const user = await requireAuth();

    // Get user's purchased agents from UserAgent table
    const userAgents = await db.userAgent.findMany({
      where: { userId: user.id },
      include: {
        agent: {
          include: {
            vendor: {
              select: {
                id: true,
                fullName: true,
                companyName: true,
              },
            },
          },
        },
        order: {
          select: {
            id: true,
            createdAt: true,
            amount: true,
          },
        },
      },
      orderBy: {
        purchasedAt: "desc",
      },
    });

    // Group by agent ID (user might have multiple API keys for same agent)
    const agentsMap = new Map<string, {
      agent: typeof userAgents[0]['agent'];
      apiKeys: string[];
      firstPurchasedAt: Date;
      totalSpent: number;
      orderIds: string[];
    }>();

    userAgents.forEach((ua) => {
      const agentId = ua.agentId;
      if (!agentsMap.has(agentId)) {
        agentsMap.set(agentId, {
          agent: ua.agent,
          apiKeys: [],
          firstPurchasedAt: ua.purchasedAt,
          totalSpent: 0,
          orderIds: [],
        });
      }

      const entry = agentsMap.get(agentId)!;
      entry.apiKeys.push(ua.apiKey);
      entry.totalSpent += Number(ua.order.amount);
      if (!entry.orderIds.includes(ua.orderId)) {
        entry.orderIds.push(ua.orderId);
      }
      // Update first purchased date if this is earlier
      if (ua.purchasedAt < entry.firstPurchasedAt) {
        entry.firstPurchasedAt = ua.purchasedAt;
      }
    });

    // Convert to array format
    const agents = Array.from(agentsMap.values()).map((entry) => ({
      id: entry.agent.id,
      name: entry.agent.name,
      description: entry.agent.description,
      shortDescription: entry.agent.shortDescription,
      imageUrl: entry.agent.imageUrl,
      category: entry.agent.category,
      features: entry.agent.features,
      demoUrl: entry.agent.demoUrl,
      documentationUrl: entry.agent.documentationUrl,
      vendor: {
        id: entry.agent.vendor.id,
        name: entry.agent.vendor.companyName || entry.agent.vendor.fullName,
      },
      apiKeys: entry.apiKeys,
      apiKeyCount: entry.apiKeys.length,
      purchasedAt: entry.firstPurchasedAt.toISOString(),
      totalSpent: entry.totalSpent.toFixed(2),
      orderIds: entry.orderIds,
    }));

    return NextResponse.json({
      agents,
      totalAgents: agents.length,
      totalApiKeys: userAgents.length,
    });
  } catch (error: any) {
    if (error.message?.includes("Unauthorized")) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 });
    }

    console.error("Error fetching user agents:", error);
    return NextResponse.json(
      { error: "Failed to fetch purchased agents", message: error.message },
      { status: 500 }
    );
  }
}

