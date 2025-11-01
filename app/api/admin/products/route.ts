import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";

/**
 * GET /api/admin/products
 * Get all products with pagination and filters
 */
export async function GET(req: NextRequest) {
  try {
    await requireAdmin();

    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "50");
    const status = searchParams.get("status"); // Filter by status
    const vendorId = searchParams.get("vendorId"); // Filter by vendor
    const search = searchParams.get("search"); // Search by name

    const skip = (page - 1) * limit;

    // Build where clause
    const where: any = {};
    if (status && ["ACTIVE", "INACTIVE"].includes(status)) {
      where.status = status;
    }
    if (vendorId) {
      where.vendorId = vendorId;
    }
    if (search) {
      where.name = { contains: search, mode: "insensitive" };
    }

    // Get products with vendor info
    const [products, total] = await Promise.all([
      db.agent.findMany({
        where,
        include: {
          vendor: {
            select: {
              id: true,
              email: true,
              fullName: true,
              companyName: true,
            },
          },
          _count: {
            select: {
              orderItems: true,
              cartItems: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
        skip,
        take: limit,
      }),
      db.agent.count({ where }),
    ]);

    return NextResponse.json({
      products: products.map(product => ({
        id: product.id,
        name: product.name,
        description: product.description,
        shortDescription: product.shortDescription,
        price: product.price.toString(),
        originalPrice: product.originalPrice?.toString() || null,
        status: product.status,
        category: product.category,
        tags: product.tags,
        features: product.features,
        imageUrl: product.imageUrl,
        demoUrl: product.demoUrl,
        documentationUrl: product.documentationUrl,
        createdAt: product.createdAt.toISOString(),
        updatedAt: product.updatedAt.toISOString(),
        vendor: {
          id: product.vendor.id,
          email: product.vendor.email,
          name: product.vendor.companyName || product.vendor.fullName,
        },
        stats: {
          orders: product._count.orderItems,
          inCart: product._count.cartItems,
        },
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

    console.error("Error fetching products:", error);
    return NextResponse.json(
      { error: "Failed to fetch products", message: error.message },
      { status: 500 }
    );
  }
}

