"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useUser } from "@clerk/nextjs";

interface CartContextType {
  cartCount: number;
  refreshCart: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cartCount, setCartCount] = useState(0);
  const { user } = useUser();

  const refreshCart = async () => {
    if (!user) {
      setCartCount(0);
      return;
    }

    try {
      const response = await fetch("/api/cart");
      if (response.ok) {
        const data = await response.json();
        if (data.items && Array.isArray(data.items)) {
          const totalItems = data.items.reduce((sum: number, item: any) => sum + (item.quantity || 0), 0);
          setCartCount(totalItems);
        } else {
          setCartCount(0);
        }
      } else {
        setCartCount(0);
      }
    } catch (error) {
      console.error("Error fetching cart:", error);
      setCartCount(0);
    }
  };

  useEffect(() => {
    refreshCart();
    
    // Listen for cart update events
    const handleCartUpdate = () => {
      refreshCart();
    };

    window.addEventListener("cartUpdated", handleCartUpdate);
    
    // Also refresh when user changes
    if (user) {
      refreshCart();
    }
    
    return () => {
      window.removeEventListener("cartUpdated", handleCartUpdate);
    };
  }, [user]);

  return (
    <CartContext.Provider value={{ cartCount, refreshCart }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}

// Helper function to dispatch cart update event
export function notifyCartUpdate() {
  window.dispatchEvent(new Event("cartUpdated"));
}

