"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Trash2, Plus, Minus, ShoppingCart, ArrowRight } from "lucide-react";

export default function CartPage() {
  const [cartItems, setCartItems] = useState([
    {
      id: 1,
      name: "AI COPYWRITER PRO",
      price: 97,
      originalPrice: 297,
      vendor: "AIWRITER",
      description: "LIFETIME ACCESS TO AI-POWERED COPYWRITING AGENT",
      quantity: 1
    },
    {
      id: 2,
      name: "CODE ASSISTANT AGENT",
      price: 149,
      originalPrice: 499,
      vendor: "DEVTECH",
      description: "REVOLUTIONARY AI AGENT FOR FASTER CODING",
      quantity: 1
    }
  ]);

  const updateQuantity = (id: number, change: number) => {
    setCartItems(items =>
      items.map(item =>
        item.id === id
          ? { ...item, quantity: Math.max(1, item.quantity + change) }
          : item
      )
    );
  };

  const removeItem = (id: number) => {
    setCartItems(items => items.filter(item => item.id !== id));
  };

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const totalSavings = cartItems.reduce(
    (sum, item) => sum + (item.originalPrice - item.price) * item.quantity,
    0
  );
  const total = subtotal;

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-8 px-4">
        <div className="mx-auto max-w-4xl">
          <h1 className="neo-heading text-5xl md:text-7xl mb-8">
            YOUR <span className="text-pink-500">CART</span>
          </h1>
          <Card className="text-center py-16">
            <CardContent>
              <ShoppingCart className="w-24 h-24 mx-auto mb-6 text-gray-400" />
              <h2 className="neo-heading text-3xl mb-4">YOUR CART IS EMPTY</h2>
              <p className="neo-text text-gray-600 mb-8">
                START ADDING AI AGENTS TO YOUR CART
              </p>
              <Link href="/shop">
                <Button size="lg">
                  BROWSE AI AGENTS
                  <ArrowRight className="ml-2 w-6 h-6" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="mx-auto max-w-7xl">
        <h1 className="neo-heading text-5xl md:text-7xl mb-8">
          YOUR <span className="text-pink-500">CART</span>
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cartItems.map((item) => (
              <Card key={item.id}>
                <CardContent className="p-6">
                  <div className="flex gap-6">
                    {/* Product Image Placeholder */}
                    <div className="w-32 h-32 bg-gradient-to-br from-purple-400 to-pink-400 flex-shrink-0 flex items-center justify-center neo-border">
                      <span className="neo-heading text-white text-xl">AI</span>
                    </div>

                    {/* Product Info */}
                    <div className="flex-1">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="neo-heading text-xl mb-1">{item.name}</h3>
                          <p className="neo-text text-sm text-gray-600 mb-1">by {item.vendor}</p>
                          <p className="neo-text text-xs text-gray-500">{item.description}</p>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => removeItem(item.id)}
                          className="text-red-500 hover:bg-red-50"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>

                      {/* Price and Quantity */}
                      <div className="flex justify-between items-center mt-4">
                        <div>
                          <div className="flex items-baseline gap-2">
                            <span className="neo-heading text-2xl">${item.price}</span>
                            <span className="neo-text text-sm text-gray-500 line-through">
                              ${item.originalPrice}
                            </span>
                          </div>
                          <p className="neo-text text-xs text-green-600 mt-1">
                            SAVE ${item.originalPrice - item.price}
                          </p>
                        </div>

                        {/* Quantity Controls */}
                        <div className="flex items-center gap-3">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => updateQuantity(item.id, -1)}
                            disabled={item.quantity === 1}
                          >
                            <Minus className="w-4 h-4" />
                          </Button>
                          <span className="neo-heading text-xl w-8 text-center">
                            {item.quantity}
                          </span>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => updateQuantity(item.id, 1)}
                          >
                            <Plus className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card className="sticky top-4">
              <CardContent className="p-6">
                <h2 className="neo-heading text-2xl mb-6">ORDER SUMMARY</h2>

                <div className="space-y-4 mb-6">
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
                  <div className="border-t-2 border-black pt-4">
                    <div className="flex justify-between">
                      <span className="neo-heading text-xl">TOTAL</span>
                      <span className="neo-heading text-3xl">${total.toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <Link href="/checkout">
                    <Button size="lg" className="w-full">
                      PROCEED TO CHECKOUT
                      <ArrowRight className="ml-2 w-6 h-6" />
                    </Button>
                  </Link>
                  <Link href="/shop">
                    <Button variant="outline" className="w-full">
                      CONTINUE SHOPPING
                    </Button>
                  </Link>
                </div>

                <div className="mt-6 pt-6 border-t-2 border-black">
                  <div className="flex items-start gap-2 mb-2">
                    <span className="neo-text text-green-600">✓</span>
                    <span className="neo-text text-sm">LIFETIME ACCESS GUARANTEED</span>
                  </div>
                  <div className="flex items-start gap-2 mb-2">
                    <span className="neo-text text-green-600">✓</span>
                    <span className="neo-text text-sm">INSTANT DELIVERY AFTER PAYMENT</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="neo-text text-green-600">✓</span>
                    <span className="neo-text text-sm">30-DAY MONEY-BACK GUARANTEE</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
