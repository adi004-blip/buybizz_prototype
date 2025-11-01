"use client";

import { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle, Shield, Loader2 } from "lucide-react";

export default function PromoteAdminPage() {
  const { user } = useUser();
  const [loading, setLoading] = useState(false);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const checkRole = async () => {
      if (!user?.id) return;
      try {
        const response = await fetch("/api/user/role");
        if (response.ok) {
          const data = await response.json();
          setUserRole(data.role);
        }
      } catch (err) {
        console.error("Error checking role:", err);
      }
    };
    checkRole();
  }, [user?.id]);

  const promoteToAdmin = async () => {
    if (!user?.id) return;
    
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const response = await fetch(`/api/admin/users/${user.id}/role`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ role: "ADMIN" }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to promote to admin");
      }

      setSuccess(true);
      setUserRole("ADMIN");
      
      // Refresh after 2 seconds
      setTimeout(() => {
        window.location.href = "/admin";
      }, 2000);
    } catch (err: any) {
      setError(err.message || "Failed to promote to admin. You may need to use the database method.");
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 py-8 px-4 flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="p-8 text-center">
            <h2 className="neo-heading text-2xl mb-4">SIGN IN REQUIRED</h2>
            <p className="neo-text text-gray-600">
              Please sign in to access this page.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (userRole === "ADMIN") {
    return (
      <div className="min-h-screen bg-gray-50 py-8 px-4 flex items-center justify-center">
        <Card className="max-w-md bg-green-400">
          <CardContent className="p-8 text-center">
            <Shield className="w-16 h-16 mx-auto mb-4" />
            <h2 className="neo-heading text-3xl mb-4">YOU'RE ALREADY AN ADMIN!</h2>
            <p className="neo-text mb-6">
              You have admin access. Redirecting to admin dashboard...
            </p>
            <Button onClick={() => window.location.href = "/admin"} size="lg">
              GO TO ADMIN DASHBOARD
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="mx-auto max-w-2xl py-8">
        <Card>
          <CardHeader>
            <CardTitle className="neo-heading text-3xl flex items-center gap-3">
              <Shield className="w-8 h-8 text-red-500" />
              PROMOTE TO ADMIN
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="bg-yellow-400 p-4 neo-border">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-6 h-6 flex-shrink-0 mt-1" />
                <div>
                  <p className="neo-text font-bold mb-2">IMPORTANT</p>
                  <p className="neo-text text-sm">
                    This page attempts to promote you to ADMIN using the admin API. If you get an error, 
                    you'll need to use the database method below.
                  </p>
                </div>
              </div>
            </div>

            <div>
              <p className="neo-text mb-4">
                <strong>Current Role:</strong> <span className="uppercase">{userRole || "LOADING..."}</span>
              </p>
              <p className="neo-text mb-4">
                <strong>User ID:</strong> <code className="bg-gray-100 px-2 py-1 neo-border text-xs">{user.id}</code>
              </p>
              <p className="neo-text mb-4">
                <strong>Email:</strong> {user.emailAddresses[0]?.emailAddress}
              </p>
            </div>

            {error && (
              <div className="bg-red-400 p-4 neo-border">
                <p className="neo-text font-bold mb-2">ERROR</p>
                <p className="neo-text text-sm">{error}</p>
              </div>
            )}

            {success && (
              <div className="bg-green-400 p-4 neo-border">
                <p className="neo-text font-bold mb-2">SUCCESS!</p>
                <p className="neo-text text-sm">You've been promoted to ADMIN. Redirecting...</p>
              </div>
            )}

            <Button
              onClick={promoteToAdmin}
              disabled={loading || userRole === "ADMIN"}
              size="lg"
              className="w-full bg-red-500 text-white"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  PROMOTING...
                </>
              ) : (
                "PROMOTE TO ADMIN (REQUIRES ADMIN ACCESS)"
              )}
            </Button>

            <div className="border-t-2 border-black pt-6">
              <h3 className="neo-heading text-xl mb-4">ALTERNATIVE METHOD: DATABASE</h3>
              <p className="neo-text text-sm mb-4">
                If the button above doesn't work (because you don't have admin access yet), 
                you can promote yourself directly in the database:
              </p>
              
              <div className="bg-black text-white p-4 neo-border font-mono text-sm mb-4">
                <p className="mb-2">Go to Neon Dashboard → SQL Editor → Run:</p>
                <code className="block whitespace-pre-wrap break-all">
                  UPDATE users SET role = 'ADMIN' WHERE id = '{user.id}';
                </code>
              </div>

              <div className="bg-gray-100 p-4 neo-border">
                <p className="neo-text text-sm font-bold mb-2">Steps:</p>
                <ol className="neo-text text-sm space-y-1 list-decimal list-inside">
                  <li>Go to <a href="https://console.neon.tech" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">Neon Console</a></li>
                  <li>Select your database</li>
                  <li>Click "SQL Editor"</li>
                  <li>Copy and paste the SQL query above</li>
                  <li>Click "Run"</li>
                  <li>Refresh this page or sign out and sign back in</li>
                </ol>
              </div>
            </div>

            <div className="border-t-2 border-black pt-6">
              <h3 className="neo-heading text-xl mb-4">QUICK ACCESS</h3>
              <div className="flex flex-col gap-2">
                <Button variant="outline" onClick={() => window.location.href = "/admin"}>
                  GO TO ADMIN DASHBOARD
                </Button>
                <Button variant="outline" onClick={() => window.location.href = "/"}>
                  BACK TO HOME
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

