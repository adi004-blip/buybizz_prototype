import { Webhook } from "svix";
import { headers } from "next/headers";
import { WebhookEvent } from "@clerk/nextjs/server";
import { db } from "@/lib/db";

export async function POST(req: Request) {
  console.log("[Webhook] Received webhook request");
  
  // Get the Svix headers for verification
  const headerPayload = await headers();
  const svix_id = headerPayload.get("svix-id");
  const svix_timestamp = headerPayload.get("svix-timestamp");
  const svix_signature = headerPayload.get("svix-signature");

  // If there are no headers, error out
  if (!svix_id || !svix_timestamp || !svix_signature) {
    console.error("[Webhook] Missing svix headers");
    return new Response("Error occured -- no svix headers", {
      status: 400,
    });
  }

  // Get the body
  const payload = await req.json();
  const body = JSON.stringify(payload);

  // Get the webhook secret from environment variables
  const webhookSecret = process.env.CLERK_WEBHOOK_SECRET;

  if (!webhookSecret) {
    console.error("[Webhook] CLERK_WEBHOOK_SECRET not configured");
    return new Response("Error: CLERK_WEBHOOK_SECRET not configured", {
      status: 500,
    });
  }

  // Check DATABASE_URL
  if (!process.env.DATABASE_URL) {
    console.error("[Webhook] DATABASE_URL not configured");
    return new Response("Error: DATABASE_URL not configured", {
      status: 500,
    });
  }

  // Create a new Svix instance with your webhook secret
  const wh = new Webhook(webhookSecret);

  let evt: WebhookEvent;

  // Verify the webhook payload
  try {
    evt = wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) as WebhookEvent;
  } catch (err) {
    console.error("Error verifying webhook:", err);
    return new Response("Error occured -- verification failed", {
      status: 400,
    });
  }

  // Handle the webhook event
  const eventType = evt.type;

  if (eventType === "user.created") {
    const { id, email_addresses, first_name, last_name, username } = evt.data;

    try {
      const email = email_addresses[0]?.email_address || `${id}@clerk.user`;
      const fullName =
        first_name && last_name
          ? `${first_name} ${last_name}`
          : first_name || last_name || username || "User";

      console.log(`[Webhook] Attempting to create user: ${id}, email: ${email}`);

      // Create user in database
      const user = await db.user.create({
        data: {
          id: id,
          email: email,
          fullName: fullName,
          role: "CUSTOMER", // Default role
        },
      });

      console.log(`[Webhook] User created successfully: ${id}`, user);
    } catch (error: any) {
      console.error("[Webhook] Error creating user:", {
        userId: id,
        error: error.message,
        code: error.code,
        meta: error.meta,
        stack: error.stack,
      });

      // Return error response so Clerk knows it failed
      return new Response(
        JSON.stringify({
          error: "Failed to create user in database",
          message: error.message,
          code: error.code,
        }),
        {
          status: 500,
          headers: { "Content-Type": "application/json" },
        }
      );
    }
  }

  if (eventType === "user.updated") {
    const { id, email_addresses, first_name, last_name, username } = evt.data;

    try {
      // Update user in database
      await db.user.update({
        where: { id: id },
        data: {
          email: email_addresses[0]?.email_address || `${id}@clerk.user`,
          fullName:
            first_name && last_name
              ? `${first_name} ${last_name}`
              : first_name || last_name || username || "User",
        },
      });

      console.log(`User updated: ${id}`);
    } catch (error) {
      console.error("Error updating user:", error);
      // If user doesn't exist, create it (fallback)
      try {
        await db.user.create({
          data: {
            id: id,
            email: email_addresses[0]?.email_address || `${id}@clerk.user`,
            fullName:
              first_name && last_name
                ? `${first_name} ${last_name}`
                : first_name || last_name || username || "User",
            role: "CUSTOMER",
          },
        });
      } catch (createError) {
        console.error("Error creating user during update fallback:", createError);
      }
    }
  }

  if (eventType === "user.deleted") {
    const { id } = evt.data;

    try {
      // Delete user from database (cascade will handle related records)
      await db.user.delete({
        where: { id: id || "" },
      });

      console.log(`User deleted: ${id}`);
    } catch (error) {
      console.error("Error deleting user:", error);
      // User might not exist, which is fine
    }
  }

  return new Response("Webhook processed", { status: 200 });
}

// Clerk webhooks should only accept POST requests
export async function GET() {
  return new Response("Clerk webhook endpoint - POST only", { status: 405 });
}

