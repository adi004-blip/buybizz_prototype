import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireVendor, getCurrentUser } from "@/lib/auth";

/**
 * GET /api/agents/[id]
 * Get a single agent by ID
 */
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const agent = await db.agent.findUnique({
      where: { id },
      include: {
        vendor: {
          select: {
            id: true,
            fullName: true,
            companyName: true,
            email: true,
          },
        },
      },
    });

    if (!agent) {
      return NextResponse.json({ error: "Agent not found" }, { status: 404 });
    }

    return NextResponse.json(agent);
  } catch (error: any) {
    console.error("Error fetching agent:", error);
    return NextResponse.json(
      { error: "Failed to fetch agent", message: error.message },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/agents/[id]
 * Update an agent (vendor only, must be owner)
 */
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Require vendor authentication
    const user = await requireVendor();
    const { id } = await params;

    // Check if agent exists and user owns it
    const existingAgent = await db.agent.findUnique({
      where: { id },
    });

    if (!existingAgent) {
      return NextResponse.json({ error: "Agent not found" }, { status: 404 });
    }

    if (existingAgent.vendorId !== user.id) {
      return NextResponse.json(
        { error: "You don't have permission to update this agent" },
        { status: 403 }
      );
    }

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
      status,
    } = body;

    // Build update data
    const updateData: any = {};

    if (name !== undefined) updateData.name = name;
    if (description !== undefined) updateData.description = description;
    if (shortDescription !== undefined) updateData.shortDescription = shortDescription || null;
    if (price !== undefined) updateData.price = parseFloat(price);
    if (originalPrice !== undefined) updateData.originalPrice = originalPrice ? parseFloat(originalPrice) : null;
    if (category !== undefined) updateData.category = category || null;
    if (tags !== undefined) updateData.tags = tags || null;
    if (features !== undefined) updateData.features = Array.isArray(features) ? features.filter((f: string) => f.trim()) : [];
    if (imageUrl !== undefined) updateData.imageUrl = imageUrl || null;
    if (demoUrl !== undefined) updateData.demoUrl = demoUrl || null;
    if (documentationUrl !== undefined) updateData.documentationUrl = documentationUrl || null;
    if (status !== undefined) updateData.status = status;

    // Update agent
    const agent = await db.agent.update({
      where: { id },
      data: updateData,
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

    return NextResponse.json(agent);
  } catch (error: any) {
    if (error.message?.includes("Forbidden") || error.message?.includes("Unauthorized")) {
      return NextResponse.json({ error: error.message }, { status: 403 });
    }

    console.error("Error updating agent:", error);
    return NextResponse.json(
      { error: "Failed to update agent", message: error.message },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/agents/[id]
 * Delete an agent (vendor only, must be owner)
 */
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Require vendor authentication
    const user = await requireVendor();
    const { id } = await params;

    // Check if agent exists and user owns it
    const existingAgent = await db.agent.findUnique({
      where: { id },
    });

    if (!existingAgent) {
      return NextResponse.json({ error: "Agent not found" }, { status: 404 });
    }

    if (existingAgent.vendorId !== user.id) {
      return NextResponse.json(
        { error: "You don't have permission to delete this agent" },
        { status: 403 }
      );
    }

    // Delete agent (cascade will handle related records)
    await db.agent.delete({
      where: { id },
    });

    return NextResponse.json({ success: true, message: "Agent deleted" });
  } catch (error: any) {
    if (error.message?.includes("Forbidden") || error.message?.includes("Unauthorized")) {
      return NextResponse.json({ error: error.message }, { status: 403 });
    }

    console.error("Error deleting agent:", error);
    return NextResponse.json(
      { error: "Failed to delete agent", message: error.message },
      { status: 500 }
    );
  }
}

