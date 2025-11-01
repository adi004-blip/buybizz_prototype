import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";

/**
 * GET /api/admin/stats
 * Get platform-wide statistics
 */
export async function GET(req: NextRequest) {
  try {
    await requireAdmin();

    // Get all counts in parallel
    const [
      totalUsers,
      totalVendors,
      totalAdmins,
      totalProducts,
      totalOrders,
      totalRevenue,
      pendingVendorApplications,
      completedOrders,
      pendingOrders,
      failedOrders,
    ] = await Promise.all([
      db.user.count(),
      db.user.count({ where: { role: "VENDOR" } }),
      db.user.count({ where: { role: "ADMIN" } }),
      db.agent.count(),
      db.order.count(),
      db.order.aggregate({
        _sum: { amount: true },
      }),
      db.vendorApplication.count({ where: { status: "PENDING" } }),
      db.order.count({ where: { status: "COMPLETED" } }),
      db.order.count({ where: { status: "PENDING" } }),
      db.order.count({ where: { status: "FAILED" } }),
    ]);

    // Calculate monthly revenue
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const monthlyOrders = await db.order.findMany({
      where: {
        createdAt: { gte: startOfMonth },
      },
      select: { amount: true },
    });
    const monthlyRevenue = monthlyOrders.reduce(
      (sum, order) => sum + Number(order.amount),
      0
    );

    // Calculate previous month revenue for growth
    const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0);
    const lastMonthOrders = await db.order.findMany({
      where: {
        createdAt: {
          gte: startOfLastMonth,
          lte: endOfLastMonth,
        },
      },
      select: { amount: true },
    });
    const lastMonthRevenue = lastMonthOrders.reduce(
      (sum, order) => sum + Number(order.amount),
      0
    );

    // Calculate monthly growth
    const monthlyGrowth = lastMonthRevenue > 0
      ? ((monthlyRevenue - lastMonthRevenue) / lastMonthRevenue) * 100
      : monthlyRevenue > 0 ? 100 : 0;

    // Get top vendors by revenue
    const vendorsWithRevenue = await db.user.findMany({
      where: { role: "VENDOR" },
      include: {
        agents: {
          include: {
            orderItems: true,
          },
        },
      },
    });

    const vendorStats = vendorsWithRevenue.map(vendor => {
      const revenue = vendor.agents.reduce((sum, agent) => {
        return sum + agent.orderItems.reduce((itemSum, item) => {
          return itemSum + Number(item.price) * item.quantity;
        }, 0);
      }, 0);

      return {
        id: vendor.id,
        name: vendor.companyName || vendor.fullName,
        email: vendor.email,
        products: vendor.agents.length,
        revenue,
      };
    });

    const topVendors = vendorStats
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 5)
      .map(v => ({
        id: v.id,
        name: v.name,
        email: v.email,
        products: v.products,
        revenue: v.revenue.toFixed(2),
      }));

    return NextResponse.json({
      users: {
        total: totalUsers,
        vendors: totalVendors,
        admins: totalAdmins,
        customers: totalUsers - totalVendors - totalAdmins,
      },
      products: {
        total: totalProducts,
        active: await db.agent.count({ where: { status: "ACTIVE" } }),
        inactive: await db.agent.count({ where: { status: "INACTIVE" } }),
      },
      orders: {
        total: totalOrders,
        completed: completedOrders,
        pending: pendingOrders,
        failed: failedOrders,
      },
      revenue: {
        total: Number(totalRevenue._sum.amount || 0).toFixed(2),
        monthly: monthlyRevenue.toFixed(2),
        monthlyGrowth: Math.round(monthlyGrowth * 10) / 10,
      },
      vendorApplications: {
        pending: pendingVendorApplications,
      },
      topVendors,
    });
  } catch (error: any) {
    if (error.message?.includes("Unauthorized") || error.message?.includes("Admin")) {
      return NextResponse.json(
        { error: "Admin access required" },
        { status: 403 }
      );
    }

    console.error("Error fetching admin stats:", error);
    return NextResponse.json(
      { error: "Failed to fetch statistics", message: error.message },
      { status: 500 }
    );
  }
}

