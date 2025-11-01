"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
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

interface Agent {
  id: string;
  name: string;
  price: number;
  originalPrice: number | null;
  status: "ACTIVE" | "INACTIVE";
  category: string | null;
  shortDescription: string | null;
  imageUrl: string | null;
  createdAt: string;
}

export default function VendorDashboard() {
  const { user } = useUser();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"overview" | "products" | "orders" | "analytics">("overview");
  const [products, setProducts] = useState<Agent[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [statsLoading, setStatsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch vendor's products
  useEffect(() => {
    const fetchProducts = async () => {
      if (!user?.id) return;
      
      try {
        setLoading(true);
        const response = await fetch(`/api/agents?vendorId=${user.id}&status=ACTIVE`);
        if (!response.ok) {
          throw new Error("Failed to fetch products");
        }
        const data = await response.json();
        setProducts(data.agents || []);
        setError(null);
      } catch (err: any) {
        console.error("Error fetching products:", err);
        setError(err.message || "Failed to load products");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [user?.id]);

  // Fetch vendor's orders
  useEffect(() => {
    const fetchOrders = async () => {
      if (!user?.id || activeTab !== "orders" && activeTab !== "overview") return;
      
      try {
        setOrdersLoading(true);
        const response = await fetch("/api/vendor/orders");
        if (!response.ok) {
          throw new Error("Failed to fetch orders");
        }
        const data = await response.json();
        setOrders(data.orders || []);
      } catch (err: any) {
        console.error("Error fetching orders:", err);
      } finally {
        setOrdersLoading(false);
      }
    };

    fetchOrders();
  }, [user?.id, activeTab]);

  // Fetch vendor's stats
  useEffect(() => {
    const fetchStats = async () => {
      if (!user?.id || activeTab !== "analytics" && activeTab !== "overview") return;
      
      try {
        setStatsLoading(true);
        const response = await fetch("/api/vendor/stats");
        if (!response.ok) {
          throw new Error("Failed to fetch stats");
        }
        const data = await response.json();
        setStats(data);
      } catch (err: any) {
        console.error("Error fetching stats:", err);
      } finally {
        setStatsLoading(false);
      }
    };

    fetchStats();
  }, [user?.id, activeTab]);

  // Calculate stats from real data
  const dashboardStats = {
    totalProducts: products.length,
    totalSales: stats?.totalSales || 0,
    totalRevenue: stats?.totalRevenue || "0.00",
    monthlyGrowth: stats?.monthlyGrowth || 0,
  };

  const recentProducts = products.slice(0, 4);
  const recentOrders = orders.slice(0, 5);
  
  const handleDeleteProduct = async (productId: string) => {
    if (!confirm("ARE YOU SURE YOU WANT TO DELETE THIS AI AGENT?")) {
      return;
    }

    try {
      const response = await fetch(`/api/agents/${productId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete product");
      }

      // Refresh products list
      setProducts(products.filter((p) => p.id !== productId));
    } catch (err: any) {
      console.error("Error deleting product:", err);
      alert(`Error: ${err.message || "Failed to delete product"}`);
    }
  };

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
                {loading ? (
                  <div className="text-center py-8">
                    <p className="neo-text">LOADING PRODUCTS...</p>
                  </div>
                ) : error ? (
                  <div className="text-center py-8">
                    <p className="neo-text text-red-500">ERROR: {error}</p>
                  </div>
                ) : recentProducts.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="neo-text text-gray-600">NO PRODUCTS YET</p>
                    <Link href="/vendor/products/new">
                      <Button variant="primary" className="mt-4">
                        <Plus className="w-5 h-5 mr-2" />
                        CREATE YOUR FIRST PRODUCT
                      </Button>
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {recentProducts.map((product) => (
                      <div
                        key={product.id}
                        className="neo-border p-4 bg-white flex items-center justify-between"
                      >
                        <div className="flex-1">
                          <h4 className="neo-heading text-lg">{product.name}</h4>
                          <div className="flex gap-4 mt-2">
                            <span className="neo-text text-gray-600">Price: ${Number(product.price).toFixed(0)}</span>
                            <span className={`neo-text ${
                              product.status === "ACTIVE" ? "text-green-600" : "text-red-600"
                            }`}>
                              {product.status === "ACTIVE" ? "ACTIVE" : "INACTIVE"}
                            </span>
                          </div>
                        </div>
                      <div className="flex gap-2">
                        <Link href={`/vendor/products/${product.id}/edit`}>
                          <Button variant="outline" size="sm">
                            <Edit className="w-4 h-4" />
                          </Button>
                        </Link>
                        <Link href={`/product/${product.id}`}>
                          <Button variant="outline" size="sm">
                            <Eye className="w-4 h-4" />
                          </Button>
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
                )}
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
                {ordersLoading ? (
                  <div className="text-center py-8">
                    <p className="neo-text">LOADING ORDERS...</p>
                  </div>
                ) : recentOrders.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="neo-text text-gray-600">NO ORDERS YET</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {recentOrders.map((order) => (
                      <div
                        key={order.id}
                        className="neo-border p-4 bg-white flex items-center justify-between"
                      >
                        <div className="flex-1">
                          <div className="flex items-center gap-4 mb-2">
                            <h4 className="neo-heading text-lg">Order #{order.id.slice(0, 8)}</h4>
                            <span className={`neo-text px-3 py-1 neo-border neo-shadow-sm ${
                              order.status === "COMPLETED" ? "bg-green-400" :
                              order.status === "PENDING" ? "bg-yellow-400" :
                              "bg-red-400"
                            }`}>
                              {order.status}
                            </span>
                          </div>
                          <div className="flex gap-4">
                            <span className="neo-text text-gray-600">
                              {order.customer.name || order.customer.email}
                            </span>
                            <span className="neo-text text-gray-600">
                              ${order.vendorRevenue}
                            </span>
                            <span className="neo-text text-gray-600">
                              {new Date(order.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
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
            {loading ? (
              <div className="text-center py-12">
                <p className="neo-heading text-2xl">LOADING PRODUCTS...</p>
              </div>
            ) : error ? (
              <div className="text-center py-12">
                <p className="neo-heading text-2xl text-red-500">ERROR: {error}</p>
              </div>
            ) : products.length === 0 ? (
              <div className="text-center py-12">
                <p className="neo-heading text-2xl mb-4">NO PRODUCTS YET</p>
                <p className="neo-text text-gray-600 mb-6">START SELLING BY CREATING YOUR FIRST AI AGENT</p>
                <Link href="/vendor/products/new">
                  <Button variant="primary" size="lg">
                    <Plus className="w-5 h-5 mr-2" />
                    CREATE PRODUCT
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map((product) => (
                  <Card key={product.id}>
                    <div className="aspect-square bg-gray-200 relative overflow-hidden">
                      {product.imageUrl ? (
                        <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center neo-text text-gray-500">
                          PRODUCT IMAGE
                        </div>
                      )}
                    </div>
                    <CardContent className="p-6">
                      <h3 className="neo-heading text-xl mb-2">{product.name}</h3>
                      <div className="flex justify-between items-center mb-4">
                        <span className="neo-heading text-2xl">${Number(product.price).toFixed(0)}</span>
                        <span className={`neo-text text-sm px-2 py-1 neo-border ${
                          product.status === "ACTIVE" ? "bg-green-400" : "bg-red-400"
                        }`}>
                          {product.status}
                        </span>
                      </div>
                      <div className="flex gap-2">
                        <Link href={`/vendor/products/${product.id}/edit`} className="flex-1">
                          <Button variant="outline" className="w-full">
                            <Edit className="w-4 h-4 mr-2" />
                            EDIT
                          </Button>
                        </Link>
                        <Button variant="outline" onClick={() => handleDeleteProduct(product.id)}>
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Orders Tab */}
        {activeTab === "orders" && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="neo-heading text-3xl">ORDERS</h2>
              {stats && (
                <div className="flex gap-4">
                  <div className="neo-border px-4 py-2 bg-white">
                    <p className="neo-text text-xs text-gray-600">TOTAL REVENUE</p>
                    <p className="neo-heading text-xl">${stats.totalRevenue || "0.00"}</p>
                  </div>
                </div>
              )}
            </div>
            <Card>
              <CardContent className="p-6">
                {ordersLoading ? (
                  <div className="text-center py-12">
                    <p className="neo-heading text-2xl">LOADING ORDERS...</p>
                  </div>
                ) : orders.length === 0 ? (
                  <div className="text-center py-12">
                    <p className="neo-heading text-2xl mb-4">NO ORDERS YET</p>
                    <p className="neo-text text-gray-600">ORDERS WILL APPEAR HERE WHEN CUSTOMERS PURCHASE YOUR AI AGENTS</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {orders.map((order) => (
                      <div
                        key={order.id}
                        className="neo-border p-6 bg-white"
                      >
                        <div className="flex justify-between items-start mb-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-4 mb-2">
                              <h3 className="neo-heading text-xl">Order #{order.id.slice(0, 8)}</h3>
                              <span className={`neo-text px-3 py-1 neo-border neo-shadow-sm ${
                                order.status === "COMPLETED" ? "bg-green-400" :
                                order.status === "PENDING" ? "bg-yellow-400" :
                                "bg-red-400"
                              }`}>
                                {order.status}
                              </span>
                            </div>
                            <p className="neo-text text-gray-600 mb-1">Customer: {order.customer.name || order.customer.email}</p>
                            <p className="neo-text text-gray-600 mb-1">
                              {order.items.length} {order.items.length === 1 ? "item" : "items"}
                            </p>
                            <div className="mt-2 space-y-1">
                              {order.items.map((item: any) => (
                                <p key={item.id} className="neo-text text-sm text-gray-600">
                                  • {item.agentName} x{item.quantity} - ${item.price}
                                </p>
                              ))}
                            </div>
                            <p className="neo-text text-xs text-gray-500 mt-2">
                              {new Date(order.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                          <div className="text-right ml-4">
                            <p className="neo-heading text-2xl mb-2">${order.vendorRevenue}</p>
                            <p className="neo-text text-xs text-gray-600">Your Revenue</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}

        {/* Analytics Tab */}
        {activeTab === "analytics" && (
          <div className="space-y-6">
            <h2 className="neo-heading text-3xl">ANALYTICS</h2>
            {statsLoading ? (
              <div className="text-center py-12">
                <p className="neo-heading text-2xl">LOADING ANALYTICS...</p>
              </div>
            ) : stats ? (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <Card className="bg-yellow-400">
                    <CardContent className="p-6">
                      <h3 className="neo-heading text-xl mb-2">TOTAL SALES</h3>
                      <p className="neo-heading text-4xl mb-1">{stats.totalSales || 0}</p>
                      <p className="neo-text text-sm">Units Sold</p>
                    </CardContent>
                  </Card>
                  <Card className="bg-pink-400">
                    <CardContent className="p-6">
                      <h3 className="neo-heading text-xl mb-2">TOTAL REVENUE</h3>
                      <p className="neo-heading text-4xl mb-1">${stats.totalRevenue || "0.00"}</p>
                      <p className="neo-text text-sm">All Time</p>
                    </CardContent>
                  </Card>
                  <Card className="bg-cyan-400">
                    <CardContent className="p-6">
                      <h3 className="neo-heading text-xl mb-2">MONTHLY REVENUE</h3>
                      <p className="neo-heading text-4xl mb-1">${stats.monthlyRevenue || "0.00"}</p>
                      <p className="neo-text text-sm">This Month</p>
                    </CardContent>
                  </Card>
                  <Card className="bg-green-400">
                    <CardContent className="p-6">
                      <h3 className="neo-heading text-xl mb-2">MONTHLY GROWTH</h3>
                      <p className="neo-heading text-4xl mb-1">
                        {stats.monthlyGrowth >= 0 ? "+" : ""}{stats.monthlyGrowth || 0}%
                      </p>
                      <p className="neo-text text-sm">vs Last Month</p>
                    </CardContent>
                  </Card>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="neo-heading text-2xl">TOP SELLING PRODUCTS</CardTitle>
                    </CardHeader>
                    <CardContent>
                      {stats.topProducts && stats.topProducts.length > 0 ? (
                        <div className="space-y-4">
                          {stats.topProducts.map((product: any, index: number) => (
                            <div key={index} className="neo-border p-4 bg-white flex items-center justify-between">
                              <div>
                                <p className="neo-heading text-lg">{product.name}</p>
                                <p className="neo-text text-sm text-gray-600">{product.sales} sales</p>
                              </div>
                              <div className="text-right">
                                <p className="neo-heading text-xl">${product.revenue}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="neo-text text-gray-600 text-center py-8">NO SALES YET</p>
                      )}
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle className="neo-heading text-2xl">PERFORMANCE METRICS</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="neo-border p-4 bg-white">
                        <p className="neo-text text-sm text-gray-600 mb-1">AVERAGE ORDER VALUE</p>
                        <p className="neo-heading text-2xl">${stats.averageOrderValue || "0.00"}</p>
                      </div>
                      <div className="neo-border p-4 bg-white">
                        <p className="neo-text text-sm text-gray-600 mb-1">TOTAL PRODUCTS</p>
                        <p className="neo-heading text-2xl">{stats.totalAgents || 0}</p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </>
            ) : (
              <div className="text-center py-12">
                <p className="neo-heading text-2xl mb-4">NO ANALYTICS DATA</p>
                <p className="neo-text text-gray-600">ANALYTICS WILL APPEAR HERE ONCE YOU START RECEIVING ORDERS</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
