"use client";

import { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function TestUserPage() {
  const { user } = useUser();
  const [userInfo, setUserInfo] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [promoting, setPromoting] = useState(false);

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const response = await fetch("/api/user/role");
        if (response.ok) {
          const data = await response.json();
          setUserInfo(data);
        }
      } catch (error) {
        console.error("Error fetching user info:", error);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchUserInfo();
    }
  }, [user]);

  const promoteToVendor = async () => {
    if (!userInfo?.id) return;
    
    setPromoting(true);
    try {
      const response = await fetch(`/api/admin/users/${userInfo.id}/role`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ role: "VENDOR" }),
      });

      if (response.ok) {
        alert("Promoted to VENDOR! Refresh the page.");
        window.location.reload();
      } else {
        const error = await response.json();
        alert(`Error: ${error.error || "Failed to promote"}`);
      }
    } catch (error: any) {
      alert(`Error: ${error.message || "Failed to promote"}`);
    } finally {
      setPromoting(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 py-8 px-4 flex items-center justify-center">
        <Card>
          <CardContent className="p-6">
            <p className="neo-heading text-xl">PLEASE SIGN IN TO TEST</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8 px-4 flex items-center justify-center">
        <p className="neo-heading text-2xl">LOADING...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="mx-auto max-w-2xl">
        <h1 className="neo-heading text-5xl mb-8">TEST USER INFO</h1>

        <Card className="mb-6">
          <CardContent className="p-6">
            <h2 className="neo-heading text-2xl mb-4">YOUR USER INFO</h2>
            {userInfo ? (
              <div className="space-y-2">
                <p className="neo-text">
                  <strong>ID:</strong> {userInfo.id}
                </p>
                <p className="neo-text">
                  <strong>Email:</strong> {userInfo.email}
                </p>
                <p className="neo-text">
                  <strong>Name:</strong> {userInfo.fullName}
                </p>
                <p className="neo-text">
                  <strong>Role:</strong>{" "}
                  <span className={`${
                    userInfo.role === "VENDOR" ? "text-green-600" :
                    userInfo.role === "ADMIN" ? "text-blue-600" :
                    "text-gray-600"
                  }`}>
                    {userInfo.role}
                  </span>
                </p>
              </div>
            ) : (
              <p className="neo-text text-red-500">Failed to load user info</p>
            )}
          </CardContent>
        </Card>

        {userInfo && userInfo.role !== "VENDOR" && (
          <Card className="mb-6 bg-yellow-400">
            <CardContent className="p-6">
              <h2 className="neo-heading text-2xl mb-4">PROMOTE TO VENDOR</h2>
              <p className="neo-text mb-4">
                TO TEST VENDOR FEATURES, YOU NEED TO BE PROMOTED TO VENDOR ROLE.
              </p>
              <p className="neo-text text-sm mb-4">
                <strong>Note:</strong> This requires admin access. If you get an error, you'll need to promote yourself via database:
              </p>
              <div className="bg-black text-white p-4 mb-4 font-mono text-sm">
                <p>UPDATE users SET role = 'VENDOR' WHERE id = '{userInfo.id}';</p>
              </div>
              <Button
                onClick={promoteToVendor}
                disabled={promoting}
                className="bg-black text-white"
              >
                {promoting ? "PROMOTING..." : "TRY PROMOTE TO VENDOR (REQUIRES ADMIN)"}
              </Button>
            </CardContent>
          </Card>
        )}

        {userInfo && userInfo.role === "VENDOR" && (
          <Card className="mb-6 bg-green-400">
            <CardContent className="p-6">
              <h2 className="neo-heading text-2xl mb-4">✅ YOU ARE A VENDOR!</h2>
              <div className="space-y-4">
                <a href="/vendor">
                  <Button className="w-full bg-black text-white">
                    GO TO VENDOR DASHBOARD
                  </Button>
                </a>
                <a href="/vendor/products/new">
                  <Button variant="outline" className="w-full">
                    CREATE YOUR FIRST PRODUCT
                  </Button>
                </a>
              </div>
            </CardContent>
          </Card>
        )}

        <Card>
          <CardContent className="p-6">
            <h2 className="neo-heading text-2xl mb-4">QUICK LINKS</h2>
            <div className="space-y-2">
              <a href="/shop" className="block">
                <Button variant="outline" className="w-full">BROWSE SHOP</Button>
              </a>
              <a href="/vendor" className="block">
                <Button variant="outline" className="w-full">VENDOR DASHBOARD</Button>
              </a>
              <a href="/api/test-db" className="block">
                <Button variant="outline" className="w-full">TEST DATABASE CONNECTION</Button>
              </a>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

