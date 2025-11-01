import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";

export const dynamic = 'force-dynamic'; // Disable caching

export default async function VendorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
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
}
