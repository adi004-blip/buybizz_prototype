"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useUser } from "@clerk/nextjs";
import { UserButton } from "@clerk/nextjs";
import { 
  Package, 
  Download, 
  Settings, 
  ShoppingBag, 
  Store,
  ChevronDown,
  LogOut
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default function UserMenu() {
  const { user } = useUser();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

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
          <UserButton 
            afterSignOutUrl="/"
            appearance={{
              elements: {
                avatarBox: "neo-border neo-shadow-sm w-8 h-8"
              }
            }}
          />
          <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </button>

        {isOpen && (
          <div className="absolute right-0 top-full mt-2 w-56 bg-white neo-border neo-shadow-lg z-50">
            <div className="p-2 border-b-2 border-black">
              <p className="neo-text text-xs text-gray-600 px-2 py-1">
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

