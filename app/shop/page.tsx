"use client";

import { useState, useEffect } from "react";
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

  // Fetch agents from API
  useEffect(() => {
    const fetchAgents = async () => {
      try {
        setLoading(true);
        const params = new URLSearchParams();
        params.append("status", "ACTIVE");
        if (selectedCategory !== "all") {
          params.append("category", selectedCategory);
        }
        if (searchQuery) {
          params.append("search", searchQuery);
        }

        const response = await fetch(`/api/agents?${params.toString()}`);
        if (!response.ok) {
          throw new Error("Failed to fetch agents");
        }
        const data = await response.json();
        setAgents(data.agents || []);
        setError(null);
      } catch (err: any) {
        console.error("Error fetching agents:", err);
        setError(err.message || "Failed to load agents");
      } finally {
        setLoading(false);
      }
    };

    fetchAgents();
  }, [selectedCategory, searchQuery]);

  const filteredAgents = agents;

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
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
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
              {loading ? "LOADING..." : `${filteredAgents.length} AI AGENTS FOUND`}
            </p>
          </div>
        </div>

        {/* Error State */}
        {error && (
          <Card className="bg-red-400 mb-6">
            <CardContent className="p-6">
              <p className="neo-text text-white">ERROR: {error}</p>
            </CardContent>
          </Card>
        )}

        {/* Loading State */}
        {loading && (
          <div className="text-center py-12">
            <p className="neo-heading text-2xl">LOADING AI AGENTS...</p>
          </div>
        )}

        {/* Products Grid/List */}
        {!loading && !error && viewMode === "grid" ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredAgents.map((agent) => (
              <Link key={agent.id} href={`/product/${agent.id}`}>
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
                      <h3 className="neo-heading text-lg line-clamp-2">{agent.name}</h3>
                    </div>
                    <p className="neo-text text-gray-600 text-xs mb-1">
                      by {agent.vendor.companyName || agent.vendor.fullName}
                    </p>
                    <p className="neo-text text-xs text-gray-500 mb-3">
                      {agent.shortDescription || "LIFETIME ACCESS"}
                    </p>
                    <div className="flex justify-between items-center">
                      <div>
                        <span className="neo-heading text-2xl">${Number(agent.price).toFixed(0)}</span>
                        {agent.originalPrice && (
                          <span className="neo-text text-sm text-gray-500 line-through ml-2">
                            ${Number(agent.originalPrice).toFixed(0)}
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
            {filteredAgents.map((agent) => (
              <Link key={agent.id} href={`/product/${agent.id}`}>
                <Card className="cursor-pointer group">
                  <div className="flex gap-6">
                    <div className="w-48 h-48 bg-gray-200 relative flex-shrink-0">
                      {agent.imageUrl ? (
                        <img src={agent.imageUrl} alt={agent.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center neo-text text-gray-500">
                          IMAGE
                        </div>
                      )}
                    </div>
                    <CardContent className="p-6 flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="neo-heading text-2xl">{agent.name}</h3>
                        </div>
                        <p className="neo-text text-gray-600 mb-4">
                          by {agent.vendor.companyName || agent.vendor.fullName}
                        </p>
                        <p className="neo-text text-gray-700">
                          {agent.shortDescription || "LIFETIME ACCESS TO THIS AI AGENT. ONE-TIME PAYMENT, FOREVER USE."}
                        </p>
                      </div>
                      <div className="flex justify-between items-center mt-4">
                        <span className="neo-heading text-3xl">${Number(agent.price).toFixed(0)}</span>
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
