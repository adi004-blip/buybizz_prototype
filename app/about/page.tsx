"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Zap, Shield, Users, Heart } from "lucide-react";
import Link from "next/link";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white py-8 px-4">
      <div className="mx-auto max-w-4xl">
        {/* Hero */}
        <div className="text-center mb-16">
          <h1 className="neo-heading text-5xl md:text-7xl mb-6">
            ABOUT <span className="text-pink-500">BUYBIZZ</span>
          </h1>
          <p className="neo-text text-xl text-gray-600 max-w-2xl mx-auto">
            THE ULTIMATE MARKETPLACE FOR AI AGENTS. LIFETIME DEALS, FOREVER ACCESS, ONE-TIME PAYMENT.
          </p>
        </div>

        {/* Mission */}
        <Card className="mb-12 bg-gradient-to-br from-yellow-400 via-pink-400 to-cyan-400">
          <CardContent className="p-12">
            <h2 className="neo-heading text-4xl mb-6 text-center">OUR MISSION</h2>
            <p className="neo-text text-xl text-center leading-relaxed">
              TO DEMOCRATIZE AI ACCESS BY CONNECTING CREATORS WITH USERS THROUGH LIFETIME DEALS.
              WE BELIEVE IN ONE-TIME PAYMENTS, FOREVER ACCESS, AND UNCOMPROMISING QUALITY.
            </p>
          </CardContent>
        </Card>

        {/* Values */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          <Card className="bg-yellow-400">
            <CardContent className="p-8">
              <Zap className="w-16 h-16 mb-4" />
              <h3 className="neo-heading text-2xl mb-4">LIFETIME ACCESS</h3>
              <p className="neo-text">
                ONE-TIME PAYMENT, FOREVER ACCESS. NO SUBSCRIPTIONS, NO RENEWALS, NO SURPRISES.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-pink-400">
            <CardContent className="p-8">
              <Shield className="w-16 h-16 mb-4" />
              <h3 className="neo-heading text-2xl mb-4">SECURITY</h3>
              <p className="neo-text">
                BULLETPROOF PROTECTION FOR VENDORS AND CUSTOMERS. YOUR DATA IS SAFE WITH US.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-cyan-400">
            <CardContent className="p-8">
              <Users className="w-16 h-16 mb-4" />
              <h3 className="neo-heading text-2xl mb-4">AI CREATORS</h3>
              <p className="neo-text">
                A THRIVING ECOSYSTEM OF AI DEVELOPERS, CREATORS, AND USERS BUILDING THE FUTURE.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-green-400">
            <CardContent className="p-8">
              <Heart className="w-16 h-16 mb-4" />
              <h3 className="neo-heading text-2xl mb-4">PASSION</h3>
              <p className="neo-text">
                BUILT WITH BRUTAL LOVE FOR DESIGN, FUNCTIONALITY, AND USER EXPERIENCE.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* CTA */}
        <Card className="bg-black text-white">
          <CardContent className="p-12 text-center">
            <h2 className="neo-heading text-4xl mb-4">
              READY TO JOIN THE <span className="text-yellow-400">REVOLUTION?</span>
            </h2>
            <p className="neo-text text-xl mb-8 text-gray-300">
              START SELLING OR SHOPPING TODAY
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/vendor/register">
                <Button size="lg" className="bg-yellow-400 text-black border-white neo-shadow-xl">
                  BECOME A VENDOR
                </Button>
              </Link>
              <Link href="/shop">
                <Button size="lg" variant="outline" className="bg-white text-black border-white neo-shadow-xl">
                  START SHOPPING
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
