import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAuth } from "@/lib/auth";

/**
 * GET /api/cart
 * Get user's cart items
 */
export async function GET(req: NextRequest) {
  try {
    const user = await requireAuth();

    const cartItems = await db.cartItem.findMany({
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
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    // Calculate totals
    const subtotal = cartItems.reduce((sum, item) => {
      return sum + Number(item.agent.price) * item.quantity;
    }, 0);

    return NextResponse.json({
      items: cartItems,
      subtotal: subtotal.toFixed(2),
      itemCount: cartItems.reduce((sum, item) => sum + item.quantity, 0),
    });
  } catch (error: any) {
    if (error.message?.includes("Unauthorized")) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 });
    }

    console.error("Error fetching cart:", error);
    return NextResponse.json(
      { error: "Failed to fetch cart", message: error.message },
      { status: 500 }
    );
  }
}

/**
 * POST /api/cart
 * Add item to cart (or update quantity if exists)
 */
export async function POST(req: NextRequest) {
  try {
    const user = await requireAuth();
    const body = await req.json();
    const { agentId, quantity = 1 } = body;

    if (!agentId) {
      return NextResponse.json({ error: "agentId is required" }, { status: 400 });
    }

    // Check if agent exists and is active
    const agent = await db.agent.findUnique({
      where: { id: agentId },
    });

    if (!agent) {
      return NextResponse.json({ error: "Agent not found" }, { status: 404 });
    }

    if (agent.status !== "ACTIVE") {
      return NextResponse.json({ error: "Agent is not available" }, { status: 400 });
    }

    // Check if item already in cart
    const existingItem = await db.cartItem.findUnique({
      where: {
        userId_agentId: {
          userId: user.id,
          agentId: agentId,
        },
      },
    });

    let cartItem;

    if (existingItem) {
      // Update quantity
      cartItem = await db.cartItem.update({
        where: { id: existingItem.id },
        data: { quantity: existingItem.quantity + quantity },
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
        },
      });
    } else {
      // Create new cart item
      cartItem = await db.cartItem.create({
        data: {
          userId: user.id,
          agentId: agentId,
          quantity: quantity,
        },
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
        },
      });
    }

    return NextResponse.json(cartItem, { status: existingItem ? 200 : 201 });
  } catch (error: any) {
    if (error.message?.includes("Unauthorized")) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 });
    }

    console.error("Error adding to cart:", error);
    return NextResponse.json(
      { error: "Failed to add to cart", message: error.message },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/cart
 * Clear entire cart
 */
export async function DELETE(req: NextRequest) {
  try {
    const user = await requireAuth();

    await db.cartItem.deleteMany({
      where: { userId: user.id },
    });

    return NextResponse.json({ success: true, message: "Cart cleared" });
  } catch (error: any) {
    if (error.message?.includes("Unauthorized")) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 });
    }

    console.error("Error clearing cart:", error);
    return NextResponse.json(
      { error: "Failed to clear cart", message: error.message },
      { status: 500 }
    );
  }
}

