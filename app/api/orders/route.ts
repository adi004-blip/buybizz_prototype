import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAuth } from "@/lib/auth";
import { generateApiKey } from "@/lib/api-keys";

/**
 * POST /api/orders
 * Create order from cart items
 */
export async function POST(req: NextRequest) {
  try {
    const user = await requireAuth();

    // Get user's cart items
    const cartItems = await db.cartItem.findMany({
      where: { userId: user.id },
      include: {
        agent: true,
      },
    });

    if (cartItems.length === 0) {
      return NextResponse.json(
        { error: "Cart is empty" },
        { status: 400 }
      );
    }

    // Validate all agents are active
    const inactiveAgents = cartItems.filter(item => item.agent.status !== "ACTIVE");
    if (inactiveAgents.length > 0) {
      return NextResponse.json(
        { error: "Some agents are no longer available", inactiveAgents: inactiveAgents.map(i => i.agent.name) },
        { status: 400 }
      );
    }

    // Calculate total amount
    const totalAmount = cartItems.reduce((sum, item) => {
      return sum + Number(item.agent.price) * item.quantity;
    }, 0);

    // Create order and order items in a transaction
    const order = await db.$transaction(async (tx) => {
      // Create order
      const newOrder = await tx.order.create({
        data: {
          userId: user.id,
          amount: totalAmount,
          status: "PENDING", // Will be updated to COMPLETED after payment
        },
      });

      // Create order items
      const orderItems = await Promise.all(
        cartItems.map(item =>
          tx.orderItem.create({
            data: {
              orderId: newOrder.id,
              agentId: item.agentId,
              quantity: item.quantity,
              price: item.agent.price,
            },
          })
        )
      );

      // Generate API keys and create UserAgent records
      // Note: We'll create UserAgent records now, but they'll only be valid after payment
      // For now, we create them with pending status (we'll update this when payment succeeds)
      const userAgents = await Promise.all(
        cartItems.flatMap(item =>
          Array.from({ length: item.quantity }).map(() =>
            tx.userAgent.create({
              data: {
                userId: user.id,
                agentId: item.agentId,
                orderId: newOrder.id,
                apiKey: generateApiKey(),
              },
            })
          )
        )
      );

      // Clear cart
      await tx.cartItem.deleteMany({
        where: { userId: user.id },
      });

      return {
        order: newOrder,
        orderItems,
        userAgents,
      };
    });

    return NextResponse.json({
      order: order.order,
      orderItems: order.orderItems,
      apiKeys: order.userAgents.map(ua => ({
        agentId: ua.agentId,
        apiKey: ua.apiKey,
      })),
    }, { status: 201 });
  } catch (error: any) {
    if (error.message?.includes("Unauthorized")) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 });
    }

    console.error("Error creating order:", error);
    return NextResponse.json(
      { error: "Failed to create order", message: error.message },
      { status: 500 }
    );
  }
}

/**
 * GET /api/orders
 * Get user's orders
 */
export async function GET(req: NextRequest) {
  try {
    const user = await requireAuth();

    const orders = await db.order.findMany({
      where: { userId: user.id },
      include: {
        orderItems: {
          include: {
            agent: {
              select: {
                id: true,
                name: true,
                imageUrl: true,
                shortDescription: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json({ orders });
  } catch (error: any) {
    if (error.message?.includes("Unauthorized")) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 });
    }

    console.error("Error fetching orders:", error);
    return NextResponse.json(
      { error: "Failed to fetch orders", message: error.message },
      { status: 500 }
    );
  }
}

