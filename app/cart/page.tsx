"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Trash2, Plus, Minus, ShoppingCart, ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";

interface CartItem {
  id: string;
  quantity: number;
  agent: {
    id: string;
    name: string;
    price: number;
    originalPrice: number | null;
    imageUrl: string | null;
    shortDescription: string | null;
    vendor: {
      id: string;
      fullName: string;
      companyName: string | null;
    };
  };
}

export default function CartPage() {
  const router = useRouter();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [subtotal, setSubtotal] = useState(0);

  // Fetch cart items
  useEffect(() => {
    const fetchCart = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/cart");
        if (!response.ok) {
          if (response.status === 401) {
            router.push("/sign-in");
            return;
          }
          throw new Error("Failed to fetch cart");
        }
        const data = await response.json();
        setCartItems(data.items || []);
        setSubtotal(parseFloat(data.subtotal || 0));
        setError(null);
      } catch (err: any) {
        console.error("Error fetching cart:", err);
        setError(err.message || "Failed to load cart");
      } finally {
        setLoading(false);
      }
    };

    fetchCart();
  }, [router]);

  const updateQuantity = async (id: string, change: number) => {
    const item = cartItems.find(i => i.id === id);
    if (!item) return;

    const newQuantity = Math.max(1, item.quantity + change);
    
    try {
      const response = await fetch(`/api/cart/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ quantity: newQuantity }),
      });

      if (!response.ok) {
        throw new Error("Failed to update quantity");
      }

      const updatedItem = await response.json();
      setCartItems(items =>
        items.map(i => i.id === id ? updatedItem : i)
      );

      // Recalculate subtotal
      const updatedItems = cartItems.map(i => i.id === id ? updatedItem : i);
      const newSubtotal = updatedItems.reduce((sum, item) => {
        return sum + Number(item.agent.price) * item.quantity;
      }, 0);
      setSubtotal(newSubtotal);
    } catch (err: any) {
      console.error("Error updating quantity:", err);
      alert(`Error: ${err.message || "Failed to update quantity"}`);
    }
  };

  const removeItem = async (id: string) => {
    try {
      const response = await fetch(`/api/cart/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to remove item");
      }

      setCartItems(items => items.filter(item => item.id !== id));
      
      // Recalculate subtotal
      const updatedItems = cartItems.filter(item => item.id !== id);
      const newSubtotal = updatedItems.reduce((sum, item) => {
        return sum + Number(item.agent.price) * item.quantity;
      }, 0);
      setSubtotal(newSubtotal);
    } catch (err: any) {
      console.error("Error removing item:", err);
      alert(`Error: ${err.message || "Failed to remove item"}`);
    }
  };

  const totalSavings = cartItems.reduce(
    (sum, item) => {
      const originalPrice = item.agent.originalPrice ? Number(item.agent.originalPrice) : 0;
      const price = Number(item.agent.price);
      return sum + (originalPrice - price) * item.quantity;
    },
    0
  );
  const total = subtotal;

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8 px-4 flex items-center justify-center">
        <div className="text-center">
          <p className="neo-heading text-4xl mb-4">LOADING CART...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 py-8 px-4 flex items-center justify-center">
        <div className="text-center">
          <p className="neo-heading text-4xl mb-4 text-red-500">ERROR</p>
          <p className="neo-text text-xl mb-4">{error}</p>
          <Link href="/shop">
            <Button>BACK TO SHOP</Button>
          </Link>
        </div>
      </div>
    );
  }

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
                    {/* Product Image */}
                    <div className="w-32 h-32 bg-gradient-to-br from-purple-400 to-pink-400 flex-shrink-0 flex items-center justify-center neo-border">
                      {item.agent.imageUrl ? (
                        <img src={item.agent.imageUrl} alt={item.agent.name} className="w-full h-full object-cover" />
                      ) : (
                        <span className="neo-heading text-white text-xl">AI</span>
                      )}
                    </div>

                    {/* Product Info */}
                    <div className="flex-1">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <Link href={`/product/${item.agent.id}`}>
                            <h3 className="neo-heading text-xl mb-1 hover:text-pink-500 transition-colors">
                              {item.agent.name}
                            </h3>
                          </Link>
                          <p className="neo-text text-sm text-gray-600 mb-1">
                            by {item.agent.vendor.companyName || item.agent.vendor.fullName}
                          </p>
                          <p className="neo-text text-xs text-gray-500">
                            {item.agent.shortDescription || "LIFETIME ACCESS"}
                          </p>
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
                            <span className="neo-heading text-2xl">${Number(item.agent.price).toFixed(0)}</span>
                            {item.agent.originalPrice && (
                              <span className="neo-text text-sm text-gray-500 line-through">
                                ${Number(item.agent.originalPrice).toFixed(0)}
                              </span>
                            )}
                          </div>
                          {item.agent.originalPrice && (
                            <p className="neo-text text-xs text-green-600 mt-1">
                              SAVE ${Number(item.agent.originalPrice - item.agent.price).toFixed(0)}
                            </p>
                          )}
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
                  {totalSavings > 0 && (
                    <div className="flex justify-between">
                      <span className="neo-text text-gray-600">TOTAL SAVINGS</span>
                      <span className="neo-text text-green-600 font-bold">
                        -${totalSavings.toFixed(2)}
                      </span>
                    </div>
                  )}
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
