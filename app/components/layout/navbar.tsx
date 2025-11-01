"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Search, Menu, X } from "lucide-react";
import {
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
} from "@clerk/nextjs";
import UserMenu from "./user-menu";

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="w-full neo-border-thick bg-white relative z-50">
      <div className="mx-auto max-w-7xl px-4 py-3">
        <div className="flex items-center justify-between gap-4">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 flex-shrink-0">
            <div className="neo-border bg-yellow-400 p-2 neo-shadow-md">
              <span className="neo-heading text-xl">BB</span>
            </div>
            <span className="neo-heading text-2xl md:text-3xl">BUYBIZZ</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-6">
            <Link href="/shop" className="neo-text text-lg hover:text-pink-500 transition-colors whitespace-nowrap">
              AI AGENTS
            </Link>
            <Link href="/vendors" className="neo-text text-lg hover:text-cyan-500 transition-colors whitespace-nowrap">
              CREATORS
            </Link>
            <Link href="/about" className="neo-text text-lg hover:text-green-500 transition-colors whitespace-nowrap">
              ABOUT
            </Link>
          </nav>

          {/* Search Bar - Desktop */}
          <div className="hidden xl:flex items-center flex-1 max-w-lg mx-6">
            <div className="relative w-full">
              <input
                type="text"
                placeholder="SEARCH AI AGENTS..."
                className="neo-input w-full pr-12 placeholder:text-gray-600 text-base"
              />
              <Search className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500" />
            </div>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-3 flex-shrink-0">
            {/* Cart - Desktop */}
            <Link href="/cart">
              <Button variant="outline" size="sm" className="relative hidden md:flex">
                <ShoppingCart className="w-4 h-4 md:w-5 md:h-5" />
                <span className="absolute -top-1.5 -right-1.5 bg-red-500 text-white text-xs neo-border w-5 h-5 flex items-center justify-center font-bold">
                  3
                </span>
              </Button>
            </Link>

            {/* Auth */}
            <SignedIn>
              <div className="hidden md:flex items-center gap-2">
                <UserMenu />
              </div>
            </SignedIn>
            
            <SignedOut>
              <div className="hidden md:flex items-center gap-2">
                <SignInButton>
                  <Button variant="outline" size="sm" className="text-sm px-4">
                    LOGIN
                  </Button>
                </SignInButton>
                <SignUpButton>
                  <Button variant="primary" size="sm" className="text-sm px-4">
                    UNLOCK
                  </Button>
                </SignUpButton>
              </div>
            </SignedOut>

            {/* Mobile Menu Toggle */}
            <Button 
              variant="outline" 
              size="sm" 
              className="lg:hidden p-2"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden mt-4 pb-4 space-y-4">
            {/* Mobile Search */}
            <div className="relative">
              <input
                type="text"
                placeholder="SEARCH AI AGENTS..."
                className="neo-input w-full pr-12 placeholder:text-gray-600"
              />
              <Search className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500" />
            </div>

            {/* Mobile Navigation */}
            <nav className="flex flex-col gap-3">
              <Link 
                href="/shop" 
                className="neo-text text-lg hover:text-pink-500 transition-colors py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                AI AGENTS
              </Link>
              <Link 
                href="/vendors" 
                className="neo-text text-lg hover:text-cyan-500 transition-colors py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                CREATORS
              </Link>
              <Link 
                href="/about" 
                className="neo-text text-lg hover:text-green-500 transition-colors py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                ABOUT
              </Link>
            </nav>

            {/* Mobile Auth */}
            <div className="flex flex-col gap-2 pt-2 border-t-2 border-black">
              <SignedIn>
                {/* Mobile Account Links */}
                <div className="flex flex-col gap-1 px-2">
                  <Link 
                    href="/account/purchases" 
                    onClick={() => setMobileMenuOpen(false)}
                    className="neo-text text-sm py-2 px-3 hover:bg-yellow-400 transition-colors neo-border"
                  >
                    MY PURCHASES
                  </Link>
                  <Link 
                    href="/account/downloads" 
                    onClick={() => setMobileMenuOpen(false)}
                    className="neo-text text-sm py-2 px-3 hover:bg-yellow-400 transition-colors neo-border"
                  >
                    MY DOWNLOADS
                  </Link>
                  <Link 
                    href="/account/settings" 
                    onClick={() => setMobileMenuOpen(false)}
                    className="neo-text text-sm py-2 px-3 hover:bg-yellow-400 transition-colors neo-border"
                  >
                    ACCOUNT SETTINGS
                  </Link>
                </div>
                <div className="flex items-center justify-center pt-2">
                  <UserMenu />
                </div>
              </SignedIn>
              <SignedOut>
                <SignInButton>
                  <Button variant="outline" className="w-full justify-center">
                    LOGIN
                  </Button>
                </SignInButton>
                <SignUpButton>
                  <Button variant="primary" className="w-full justify-center">
                    UNLOCK
                  </Button>
                </SignUpButton>
              </SignedOut>
              <Link href="/cart" className="w-full">
                <Button variant="outline" className="w-full justify-center md:hidden relative">
                  <ShoppingCart className="w-5 h-5 mr-2" />
                  CART
                  <span className="absolute -top-1.5 -right-1.5 bg-red-500 text-white text-xs neo-border w-5 h-5 flex items-center justify-center font-bold">
                    3
                  </span>
                </Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}

