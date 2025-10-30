"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { 
  Package, 
  DollarSign, 
  TrendingUp, 
  Users, 
  Plus, 
  Edit, 
  Trash2,
  Eye,
  ShoppingCart,
  Star,
  ArrowUpRight
} from "lucide-react";
import { useUser } from "@clerk/nextjs";

export default function VendorDashboard() {
  const { user } = useUser();
  const [activeTab, setActiveTab] = useState<"overview" | "products" | "orders" | "analytics">("overview");

  // Mock data
  const stats = {
    totalProducts: 156,
    totalSales: 2847,
    totalRevenue: 245890,
    totalCustomers: 892,
    monthlyGrowth: 23.5
  };

  const recentProducts = [
    { id: 1, name: "WIRELESS HEADPHONES", price: 199, stock: 47, sales: 234, status: "active" },
    { id: 2, name: "SMART WATCH", price: 299, stock: 23, sales: 189, status: "active" },
    { id: 3, name: "BLUETOOTH SPEAKER", price: 129, stock: 0, sales: 156, status: "out_of_stock" },
    { id: 4, name: "WIRELESS CHARGER", price: 39, stock: 89, sales: 412, status: "active" }
  ];

  const recentOrders = [
    { id: "#ORD-001", customer: "John Doe", product: "WIRELESS HEADPHONES", amount: 199, status: "completed", date: "2024-01-15" },
    { id: "#ORD-002", customer: "Jane Smith", product: "SMART WATCH", amount: 299, status: "pending", date: "2024-01-14" },
    { id: "#ORD-003", customer: "Bob Johnson", product: "BLUETOOTH SPEAKER", amount: 129, status: "shipped", date: "2024-01-13" }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="neo-heading text-5xl md:text-7xl mb-2">
            VENDOR <span className="text-yellow-400">DASHBOARD</span>
          </h1>
          <p className="neo-text text-xl text-gray-600">
            WELCOME BACK, {user?.firstName?.toUpperCase() || "VENDOR"}
          </p>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-8 overflow-x-auto">
          {[
            { id: "overview", label: "OVERVIEW" },
            { id: "products", label: "PRODUCTS" },
            { id: "orders", label: "ORDERS" },
            { id: "analytics", label: "ANALYTICS" }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`neo-border px-6 py-3 neo-shadow-md transition-all whitespace-nowrap ${
                activeTab === tab.id
                  ? "bg-yellow-400 text-black"
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
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="bg-yellow-400">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <Package className="w-12 h-12" />
                    <TrendingUp className="w-6 h-6" />
                  </div>
                  <h3 className="neo-heading text-3xl mb-1">{stats.totalProducts}</h3>
                  <p className="neo-text">TOTAL PRODUCTS</p>
                </CardContent>
              </Card>

              <Card className="bg-pink-400">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <DollarSign className="w-12 h-12" />
                    <TrendingUp className="w-6 h-6" />
                  </div>
                  <h3 className="neo-heading text-3xl mb-1">${stats.totalRevenue.toLocaleString()}</h3>
                  <p className="neo-text">TOTAL REVENUE</p>
                </CardContent>
              </Card>

              <Card className="bg-cyan-400">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <ShoppingCart className="w-12 h-12" />
                    <TrendingUp className="w-6 h-6" />
                  </div>
                  <h3 className="neo-heading text-3xl mb-1">{stats.totalSales}</h3>
                  <p className="neo-text">TOTAL SALES</p>
                </CardContent>
              </Card>

              <Card className="bg-green-400">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <Users className="w-12 h-12" />
                    <TrendingUp className="w-6 h-6" />
                  </div>
                  <h3 className="neo-heading text-3xl mb-1">{stats.totalCustomers}</h3>
                  <p className="neo-text">CUSTOMERS</p>
                </CardContent>
              </Card>
            </div>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="neo-heading text-2xl">QUICK ACTIONS</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Link href="/vendor/products/new">
                    <Button variant="primary" className="w-full">
                      <Plus className="w-5 h-5 mr-2" />
                      ADD NEW PRODUCT
                    </Button>
                  </Link>
                  <Link href="/vendor/orders">
                    <Button variant="secondary" className="w-full">
                      <ShoppingCart className="w-5 h-5 mr-2" />
                      VIEW ORDERS
                    </Button>
                  </Link>
                  <Link href="/vendor/analytics">
                    <Button variant="accent" className="w-full">
                      <TrendingUp className="w-5 h-5 mr-2" />
                      VIEW ANALYTICS
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>

            {/* Recent Products */}
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle className="neo-heading text-2xl">RECENT PRODUCTS</CardTitle>
                  <Link href="/vendor/products">
                    <Button variant="outline" size="sm">
                      VIEW ALL
                      <ArrowUpRight className="w-4 h-4 ml-2" />
                    </Button>
                  </Link>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentProducts.map((product) => (
                    <div
                      key={product.id}
                      className="neo-border p-4 bg-white flex items-center justify-between"
                    >
                      <div className="flex-1">
                        <h4 className="neo-heading text-lg">{product.name}</h4>
                        <div className="flex gap-4 mt-2">
                          <span className="neo-text text-gray-600">Price: ${product.price}</span>
                          <span className="neo-text text-gray-600">Stock: {product.stock}</span>
                          <span className="neo-text text-gray-600">Sales: {product.sales}</span>
                          <span className={`neo-text ${
                            product.status === "active" ? "text-green-600" : "text-red-600"
                          }`}>
                            {product.status === "active" ? "ACTIVE" : "OUT OF STOCK"}
                          </span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button variant="outline" size="sm">
                          <Eye className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Recent Orders */}
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle className="neo-heading text-2xl">RECENT ORDERS</CardTitle>
                  <Link href="/vendor/orders">
                    <Button variant="outline" size="sm">
                      VIEW ALL
                      <ArrowUpRight className="w-4 h-4 ml-2" />
                    </Button>
                  </Link>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentOrders.map((order) => (
                    <div
                      key={order.id}
                      className="neo-border p-4 bg-white flex items-center justify-between"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-4 mb-2">
                          <h4 className="neo-heading text-lg">{order.id}</h4>
                          <span className={`neo-text px-3 py-1 neo-border neo-shadow-sm ${
                            order.status === "completed" ? "bg-green-400" :
                            order.status === "shipped" ? "bg-cyan-400" :
                            "bg-yellow-400"
                          }`}>
                            {order.status.toUpperCase()}
                          </span>
                        </div>
                        <div className="flex gap-4">
                          <span className="neo-text text-gray-600">Customer: {order.customer}</span>
                          <span className="neo-text text-gray-600">Product: {order.product}</span>
                          <span className="neo-text text-gray-600">Amount: ${order.amount}</span>
                          <span className="neo-text text-gray-600">Date: {order.date}</span>
                        </div>
                      </div>
                      <Button variant="outline" size="sm">
                        VIEW DETAILS
                      </Button>
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
              <h2 className="neo-heading text-3xl">MY PRODUCTS</h2>
              <Link href="/vendor/products/new">
                <Button variant="primary">
                  <Plus className="w-5 h-5 mr-2" />
                  ADD PRODUCT
                </Button>
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {recentProducts.map((product) => (
                <Card key={product.id}>
                  <div className="aspect-square bg-gray-200 relative">
                    <div className="absolute inset-0 flex items-center justify-center neo-text text-gray-500">
                      PRODUCT IMAGE
                    </div>
                  </div>
                  <CardContent className="p-6">
                    <h3 className="neo-heading text-xl mb-2">{product.name}</h3>
                    <div className="flex justify-between items-center mb-4">
                      <span className="neo-heading text-2xl">${product.price}</span>
                      <span className={`neo-text text-sm px-2 py-1 neo-border ${
                        product.status === "active" ? "bg-green-400" : "bg-red-400"
                      }`}>
                        {product.stock} IN STOCK
                      </span>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" className="flex-1">
                        <Edit className="w-4 h-4 mr-2" />
                        EDIT
                      </Button>
                      <Button variant="outline">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Orders Tab */}
        {activeTab === "orders" && (
          <div className="space-y-6">
            <h2 className="neo-heading text-3xl">ORDERS</h2>
            <Card>
              <CardContent className="p-6">
                <div className="space-y-4">
                  {recentOrders.map((order) => (
                    <div
                      key={order.id}
                      className="neo-border p-6 bg-white"
                    >
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="neo-heading text-xl mb-2">{order.id}</h3>
                          <p className="neo-text text-gray-600">Customer: {order.customer}</p>
                          <p className="neo-text text-gray-600">Product: {order.product}</p>
                        </div>
                        <div className="text-right">
                          <p className="neo-heading text-2xl mb-2">${order.amount}</p>
                          <span className={`neo-text px-3 py-1 neo-border neo-shadow-sm ${
                            order.status === "completed" ? "bg-green-400" :
                            order.status === "shipped" ? "bg-cyan-400" :
                            "bg-yellow-400"
                          }`}>
                            {order.status.toUpperCase()}
                          </span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" className="flex-1">VIEW DETAILS</Button>
                        {order.status === "pending" && (
                          <Button variant="primary">PROCESS ORDER</Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Analytics Tab */}
        {activeTab === "analytics" && (
          <div className="space-y-6">
            <h2 className="neo-heading text-3xl">ANALYTICS</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="bg-yellow-400">
                <CardContent className="p-8">
                  <h3 className="neo-heading text-2xl mb-4">MONTHLY GROWTH</h3>
                  <p className="neo-heading text-5xl mb-2">+{stats.monthlyGrowth}%</p>
                  <p className="neo-text">UP FROM LAST MONTH</p>
                </CardContent>
              </Card>
              <Card className="bg-pink-400">
                <CardContent className="p-8">
                  <h3 className="neo-heading text-2xl mb-4">AVERAGE RATING</h3>
                  <div className="flex items-center gap-2 mb-2">
                    <Star className="w-8 h-8 fill-black text-black" />
                    <p className="neo-heading text-5xl">4.8</p>
                  </div>
                  <p className="neo-text">BASED ON 342 REVIEWS</p>
                </CardContent>
              </Card>
            </div>
            <Card>
              <CardHeader>
                <CardTitle className="neo-heading text-2xl">SALES OVERVIEW</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64 bg-gray-200 flex items-center justify-center neo-border">
                  <p className="neo-text text-gray-500">SALES CHART PLACEHOLDER</p>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
