import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireVendor } from "@/lib/auth";

/**
 * GET /api/vendor/stats
 * Get sales/revenue statistics for vendor
 */
export async function GET(req: NextRequest) {
  try {
    const user = await requireVendor();

    // Get vendor's agents
    const vendorAgents = await db.agent.findMany({
      where: { vendorId: user.id },
      select: { id: true, name: true },
    });

    const agentIds = vendorAgents.map(agent => agent.id);

    if (agentIds.length === 0) {
      return NextResponse.json({
        totalAgents: 0,
        totalSales: 0,
        totalRevenue: "0.00",
        monthlyRevenue: "0.00",
        monthlyGrowth: 0,
        averageOrderValue: "0.00",
        topProducts: [],
      });
    }

    // Get all orders with vendor's agents
    const orders = await db.order.findMany({
      where: {
        orderItems: {
          some: {
            agentId: { in: agentIds },
          },
        },
      },
      include: {
        orderItems: {
          where: {
            agentId: { in: agentIds },
          },
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
      orderBy: {
        createdAt: "desc",
      },
    });

    // Calculate total sales (total quantity sold)
    const totalSales = orders.reduce((sum, order) => {
      return sum + order.orderItems.reduce((itemSum, item) => {
        return itemSum + item.quantity;
      }, 0);
    }, 0);

    // Calculate total revenue
    const totalRevenue = orders.reduce((sum, order) => {
      const vendorRevenue = order.orderItems.reduce((itemSum, item) => {
        return itemSum + Number(item.price) * item.quantity;
      }, 0);
      return sum + vendorRevenue;
    }, 0);

    // Calculate monthly revenue (current month)
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const monthlyOrders = orders.filter(
      order => new Date(order.createdAt) >= startOfMonth
    );
    const monthlyRevenue = monthlyOrders.reduce((sum, order) => {
      const vendorRevenue = order.orderItems.reduce((itemSum, item) => {
        return itemSum + Number(item.price) * item.quantity;
      }, 0);
      return sum + vendorRevenue;
    }, 0);

    // Calculate previous month revenue for growth
    const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0);
    const lastMonthOrders = orders.filter(order => {
      const orderDate = new Date(order.createdAt);
      return orderDate >= startOfLastMonth && orderDate <= endOfLastMonth;
    });
    const lastMonthRevenue = lastMonthOrders.reduce((sum, order) => {
      const vendorRevenue = order.orderItems.reduce((itemSum, item) => {
        return itemSum + Number(item.price) * item.quantity;
      }, 0);
      return sum + vendorRevenue;
    }, 0);

    // Calculate monthly growth percentage
    const monthlyGrowth = lastMonthRevenue > 0
      ? ((monthlyRevenue - lastMonthRevenue) / lastMonthRevenue) * 100
      : monthlyRevenue > 0 ? 100 : 0;

    // Calculate average order value
    const completedOrders = orders.filter(order => order.status === "COMPLETED");
    const averageOrderValue = completedOrders.length > 0
      ? totalRevenue / completedOrders.length
      : 0;

    // Get top selling products
    const productSales = new Map<string, { name: string; sales: number; revenue: number }>();
    
    orders.forEach(order => {
      order.orderItems.forEach(item => {
        const agentId = item.agentId;
        const agentName = item.agent.name;
        const current = productSales.get(agentId) || { name: agentName, sales: 0, revenue: 0 };
        current.sales += item.quantity;
        current.revenue += Number(item.price) * item.quantity;
        productSales.set(agentId, current);
      });
    });

    const topProducts = Array.from(productSales.values())
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 5)
      .map(product => ({
        name: product.name,
        sales: product.sales,
        revenue: product.revenue.toFixed(2),
      }));

    return NextResponse.json({
      totalAgents: vendorAgents.length,
      totalSales,
      totalRevenue: totalRevenue.toFixed(2),
      monthlyRevenue: monthlyRevenue.toFixed(2),
      monthlyGrowth: Math.round(monthlyGrowth * 10) / 10, // Round to 1 decimal
      averageOrderValue: averageOrderValue.toFixed(2),
      topProducts,
    });
  } catch (error: any) {
    if (error.message?.includes("Unauthorized") || error.message?.includes("vendor")) {
      return NextResponse.json(
        { error: "Vendor access required" },
        { status: 403 }
      );
    }

    console.error("Error fetching vendor stats:", error);
    return NextResponse.json(
      { error: "Failed to fetch statistics", message: error.message },
      { status: 500 }
    );
  }
}

