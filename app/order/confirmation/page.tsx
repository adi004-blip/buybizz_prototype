"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle, Copy, Download, Key, Mail, ArrowRight } from "lucide-react";
import { useState, Suspense, useEffect } from "react";
import { useRouter } from "next/navigation";

interface OrderItem {
  id: string;
  agentId: string;
  name: string;
  vendor: string;
  price: number;
  quantity: number;
  apiKeys: {
    apiKey: string;
    purchasedAt: string;
  }[];
}

interface Order {
  id: string;
  amount: number;
  status: string;
  createdAt: string;
}

function OrderConfirmationContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const orderId = searchParams.get("orderId");
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [order, setOrder] = useState<Order | null>(null);
  const [items, setItems] = useState<OrderItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrder = async () => {
      if (!orderId) {
        setError("Order ID is required");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const response = await fetch(`/api/orders/${orderId}`);
        if (!response.ok) {
          if (response.status === 401) {
            router.push("/sign-in");
            return;
          }
          throw new Error("Failed to fetch order");
        }
        const data = await response.json();
        setOrder(data.order);
        setItems(data.items || []);
        setError(null);
      } catch (err: any) {
        console.error("Error fetching order:", err);
        setError(err.message || "Failed to load order");
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderId, router]);

  const copyToClipboard = (text: string, keyId: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(keyId);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8 px-4 flex items-center justify-center">
        <div className="text-center">
          <h1 className="neo-heading text-4xl mb-4">LOADING ORDER...</h1>
          <p className="neo-text text-gray-600">Please wait</p>
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen bg-gray-50 py-8 px-4 flex items-center justify-center">
        <div className="text-center">
          <h1 className="neo-heading text-4xl mb-4 text-red-500">ERROR</h1>
          <p className="neo-text text-xl mb-4">{error || "Order not found"}</p>
          <Link href="/shop">
            <Button>BACK TO SHOP</Button>
          </Link>
        </div>
      </div>
    );
  }

  const orderDate = new Date(order.createdAt).toLocaleDateString();

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
            Order #{order.id} • {orderDate}
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
              {items.map((item, itemIndex) => (
                <div key={item.id} className="bg-white neo-border p-4">
                  <div className="mb-3">
                    <h3 className="neo-heading text-lg">{item.name}</h3>
                    <p className="neo-text text-sm text-gray-600">by {item.vendor}</p>
                    {item.quantity > 1 && (
                      <p className="neo-text text-xs text-gray-500 mt-1">
                        Quantity: {item.quantity} (multiple API keys generated)
                      </p>
                    )}
                  </div>
                  <div className="space-y-3">
                    {item.apiKeys.map((apiKeyData, keyIndex) => {
                      const keyId = `${item.agentId}-${keyIndex}`;
                      return (
                        <div key={keyId} className="bg-gray-100 neo-border p-3">
                          <div className="flex justify-between items-start mb-2">
                            <div className="flex-1">
                              {item.quantity > 1 && (
                                <p className="neo-text text-xs text-gray-600 mb-1">
                                  API Key {keyIndex + 1} of {item.quantity}
                                </p>
                              )}
                              <code className="neo-text text-sm break-all">{apiKeyData.apiKey}</code>
                            </div>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => copyToClipboard(apiKeyData.apiKey, keyId)}
                              className="ml-3 flex-shrink-0"
                            >
                              {copiedKey === keyId ? (
                                <>
                                  <CheckCircle className="w-4 h-4 mr-2" />
                                  COPIED!
                                </>
                              ) : (
                                <>
                                  <Copy className="w-4 h-4 mr-2" />
                                  COPY
                                </>
                              )}
                            </Button>
                          </div>
                        </div>
                      );
                    })}
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
              {items.map((item) => (
                <div key={item.id} className="flex justify-between items-center py-3 border-b-2 border-gray-200 last:border-0">
                  <div>
                    <p className="neo-heading">{item.name}</p>
                    <p className="neo-text text-sm text-gray-600">
                      LIFETIME ACCESS {item.quantity > 1 && `× ${item.quantity}`}
                    </p>
                  </div>
                  <span className="neo-heading text-xl">${(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
              <div className="pt-4 border-t-2 border-black">
                <div className="flex justify-between">
                  <span className="neo-heading text-xl">TOTAL PAID</span>
                  <span className="neo-heading text-3xl">${Number(order.amount).toFixed(2)}</span>
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
              <ArrowRight className="w-6 h-6" />
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

export default function OrderConfirmationPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 py-8 px-4 flex items-center justify-center">
        <div className="text-center">
          <h1 className="neo-heading text-4xl mb-4">LOADING ORDER...</h1>
          <p className="neo-text text-gray-600">Please wait</p>
        </div>
      </div>
    }>
      <OrderConfirmationContent />
    </Suspense>
  );
}
