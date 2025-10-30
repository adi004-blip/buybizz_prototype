"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Instagram, Twitter, Facebook, Mail } from "lucide-react";

export default function Footer() {
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
            <p className="neo-text text-gray-300">
              THE ULTIMATE MARKETPLACE FOR AI AGENTS. LIFETIME DEALS, FOREVER ACCESS.
            </p>
            <div className="flex gap-3">
              <Button variant="outline" size="sm" className="bg-pink-400 text-black border-white">
                <Instagram className="w-4 h-4" />
              </Button>
              <Button variant="outline" size="sm" className="bg-cyan-400 text-black border-white">
                <Twitter className="w-4 h-4" />
              </Button>
              <Button variant="outline" size="sm" className="bg-green-400 text-black border-white">
                <Facebook className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Shop */}
          <div className="space-y-4">
            <h3 className="neo-heading text-xl text-yellow-400">AI AGENTS</h3>
            <div className="space-y-2">
              <Link href="/shop" className="block neo-text text-white hover:text-pink-400 transition-colors">
                ALL AGENTS
              </Link>
              <Link href="/shop/writing" className="block neo-text text-white hover:text-pink-400 transition-colors">
                WRITING AI
              </Link>
              <Link href="/shop/coding" className="block neo-text text-white hover:text-pink-400 transition-colors">
                CODE ASSISTANTS
              </Link>
              <Link href="/shop/marketing" className="block neo-text text-white hover:text-pink-400 transition-colors">
                MARKETING AI
              </Link>
              <Link href="/shop/analytics" className="block neo-text text-white hover:text-pink-400 transition-colors">
                ANALYTICS AI
              </Link>
            </div>
          </div>

          {/* Vendors */}
          <div className="space-y-4">
            <h3 className="neo-heading text-xl text-cyan-400">CREATORS</h3>
            <div className="space-y-2">
              <Link href="/vendor" className="block neo-text text-white hover:text-cyan-400 transition-colors">
                CREATOR DASHBOARD
              </Link>
              <Link href="/vendor/register" className="block neo-text text-white hover:text-cyan-400 transition-colors">
                SELL YOUR AI AGENT
              </Link>
              <Link href="/vendor/guide" className="block neo-text text-white hover:text-cyan-400 transition-colors">
                CREATOR GUIDE
              </Link>
              <Link href="/vendor/support" className="block neo-text text-white hover:text-cyan-400 transition-colors">
                CREATOR SUPPORT
              </Link>
            </div>
          </div>

          {/* Support */}
          <div className="space-y-4">
            <h3 className="neo-heading text-xl text-green-400">SUPPORT</h3>
            <div className="space-y-2">
              <Link href="/help" className="block neo-text text-white hover:text-green-400 transition-colors">
                HELP CENTER
              </Link>
              <Link href="/contact" className="block neo-text text-white hover:text-green-400 transition-colors">
                CONTACT US
              </Link>
              <Link href="/shipping" className="block neo-text text-white hover:text-green-400 transition-colors">
                SHIPPING INFO
              </Link>
              <Link href="/returns" className="block neo-text text-white hover:text-green-400 transition-colors">
                RETURNS
              </Link>
              <Link href="/privacy" className="block neo-text text-white hover:text-green-400 transition-colors">
                PRIVACY POLICY
              </Link>
            </div>
          </div>
        </div>

        {/* Newsletter */}
        <div className="mt-12 pt-8 border-t-4 border-white">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="neo-heading text-2xl text-white mb-2">STAY UPDATED!</h3>
              <p className="neo-text text-gray-300">GET THE LATEST DEALS AND PRODUCT DROPS</p>
            </div>
            <div className="flex gap-2 w-full md:w-auto">
              <input
                type="email"
                placeholder="YOUR EMAIL..."
                className="neo-input flex-1 md:w-80 bg-white text-black placeholder:text-gray-600"
              />
              <Button variant="primary">
                <Mail className="w-5 h-5 mr-2" />
                SUBSCRIBE
              </Button>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-8 pt-8 border-t-4 border-white text-center">
          <p className="neo-text text-gray-300">
            © 2024 BUYBIZZ. ALL RIGHTS RESERVED. BUILT WITH BRUTAL LOVE.
          </p>
        </div>
      </div>
    </footer>
  );
}

