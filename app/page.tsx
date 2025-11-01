"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useUser } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, Zap, Shield, Star, Loader2 } from "lucide-react";

interface Agent {
  id: string;
  name: string;
  price: string;
  originalPrice: string | null;
  imageUrl: string | null;
  vendor: {
    id: string;
    fullName: string;
    companyName: string | null;
  };
  shortDescription: string | null;
  description: string;
}

interface Creator {
  id: string;
  name: string;
  totalProducts: number;
  rating: number;
  slug: string;
}

export default function HomePage() {
  const { user, isLoaded: userLoaded } = useUser();
  const [featuredProducts, setFeaturedProducts] = useState<Agent[]>([]);
  const [topCreators, setTopCreators] = useState<Creator[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
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
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch featured products (latest 3 active agents)
        const productsResponse = await fetch("/api/agents?status=ACTIVE&limit=3");
        if (productsResponse.ok) {
          const productsData = await productsResponse.json();
          setFeaturedProducts(productsData.agents || []);
        }

        // Fetch top creators (limit to 4)
        const creatorsResponse = await fetch("/api/creators");
        if (creatorsResponse.ok) {
          const creatorsData = await creatorsResponse.json();
          // Sort by totalProducts and take top 4
          const sorted = (creatorsData.creators || []).sort((a: Creator, b: Creator) => b.totalProducts - a.totalProducts).slice(0, 4);
          setTopCreators(sorted);
        }

        setError(null);
      } catch (err: any) {
        console.error("Error fetching homepage data:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const colors = ["bg-yellow-400", "bg-pink-400", "bg-cyan-400", "bg-green-400"];

  // Determine if user should see vendor buttons
  const isVendorOrAdmin = userRole === "VENDOR" || userRole === "ADMIN";
  const showVendorButton = !isVendorOrAdmin && !roleLoading;

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-yellow-400 via-pink-400 to-cyan-400 py-20 px-4">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative mx-auto max-w-7xl text-center">
          <h1 className="neo-heading text-5xl md:text-7xl text-black mb-6">
            UNLOCK AI AGENTS
            <br />
            <span className="text-white neo-shadow-xl">FOR LIFE</span>
          </h1>
          <p className="neo-text text-xl md:text-2xl text-black mb-8 max-w-3xl mx-auto">
            DISCOVER LIFETIME DEALS ON CUTTING-EDGE AI AGENTS. ONE-TIME PAYMENT, FOREVER ACCESS.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/shop">
              <Button size="lg" className="bg-black text-white border-white neo-shadow-xl">
                BROWSE AI AGENTS
                <ArrowRight className="ml-2 w-6 h-6" />
              </Button>
            </Link>
            {showVendorButton && (
              <Link href={user ? "/vendor/register" : "/sign-in?redirect=/vendor/register"}>
                <Button variant="outline" size="lg" className="bg-white text-black border-black neo-shadow-xl">
                  {user ? "BECOME A VENDOR" : "APPLY TO BECOME A VENDOR"}
                </Button>
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-4 bg-white">
        <div className="mx-auto max-w-7xl">
          <h2 className="neo-heading text-4xl md:text-6xl text-center mb-16">
            WHY CHOOSE <span className="text-pink-500">BUYBIZZ?</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="text-center bg-yellow-400">
              <CardContent className="p-8">
                <Zap className="w-16 h-16 mx-auto mb-4" />
                <h3 className="neo-heading text-2xl mb-4">LIFETIME ACCESS</h3>
                <p className="neo-text">ONE-TIME PAYMENT, USE FOREVER. NO SUBSCRIPTIONS, NO HIDDEN FEES</p>
              </CardContent>
            </Card>
            <Card className="text-center bg-pink-400">
              <CardContent className="p-8">
                <Shield className="w-16 h-16 mx-auto mb-4" />
                <h3 className="neo-heading text-2xl mb-4">INSTANT DELIVERY</h3>
                <p className="neo-text">GET YOUR AI AGENT IMMEDIATELY AFTER PURCHASE. NO WAITING</p>
              </CardContent>
            </Card>
            <Card className="text-center bg-cyan-400">
              <CardContent className="p-8">
                <Star className="w-16 h-16 mx-auto mb-4" />
                <h3 className="neo-heading text-2xl mb-4">VETTED CREATORS</h3>
                <p className="neo-text">ALL AI AGENTS VERIFIED BY OUR TEAM. QUALITY GUARANTEED</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-20 px-4 bg-gray-100">
        <div className="mx-auto max-w-7xl">
          <div className="flex justify-between items-center mb-16">
            <h2 className="neo-heading text-4xl md:text-6xl">
              FEATURED <span className="text-green-500">AI AGENTS</span>
            </h2>
            <Link href="/shop">
              <Button variant="outline">
                VIEW ALL
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
          </div>
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin mr-3" />
              <p className="neo-heading text-xl">LOADING AI AGENTS...</p>
            </div>
          ) : error ? (
            <Card className="bg-red-400">
              <CardContent className="p-6 text-center">
                <p className="neo-text text-white">{error}</p>
              </CardContent>
            </Card>
          ) : featuredProducts.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <p className="neo-text text-gray-600">NO AI AGENTS AVAILABLE YET</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {featuredProducts.map((product) => (
                <Link key={product.id} href={`/product/${product.id}`}>
                  <Card className="overflow-hidden cursor-pointer h-full">
                    <div className="aspect-square bg-gradient-to-br from-purple-400 to-pink-400 relative flex items-center justify-center">
                      {product.imageUrl ? (
                        <img 
                          src={product.imageUrl} 
                          alt={product.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="text-center px-4">
                          <div className="w-20 h-20 bg-black text-white neo-border neo-shadow-lg mx-auto mb-4 flex items-center justify-center">
                            <Zap className="w-10 h-10" />
                          </div>
                          <p className="neo-text text-white text-sm">AI AGENT</p>
                        </div>
                      )}
                      {product.originalPrice && (
                        <div className="absolute top-4 right-4 bg-green-500 text-white neo-border px-3 py-1 neo-shadow-sm">
                          <span className="neo-text text-xs font-bold">LIFETIME</span>
                        </div>
                      )}
                    </div>
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="neo-heading text-xl">{product.name}</h3>
                      </div>
                      <p className="neo-text text-gray-600 mb-2 text-sm">
                        by {product.vendor.companyName || product.vendor.fullName}
                      </p>
                      <p className="neo-text text-xs text-gray-500 mb-4">
                        {product.shortDescription || product.description.substring(0, 80)}...
                      </p>
                      <div className="flex justify-between items-center">
                        <div>
                          <span className="neo-heading text-2xl">${Number(product.price).toFixed(0)}</span>
                          {product.originalPrice && (
                            <span className="neo-text text-sm text-gray-500 line-through ml-2">
                              ${Number(product.originalPrice).toFixed(0)}
                            </span>
                          )}
                        </div>
                        <Button size="sm">UNLOCK</Button>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Top Creators */}
      {topCreators.length > 0 && (
        <section className="py-20 px-4 bg-white">
          <div className="mx-auto max-w-7xl">
            <h2 className="neo-heading text-4xl md:text-6xl text-center mb-16">
              TOP <span className="text-purple-500">CREATORS</span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {topCreators.map((creator, index) => (
                <Link key={creator.id} href={`/creators/${creator.slug}`}>
                  <Card className={`${colors[index % colors.length]} text-center cursor-pointer`}>
                    <CardContent className="p-6">
                      <div className="w-16 h-16 bg-black text-white neo-border mx-auto mb-4 flex items-center justify-center">
                        <span className="neo-heading text-2xl">{creator.name[0]}</span>
                      </div>
                      <h3 className="neo-heading text-xl mb-1">{creator.name}</h3>
                      <p className="neo-text mb-2">{creator.totalProducts} AGENTS</p>
                      {creator.rating > 0 && (
                        <div className="flex items-center justify-center gap-1">
                          <Star className="w-4 h-4 fill-black text-black" />
                          <span className="neo-text">{creator.rating.toFixed(1)}</span>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
            <div className="text-center mt-12">
              <Link href="/vendors">
                <Button variant="outline" size="lg">
                  VIEW ALL CREATORS
                  <ArrowRight className="ml-2 w-6 h-6" />
                </Button>
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* CTA Section - Only show if user is not vendor/admin */}
      {showVendorButton && (
        <section className="py-20 px-4 bg-black text-white">
          <div className="mx-auto max-w-4xl text-center">
            <h2 className="neo-heading text-4xl md:text-6xl mb-6 text-white">
              HAVE AN <span className="text-yellow-400">AI AGENT</span> TO SELL?
            </h2>
            <p className="neo-text text-xl mb-8 text-gray-300">
              JOIN THOUSANDS OF CREATORS SELLING LIFETIME DEALS ON BUYBIZZ
            </p>
            <Link href={user ? "/vendor/register" : "/sign-in?redirect=/vendor/register"}>
              <Button size="lg" className="bg-yellow-400 text-black border-white neo-shadow-xl">
                {user ? "LIST YOUR AI AGENT" : "APPLY TO BECOME A VENDOR"}
                <ArrowRight className="ml-2 w-6 h-6" />
              </Button>
            </Link>
          </div>
        </section>
      )}
    </div>
  );
}
