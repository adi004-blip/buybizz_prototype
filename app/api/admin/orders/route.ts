import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";

/**
 * GET /api/admin/orders
 * Get all orders with pagination and filters
 */
export async function GET(req: NextRequest) {
  try {
    await requireAdmin();

    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "50");
    const status = searchParams.get("status"); // Filter by status
    const userId = searchParams.get("userId"); // Filter by user

    const skip = (page - 1) * limit;

    // Build where clause
    const where: any = {};
    if (status && ["PENDING", "COMPLETED", "FAILED"].includes(status)) {
      where.status = status;
    }
    if (userId) {
      where.userId = userId;
    }

    // Get orders with user and items
    const [orders, total] = await Promise.all([
      db.order.findMany({
        where,
        include: {
          user: {
            select: {
              id: true,
              email: true,
              fullName: true,
            },
          },
          orderItems: {
            include: {
              agent: {
                select: {
                  id: true,
                  name: true,
                  vendorId: true,
                },
              },
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
        skip,
        take: limit,
      }),
      db.order.count({ where }),
    ]);

    return NextResponse.json({
      orders: orders.map(order => ({
        id: order.id,
        userId: order.userId,
        customer: {
          id: order.user.id,
          email: order.user.email,
          name: order.user.fullName,
        },
        amount: order.amount.toString(),
        status: order.status,
        stripePaymentId: order.stripePaymentId,
        stripePaymentIntentId: order.stripePaymentIntentId,
        items: order.orderItems.map(item => ({
          id: item.id,
          agentId: item.agentId,
          agentName: item.agent.name,
          vendorId: item.agent.vendorId,
          quantity: item.quantity,
          price: item.price.toString(),
        })),
        createdAt: order.createdAt.toISOString(),
        updatedAt: order.updatedAt.toISOString(),
      })),
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error: any) {
    if (error.message?.includes("Unauthorized") || error.message?.includes("Admin")) {
      return NextResponse.json(
        { error: "Admin access required" },
        { status: 403 }
      );
    }

    console.error("Error fetching orders:", error);
    return NextResponse.json(
      { error: "Failed to fetch orders", message: error.message },
      { status: 500 }
    );
  }
}

