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
    
    if (!user) {
      redirect("/");
    }

    // Double-check role - log for debugging
    const isVendor = user.role === "VENDOR";
    
    if (!isVendor) {
      // Log the actual role value for debugging
      console.error(`[VendorLayout] Access denied. User role: "${user.role}", Expected: "VENDOR"`);
      redirect("/");
    }

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
