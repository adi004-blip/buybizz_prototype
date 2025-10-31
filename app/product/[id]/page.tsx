"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Star, ShoppingCart, Heart, Share2, Truck, Shield, RotateCcw, ChevronLeft, ChevronRight } from "lucide-react";

interface Agent {
  id: string;
  name: string;
  description: string;
  shortDescription: string | null;
  price: number;
  originalPrice: number | null;
  category: string | null;
  features: string[];
  imageUrl: string | null;
  demoUrl: string | null;
  documentationUrl: string | null;
  vendor: {
    id: string;
    fullName: string;
    companyName: string | null;
  };
}

export default function ProductPage() {
  const params = useParams();
  const id = params.id as string;
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [product, setProduct] = useState<Agent | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/agents/${id}`);
        if (!response.ok) {
          throw new Error("Failed to fetch product");
        }
        const data = await response.json();
        setProduct(data);
        setError(null);
      } catch (err: any) {
        console.error("Error fetching product:", err);
        setError(err.message || "Failed to load product");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProduct();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white py-8 px-4 flex items-center justify-center">
        <div className="text-center">
          <p className="neo-heading text-4xl mb-4">LOADING PRODUCT...</p>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-white py-8 px-4 flex items-center justify-center">
        <div className="text-center">
          <p className="neo-heading text-4xl mb-4 text-red-500">ERROR</p>
          <p className="neo-text text-xl">{error || "Product not found"}</p>
          <Link href="/shop">
            <Button className="mt-4">BACK TO SHOP</Button>
          </Link>
        </div>
      </div>
    );
  }

  const images = product.imageUrl ? [product.imageUrl] : [];

  return (
    <div className="min-h-screen bg-white py-8 px-4">
      <div className="mx-auto max-w-7xl">
        {/* Breadcrumb */}
        <div className="mb-6 flex items-center gap-2 text-sm">
          <Link href="/" className="neo-text hover:text-pink-500">HOME</Link>
          <span>/</span>
          <Link href="/shop" className="neo-text hover:text-pink-500">SHOP</Link>
          <span>/</span>
          <span className="neo-text text-gray-600">{product.category?.toUpperCase() || "AI AGENTS"}</span>
          <span>/</span>
          <span className="neo-text">{product.name}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          {/* Product Images */}
          <div>
            <div className="aspect-square bg-gray-200 mb-4 relative neo-border neo-shadow-lg overflow-hidden">
              {product.imageUrl ? (
                <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover" />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center neo-text text-gray-500 text-xl">
                  PRODUCT IMAGE
                </div>
              )}
              {images.length > 1 && (
                <>
                  <button
                    onClick={() => setSelectedImage(Math.max(0, selectedImage - 1))}
                    className="absolute left-4 top-1/2 -translate-y-1/2 bg-white neo-border p-3 neo-shadow-md hover:bg-yellow-400 transition-colors"
                  >
                    <ChevronLeft className="w-6 h-6" />
                  </button>
                  <button
                    onClick={() => setSelectedImage(Math.min(images.length - 1, selectedImage + 1))}
                    className="absolute right-4 top-1/2 -translate-y-1/2 bg-white neo-border p-3 neo-shadow-md hover:bg-yellow-400 transition-colors"
                  >
                    <ChevronRight className="w-6 h-6" />
                  </button>
                </>
              )}
            </div>
            {images.length > 1 && (
            <div className="grid grid-cols-4 gap-4">
              {images.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`aspect-square bg-gray-200 neo-border ${
                    selectedImage === index ? "neo-shadow-md ring-4 ring-yellow-400" : ""
                  }`}
                >
                  <div className="w-full h-full flex items-center justify-center neo-text text-xs">
                    {index + 1}
                  </div>
                </button>
              ))}
            </div>
            )}
          </div>

          {/* Product Info */}
          <div>
            <div className="mb-4">
              <span className="neo-text text-pink-500 uppercase tracking-wide">{product.category}</span>
            </div>
            <h1 className="neo-heading text-4xl md:text-5xl mb-4">{product.name}</h1>
            

            {/* Price */}
            <div className="mb-6">
              <div className="flex items-baseline gap-4">
                <span className="neo-heading text-5xl">${Number(product.price).toFixed(0)}</span>
                {product.originalPrice && (
                  <>
                    <span className="neo-text text-2xl text-gray-500 line-through">${Number(product.originalPrice).toFixed(0)}</span>
                    <span className="neo-text text-xl bg-red-500 text-white px-3 py-1 neo-border neo-shadow-sm">
                      SAVE ${Number(product.originalPrice - product.price).toFixed(0)}
                    </span>
                  </>
                )}
              </div>
            </div>

            {/* Vendor Info */}
            <Card className="mb-6 bg-yellow-400">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <Link href={`/creators/${product.vendor.id}`} className="neo-heading text-xl hover:underline">
                        {product.vendor.companyName || product.vendor.fullName}
                      </Link>
                    </div>
                  </div>
                  <Link href={`/creators/${product.vendor.id}`}>
                    <Button variant="outline" size="sm" className="bg-black text-white border-white">
                      VIEW STORE
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>

            {/* Status */}
            <div className="mb-6">
              <p className="neo-text text-green-600">
                ✓ LIFETIME ACCESS - ONE-TIME PAYMENT
              </p>
            </div>

            {/* Quantity & Add to Cart */}
            <div className="mb-8 space-y-4">
              <div className="flex items-center gap-4">
                <label className="neo-text text-lg">QUANTITY:</label>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  >
                    -
                  </Button>
                  <Input
                    type="number"
                    value={quantity}
                    onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                    className="w-20 text-center"
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setQuantity(quantity + 1)}
                  >
                    +
                  </Button>
                </div>
              </div>
              <div className="flex gap-4">
                <Button size="lg" className="flex-1 bg-black text-white border-white neo-shadow-xl">
                  <ShoppingCart className="w-6 h-6 mr-2" />
                  ADD TO CART
                </Button>
                <Button variant="secondary" size="lg">
                  <Heart className="w-6 h-6" />
                </Button>
                <Button variant="accent" size="lg">
                  <Share2 className="w-6 h-6" />
                </Button>
              </div>
            </div>

            {/* Features */}
            {product.features && product.features.length > 0 && (
              <Card className="mb-6">
                <CardContent className="p-6">
                  <h3 className="neo-heading text-xl mb-4">KEY FEATURES</h3>
                  <ul className="space-y-2">
                    {product.features.map((feature, index) => (
                      <li key={index} className="flex items-center gap-2">
                        <span className="text-yellow-400 neo-text">✓</span>
                        <span className="neo-text">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}

            {/* Shipping Info */}
            <div className="grid grid-cols-3 gap-4">
              <Card className="bg-cyan-400 text-center">
                <CardContent className="p-4">
                  <Truck className="w-8 h-8 mx-auto mb-2" />
                  <p className="neo-text text-sm">FREE SHIPPING</p>
                </CardContent>
              </Card>
              <Card className="bg-green-400 text-center">
                <CardContent className="p-4">
                  <Shield className="w-8 h-8 mx-auto mb-2" />
                  <p className="neo-text text-sm">SECURE PAYMENT</p>
                </CardContent>
              </Card>
              <Card className="bg-pink-400 text-center">
                <CardContent className="p-4">
                  <RotateCcw className="w-8 h-8 mx-auto mb-2" />
                  <p className="neo-text text-sm">30-DAY RETURNS</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        {/* Description */}
        <Card className="mb-16">
          <CardContent className="p-8">
            <h2 className="neo-heading text-3xl mb-6">PRODUCT DESCRIPTION</h2>
            <p className="neo-text text-lg leading-relaxed whitespace-pre-wrap">{product.description}</p>
            {product.documentationUrl && (
              <div className="mt-6">
                <a href={product.documentationUrl} target="_blank" rel="noopener noreferrer">
                  <Button variant="primary">VIEW DOCUMENTATION</Button>
                </a>
              </div>
            )}
            {product.demoUrl && (
              <div className="mt-4">
                <a href={product.demoUrl} target="_blank" rel="noopener noreferrer">
                  <Button variant="outline">TRY DEMO</Button>
                </a>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
