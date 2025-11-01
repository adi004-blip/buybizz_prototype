import { redirect } from "next/navigation";
import { requireVendor, getCurrentUser } from "@/lib/auth";

export default async function VendorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  try {
    // First check if user is authenticated
    const user = await getCurrentUser();
    
    if (!user) {
      console.log("[VendorLayout] User not authenticated");
      redirect("/");
      return null;
    }

    console.log("[VendorLayout] User role:", user.role, "User ID:", user.id);

    // Check if user is vendor
    if (user.role !== "VENDOR") {
      console.log("[VendorLayout] User is not VENDOR, role is:", user.role);
      redirect("/");
      return null;
    }

    // User is vendor, allow access
    return <>{children}</>;
  } catch (error: any) {
    console.error("[VendorLayout] Error:", error.message);
    // If there's an error checking auth, redirect to home
    redirect("/");
  }
}

