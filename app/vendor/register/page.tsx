"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { CheckCircle, ArrowRight, Store, Shield, Zap } from "lucide-react";

export default function VendorRegisterPage() {
  const { user } = useUser();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    companyName: "",
    reason: "",
  });

  // Check if user is already a vendor
  useEffect(() => {
    const checkRole = async () => {
      if (!user?.id) return;

      try {
        const response = await fetch("/api/user/role");
        if (response.ok) {
          const data = await response.json();
          setUserRole(data.role);

          // If already vendor, redirect to dashboard
          if (data.role === "VENDOR" || data.role === "ADMIN") {
            router.push("/vendor");
          }
        }
      } catch (err) {
        console.error("Error checking role:", err);
      }
    };

    checkRole();
  }, [user?.id, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.id) {
      router.push("/sign-in");
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      // Use vendor registration API (self-registration)
      const response = await fetch("/api/vendor/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          companyName: formData.companyName,
          reason: formData.reason,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to register as vendor");
      }

      // Redirect to confirmation page
      router.push("/vendor/register/confirmation");
    } catch (err: any) {
      console.error("Error registering as vendor:", err);
      setError(err.message || "Failed to register. Please try again or contact support.");
      setSubmitting(false);
    }
  };

  if (loading || !user) {
    return (
      <div className="min-h-screen bg-gray-50 py-8 px-4 flex items-center justify-center">
        <div className="text-center">
          <p className="neo-heading text-4xl mb-4">LOADING...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 py-8 px-4 flex items-center justify-center">
        <Card className="max-w-md w-full">
          <CardContent className="p-8 text-center">
            <h2 className="neo-heading text-3xl mb-4">SIGN IN REQUIRED</h2>
            <p className="neo-text text-gray-600 mb-6">
              YOU NEED TO SIGN IN TO BECOME A VENDOR
            </p>
            <Link href="/sign-in">
              <Button size="lg">SIGN IN</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="mx-auto max-w-4xl">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="neo-heading text-5xl md:text-7xl mb-4">
            BECOME A <span className="text-yellow-400">VENDOR</span>
          </h1>
          <p className="neo-text text-xl text-gray-600">
            START SELLING YOUR AI AGENTS ON BUYBIZZ
          </p>
        </div>

        {/* Benefits */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <Card className="bg-yellow-400">
            <CardContent className="p-6 text-center">
              <Store className="w-12 h-12 mx-auto mb-4" />
              <h3 className="neo-heading text-xl mb-2">SELL INSTANTLY</h3>
              <p className="neo-text text-sm">
                START LISTING YOUR AI AGENTS IMMEDIATELY AFTER APPROVAL
              </p>
            </CardContent>
          </Card>
          <Card className="bg-pink-400">
            <CardContent className="p-6 text-center">
              <Zap className="w-12 h-12 mx-auto mb-4" />
              <h3 className="neo-heading text-xl mb-2">FAST APPROVAL</h3>
              <p className="neo-text text-sm">
                GET APPROVED QUICKLY AND START EARNING RIGHT AWAY
              </p>
            </CardContent>
          </Card>
          <Card className="bg-cyan-400">
            <CardContent className="p-6 text-center">
              <Shield className="w-12 h-12 mx-auto mb-4" />
              <h3 className="neo-heading text-xl mb-2">SECURE PAYMENTS</h3>
              <p className="neo-text text-sm">
                SECURE PAYMENT PROCESSING HANDLED FOR YOU
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Registration Form */}
        <Card>
          <CardHeader>
            <CardTitle className="neo-heading text-3xl">VENDOR APPLICATION</CardTitle>
          </CardHeader>
          <CardContent>
            {error && (
              <div className="mb-6 p-4 bg-red-500 text-white neo-border">
                <p className="neo-text">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="neo-text block mb-2 font-bold">
                  COMPANY NAME (OPTIONAL)
                </label>
                <Input
                  type="text"
                  placeholder="YOUR COMPANY NAME"
                  value={formData.companyName}
                  onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                  className="neo-input"
                />
              </div>

              <div>
                <label className="neo-text block mb-2 font-bold">
                  TELL US ABOUT YOUR AI AGENTS
                </label>
                <textarea
                  placeholder="DESCRIBE THE AI AGENTS YOU PLAN TO SELL..."
                  value={formData.reason}
                  onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                  rows={6}
                  className="neo-input w-full resize-none"
                />
              </div>

              <div className="bg-yellow-400 p-4 neo-border">
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-6 h-6 flex-shrink-0 mt-1" />
                  <div>
                    <p className="neo-text font-bold mb-2">APPLICATION PROCESS</p>
                    <p className="neo-text text-sm">
                      SUBMIT YOUR APPLICATION AND OUR ADMIN TEAM WILL REVIEW IT. YOU'LL BE NOTIFIED ONCE YOUR APPLICATION IS APPROVED.
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  type="submit"
                  size="lg"
                  disabled={submitting}
                  className="flex-1 bg-yellow-400 text-black"
                >
                  {submitting ? "SUBMITTING..." : "SUBMIT APPLICATION"}
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
                <Link href="/shop" className="flex-1">
                  <Button variant="outline" size="lg" className="w-full">
                    CANCEL
                  </Button>
                </Link>
              </div>
            </form>

            <div className="mt-8 pt-8 border-t-2 border-black">
              <h3 className="neo-heading text-xl mb-4">WHAT HAPPENS NEXT?</h3>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <span className="neo-heading text-xl">1.</span>
                  <p className="neo-text">SUBMIT YOUR APPLICATION</p>
                </div>
                <div className="flex items-start gap-3">
                  <span className="neo-heading text-xl">2.</span>
                  <p className="neo-text">GET INSTANT APPROVAL (MVP)</p>
                </div>
                <div className="flex items-start gap-3">
                  <span className="neo-heading text-xl">3.</span>
                  <p className="neo-text">START LISTING YOUR AI AGENTS</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Already a Vendor? */}
        {userRole === "VENDOR" && (
          <Card className="mt-6 bg-green-400">
            <CardContent className="p-6 text-center">
              <p className="neo-heading text-xl mb-4">YOU'RE ALREADY A VENDOR!</p>
              <Link href="/vendor">
                <Button size="lg" className="bg-black text-white">
                  GO TO VENDOR DASHBOARD
                </Button>
              </Link>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

