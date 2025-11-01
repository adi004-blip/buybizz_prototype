"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useUser, useClerk } from "@clerk/nextjs";
import { 
  Package, 
  Download, 
  Store,
  Shield,
  ChevronDown,
  LogOut,
  User,
} from "lucide-react";

export default function UserMenu() {
  const { user } = useUser();
  const { signOut } = useClerk();
  const [isOpen, setIsOpen] = useState(false);
  const [isVendor, setIsVendor] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Check if user is vendor/admin
  useEffect(() => {
    const checkRole = async () => {
      try {
        const response = await fetch("/api/user/role");
        if (response.ok) {
          const data = await response.json();
          setIsVendor(data.role === "VENDOR" || data.role === "ADMIN");
          setIsAdmin(data.role === "ADMIN");
        }
      } catch (error) {
        console.error("Error checking role:", error);
      }
    };

    if (user) {
      checkRole();
    }
  }, [user]);

  // Close menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const handleSignOut = async () => {
    setIsOpen(false);
    await signOut();
    window.location.href = "/";
  };

  if (!user) return null;

  return (
    <div className="relative" ref={menuRef}>
      {/* Desktop: Custom dropdown */}
      <div className="hidden md:block">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2 neo-border px-3 py-2 bg-white hover:bg-gray-50 transition-colors neo-shadow-sm"
        >
          <div className="neo-border neo-shadow-sm w-8 h-8 rounded-full overflow-hidden bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center">
            {user?.imageUrl ? (
              <img src={user.imageUrl} alt="Avatar" className="w-full h-full object-cover" />
            ) : (
              <span className="text-white text-xs font-bold">
                {user?.firstName?.[0] || user?.emailAddresses[0]?.emailAddress?.[0] || "U"}
              </span>
            )}
          </div>
          <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </button>

        {isOpen && (
          <div className="absolute right-0 top-full mt-2 w-56 bg-white neo-border neo-shadow-lg z-50">
            {/* User info */}
            <div className="p-3 border-b-2 border-black">
              <p className="neo-text text-xs text-gray-600 truncate">
                {user?.emailAddresses[0]?.emailAddress || "User"}
              </p>
            </div>

            {/* Custom links - only show if vendor */}
            {isVendor && (
              <div className="py-1">
                <Link
                  href="/account/purchases"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-3 px-4 py-2 hover:bg-yellow-400 transition-colors neo-text font-bold text-sm"
                >
                  <Package className="w-4 h-4" />
                  MY PURCHASES
                </Link>
                <Link
                  href="/account/downloads"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-3 px-4 py-2 hover:bg-yellow-400 transition-colors neo-text font-bold text-sm"
                >
                  <Download className="w-4 h-4" />
                  MY DOWNLOADS
                </Link>
                <Link
                  href="/vendor"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-3 px-4 py-2 hover:bg-cyan-400 transition-colors neo-text font-bold text-sm"
                >
                  <Store className="w-4 h-4" />
                  VENDOR DASHBOARD
                </Link>
              </div>
            )}

            {/* Admin link */}
            {isAdmin && (
              <div className="py-1 border-t-2 border-black">
                <Link
                  href="/admin"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-3 px-4 py-2 hover:bg-red-400 transition-colors neo-text font-bold text-sm"
                >
                  <Shield className="w-4 h-4" />
                  ADMIN DASHBOARD
                </Link>
              </div>
            )}

            {/* Clerk account settings */}
            <div className="py-1 border-t-2 border-black">
              <Link
                href="/account/settings"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-3 px-4 py-2 hover:bg-gray-100 transition-colors neo-text font-bold text-sm"
              >
                <User className="w-4 h-4" />
                ACCOUNT SETTINGS
              </Link>
            </div>

            {/* Sign out */}
            <div className="p-2 border-t-2 border-black">
              <button
                onClick={handleSignOut}
                className="flex items-center gap-3 px-4 py-2 w-full hover:bg-red-400 transition-colors neo-text font-bold text-sm"
              >
                <LogOut className="w-4 h-4" />
                SIGN OUT
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Mobile: Simplified version */}
      <div className="md:hidden">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="neo-border neo-shadow-sm w-10 h-10 rounded-full overflow-hidden bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center"
        >
          {user?.imageUrl ? (
            <img src={user.imageUrl} alt="Avatar" className="w-full h-full object-cover" />
          ) : (
            <span className="text-white text-xs font-bold">
              {user?.firstName?.[0] || user?.emailAddresses[0]?.emailAddress?.[0] || "U"}
            </span>
          )}
        </button>

        {isOpen && (
          <div className="absolute right-0 top-full mt-2 w-56 bg-white neo-border neo-shadow-lg z-50">
            <div className="p-3 border-b-2 border-black">
              <p className="neo-text text-xs text-gray-600 truncate">
                {user?.emailAddresses[0]?.emailAddress || "User"}
              </p>
            </div>

            {isVendor && (
              <div className="py-1">
                <Link
                  href="/account/purchases"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-3 px-4 py-2 hover:bg-yellow-400 transition-colors neo-text font-bold text-sm"
                >
                  <Package className="w-4 h-4" />
                  MY PURCHASES
                </Link>
                <Link
                  href="/account/downloads"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-3 px-4 py-2 hover:bg-yellow-400 transition-colors neo-text font-bold text-sm"
                >
                  <Download className="w-4 h-4" />
                  MY DOWNLOADS
                </Link>
                <Link
                  href="/vendor"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-3 px-4 py-2 hover:bg-cyan-400 transition-colors neo-text font-bold text-sm"
                >
                  <Store className="w-4 h-4" />
                  VENDOR DASHBOARD
                </Link>
              </div>
            )}

            {isAdmin && (
              <div className="py-1 border-t-2 border-black">
                <Link
                  href="/admin"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-3 px-4 py-2 hover:bg-red-400 transition-colors neo-text font-bold text-sm"
                >
                  <Shield className="w-4 h-4" />
                  ADMIN DASHBOARD
                </Link>
              </div>
            )}

            <div className="py-1 border-t-2 border-black">
              <Link
                href="/account/settings"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-3 px-4 py-2 hover:bg-gray-100 transition-colors neo-text font-bold text-sm"
              >
                <User className="w-4 h-4" />
                ACCOUNT SETTINGS
              </Link>
            </div>

            <div className="p-2 border-t-2 border-black">
              <button
                onClick={handleSignOut}
                className="flex items-center gap-3 px-4 py-2 w-full hover:bg-red-400 transition-colors neo-text font-bold text-sm"
              >
                <LogOut className="w-4 h-4" />
                SIGN OUT
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
