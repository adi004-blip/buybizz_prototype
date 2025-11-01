import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";

export const dynamic = 'force-dynamic'; // Disable caching

export default async function VendorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  try {
    const user = await getCurrentUser();
    
    // Log for debugging
    console.log("[VendorLayout] User check:", {
      userExists: !!user,
      userId: user?.id,
      userEmail: user?.email,
      userRole: user?.role,
      roleType: typeof user?.role,
    });
    
    if (!user) {
      console.log("[VendorLayout] No user found, redirecting to home");
      redirect("/");
    }

    // Double-check role - log for debugging
    const isVendor = user.role === "VENDOR";
    
    console.log("[VendorLayout] Role check:", {
      userRole: user.role,
      expectedRole: "VENDOR",
      isVendor: isVendor,
      roleMatch: user.role === "VENDOR",
      roleType: typeof user.role,
    });
    
    if (!isVendor) {
      // Log the actual role value for debugging
      console.error(`[VendorLayout] Access denied. User role: "${user.role}", Expected: "VENDOR"`);
      redirect("/");
    }

    console.log("[VendorLayout] Access granted, rendering children");
    return <>{children}</>;
  } catch (error: any) {
    // Next.js redirect() throws a special error - we need to rethrow it
    if (error?.digest?.startsWith('NEXT_REDIRECT') || error?.message?.includes('NEXT_REDIRECT')) {
      throw error;
    }
    
    // Log other errors for debugging
    console.error("[VendorLayout] Error:", {
      message: error.message,
      stack: error.stack,
      digest: error.digest,
    });
    // Redirect to home on any other error
    redirect("/");
  }
}
