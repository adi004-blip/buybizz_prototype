import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/auth";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  try {
    await requireAdmin();
  } catch (error: any) {
    // If not admin, redirect to home
    redirect("/");
  }

  return <>{children}</>;
}

