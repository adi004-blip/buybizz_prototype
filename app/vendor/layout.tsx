import { redirect } from "next/navigation";
import { requireVendor } from "@/lib/auth";

export default async function VendorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  try {
    await requireVendor();
  } catch (error: any) {
    // If not vendor, redirect to home
    redirect("/");
  }

  return <>{children}</>;
}

