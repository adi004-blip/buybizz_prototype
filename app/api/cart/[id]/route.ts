import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAuth } from "@/lib/auth";

/**
 * PUT /api/cart/[id]
 * Update cart item quantity
 */
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await requireAuth();
    const { id } = await params;
    const body = await req.json();
    const { quantity } = body;

    if (!quantity || quantity < 1) {
      return NextResponse.json(
        { error: "Quantity must be at least 1" },
        { status: 400 }
      );
    }

    // Check if cart item exists and belongs to user
    const cartItem = await db.cartItem.findUnique({
      where: { id },
    });

    if (!cartItem) {
      return NextResponse.json({ error: "Cart item not found" }, { status: 404 });
    }

    if (cartItem.userId !== user.id) {
      return NextResponse.json(
        { error: "You don't have permission to update this item" },
        { status: 403 }
      );
    }

    // Update quantity
    const updatedItem = await db.cartItem.update({
      where: { id },
      data: { quantity },
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

    return NextResponse.json(updatedItem);
  } catch (error: any) {
    if (error.message?.includes("Unauthorized")) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 });
    }

    console.error("Error updating cart item:", error);
    return NextResponse.json(
      { error: "Failed to update cart item", message: error.message },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/cart/[id]
 * Remove item from cart
 */
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await requireAuth();
    const { id } = await params;

    // Check if cart item exists and belongs to user
    const cartItem = await db.cartItem.findUnique({
      where: { id },
    });

    if (!cartItem) {
      return NextResponse.json({ error: "Cart item not found" }, { status: 404 });
    }

    if (cartItem.userId !== user.id) {
      return NextResponse.json(
        { error: "You don't have permission to delete this item" },
        { status: 403 }
      );
    }

    await db.cartItem.delete({
      where: { id },
    });

    return NextResponse.json({ success: true, message: "Item removed from cart" });
  } catch (error: any) {
    if (error.message?.includes("Unauthorized")) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 });
    }

    console.error("Error removing cart item:", error);
    return NextResponse.json(
      { error: "Failed to remove cart item", message: error.message },
      { status: 500 }
    );
  }
}

