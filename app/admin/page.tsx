"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Users,
  Store,
  DollarSign,
  Package,
  TrendingUp,
  Shield,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Search,
  Settings
} from "lucide-react";
import { useUser } from "@clerk/nextjs";

export default function AdminDashboard() {
  const { user } = useUser();
  const [activeTab, setActiveTab] = useState<"overview" | "vendors" | "products" | "users" | "settings">("overview");

  // Mock admin data
  const platformStats = {
    totalVendors: 1247,
    totalUsers: 45678,
    totalProducts: 34567,
    totalRevenue: 12345678,
    monthlyGrowth: 18.3,
    pendingVendors: 23
  };

  const pendingVendors = [
    { id: 1, name: "NEWTECH CORP", email: "contact@newtech.com", products: 45, submitted: "2024-01-10", status: "pending" },
    { id: 2, name: "STYLEHUB", email: "info@stylehub.com", products: 23, submitted: "2024-01-12", status: "pending" },
    { id: 3, name: "GADGETZONE", email: "hello@gadgetzone.com", products: 67, submitted: "2024-01-14", status: "pending" }
  ];

  const recentVendors = [
    { id: 1, name: "TECHBEAST", email: "tech@beast.com", products: 156, sales: 2847, status: "active", verified: true },
    { id: 2, name: "RETROWAVE", email: "info@retrowave.com", products: 89, sales: 1234, status: "active", verified: true },
    { id: 3, name: "FUTURETECH", email: "contact@futuretech.com", products: 234, sales: 3456, status: "active", verified: true },
    { id: 4, name: "STYLEMART", email: "hello@stylemart.com", products: 45, sales: 567, status: "suspended", verified: false }
  ];

  const topProducts = [
    { id: 1, name: "WIRELESS HEADPHONES", vendor: "TECHBEAST", sales: 1234, revenue: 245766 },
    { id: 2, name: "SMART WATCH", vendor: "FUTURETECH", sales: 987, revenue: 295113 },
    { id: 3, name: "VINTAGE JACKET", vendor: "RETROWAVE", sales: 756, revenue: 67284 }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="neo-heading text-5xl md:text-7xl mb-2">
            ADMIN <span className="text-red-500">DASHBOARD</span>
          </h1>
          <p className="neo-text text-xl text-gray-600">
            PLATFORM CONTROL CENTER
          </p>
        </div>

        {/* Alert Banner */}
        {platformStats.pendingVendors > 0 && (
          <Card className="mb-8 bg-yellow-400">
            <CardContent className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <AlertTriangle className="w-6 h-6" />
                <p className="neo-text">
                  {platformStats.pendingVendors} VENDOR APPLICATIONS PENDING REVIEW
                </p>
              </div>
              <Button variant="outline" className="bg-black text-white border-white">
                REVIEW NOW
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Tabs */}
        <div className="flex gap-4 mb-8 overflow-x-auto">
          {[
            { id: "overview", label: "OVERVIEW" },
            { id: "vendors", label: "VENDORS" },
            { id: "products", label: "PRODUCTS" },
            { id: "users", label: "USERS" },
            { id: "settings", label: "SETTINGS" }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`neo-border px-6 py-3 neo-shadow-md transition-all whitespace-nowrap ${
                activeTab === tab.id
                  ? "bg-red-500 text-white"
                  : "bg-white hover:bg-gray-100"
              }`}
            >
              <span className="neo-text font-bold">{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Overview Tab */}
        {activeTab === "overview" && (
          <div className="space-y-8">
            {/* Platform Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="bg-red-500 text-white">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <Store className="w-12 h-12" />
                    <TrendingUp className="w-6 h-6" />
                  </div>
                  <h3 className="neo-heading text-3xl mb-1">{platformStats.totalVendors.toLocaleString()}</h3>
                  <p className="neo-text">TOTAL VENDORS</p>
                </CardContent>
              </Card>

              <Card className="bg-yellow-400">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <Users className="w-12 h-12" />
                    <TrendingUp className="w-6 h-6" />
                  </div>
                  <h3 className="neo-heading text-3xl mb-1">{platformStats.totalUsers.toLocaleString()}</h3>
                  <p className="neo-text">TOTAL USERS</p>
                </CardContent>
              </Card>

              <Card className="bg-pink-400">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <Package className="w-12 h-12" />
                    <TrendingUp className="w-6 h-6" />
                  </div>
                  <h3 className="neo-heading text-3xl mb-1">{platformStats.totalProducts.toLocaleString()}</h3>
                  <p className="neo-text">TOTAL PRODUCTS</p>
                </CardContent>
              </Card>

              <Card className="bg-cyan-400">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <DollarSign className="w-12 h-12" />
                    <TrendingUp className="w-6 h-6" />
                  </div>
                  <h3 className="neo-heading text-3xl mb-1">${(platformStats.totalRevenue / 1000000).toFixed(1)}M</h3>
                  <p className="neo-text">TOTAL REVENUE</p>
                </CardContent>
              </Card>
            </div>

            {/* Pending Vendors */}
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle className="neo-heading text-2xl">PENDING VENDOR APPLICATIONS</CardTitle>
                  <Button variant="outline">VIEW ALL</Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {pendingVendors.map((vendor) => (
                    <div
                      key={vendor.id}
                      className="neo-border p-6 bg-white flex items-center justify-between"
                    >
                      <div className="flex-1">
                        <h4 className="neo-heading text-xl mb-2">{vendor.name}</h4>
                        <div className="flex gap-4">
                          <span className="neo-text text-gray-600">{vendor.email}</span>
                          <span className="neo-text text-gray-600">{vendor.products} PRODUCTS</span>
                          <span className="neo-text text-gray-600">Submitted: {vendor.submitted}</span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="primary" className="bg-green-500 text-white">
                          <CheckCircle className="w-4 h-4 mr-2" />
                          APPROVE
                        </Button>
                        <Button variant="outline" className="bg-red-500 text-white border-red-500">
                          <XCircle className="w-4 h-4 mr-2" />
                          REJECT
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Top Products */}
            <Card>
              <CardHeader>
                <CardTitle className="neo-heading text-2xl">TOP SELLING PRODUCTS</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {topProducts.map((product) => (
                    <div
                      key={product.id}
                      className="neo-border p-6 bg-white flex items-center justify-between"
                    >
                      <div>
                        <h4 className="neo-heading text-xl mb-2">{product.name}</h4>
                        <p className="neo-text text-gray-600">by {product.vendor}</p>
                      </div>
                      <div className="text-right">
                        <p className="neo-heading text-2xl mb-1">${product.revenue.toLocaleString()}</p>
                        <p className="neo-text text-gray-600">{product.sales} SALES</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Vendors Tab */}
        {activeTab === "vendors" && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="neo-heading text-3xl">ALL VENDORS</h2>
              <div className="flex gap-2">
                <Input placeholder="SEARCH VENDORS..." className="w-64" />
                <Button variant="outline">
                  <Search className="w-4 h-4" />
                </Button>
              </div>
            </div>
            <Card>
              <CardContent className="p-6">
                <div className="space-y-4">
                  {recentVendors.map((vendor) => (
                    <div
                      key={vendor.id}
                      className="neo-border p-6 bg-white"
                    >
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="neo-heading text-xl">{vendor.name}</h3>
                            {vendor.verified && (
                              <span className="bg-green-500 text-white px-2 py-1 neo-border text-xs neo-shadow-sm">
                                VERIFIED
                              </span>
                            )}
                            <span className={`neo-text px-3 py-1 neo-border neo-shadow-sm ${
                              vendor.status === "active" ? "bg-green-400" : "bg-red-400"
                            }`}>
                              {vendor.status.toUpperCase()}
                            </span>
                          </div>
                          <p className="neo-text text-gray-600">{vendor.email}</p>
                        </div>
                        <div className="text-right">
                          <p className="neo-heading text-2xl mb-1">{vendor.products}</p>
                          <p className="neo-text text-gray-600">PRODUCTS</p>
                          <p className="neo-heading text-xl mt-2">{vendor.sales}</p>
                          <p className="neo-text text-gray-600">SALES</p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" className="flex-1">VIEW DETAILS</Button>
                        {vendor.status === "active" ? (
                          <Button variant="outline" className="bg-red-500 text-white border-red-500">
                            SUSPEND
                          </Button>
                        ) : (
                          <Button variant="primary" className="bg-green-500 text-white">
                            ACTIVATE
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Products Tab */}
        {activeTab === "products" && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="neo-heading text-3xl">ALL PRODUCTS</h2>
              <div className="flex gap-2">
                <Input placeholder="SEARCH PRODUCTS..." className="w-64" />
                <Button variant="outline">
                  <Search className="w-4 h-4" />
                </Button>
              </div>
            </div>
            <Card>
              <CardContent className="p-6">
                <p className="neo-text text-gray-600 text-center py-12">
                  PRODUCT MANAGEMENT INTERFACE - COMING SOON
                </p>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Users Tab */}
        {activeTab === "users" && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="neo-heading text-3xl">ALL USERS</h2>
              <div className="flex gap-2">
                <Input placeholder="SEARCH USERS..." className="w-64" />
                <Button variant="outline">
                  <Search className="w-4 h-4" />
                </Button>
              </div>
            </div>
            <Card>
              <CardContent className="p-6">
                <p className="neo-text text-gray-600 text-center py-12">
                  USER MANAGEMENT INTERFACE - COMING SOON
                </p>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Settings Tab */}
        {activeTab === "settings" && (
          <div className="space-y-6">
            <h2 className="neo-heading text-3xl">PLATFORM SETTINGS</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="neo-heading text-xl">GENERAL SETTINGS</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="neo-text block mb-2">PLATFORM NAME</label>
                    <Input defaultValue="BUYBIZZ" />
                  </div>
                  <div>
                    <label className="neo-text block mb-2">COMMISSION RATE (%)</label>
                    <Input type="number" defaultValue="10" />
                  </div>
                  <Button variant="primary">SAVE CHANGES</Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="neo-heading text-xl">SECURITY SETTINGS</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="neo-text">TWO-FACTOR AUTHENTICATION</span>
                    <Button variant="outline" size="sm">ENABLE</Button>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="neo-text">IP WHITELIST</span>
                    <Button variant="outline" size="sm">CONFIGURE</Button>
                  </div>
                  <Button variant="primary">SAVE CHANGES</Button>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
