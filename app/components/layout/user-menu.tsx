"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useUser } from "@clerk/nextjs";
import { UserButton } from "@clerk/nextjs";
import { 
  Package, 
  Download, 
  Settings, 
  Store,
  ChevronDown,
} from "lucide-react";

export default function UserMenu() {
  const { user } = useUser();
  const [isOpen, setIsOpen] = useState(false);
  const [isVendor, setIsVendor] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Check if user is vendor
  useEffect(() => {
    const checkVendorStatus = async () => {
      try {
        const response = await fetch("/api/user/role");
        if (response.ok) {
          const data = await response.json();
          setIsVendor(data.role === "VENDOR" || data.role === "ADMIN");
        }
      } catch (error) {
        console.error("Error checking vendor status:", error);
      }
    };

    if (user) {
      checkVendorStatus();
    }
  }, [user]);

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

  const menuItems = [
    { href: "/account/purchases", label: "MY PURCHASES", icon: Package },
    { href: "/account/downloads", label: "MY DOWNLOADS", icon: Download },
    { href: "/account/settings", label: "ACCOUNT SETTINGS", icon: Settings },
  ];

  return (
    <div className="relative" ref={menuRef}>
      {/* Desktop: Custom dropdown menu */}
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
            <div className="p-2 border-b-2 border-black">
              <p className="neo-text text-xs text-gray-600 px-2 py-1 truncate">
                {user?.emailAddresses[0]?.emailAddress || "User"}
              </p>
            </div>
            <nav className="py-1">
              {menuItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setIsOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 hover:bg-yellow-400 transition-colors neo-text font-bold text-sm"
                  >
                    <Icon className="w-4 h-4" />
                    {item.label}
                  </Link>
                );
              })}
            </nav>
            {isVendor && (
              <div className="border-t-2 border-black p-2">
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
            <div className="border-t-2 border-black p-2">
              <UserButton 
                afterSignOutUrl="/"
                appearance={{
                  elements: {
                    userButtonPopoverCard: "neo-border neo-shadow-lg",
                    userButtonPopoverActions: "neo-text",
                  }
                }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Mobile: Just show UserButton */}
      <div className="md:hidden">
        <UserButton 
          afterSignOutUrl="/"
          appearance={{
            elements: {
              avatarBox: "neo-border neo-shadow-sm"
            }
          }}
        />
      </div>
    </div>
  );
}

