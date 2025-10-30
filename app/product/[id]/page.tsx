"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Star, ShoppingCart, Heart, Share2, Truck, Shield, RotateCcw, ChevronLeft, ChevronRight } from "lucide-react";

export default function ProductPage({ params }: { params: { id: string } }) {
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);

  // Mock product data - in real app, fetch from API
  const product = {
    id: params.id,
    name: "WIRELESS HEADPHONES PRO",
    price: 199,
    originalPrice: 249,
    vendor: {
      name: "TECHBEAST",
      rating: 4.9,
      products: 156,
      verified: true
    },
    rating: 4.8,
    reviews: 342,
    description: "PREMIUM WIRELESS HEADPHONES WITH ACTIVE NOISE CANCELLATION. PERFECT FOR MUSIC LOVERS WHO DEMAND THE BEST. FEATURES 30-HOUR BATTERY LIFE, PREMIUM SOUND QUALITY, AND COMFORTABLE DESIGN.",
    features: [
      "ACTIVE NOISE CANCELLATION",
      "30-HOUR BATTERY LIFE",
      "PREMIUM SOUND QUALITY",
      "COMFORTABLE DESIGN",
      "WIRELESS CONNECTIVITY"
    ],
    images: [
      "/api/placeholder/800/800",
      "/api/placeholder/800/800",
      "/api/placeholder/800/800",
      "/api/placeholder/800/800"
    ],
    inStock: true,
    stock: 47,
    category: "Electronics"
  };

  const relatedProducts = [
    { id: 2, name: "SMART WATCH", price: 299, vendor: "FUTURETECH", rating: 4.7 },
    { id: 3, name: "WIRELESS CHARGER", price: 39, vendor: "TECHBEAST", rating: 4.5 },
    { id: 4, name: "BLUETOOTH SPEAKER", price: 129, vendor: "TECHBEAST", rating: 4.6 }
  ];

  return (
    <div className="min-h-screen bg-white py-8 px-4">
      <div className="mx-auto max-w-7xl">
        {/* Breadcrumb */}
        <div className="mb-6 flex items-center gap-2 text-sm">
          <Link href="/" className="neo-text hover:text-pink-500">HOME</Link>
          <span>/</span>
          <Link href="/shop" className="neo-text hover:text-pink-500">SHOP</Link>
          <span>/</span>
          <span className="neo-text text-gray-600">{product.category}</span>
          <span>/</span>
          <span className="neo-text">{product.name}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          {/* Product Images */}
          <div>
            <div className="aspect-square bg-gray-200 mb-4 relative neo-border neo-shadow-lg overflow-hidden">
              <div className="absolute inset-0 flex items-center justify-center neo-text text-gray-500 text-xl">
                PRODUCT IMAGE {selectedImage + 1}
              </div>
              <button
                onClick={() => setSelectedImage(Math.max(0, selectedImage - 1))}
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-white neo-border p-3 neo-shadow-md hover:bg-yellow-400 transition-colors"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button
                onClick={() => setSelectedImage(Math.min(product.images.length - 1, selectedImage + 1))}
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-white neo-border p-3 neo-shadow-md hover:bg-yellow-400 transition-colors"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </div>
            <div className="grid grid-cols-4 gap-4">
              {product.images.map((_, index) => (
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
          </div>

          {/* Product Info */}
          <div>
            <div className="mb-4">
              <span className="neo-text text-pink-500 uppercase tracking-wide">{product.category}</span>
            </div>
            <h1 className="neo-heading text-4xl md:text-5xl mb-4">{product.name}</h1>
            
            {/* Rating */}
            <div className="flex items-center gap-4 mb-6">
              <div className="flex items-center gap-2">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-5 h-5 ${
                        i < Math.floor(product.rating)
                          ? "fill-yellow-400 text-yellow-400"
                          : "text-gray-300"
                      }`}
                    />
                  ))}
                </div>
                <span className="neo-text text-lg">{product.rating}</span>
              </div>
              <span className="neo-text text-gray-600">({product.reviews} REVIEWS)</span>
            </div>

            {/* Price */}
            <div className="mb-6">
              <div className="flex items-baseline gap-4">
                <span className="neo-heading text-5xl">${product.price}</span>
                <span className="neo-text text-2xl text-gray-500 line-through">${product.originalPrice}</span>
                <span className="neo-text text-xl bg-red-500 text-white px-3 py-1 neo-border neo-shadow-sm">
                  SAVE ${product.originalPrice - product.price}
                </span>
              </div>
            </div>

            {/* Vendor Info */}
            <Card className="mb-6 bg-yellow-400">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <Link href={`/vendor/${product.vendor.name}`} className="neo-heading text-xl hover:underline">
                        {product.vendor.name}
                      </Link>
                      {product.vendor.verified && (
                        <span className="bg-green-500 text-white px-2 py-1 neo-border text-xs neo-shadow-sm">
                          VERIFIED
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <Star className="w-4 h-4 fill-black text-black" />
                      <span className="neo-text">{product.vendor.rating}</span>
                      <span className="neo-text text-gray-700">• {product.vendor.products} PRODUCTS</span>
                    </div>
                  </div>
                  <Link href={`/vendor/${product.vendor.name}`}>
                    <Button variant="outline" size="sm" className="bg-black text-white border-white">
                      VIEW STORE
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>

            {/* Stock Status */}
            <div className="mb-6">
              {product.inStock ? (
                <p className="neo-text text-green-600">
                  ✓ IN STOCK - {product.stock} AVAILABLE
                </p>
              ) : (
                <p className="neo-text text-red-600">✗ OUT OF STOCK</p>
              )}
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
            <p className="neo-text text-lg leading-relaxed">{product.description}</p>
          </CardContent>
        </Card>

        {/* Related Products */}
        <div>
          <h2 className="neo-heading text-4xl mb-8">RELATED PRODUCTS</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {relatedProducts.map((related) => (
              <Link key={related.id} href={`/product/${related.id}`}>
                <Card className="cursor-pointer overflow-hidden">
                  <div className="aspect-square bg-gray-200 relative">
                    <div className="absolute inset-0 flex items-center justify-center neo-text text-gray-500">
                      PRODUCT IMAGE
                    </div>
                  </div>
                  <CardContent className="p-6">
                    <h3 className="neo-heading text-xl mb-2">{related.name}</h3>
                    <p className="neo-text text-gray-600 mb-2">by {related.vendor}</p>
                    <div className="flex justify-between items-center">
                      <span className="neo-heading text-2xl">${related.price}</span>
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span className="neo-text text-sm">{related.rating}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
