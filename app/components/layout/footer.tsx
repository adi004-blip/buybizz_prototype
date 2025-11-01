"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useUser } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { Mail } from "lucide-react";
import { SignedIn, SignedOut } from "@clerk/nextjs";

export default function Footer() {
  const { user, isLoaded: userLoaded } = useUser();
  const [userRole, setUserRole] = useState<string | null>(null);
  const [roleLoading, setRoleLoading] = useState(true);

  // Fetch user role if authenticated
  useEffect(() => {
    const fetchUserRole = async () => {
      if (!userLoaded) return;
      
      if (user) {
        try {
          const response = await fetch("/api/user/role");
          if (response.ok) {
            const data = await response.json();
            setUserRole(data.role);
          }
        } catch (err) {
          console.error("Error fetching user role:", err);
        } finally {
          setRoleLoading(false);
        }
      } else {
        setRoleLoading(false);
      }
    };

    fetchUserRole();
  }, [user, userLoaded]);

  const isVendorOrAdmin = userRole === "VENDOR" || userRole === "ADMIN";
  const showVendorButton = !isVendorOrAdmin && !roleLoading;
  return (
    <footer className="w-full neo-border-thick bg-black text-white mt-20">
      <div className="mx-auto max-w-7xl px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="neo-border bg-yellow-400 p-2 neo-shadow-md">
                <span className="neo-heading text-xl text-black">BB</span>
              </div>
              <span className="neo-heading text-2xl text-white">BUYBIZZ</span>
            </div>
            <p className="neo-text text-gray-300 text-sm">
              THE ULTIMATE MARKETPLACE FOR AI AGENTS. LIFETIME DEALS, FOREVER ACCESS.
            </p>
          </div>

          {/* Shop */}
          <div className="space-y-4">
            <h3 className="neo-heading text-xl text-yellow-400">SHOP</h3>
            <div className="space-y-2">
              <Link href="/shop" className="block neo-text text-gray-300 hover:text-yellow-400 transition-colors text-sm">
                BROWSE AI AGENTS
              </Link>
              <Link href="/vendors" className="block neo-text text-gray-300 hover:text-yellow-400 transition-colors text-sm">
                ALL CREATORS
              </Link>
              <Link href="/about" className="block neo-text text-gray-300 hover:text-yellow-400 transition-colors text-sm">
                ABOUT US
              </Link>
            </div>
          </div>

          {/* Creators */}
          <div className="space-y-4">
            <h3 className="neo-heading text-xl text-cyan-400">CREATORS</h3>
            <div className="space-y-2">
              {showVendorButton && (
                <Link href={user ? "/vendor/register" : "/sign-in?redirect=/vendor/register"} className="block neo-text text-gray-300 hover:text-cyan-400 transition-colors text-sm">
                  BECOME A CREATOR
                </Link>
              )}
              {isVendorOrAdmin && (
                <Link href="/vendor" className="block neo-text text-gray-300 hover:text-cyan-400 transition-colors text-sm">
                  CREATOR DASHBOARD
                </Link>
              )}
              <Link href="/vendors" className="block neo-text text-gray-300 hover:text-cyan-400 transition-colors text-sm">
                BROWSE CREATORS
              </Link>
            </div>
          </div>

          {/* Account & Support */}
          <div className="space-y-4">
            <h3 className="neo-heading text-xl text-green-400">ACCOUNT</h3>
            <SignedIn>
              <div className="space-y-2">
                <Link href="/account/purchases" className="block neo-text text-gray-300 hover:text-green-400 transition-colors text-sm">
                  MY PURCHASES
                </Link>
                <Link href="/account/downloads" className="block neo-text text-gray-300 hover:text-green-400 transition-colors text-sm">
                  MY DOWNLOADS
                </Link>
                <Link href="/account/settings" className="block neo-text text-gray-300 hover:text-green-400 transition-colors text-sm">
                  ACCOUNT SETTINGS
                </Link>
                <Link href="/cart" className="block neo-text text-gray-300 hover:text-green-400 transition-colors text-sm">
                  SHOPPING CART
                </Link>
              </div>
            </SignedIn>
            <SignedOut>
              <div className="space-y-2">
                <Link href="/sign-in" className="block neo-text text-gray-300 hover:text-green-400 transition-colors text-sm">
                  SIGN IN
                </Link>
                <Link href="/sign-up" className="block neo-text text-gray-300 hover:text-green-400 transition-colors text-sm">
                  CREATE ACCOUNT
                </Link>
              </div>
            </SignedOut>
          </div>
        </div>

        {/* Newsletter */}
        <div className="mt-12 pt-8 border-t-2 border-white">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="neo-heading text-2xl text-white mb-2">STAY UPDATED!</h3>
              <p className="neo-text text-gray-300 text-sm">GET THE LATEST AI AGENT DEALS</p>
            </div>
            <div className="flex gap-2 w-full md:w-auto">
              <input
                type="email"
                placeholder="YOUR EMAIL..."
                className="neo-input flex-1 md:w-80 bg-white text-black placeholder:text-gray-600"
              />
              <Button variant="primary" className="bg-yellow-400 text-black">
                <Mail className="w-5 h-5 mr-2" />
                SUBSCRIBE
              </Button>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-8 pt-8 border-t-2 border-white">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="neo-text text-gray-300 text-sm text-center md:text-left">
              © 2024 BUYBIZZ. ALL RIGHTS RESERVED.
            </p>
            <div className="flex gap-6 text-sm">
              <Link href="/about" className="neo-text text-gray-300 hover:text-yellow-400 transition-colors">
                ABOUT
              </Link>
              <Link href="/terms" className="neo-text text-gray-300 hover:text-yellow-400 transition-colors">
                TERMS
              </Link>
              <Link href="/privacy" className="neo-text text-gray-300 hover:text-yellow-400 transition-colors">
                PRIVACY
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
