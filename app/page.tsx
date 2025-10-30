"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, Zap, Shield, Truck, Star } from "lucide-react";

export default function HomePage() {
  const featuredProducts = [
    {
      id: 1,
      name: "AI COPYWRITER PRO",
      price: "$97",
      originalPrice: "$297",
      image: "/api/placeholder/300/300",
      vendor: "AIWRITER",
      rating: 4.9,
      description: "LIFETIME ACCESS TO AI-POWERED COPYWRITING AGENT"
    },
    {
      id: 2,
      name: "CODE ASSISTANT AGENT",
      price: "$149",
      originalPrice: "$499",
      image: "/api/placeholder/300/300",
      vendor: "DEVTECH",
      rating: 4.8,
      description: "REVOLUTIONARY AI AGENT FOR FASTER CODING"
    },
    {
      id: 3,
      name: "SOCIAL MEDIA MANAGER AI",
      price: "$79",
      originalPrice: "$199",
      image: "/api/placeholder/300/300",
      vendor: "SOCIALAI",
      rating: 4.9,
      description: "AUTOMATE YOUR SOCIAL MEDIA WITH AI POWER"
    }
  ];

  const topCreators = [
    { name: "AIWRITER", products: 23, rating: 4.9, color: "bg-yellow-400", category: "WRITING AI" },
    { name: "DEVTECH", products: 15, rating: 4.8, color: "bg-pink-400", category: "DEVELOPMENT" },
    { name: "SOCIALAI", products: 18, rating: 4.9, color: "bg-cyan-400", category: "MARKETING" },
    { name: "DATABOT", products: 12, rating: 4.7, color: "bg-green-400", category: "ANALYTICS" }
  ];

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
            <Link href="/vendor/register">
              <Button variant="outline" size="lg" className="bg-white text-black border-black neo-shadow-xl">
                SELL YOUR AI AGENT
              </Button>
            </Link>
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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featuredProducts.map((product) => (
              <Link key={product.id} href={`/product/${product.id}`}>
                <Card className="overflow-hidden cursor-pointer h-full">
                  <div className="aspect-square bg-gradient-to-br from-purple-400 to-pink-400 relative flex items-center justify-center">
                    <div className="text-center px-4">
                      <div className="w-20 h-20 bg-black text-white neo-border neo-shadow-lg mx-auto mb-4 flex items-center justify-center">
                        <Zap className="w-10 h-10" />
                      </div>
                      <p className="neo-text text-white text-sm">AI AGENT</p>
                    </div>
                    {product.originalPrice && (
                      <div className="absolute top-4 right-4 bg-green-500 text-white neo-border px-3 py-1 neo-shadow-sm">
                        <span className="neo-text text-xs font-bold">LIFETIME</span>
                      </div>
                    )}
                  </div>
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="neo-heading text-xl">{product.name}</h3>
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span className="neo-text text-sm">{product.rating}</span>
                      </div>
                    </div>
                    <p className="neo-text text-gray-600 mb-2 text-sm">by {product.vendor}</p>
                    <p className="neo-text text-xs text-gray-500 mb-4">{product.description}</p>
                    <div className="flex justify-between items-center">
                      <div>
                        <span className="neo-heading text-2xl">{product.price}</span>
                        {product.originalPrice && (
                          <span className="neo-text text-sm text-gray-500 line-through ml-2">
                            {product.originalPrice}
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
        </div>
      </section>

      {/* Top Vendors */}
      <section className="py-20 px-4 bg-white">
        <div className="mx-auto max-w-7xl">
          <h2 className="neo-heading text-4xl md:text-6xl text-center mb-16">
            TOP <span className="text-purple-500">CREATORS</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {topCreators.map((creator) => (
              <Link key={creator.name} href={`/vendors/${creator.name.toLowerCase()}`}>
                <Card className={`${creator.color} text-center cursor-pointer`}>
                  <CardContent className="p-6">
                    <div className="w-16 h-16 bg-black text-white neo-border mx-auto mb-4 flex items-center justify-center">
                      <span className="neo-heading text-2xl">{creator.name[0]}</span>
                    </div>
                    <h3 className="neo-heading text-xl mb-1">{creator.name}</h3>
                    <p className="neo-text text-xs mb-2 text-gray-800">{creator.category}</p>
                    <p className="neo-text mb-2">{creator.products} AGENTS</p>
                    <div className="flex items-center justify-center gap-1">
                      <Star className="w-4 h-4 fill-black text-black" />
                      <span className="neo-text">{creator.rating}</span>
                    </div>
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

      {/* CTA Section */}
      <section className="py-20 px-4 bg-black text-white">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="neo-heading text-4xl md:text-6xl mb-6 text-white">
            HAVE AN <span className="text-yellow-400">AI AGENT</span> TO SELL?
          </h2>
          <p className="neo-text text-xl mb-8 text-gray-300">
            JOIN THOUSANDS OF CREATORS SELLING LIFETIME DEALS ON BUYBIZZ
          </p>
          <Link href="/vendor/register">
            <Button size="lg" className="bg-yellow-400 text-black border-white neo-shadow-xl">
              LIST YOUR AI AGENT
              <ArrowRight className="ml-2 w-6 h-6" />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}