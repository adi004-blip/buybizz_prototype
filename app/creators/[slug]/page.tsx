"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Star, Globe, Mail, Zap, Loader2 } from "lucide-react";

interface Creator {
  id: string;
  name: string;
  email: string;
  fullName: string;
  companyName: string | null;
  bio: string | null;
  slug: string;
  rating: number;
  totalReviews: number;
  totalProducts: number;
  totalSales: number;
  totalRevenue: string;
  verified: boolean;
  joinedDate: string;
  website: string | null;
}

interface Product {
  id: string;
  name: string;
  description: string;
  shortDescription: string | null;
  price: string;
  originalPrice: string | null;
  imageUrl: string | null;
  category: string | null;
  tags: string | null;
  features: string[];
  rating: number;
  sales: number;
  createdAt: string;
}

export default function CreatorProfilePage({ params }: { params: { slug: string } }) {
  const router = useRouter();
  const [creator, setCreator] = useState<Creator | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCreator = async () => {
      try {
        setLoading(true);
        // Try to fetch by slug (which is the user ID)
        const response = await fetch(`/api/creators/${params.slug}`);
        if (!response.ok) {
          if (response.status === 404) {
            setError("Creator not found");
            return;
          }
          throw new Error("Failed to fetch creator");
        }
        const data = await response.json();
        setCreator(data);
        setProducts(data.products || []);
      } catch (err: any) {
        console.error("Error fetching creator:", err);
        setError(err.message || "Failed to load creator");
      } finally {
        setLoading(false);
      }
    };

    fetchCreator();
  }, [params.slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8 px-4 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4" />
          <p className="neo-heading text-2xl">LOADING CREATOR...</p>
        </div>
      </div>
    );
  }

  if (error || !creator) {
    return (
      <div className="min-h-screen bg-gray-50 py-8 px-4 flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="p-8 text-center">
            <h2 className="neo-heading text-2xl mb-4">CREATOR NOT FOUND</h2>
            <p className="neo-text text-gray-600 mb-6">{error || "This creator does not exist"}</p>
            <Link href="/vendors">
              <Button>BROWSE ALL CREATORS</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

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
                {creator.bio && (
                  <p className="neo-text text-lg mb-4">{creator.bio}</p>
                )}
                <div className="flex flex-wrap gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <Star className="w-5 h-5 fill-black text-black" />
                    <span className="neo-heading">{creator.rating.toFixed(1)}</span>
                    {creator.totalReviews > 0 && (
                      <span className="neo-text text-gray-700">({creator.totalReviews} REVIEWS)</span>
                    )}
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
              <h3 className="neo-heading text-3xl mb-1">{creator.rating.toFixed(1)}</h3>
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
        {(creator.website || creator.email) && (
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
        )}

        {/* Products */}
        <div className="mb-8">
          <h2 className="neo-heading text-4xl mb-6">
            AI AGENTS BY <span className="text-pink-500">{creator.name}</span>
          </h2>
          {products.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <p className="neo-text text-gray-600">NO PRODUCTS AVAILABLE YET</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product) => (
                <Link key={product.id} href={`/product/${product.id}`}>
                  <Card className="cursor-pointer h-full">
                    <div className="aspect-square bg-gradient-to-br from-purple-400 to-pink-400 relative flex items-center justify-center">
                      {product.imageUrl ? (
                        <img 
                          src={product.imageUrl} 
                          alt={product.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="text-center">
                          <div className="w-16 h-16 bg-black text-white neo-border neo-shadow-lg mx-auto mb-3 flex items-center justify-center">
                            <span className="neo-heading text-2xl">AI</span>
                          </div>
                          <p className="neo-text text-white text-xs">AGENT</p>
                        </div>
                      )}
                      <div className="absolute top-4 right-4 bg-green-500 text-white neo-border px-3 py-1 neo-shadow-sm">
                        <span className="neo-text text-xs font-bold">LIFETIME</span>
                      </div>
                    </div>
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="neo-heading text-lg">{product.name}</h3>
                        {product.rating > 0 && (
                          <div className="flex items-center gap-1">
                            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                            <span className="neo-text text-sm">{product.rating.toFixed(1)}</span>
                          </div>
                        )}
                      </div>
                      <p className="neo-text text-xs text-gray-500 mb-3">
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
                        <Button size="sm">VIEW</Button>
                      </div>
                      {product.sales > 0 && (
                        <p className="neo-text text-xs text-gray-600 mt-2">
                          {product.sales.toLocaleString()} SALES
                        </p>
                      )}
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          )}
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
