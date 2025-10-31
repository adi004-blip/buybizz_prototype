import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireVendor, getCurrentUser } from "@/lib/auth";

/**
 * GET /api/agents
 * List all agents with optional filtering and pagination
 */
export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");
    const category = searchParams.get("category");
    const status = searchParams.get("status") || "ACTIVE";
    const vendorId = searchParams.get("vendorId");
    const search = searchParams.get("search");

    const skip = (page - 1) * limit;

    // Build where clause
    const where: any = {
      status: status as "ACTIVE" | "INACTIVE",
    };

    if (category) {
      where.category = category;
    }

    if (vendorId) {
      where.vendorId = vendorId;
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
        { shortDescription: { contains: search, mode: "insensitive" } },
      ];
    }

    // Get agents with vendor info
    const [agents, total] = await Promise.all([
      db.agent.findMany({
        where,
        include: {
          vendor: {
            select: {
              id: true,
              fullName: true,
              companyName: true,
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
      agents,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error: any) {
    console.error("Error fetching agents:", error);
    return NextResponse.json(
      { error: "Failed to fetch agents", message: error.message },
      { status: 500 }
    );
  }
}

/**
 * POST /api/agents
 * Create a new agent (vendor only)
 */
export async function POST(req: NextRequest) {
  try {
    // Require vendor authentication
    const user = await requireVendor();

    const body = await req.json();
    const {
      name,
      description,
      shortDescription,
      price,
      originalPrice,
      category,
      tags,
      features,
      imageUrl,
      demoUrl,
      documentationUrl,
    } = body;

    // Validation
    if (!name || !description || !price) {
      return NextResponse.json(
        { error: "Missing required fields: name, description, price" },
        { status: 400 }
      );
    }

    // Create agent
    const agent = await db.agent.create({
      data: {
        vendorId: user.id,
        name,
        description,
        shortDescription: shortDescription || null,
        price: parseFloat(price),
        originalPrice: originalPrice ? parseFloat(originalPrice) : null,
        category: category || null,
        tags: tags || null,
        features: Array.isArray(features) ? features.filter((f: string) => f.trim()) : [],
        imageUrl: imageUrl || null,
        demoUrl: demoUrl || null,
        documentationUrl: documentationUrl || null,
        status: "ACTIVE",
      },
      include: {
        vendor: {
          select: {
            id: true,
            fullName: true,
            companyName: true,
          },
        },
      },
    });

    return NextResponse.json(agent, { status: 201 });
  } catch (error: any) {
    if (error.message?.includes("Forbidden") || error.message?.includes("Unauthorized")) {
      return NextResponse.json({ error: error.message }, { status: 403 });
    }

    console.error("Error creating agent:", error);
    return NextResponse.json(
      { error: "Failed to create agent", message: error.message },
      { status: 500 }
    );
  }
}

