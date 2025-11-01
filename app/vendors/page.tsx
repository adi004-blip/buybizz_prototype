"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useUser } from "@clerk/nextjs";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Star, Store, Search, Loader2, ArrowRight } from "lucide-react";

interface Creator {
  id: string;
  name: string;
  email: string;
  totalProducts: number;
  totalSales: number;
  rating: number;
  totalReviews: number;
  verified: boolean;
  slug: string;
}

export default function VendorsPage() {
  const { user, isLoaded: userLoaded } = useUser();
  const [creators, setCreators] = useState<Creator[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [userRole, setUserRole] = useState<string | null>(null);
  const [roleLoading, setRoleLoading] = useState(true);

  // Fetch user role if authenticated
  useEffect(() => {
    const fetchUserRole = async () => {
      if (!userLoaded) return;
      
      if (user) {
        try {
          const response = await fetch("/api/user/role");
          if (response.ok) {
            const data = await response.json();
            setUserRole(data.role);
          }
        } catch (err) {
          console.error("Error fetching user role:", err);
        } finally {
          setRoleLoading(false);
        }
      } else {
        setRoleLoading(false);
      }
    };

    fetchUserRole();
  }, [user, userLoaded]);

  useEffect(() => {
    const fetchCreators = async () => {
      try {
        setLoading(true);
        const url = searchQuery 
          ? `/api/creators?search=${encodeURIComponent(searchQuery)}`
          : "/api/creators";
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error("Failed to fetch creators");
        }
        const data = await response.json();
        setCreators(data.creators || []);
      } catch (err: any) {
        console.error("Error fetching creators:", err);
        setError(err.message || "Failed to load creators");
      } finally {
        setLoading(false);
      }
    };

    fetchCreators();
  }, [searchQuery]);

  const colors = [
    "bg-yellow-400",
    "bg-pink-400",
    "bg-cyan-400",
    "bg-green-400",
    "bg-purple-400",
    "bg-orange-400",
  ];

  const getColor = (index: number) => colors[index % colors.length];

  const isVendorOrAdmin = userRole === "VENDOR" || userRole === "ADMIN";
  const showVendorButton = !isVendorOrAdmin && !roleLoading;

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="neo-heading text-5xl md:text-7xl mb-4">
            ALL <span className="text-cyan-500">CREATORS</span>
          </h1>
          <p className="neo-text text-xl text-gray-600">
            DISCOVER AMAZING CREATORS AND THEIR AI AGENTS
          </p>
        </div>

        {/* Search */}
        <div className="mb-8 flex gap-4">
          <div className="relative flex-1">
            <Input
              type="text"
              placeholder="SEARCH CREATORS..."
              className="pr-12"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Search className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500" />
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin mr-3" />
            <p className="neo-heading text-xl">LOADING CREATORS...</p>
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <Card className="mb-8 bg-red-400">
            <CardContent className="p-6 text-center">
              <p className="neo-text text-white">{error}</p>
            </CardContent>
          </Card>
        )}

        {/* Vendors Grid */}
        {!loading && !error && (
          <>
            {creators.length === 0 ? (
              <Card>
                <CardContent className="p-12 text-center">
                  <p className="neo-text text-gray-600">
                    {searchQuery ? "NO CREATORS FOUND MATCHING YOUR SEARCH" : "NO CREATORS FOUND"}
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {creators.map((creator, index) => (
                  <Link key={creator.id} href={`/creators/${creator.slug}`}>
                    <Card className={`${getColor(index)} cursor-pointer h-full`}>
                      <CardContent className="p-8">
                        <div className="flex items-center justify-between mb-4">
                          <div className="w-20 h-20 bg-black text-white neo-border neo-shadow-md flex items-center justify-center">
                            <span className="neo-heading text-3xl">{creator.name[0]}</span>
                          </div>
                          {creator.verified && (
                            <span className="bg-green-500 text-white px-3 py-1 neo-border text-xs neo-shadow-sm">
                              VERIFIED
                            </span>
                          )}
                        </div>
                        <h3 className="neo-heading text-2xl mb-2">{creator.name}</h3>
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center gap-1">
                            {creator.rating > 0 && (
                              <>
                                <Star className="w-5 h-5 fill-black text-black" />
                                <span className="neo-heading text-xl">{creator.rating.toFixed(1)}</span>
                                {creator.totalReviews > 0 && (
                                  <span className="neo-text text-gray-700">({creator.totalReviews})</span>
                                )}
                              </>
                            )}
                          </div>
                          <div className="text-right">
                            <p className="neo-heading text-xl">{creator.totalProducts}</p>
                            <p className="neo-text text-sm text-gray-700">AI AGENTS</p>
                          </div>
                        </div>
                        {creator.totalSales > 0 && (
                          <p className="neo-text text-sm text-gray-700 mb-4">
                            {creator.totalSales.toLocaleString()} SALES
                          </p>
                        )}
                        <Button variant="outline" className="w-full bg-black text-white border-white neo-shadow-md">
                          VIEW STORE
                        </Button>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            )}
          </>
        )}

        {/* Become a Vendor CTA - Only show if user is not vendor/admin */}
        {showVendorButton && (
          <Card className="mt-12 bg-black text-white">
            <CardContent className="p-12 text-center">
              <h2 className="neo-heading text-4xl mb-4 text-white">
                WANT TO BECOME A <span className="text-yellow-400">CREATOR?</span>
              </h2>
              <p className="neo-text text-xl mb-8 text-gray-300">
                JOIN OUR MARKETPLACE AND START SELLING YOUR AI AGENTS TODAY
              </p>
              <Link href={user ? "/vendor/register" : "/sign-in?redirect=/vendor/register"} className="inline-block">
                <Button size="lg" className="bg-yellow-400 text-black border-white neo-shadow-xl">
                  {user ? "APPLY NOW" : "SIGN IN TO APPLY"}
                </Button>
              </Link>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

