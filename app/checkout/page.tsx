"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Lock, CreditCard, Shield } from "lucide-react";
import { useRouter } from "next/navigation";

export default function CheckoutPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: "",
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    cardName: "",
    address: "",
    city: "",
    zipCode: "",
    country: "United States"
  });

  const orderItems = [
    {
      id: 1,
      name: "AI COPYWRITER PRO",
      price: 97,
      originalPrice: 297
    },
    {
      id: 2,
      name: "CODE ASSISTANT AGENT",
      price: 149,
      originalPrice: 499
    }
  ];

  const subtotal = orderItems.reduce((sum, item) => sum + item.price, 0);
  const totalSavings = orderItems.reduce((sum, item) => sum + (item.originalPrice - item.price), 0);
  const total = subtotal;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In real app, this would process payment via Stripe
    // For now, redirect to order confirmation
    router.push(`/order/confirmation?orderId=ORD-${Date.now()}`);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="mx-auto max-w-7xl">
        <Link href="/cart" className="inline-flex items-center gap-2 mb-6 hover:text-pink-500 transition-colors">
          <ArrowLeft className="w-5 h-5" />
          <span className="neo-text">BACK TO CART</span>
        </Link>

        <h1 className="neo-heading text-5xl md:text-7xl mb-8">
          CHECKOUT
        </h1>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Checkout Form */}
            <div className="lg:col-span-2 space-y-6">
              {/* Email */}
              <Card>
                <CardContent className="p-6">
                  <h2 className="neo-heading text-xl mb-4">CONTACT INFORMATION</h2>
                  <Input
                    type="email"
                    placeholder="YOUR EMAIL ADDRESS"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                    className="mb-4"
                  />
                  <p className="neo-text text-xs text-gray-600">
                    WE'LL SEND YOUR ORDER CONFIRMATION AND API KEYS TO THIS EMAIL
                  </p>
                </CardContent>
              </Card>

              {/* Payment */}
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <CreditCard className="w-5 h-5" />
                    <h2 className="neo-heading text-xl">PAYMENT METHOD</h2>
                  </div>
                  <div className="space-y-4">
                    <Input
                      type="text"
                      placeholder="CARD NUMBER"
                      value={formData.cardNumber}
                      onChange={(e) => setFormData({ ...formData, cardNumber: e.target.value })}
                      required
                      maxLength={19}
                    />
                    <div className="grid grid-cols-2 gap-4">
                      <Input
                        type="text"
                        placeholder="MM/YY"
                        value={formData.expiryDate}
                        onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
                        required
                        maxLength={5}
                      />
                      <Input
                        type="text"
                        placeholder="CVV"
                        value={formData.cvv}
                        onChange={(e) => setFormData({ ...formData, cvv: e.target.value })}
                        required
                        maxLength={4}
                      />
                    </div>
                    <Input
                      type="text"
                      placeholder="NAME ON CARD"
                      value={formData.cardName}
                      onChange={(e) => setFormData({ ...formData, cardName: e.target.value })}
                      required
                    />
                  </div>
                  <div className="mt-4 flex items-center gap-2 text-sm text-gray-600">
                    <Lock className="w-4 h-4" />
                    <span className="neo-text">YOUR PAYMENT IS SECURE AND ENCRYPTED</span>
                  </div>
                </CardContent>
              </Card>

              {/* Billing Address */}
              <Card>
                <CardContent className="p-6">
                  <h2 className="neo-heading text-xl mb-4">BILLING ADDRESS</h2>
                  <div className="space-y-4">
                    <Input
                      type="text"
                      placeholder="ADDRESS"
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      required
                    />
                    <div className="grid grid-cols-2 gap-4">
                      <Input
                        type="text"
                        placeholder="CITY"
                        value={formData.city}
                        onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                        required
                      />
                      <Input
                        type="text"
                        placeholder="ZIP CODE"
                        value={formData.zipCode}
                        onChange={(e) => setFormData({ ...formData, zipCode: e.target.value })}
                        required
                      />
                    </div>
                    <Input
                      type="text"
                      placeholder="COUNTRY"
                      value={formData.country}
                      onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                      required
                    />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <Card className="sticky top-4">
                <CardContent className="p-6">
                  <h2 className="neo-heading text-2xl mb-6">ORDER SUMMARY</h2>

                  <div className="space-y-3 mb-6">
                    {orderItems.map((item) => (
                      <div key={item.id} className="flex justify-between items-start">
                        <div className="flex-1">
                          <p className="neo-text text-sm">{item.name}</p>
                          <p className="neo-text text-xs text-gray-500">LIFETIME ACCESS</p>
                        </div>
                        <span className="neo-heading">${item.price}</span>
                      </div>
                    ))}
                  </div>

                  <div className="space-y-3 mb-6 pt-4 border-t-2 border-black">
                    <div className="flex justify-between">
                      <span className="neo-text text-gray-600">SUBTOTAL</span>
                      <span className="neo-heading">${subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="neo-text text-gray-600">TOTAL SAVINGS</span>
                      <span className="neo-text text-green-600 font-bold">
                        -${totalSavings.toFixed(2)}
                      </span>
                    </div>
                    <div className="border-t-2 border-black pt-3">
                      <div className="flex justify-between">
                        <span className="neo-heading text-xl">TOTAL</span>
                        <span className="neo-heading text-3xl">${total.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>

                  <Button
                    type="submit"
                    size="lg"
                    className="w-full mb-4"
                  >
                    <Lock className="w-5 h-5 mr-2" />
                    PAY ${total.toFixed(2)}
                  </Button>

                  <div className="space-y-2 text-sm">
                    <div className="flex items-start gap-2">
                      <Shield className="w-4 h-4 text-green-600 mt-0.5" />
                      <span className="neo-text text-xs">SECURE PAYMENT PROCESSED BY STRIPE</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="neo-text text-green-600 text-xs">✓</span>
                      <span className="neo-text text-xs">INSTANT ACCESS AFTER PAYMENT</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="neo-text text-green-600 text-xs">✓</span>
                      <span className="neo-text text-xs">30-DAY MONEY-BACK GUARANTEE</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
