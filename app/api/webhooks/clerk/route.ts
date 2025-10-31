import { Webhook } from "svix";
import { headers } from "next/headers";
import { WebhookEvent } from "@clerk/nextjs/server";
import { db } from "@/lib/db";

export async function POST(req: Request) {
  // Get the Svix headers for verification
  const headerPayload = await headers();
  const svix_id = headerPayload.get("svix-id");
  const svix_timestamp = headerPayload.get("svix-timestamp");
  const svix_signature = headerPayload.get("svix-signature");

  // If there are no headers, error out
  if (!svix_id || !svix_timestamp || !svix_signature) {
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
    return new Response("Error: CLERK_WEBHOOK_SECRET not configured", {
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
      // Create user in database
      await db.user.create({
        data: {
          id: id,
          email: email_addresses[0]?.email_address || `${id}@clerk.user`,
          fullName:
            first_name && last_name
              ? `${first_name} ${last_name}`
              : first_name || last_name || username || "User",
          role: "CUSTOMER", // Default role
        },
      });

      console.log(`User created: ${id}`);
    } catch (error) {
      console.error("Error creating user:", error);
      // Don't fail the webhook, just log the error
      // User will be created on first auth via getCurrentUser fallback
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

