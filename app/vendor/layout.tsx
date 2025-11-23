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

    // Allow VENDOR and ADMIN roles to access vendor dashboard
    const hasAccess = user.role === "VENDOR" || user.role === "ADMIN";
    
    if (!hasAccess) {
      redirect("/");
    }

    return <>{children}</>;
  } catch (error: any) {
    // Next.js redirect() throws a special error - we need to rethrow it
    if (error?.digest?.startsWith('NEXT_REDIRECT') || error?.message?.includes('NEXT_REDIRECT')) {
      throw error;
    }
    
    // Log error for debugging
    console.error("[VendorLayout] Error:", error);
    // Redirect to home on any other error
    redirect("/");
  }
}
