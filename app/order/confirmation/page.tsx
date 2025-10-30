"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle, Copy, Download, Key, Mail, ArrowRight } from "lucide-react";
import { useState } from "react";

export default function OrderConfirmationPage() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId") || "ORD-123456";
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Mock order data - in real app, fetch from API
  const order = {
    id: orderId,
    date: new Date().toLocaleDateString(),
    total: 246,
    items: [
      {
        id: 1,
        name: "AI COPYWRITER PRO",
        vendor: "AIWRITER",
        price: 97,
        apiKey: "bb_live_sk_a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6",
        downloadUrl: "#"
      },
      {
        id: 2,
        name: "CODE ASSISTANT AGENT",
        vendor: "DEVTECH",
        price: 149,
        apiKey: "bb_live_sk_z9y8x7w6v5u4t3s2r1q0p9o8n7m6l5k",
        downloadUrl: "#"
      }
    ]
  };

  const copyToClipboard = (text: string, keyId: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(keyId);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="mx-auto max-w-4xl">
        {/* Success Header */}
        <div className="text-center mb-12">
          <div className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6 neo-border neo-shadow-lg">
            <CheckCircle className="w-12 h-12 text-white" />
          </div>
          <h1 className="neo-heading text-5xl md:text-7xl mb-4">
            ORDER <span className="text-green-500">CONFIRMED!</span>
          </h1>
          <p className="neo-text text-xl text-gray-600 mb-2">
            YOUR AI AGENTS ARE READY TO USE
          </p>
          <p className="neo-text text-gray-500">
            Order #{order.id} • {order.date}
          </p>
        </div>

        {/* API Keys Section */}
        <Card className="mb-6 bg-yellow-400">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <Key className="w-6 h-6" />
              <h2 className="neo-heading text-2xl">YOUR API KEYS</h2>
            </div>
            <p className="neo-text mb-6">
              KEEP THESE API KEYS SAFE. YOU'LL NEED THEM TO ACCESS YOUR AI AGENTS.
            </p>
            <div className="space-y-4">
              {order.items.map((item) => (
                <div key={item.id} className="bg-white neo-border p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="neo-heading text-lg">{item.name}</h3>
                      <p className="neo-text text-sm text-gray-600">by {item.vendor}</p>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => copyToClipboard(item.apiKey, item.id.toString())}
                    >
                      {copiedKey === item.id.toString() ? (
                        <>
                          <CheckCircle className="w-4 h-4 mr-2" />
                          COPIED!
                        </>
                      ) : (
                        <>
                          <Copy className="w-4 h-4 mr-2" />
                          COPY KEY
                        </>
                      )}
                    </Button>
                  </div>
                  <div className="bg-gray-100 neo-border p-3 mt-3">
                    <code className="neo-text text-sm break-all">{item.apiKey}</code>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Order Details */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <h2 className="neo-heading text-2xl mb-6">ORDER DETAILS</h2>
            <div className="space-y-4">
              {order.items.map((item) => (
                <div key={item.id} className="flex justify-between items-center py-3 border-b-2 border-gray-200 last:border-0">
                  <div>
                    <p className="neo-heading">{item.name}</p>
                    <p className="neo-text text-sm text-gray-600">LIFETIME ACCESS</p>
                  </div>
                  <span className="neo-heading text-xl">${item.price}</span>
                </div>
              ))}
              <div className="pt-4 border-t-2 border-black">
                <div className="flex justify-between">
                  <span className="neo-heading text-xl">TOTAL PAID</span>
                  <span className="neo-heading text-3xl">${order.total}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Next Steps */}
        <Card className="mb-6 bg-pink-400">
          <CardContent className="p-6">
            <h2 className="neo-heading text-2xl mb-4">WHAT'S NEXT?</h2>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-black text-white neo-border flex items-center justify-center flex-shrink-0">
                  <span className="neo-heading">1</span>
                </div>
                <div>
                  <p className="neo-heading mb-1">COPY YOUR API KEYS</p>
                  <p className="neo-text text-sm">SAVE THEM SOMEWHERE SAFE. YOU'LL NEED THEM TO ACCESS YOUR AI AGENTS.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-black text-white neo-border flex items-center justify-center flex-shrink-0">
                  <span className="neo-heading">2</span>
                </div>
                <div>
                  <p className="neo-heading mb-1">CHECK YOUR EMAIL</p>
                  <p className="neo-text text-sm">WE'VE SENT YOU A CONFIRMATION EMAIL WITH ALL YOUR API KEYS AND DOCUMENTATION.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-black text-white neo-border flex items-center justify-center flex-shrink-0">
                  <span className="neo-heading">3</span>
                </div>
                <div>
                  <p className="neo-heading mb-1">START USING YOUR AI AGENTS</p>
                  <p className="neo-text text-sm">VISIT YOUR ACCOUNT TO ACCESS DOCUMENTATION AND GET STARTED.</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4">
          <Link href="/account/purchases" className="flex-1">
            <Button size="lg" className="w-full">
              VIEW MY PURCHASES
              <ArrowRight className="ml-2 w-6 h-6" />
            </Button>
          </Link>
          <Link href="/shop" className="flex-1">
            <Button variant="outline" size="lg" className="w-full">
              CONTINUE SHOPPING
            </Button>
          </Link>
        </div>

        {/* Help Section */}
        <Card className="mt-6 bg-cyan-400">
          <CardContent className="p-6 text-center">
            <Mail className="w-8 h-8 mx-auto mb-3" />
            <h3 className="neo-heading text-xl mb-2">NEED HELP?</h3>
            <p className="neo-text mb-4">
              IF YOU HAVE ANY QUESTIONS ABOUT YOUR ORDER OR API KEYS, CONTACT OUR SUPPORT TEAM.
            </p>
            <Link href="/contact">
              <Button variant="outline" className="bg-white">
                CONTACT SUPPORT
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
