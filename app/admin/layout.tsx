import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/auth";

export const dynamic = 'force-dynamic'; // Disable caching

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  try {
    await requireAdmin();
    return <>{children}</>;
  } catch (error: any) {
    // Next.js redirect() throws a special error - we need to rethrow it
    if (error?.digest?.startsWith('NEXT_REDIRECT') || error?.message?.includes('NEXT_REDIRECT')) {
      throw error;
    }
    
    // If not admin, redirect to home
    redirect("/");
  }
}

