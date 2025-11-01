import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";

export default async function VendorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();
  
  if (!user) {
    redirect("/");
  }

  // Check role - make sure it's exactly "VENDOR"
  if (user.role !== "VENDOR") {
    redirect("/");
  }

  return <>{children}</>;
}

