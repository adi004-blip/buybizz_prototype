"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Star, Globe, Mail, Zap } from "lucide-react";

export default function CreatorProfilePage({ params }: { params: { slug: string } }) {
  // Mock creator data - in real app, fetch from API
  const creator = {
    slug: params.slug,
    name: "AIWRITER",
    bio: "WE CREATE POWERFUL AI AGENTS THAT HELP BUSINESSES AUTOMATE THEIR WRITING TASKS. FOUNDED IN 2023, WE'VE HELPED THOUSANDS OF COMPANIES IMPROVE THEIR CONTENT.",
    rating: 4.9,
    totalReviews: 342,
    totalProducts: 23,
    totalSales: 2847,
    website: "https://aiwriter.com",
    email: "contact@aiwriter.com",
    verified: true,
    joinedDate: "2023-01-15"
  };

  const products = [
    {
      id: 1,
      name: "AI COPYWRITER PRO",
      price: 97,
      originalPrice: 297,
      rating: 4.9,
      sales: 1234,
      description: "LIFETIME ACCESS TO AI-POWERED COPYWRITING AGENT"
    },
    {
      id: 2,
      name: "EMAIL WRITER AGENT",
      price: 59,
      originalPrice: 149,
      rating: 4.8,
      sales: 892,
      description: "AUTOMATE YOUR EMAIL WRITING WITH AI"
    },
    {
      id: 3,
      name: "BLOG POST GENERATOR",
      price: 79,
      originalPrice: 199,
      rating: 4.9,
      sales: 721,
      description: "CREATE ENGAGING BLOG POSTS IN MINUTES"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="mx-auto max-w-7xl">
        {/* Creator Header */}
        <Card className="mb-8 bg-gradient-to-br from-yellow-400 via-pink-400 to-cyan-400">
          <CardContent className="p-8">
            <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
              <div className="w-32 h-32 bg-black text-white neo-border neo-shadow-lg flex items-center justify-center flex-shrink-0">
                <span className="neo-heading text-5xl">{creator.name[0]}</span>
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h1 className="neo-heading text-4xl md:text-6xl">{creator.name}</h1>
                  {creator.verified && (
                    <span className="bg-green-500 text-white px-3 py-1 neo-border text-sm neo-shadow-sm">
                      VERIFIED
                    </span>
                  )}
                </div>
                <p className="neo-text text-lg mb-4">{creator.bio}</p>
                <div className="flex flex-wrap gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <Star className="w-5 h-5 fill-black text-black" />
                    <span className="neo-heading">{creator.rating}</span>
                    <span className="neo-text text-gray-700">({creator.totalReviews} REVIEWS)</span>
                  </div>
                  <div>
                    <span className="neo-heading">{creator.totalProducts}</span>
                    <span className="neo-text text-gray-700"> AI AGENTS</span>
                  </div>
                  <div>
                    <span className="neo-heading">{creator.totalSales.toLocaleString()}</span>
                    <span className="neo-text text-gray-700"> SALES</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-yellow-400">
            <CardContent className="p-6 text-center">
              <Zap className="w-8 h-8 mx-auto mb-2" />
              <h3 className="neo-heading text-3xl mb-1">{creator.totalProducts}</h3>
              <p className="neo-text">AI AGENTS</p>
            </CardContent>
          </Card>
          <Card className="bg-pink-400">
            <CardContent className="p-6 text-center">
              <Star className="w-8 h-8 mx-auto mb-2" />
              <h3 className="neo-heading text-3xl mb-1">{creator.rating}</h3>
              <p className="neo-text">AVG RATING</p>
            </CardContent>
          </Card>
          <Card className="bg-cyan-400">
            <CardContent className="p-6 text-center">
              <span className="neo-heading text-3xl mb-1 block">{creator.totalSales.toLocaleString()}</span>
              <p className="neo-text">TOTAL SALES</p>
            </CardContent>
          </Card>
          <Card className="bg-green-400">
            <CardContent className="p-6 text-center">
              <span className="neo-heading text-3xl mb-1 block">{creator.totalReviews}</span>
              <p className="neo-text">REVIEWS</p>
            </CardContent>
          </Card>
        </div>

        {/* Contact Info */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <h2 className="neo-heading text-2xl mb-4">CONTACT</h2>
            <div className="flex flex-wrap gap-4">
              {creator.website && (
                <a
                  href={creator.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 neo-text hover:text-pink-500 transition-colors"
                >
                  <Globe className="w-5 h-5" />
                  VISIT WEBSITE
                </a>
              )}
              {creator.email && (
                <a
                  href={`mailto:${creator.email}`}
                  className="flex items-center gap-2 neo-text hover:text-pink-500 transition-colors"
                >
                  <Mail className="w-5 h-5" />
                  {creator.email}
                </a>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Products */}
        <div className="mb-8">
          <h2 className="neo-heading text-4xl mb-6">
            AI AGENTS BY <span className="text-pink-500">{creator.name}</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
              <Link key={product.id} href={`/product/${product.id}`}>
                <Card className="cursor-pointer h-full">
                  <div className="aspect-square bg-gradient-to-br from-purple-400 to-pink-400 relative flex items-center justify-center">
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
                      <h3 className="neo-heading text-lg">{product.name}</h3>
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span className="neo-text text-sm">{product.rating}</span>
                      </div>
                    </div>
                    <p className="neo-text text-xs text-gray-500 mb-3">{product.description}</p>
                    <div className="flex justify-between items-center">
                      <div>
                        <span className="neo-heading text-2xl">${product.price}</span>
                        <span className="neo-text text-sm text-gray-500 line-through ml-2">
                          ${product.originalPrice}
                        </span>
                      </div>
                      <Button size="sm">VIEW</Button>
                    </div>
                    <p className="neo-text text-xs text-gray-600 mt-2">
                      {product.sales.toLocaleString()} SALES
                    </p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>

        {/* Follow CTA */}
        <Card className="bg-black text-white text-center">
          <CardContent className="p-12">
            <h2 className="neo-heading text-3xl mb-4">
              FOLLOW {creator.name} FOR UPDATES
            </h2>
            <p className="neo-text text-gray-300 mb-6">
              GET NOTIFIED WHEN THEY RELEASE NEW AI AGENTS
            </p>
            <Button size="lg" className="bg-yellow-400 text-black">
              FOLLOW CREATOR
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
