"use client";

import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Star, Store, Search } from "lucide-react";

export default function VendorsPage() {
  const vendors = [
    { 
      id: 1, 
      name: "TECHBEAST", 
      products: 156, 
      rating: 4.9, 
      reviews: 342,
      description: "PREMIUM ELECTRONICS AND TECH GADGETS",
      color: "bg-yellow-400",
      verified: true
    },
    { 
      id: 2, 
      name: "RETROWAVE", 
      products: 89, 
      rating: 4.8, 
      reviews: 234,
      description: "VINTAGE FASHION AND RETRO STYLE",
      color: "bg-pink-400",
      verified: true
    },
    { 
      id: 3, 
      name: "FUTURETECH", 
      products: 234, 
      rating: 4.7, 
      reviews: 567,
      description: "CUTTING-EDGE TECHNOLOGY AND INNOVATION",
      color: "bg-cyan-400",
      verified: true
    },
    { 
      id: 4, 
      name: "URBANSTYLE", 
      products: 67, 
      rating: 4.9, 
      reviews: 189,
      description: "MODERN URBAN FASHION AND LIFESTYLE",
      color: "bg-green-400",
      verified: true
    },
    { 
      id: 5, 
      name: "HOMEDECO", 
      products: 123, 
      rating: 4.6, 
      reviews: 278,
      description: "HOME DECOR AND FURNITURE",
      color: "bg-purple-400",
      verified: true
    },
    { 
      id: 6, 
      name: "SPORTMAX", 
      products: 98, 
      rating: 4.8, 
      reviews: 145,
      description: "SPORTS EQUIPMENT AND FITNESS GEAR",
      color: "bg-orange-400",
      verified: true
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="neo-heading text-5xl md:text-7xl mb-4">
            ALL <span className="text-cyan-500">VENDORS</span>
          </h1>
          <p className="neo-text text-xl text-gray-600">
            DISCOVER AMAZING BRANDS AND SHOPS
          </p>
        </div>

        {/* Search */}
        <div className="mb-8 flex gap-4">
          <div className="relative flex-1">
            <Input
              type="text"
              placeholder="SEARCH VENDORS..."
              className="pr-12"
            />
            <Search className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5" />
          </div>
        </div>

        {/* Vendors Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {vendors.map((vendor) => (
            <Link key={vendor.id} href={`/vendor/${vendor.name.toLowerCase()}`}>
              <Card className={`${vendor.color} cursor-pointer h-full`}>
                <CardContent className="p-8">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-20 h-20 bg-black text-white neo-border neo-shadow-md flex items-center justify-center">
                      <span className="neo-heading text-3xl">{vendor.name[0]}</span>
                    </div>
                    {vendor.verified && (
                      <span className="bg-green-500 text-white px-3 py-1 neo-border text-xs neo-shadow-sm">
                        VERIFIED
                      </span>
                    )}
                  </div>
                  <h3 className="neo-heading text-2xl mb-2">{vendor.name}</h3>
                  <p className="neo-text mb-4 text-gray-800">{vendor.description}</p>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-1">
                      <Star className="w-5 h-5 fill-black text-black" />
                      <span className="neo-heading text-xl">{vendor.rating}</span>
                      <span className="neo-text text-gray-700">({vendor.reviews})</span>
                    </div>
                    <div className="text-right">
                      <p className="neo-heading text-xl">{vendor.products}</p>
                      <p className="neo-text text-sm text-gray-700">PRODUCTS</p>
                    </div>
                  </div>
                  <Button variant="outline" className="w-full bg-black text-white border-white neo-shadow-md">
                    VIEW STORE
                  </Button>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        {/* Become a Vendor CTA */}
        <Card className="mt-12 bg-black text-white">
          <CardContent className="p-12 text-center">
            <h2 className="neo-heading text-4xl mb-4">
              WANT TO BECOME A <span className="text-yellow-400">VENDOR?</span>
            </h2>
            <p className="neo-text text-xl mb-8 text-gray-300">
              JOIN OUR MARKETPLACE AND START SELLING TODAY
            </p>
            <Link href="/vendor/register">
              <Button size="lg" className="bg-yellow-400 text-black border-white neo-shadow-xl">
                APPLY NOW
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
