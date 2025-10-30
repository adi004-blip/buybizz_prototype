"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Filter, Grid, List, Star, ShoppingCart } from "lucide-react";

export default function ShopPage() {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000]);

  const categories = [
    { id: "all", name: "ALL AGENTS", color: "bg-black" },
    { id: "writing", name: "WRITING AI", color: "bg-yellow-400" },
    { id: "coding", name: "CODE ASSISTANTS", color: "bg-pink-400" },
    { id: "marketing", name: "MARKETING AI", color: "bg-cyan-400" },
    { id: "analytics", name: "ANALYTICS", color: "bg-green-400" },
    { id: "design", name: "DESIGN AI", color: "bg-purple-400" }
  ];

  const products = [
    {
      id: 1,
      name: "AI COPYWRITER PRO",
      price: 97,
      originalPrice: 297,
      vendor: "AIWRITER",
      rating: 4.9,
      category: "writing",
      description: "LIFETIME ACCESS"
    },
    {
      id: 2,
      name: "CODE ASSISTANT AGENT",
      price: 149,
      originalPrice: 499,
      vendor: "DEVTECH",
      rating: 4.8,
      category: "coding",
      description: "LIFETIME ACCESS"
    },
    {
      id: 3,
      name: "SOCIAL MEDIA MANAGER AI",
      price: 79,
      originalPrice: 199,
      vendor: "SOCIALAI",
      rating: 4.9,
      category: "marketing",
      description: "LIFETIME ACCESS"
    },
    {
      id: 4,
      name: "DATA ANALYZER PRO",
      price: 129,
      originalPrice: 399,
      vendor: "DATABOT",
      rating: 4.7,
      category: "analytics",
      description: "LIFETIME ACCESS"
    },
    {
      id: 5,
      name: "DESIGN ASSISTANT AI",
      price: 89,
      originalPrice: 249,
      vendor: "DESIGNAI",
      rating: 4.8,
      category: "design",
      description: "LIFETIME ACCESS"
    },
    {
      id: 6,
      name: "EMAIL WRITER AGENT",
      price: 59,
      originalPrice: 149,
      vendor: "AIWRITER",
      rating: 4.9,
      category: "writing",
      description: "LIFETIME ACCESS"
    },
    {
      id: 7,
      name: "API TESTER AGENT",
      price: 119,
      originalPrice: 349,
      vendor: "DEVTECH",
      rating: 4.6,
      category: "coding",
      description: "LIFETIME ACCESS"
    },
    {
      id: 8,
      name: "CONTENT SCHEDULER AI",
      price: 69,
      originalPrice: 179,
      vendor: "SOCIALAI",
      rating: 4.8,
      category: "marketing",
      description: "LIFETIME ACCESS"
    }
  ];

  const filteredProducts = products.filter(product => {
    const matchesCategory = selectedCategory === "all" || product.category === selectedCategory;
    const matchesPrice = product.price >= priceRange[0] && product.price <= priceRange[1];
    return matchesCategory && matchesPrice;
  });

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="neo-heading text-5xl md:text-7xl mb-4">
            AI AGENTS <span className="text-pink-500">MARKETPLACE</span>
          </h1>
          <p className="neo-text text-xl text-gray-600">
            DISCOVER LIFETIME DEALS ON CUTTING-EDGE AI AGENTS
          </p>
        </div>

        {/* Filters and Search */}
        <div className="mb-8 space-y-4">
          {/* Search Bar */}
          <div className="flex gap-4">
              <Input
                type="text"
                placeholder="SEARCH AI AGENTS, CREATORS, CATEGORIES..."
                className="flex-1"
              />
            <Button variant="primary">
              <Filter className="w-5 h-5 mr-2" />
              FILTERS
            </Button>
          </div>

          {/* Categories */}
          <div className="flex flex-wrap gap-3">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`neo-border px-6 py-3 neo-shadow-md transition-all ${
                  selectedCategory === category.id
                    ? `${category.color} text-black`
                    : "bg-white hover:bg-gray-100"
                }`}
              >
                <span className="neo-text font-bold">{category.name}</span>
              </button>
            ))}
          </div>

          {/* View Mode Toggle */}
          <div className="flex justify-between items-center">
            <div className="flex gap-2">
              <Button
                variant={viewMode === "grid" ? "primary" : "outline"}
                size="sm"
                onClick={() => setViewMode("grid")}
              >
                <Grid className="w-4 h-4" />
              </Button>
              <Button
                variant={viewMode === "list" ? "primary" : "outline"}
                size="sm"
                onClick={() => setViewMode("list")}
              >
                <List className="w-4 h-4" />
              </Button>
            </div>
            <p className="neo-text text-gray-600">
              {filteredProducts.length} AI AGENTS FOUND
            </p>
          </div>
        </div>

        {/* Products Grid/List */}
        {viewMode === "grid" ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <Link key={product.id} href={`/product/${product.id}`}>
                <Card className="h-full overflow-hidden cursor-pointer group">
                  <div className="aspect-square bg-gradient-to-br from-purple-400 to-pink-400 relative overflow-hidden flex items-center justify-center">
                    <div className="text-center">
                      <div className="w-16 h-16 bg-black text-white neo-border neo-shadow-lg mx-auto mb-3 flex items-center justify-center">
                        <span className="neo-heading text-2xl">AI</span>
                      </div>
                      <p className="neo-text text-white text-xs">AGENT</p>
                    </div>
                    <div className="absolute top-4 right-4 bg-green-500 text-white neo-border px-3 py-1 neo-shadow-sm">
                      <span className="neo-text text-xs font-bold">LIFETIME</span>
                    </div>
                  </div>
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="neo-heading text-lg line-clamp-2">{product.name}</h3>
                      <div className="flex items-center gap-1 ml-2">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span className="neo-text text-sm">{product.rating}</span>
                      </div>
                    </div>
                    <p className="neo-text text-gray-600 text-xs mb-1">by {product.vendor}</p>
                    <p className="neo-text text-xs text-gray-500 mb-3">{product.description}</p>
                    <div className="flex justify-between items-center">
                      <div>
                        <span className="neo-heading text-2xl">${product.price}</span>
                        {product.originalPrice && (
                          <span className="neo-text text-sm text-gray-500 line-through ml-2">
                            ${product.originalPrice}
                          </span>
                        )}
                      </div>
                      <Button size="sm" className="group-hover:bg-pink-400 transition-colors">
                        UNLOCK
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredProducts.map((product) => (
              <Link key={product.id} href={`/product/${product.id}`}>
                <Card className="cursor-pointer group">
                  <div className="flex gap-6">
                    <div className="w-48 h-48 bg-gray-200 relative flex-shrink-0">
                      <div className="absolute inset-0 flex items-center justify-center neo-text text-gray-500">
                        IMAGE
                      </div>
                    </div>
                    <CardContent className="p-6 flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="neo-heading text-2xl">{product.name}</h3>
                          <div className="flex items-center gap-1">
                            <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                            <span className="neo-text">{product.rating}</span>
                          </div>
                        </div>
                        <p className="neo-text text-gray-600 mb-4">by {product.vendor}</p>
                        <p className="neo-text text-gray-700">
                          LIFETIME ACCESS TO THIS AI AGENT. ONE-TIME PAYMENT, FOREVER USE.
                        </p>
                      </div>
                      <div className="flex justify-between items-center mt-4">
                        <span className="neo-heading text-3xl">${product.price}</span>
                        <Button className="group-hover:bg-pink-400 transition-colors">
                          ADD TO CART
                          <ShoppingCart className="w-5 h-5 ml-2" />
                        </Button>
                      </div>
                    </CardContent>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        )}

        {/* Pagination */}
        <div className="mt-12 flex justify-center gap-4">
          <Button variant="outline">PREV</Button>
          <Button variant="primary">1</Button>
          <Button variant="outline">2</Button>
          <Button variant="outline">3</Button>
          <Button variant="outline">NEXT</Button>
        </div>
      </div>
    </div>
  );
}
