"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function VendorAccessTest() {
  const router = useRouter();
  const { user } = useUser();
  const [checking, setChecking] = useState(true);
  const [result, setResult] = useState<any>(null);

  useEffect(() => {
    const checkAccess = async () => {
      try {
        const response = await fetch("/api/debug/vendor-check");
        const data = await response.json();
        setResult(data);
        
        if (data.canAccess) {
          // Try to navigate to vendor dashboard
          setTimeout(() => {
            router.push("/vendor");
          }, 1000);
        }
      } catch (error) {
        console.error("Error checking access:", error);
      } finally {
        setChecking(false);
      }
    };

    if (user) {
      checkAccess();
    }
  }, [user, router]);

  if (checking) {
    return (
      <div className="min-h-screen bg-gray-50 py-8 px-4 flex items-center justify-center">
        <p className="neo-heading text-2xl">CHECKING ACCESS...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="mx-auto max-w-2xl">
        <h1 className="neo-heading text-5xl mb-8">VENDOR ACCESS TEST</h1>

        <Card className="mb-6">
          <CardContent className="p-6">
            <h2 className="neo-heading text-2xl mb-4">ACCESS CHECK RESULT</h2>
            <pre className="bg-black text-white p-4 overflow-auto text-sm">
              {JSON.stringify(result, null, 2)}
            </pre>
          </CardContent>
        </Card>

        {result?.canAccess ? (
          <Card className="bg-green-400 mb-6">
            <CardContent className="p-6">
              <h2 className="neo-heading text-2xl mb-4">✅ YOU CAN ACCESS VENDOR DASHBOARD</h2>
              <p className="neo-text mb-4">
                Redirecting to vendor dashboard...
              </p>
              <Button onClick={() => router.push("/vendor")} className="bg-black text-white">
                GO TO VENDOR DASHBOARD
              </Button>
            </CardContent>
          </Card>
        ) : (
          <Card className="bg-red-400 mb-6">
            <CardContent className="p-6">
              <h2 className="neo-heading text-2xl mb-4">❌ CANNOT ACCESS</h2>
              <p className="neo-text mb-4">
                Reason: {result?.reason || "Unknown"}
              </p>
              {result?.user && (
                <div className="bg-white p-4 mb-4">
                  <p><strong>Your Role:</strong> {result.user.role}</p>
                  <p><strong>Expected:</strong> VENDOR</p>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

