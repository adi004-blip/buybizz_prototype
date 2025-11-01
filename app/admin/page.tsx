"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
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
  Settings,
  Loader2
} from "lucide-react";

interface AdminStats {
  users: {
    total: number;
    vendors: number;
    admins: number;
    customers: number;
  };
  products: {
    total: number;
    active: number;
    inactive: number;
  };
  orders: {
    total: number;
    completed: number;
    pending: number;
    failed: number;
  };
  revenue: {
    total: string;
    monthly: string;
    monthlyGrowth: number;
  };
  vendorApplications: {
    pending: number;
  };
  topVendors: Array<{
    id: string;
    name: string;
    email: string;
    products: number;
    revenue: string;
  }>;
}

interface VendorApplication {
  id: string;
  userId: string;
  user: {
    id: string;
    email: string;
    fullName: string;
    companyName: string | null;
    createdAt: string;
  };
  companyName: string | null;
  description: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
  reviewedBy: string | null;
  reviewedAt: string | null;
  rejectionReason: string | null;
  createdAt: string;
  updatedAt: string;
}

interface User {
  id: string;
  email: string;
  role: string;
  fullName: string;
  companyName: string | null;
  stats: {
    products: number;
    orders: number;
  };
}

interface Product {
  id: string;
  name: string;
  price: string;
  status: string;
  vendor: {
    id: string;
    name: string;
    email: string;
  };
  stats: {
    orders: number;
    inCart: number;
  };
}

interface Order {
  id: string;
  customer: {
    id: string;
    email: string;
    name: string;
  };
  amount: string;
  status: string;
  items: Array<{
    id: string;
    agentName: string;
    quantity: number;
    price: string;
  }>;
  createdAt: string;
}

export default function AdminDashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"overview" | "vendors" | "products" | "users" | "orders" | "applications" | "settings">("overview");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Overview data
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [pendingApplications, setPendingApplications] = useState<VendorApplication[]>([]);
  
  // Tabs data
  const [users, setUsers] = useState<User[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [allApplications, setAllApplications] = useState<VendorApplication[]>([]);
  
  // Loading states
  const [usersLoading, setUsersLoading] = useState(false);
  const [productsLoading, setProductsLoading] = useState(false);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [applicationsLoading, setApplicationsLoading] = useState(false);
  const [processing, setProcessing] = useState<string | null>(null);

  // Fetch overview stats
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch("/api/admin/stats");
        if (!response.ok) {
          if (response.status === 403) {
            router.push("/");
            return;
          }
          throw new Error("Failed to fetch stats");
        }
        const data = await response.json();
        setStats(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [router]);

  // Fetch pending applications for overview
  useEffect(() => {
    if (activeTab === "overview") {
      const fetchApplications = async () => {
        try {
          const response = await fetch("/api/admin/vendor-applications?status=PENDING");
          if (response.ok) {
            const data = await response.json();
            setPendingApplications(data.applications.slice(0, 5)); // Show first 5
          }
        } catch (err) {
          console.error("Error fetching applications:", err);
        }
      };
      fetchApplications();
    }
  }, [activeTab]);

  // Fetch users when tab is active (for both Users and Vendors tabs)
  useEffect(() => {
    if (activeTab === "users" || activeTab === "vendors") {
      setUsersLoading(true);
      fetch("/api/admin/users")
        .then(res => res.json())
        .then(data => {
          setUsers(data.users || []);
        })
        .catch(err => {
          console.error("Error fetching users:", err);
        })
        .finally(() => setUsersLoading(false));
    }
  }, [activeTab]);

  // Fetch products when tab is active
  useEffect(() => {
    if (activeTab === "products") {
      setProductsLoading(true);
      fetch("/api/admin/products")
        .then(res => res.json())
        .then(data => {
          setProducts(data.products || []);
        })
        .catch(err => {
          console.error("Error fetching products:", err);
        })
        .finally(() => setProductsLoading(false));
    }
  }, [activeTab]);

  // Fetch orders when tab is active
  useEffect(() => {
    if (activeTab === "orders") {
      setOrdersLoading(true);
      fetch("/api/admin/orders")
        .then(res => res.json())
        .then(data => {
          setOrders(data.orders || []);
        })
        .catch(err => {
          console.error("Error fetching orders:", err);
        })
        .finally(() => setOrdersLoading(false));
    }
  }, [activeTab]);

  // Fetch all applications when tab is active
  useEffect(() => {
    if (activeTab === "applications") {
      setApplicationsLoading(true);
      fetch("/api/admin/vendor-applications")
        .then(res => res.json())
        .then(data => {
          setAllApplications(data.applications || []);
        })
        .catch(err => {
          console.error("Error fetching applications:", err);
        })
        .finally(() => setApplicationsLoading(false));
    }
  }, [activeTab]);

  const handleApproveApplication = async (applicationId: string) => {
    if (processing) return;
    setProcessing(applicationId);
    try {
      const response = await fetch("/api/admin/vendor-applications", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ applicationId, action: "approve" }),
      });
      if (response.ok) {
        // Refresh data
        window.location.reload();
      } else {
        const error = await response.json();
        alert(error.error || "Failed to approve application");
      }
    } catch (err: any) {
      alert(err.message || "Failed to approve application");
    } finally {
      setProcessing(null);
    }
  };

  const handleRejectApplication = async (applicationId: string, reason?: string) => {
    if (processing) return;
    const rejectionReason = reason || prompt("Please provide a reason for rejection:");
    if (!rejectionReason) return;
    
    setProcessing(applicationId);
    try {
      const response = await fetch("/api/admin/vendor-applications", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ applicationId, action: "reject", rejectionReason }),
      });
      if (response.ok) {
        // Refresh data
        window.location.reload();
      } else {
        const error = await response.json();
        alert(error.error || "Failed to reject application");
      }
    } catch (err: any) {
      alert(err.message || "Failed to reject application");
    } finally {
      setProcessing(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8 px-4 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4" />
          <p className="neo-heading text-2xl">LOADING ADMIN DASHBOARD...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 py-8 px-4 flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="p-8 text-center">
            <AlertTriangle className="w-12 h-12 mx-auto mb-4 text-red-500" />
            <h2 className="neo-heading text-2xl mb-4">ERROR</h2>
            <p className="neo-text text-gray-600">{error}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

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
        {stats && stats.vendorApplications.pending > 0 && (
          <Card className="mb-8 bg-yellow-400">
            <CardContent className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <AlertTriangle className="w-6 h-6" />
                <p className="neo-text">
                  {stats.vendorApplications.pending} VENDOR APPLICATION{stats.vendorApplications.pending !== 1 ? "S" : ""} PENDING REVIEW
                </p>
              </div>
              <Button 
                variant="outline" 
                className="bg-black text-white border-white"
                onClick={() => setActiveTab("applications")}
              >
                REVIEW NOW
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Tabs */}
        <div className="flex gap-4 mb-8 overflow-x-auto">
          {[
            { id: "overview", label: "OVERVIEW" },
            { id: "applications", label: "APPLICATIONS" },
            { id: "vendors", label: "VENDORS" },
            { id: "products", label: "PRODUCTS" },
            { id: "orders", label: "ORDERS" },
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
        {activeTab === "overview" && stats && (
          <div className="space-y-8">
            {/* Platform Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="bg-red-500 text-white">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <Store className="w-12 h-12 text-white" />
                    <TrendingUp className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="neo-heading text-3xl mb-1 text-white">
                    {(stats?.users?.vendors ?? 0).toLocaleString()}
                  </h3>
                  <p className="neo-text text-white">TOTAL VENDORS</p>
                </CardContent>
              </Card>

              <Card className="bg-yellow-400">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <Users className="w-12 h-12" />
                    <TrendingUp className="w-6 h-6" />
                  </div>
                  <h3 className="neo-heading text-3xl mb-1">{stats.users.total.toLocaleString()}</h3>
                  <p className="neo-text">TOTAL USERS</p>
                </CardContent>
              </Card>

              <Card className="bg-pink-400">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <Package className="w-12 h-12" />
                    <TrendingUp className="w-6 h-6" />
                  </div>
                  <h3 className="neo-heading text-3xl mb-1">{stats.products.total.toLocaleString()}</h3>
                  <p className="neo-text">TOTAL PRODUCTS</p>
                </CardContent>
              </Card>

              <Card className="bg-cyan-400">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <DollarSign className="w-12 h-12" />
                    <TrendingUp className="w-6 h-6" />
                  </div>
                  <h3 className="neo-heading text-3xl mb-1">${stats.revenue.total}</h3>
                  <p className="neo-text">TOTAL REVENUE</p>
                </CardContent>
              </Card>
            </div>

            {/* Additional Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="bg-green-400">
                <CardContent className="p-6">
                  <h3 className="neo-heading text-2xl mb-1">{stats.orders.completed.toLocaleString()}</h3>
                  <p className="neo-text">COMPLETED ORDERS</p>
                </CardContent>
              </Card>
              <Card className="bg-purple-400">
                <CardContent className="p-6">
                  <h3 className="neo-heading text-2xl mb-1">{stats.revenue.monthly}</h3>
                  <p className="neo-text">MONTHLY REVENUE</p>
                  <p className="neo-text text-sm mt-2">
                    {stats.revenue.monthlyGrowth >= 0 ? "+" : ""}{stats.revenue.monthlyGrowth.toFixed(1)}% GROWTH
                  </p>
                </CardContent>
              </Card>
              <Card className="bg-orange-400">
                <CardContent className="p-6">
                  <h3 className="neo-heading text-2xl mb-1">{stats.vendorApplications.pending}</h3>
                  <p className="neo-text">PENDING APPLICATIONS</p>
                </CardContent>
              </Card>
            </div>

            {/* Pending Vendor Applications */}
            {pendingApplications.length > 0 ? (
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <CardTitle className="neo-heading text-2xl">PENDING VENDOR APPLICATIONS</CardTitle>
                    <Button variant="outline" onClick={() => setActiveTab("applications")}>VIEW ALL</Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {pendingApplications.map((app) => (
                      <div
                        key={app.id}
                        className="neo-border p-6 bg-white flex items-center justify-between"
                      >
                        <div className="flex-1">
                          <h4 className="neo-heading text-xl mb-2">
                            {app.user.companyName || app.user.fullName}
                          </h4>
                          <div className="flex gap-4 flex-wrap">
                            <span className="neo-text text-gray-600">{app.user.email}</span>
                            <span className="neo-text text-gray-600">
                              Submitted: {new Date(app.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                          <p className="neo-text text-sm text-gray-500 mt-2 line-clamp-2">
                            {app.description}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <Button 
                            variant="primary" 
                            className="bg-green-500 text-white"
                            onClick={() => handleApproveApplication(app.id)}
                            disabled={processing === app.id}
                          >
                            {processing === app.id ? (
                              <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                              <>
                                <CheckCircle className="w-4 h-4 mr-2" />
                                APPROVE
                              </>
                            )}
                          </Button>
                          <Button 
                            variant="outline" 
                            className="bg-red-500 text-white border-red-500"
                            onClick={() => handleRejectApplication(app.id)}
                            disabled={processing === app.id}
                          >
                            {processing === app.id ? (
                              <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                              <>
                                <XCircle className="w-4 h-4 mr-2" />
                                REJECT
                              </>
                            )}
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ) : null}

            {/* Top Vendors */}
            {stats.topVendors.length > 0 ? (
              <Card>
                <CardHeader>
                  <CardTitle className="neo-heading text-2xl">TOP VENDORS</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {stats.topVendors.map((vendor) => (
                      <div
                        key={vendor.id}
                        className="neo-border p-6 bg-white flex items-center justify-between"
                      >
                        <div>
                          <h4 className="neo-heading text-xl mb-2">{vendor.name}</h4>
                          <p className="neo-text text-gray-600">{vendor.email}</p>
                        </div>
                        <div className="text-right">
                          <p className="neo-heading text-2xl mb-1">${vendor.revenue}</p>
                          <p className="neo-text text-gray-600">{vendor.products} PRODUCTS</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ) : null}
          </div>
        )}

        {/* Applications Tab */}
        {activeTab === "applications" && (
          <div className="space-y-6">
            <h2 className="neo-heading text-3xl">VENDOR APPLICATIONS</h2>
            {applicationsLoading ? (
              <Card>
                <CardContent className="p-12 text-center">
                  <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" />
                  <p className="neo-text">LOADING APPLICATIONS...</p>
                </CardContent>
              </Card>
            ) : allApplications.length === 0 ? (
              <Card>
                <CardContent className="p-12 text-center">
                  <p className="neo-text text-gray-600">NO APPLICATIONS FOUND</p>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    {allApplications.map((app) => (
                      <div
                        key={app.id}
                        className="neo-border p-6 bg-white"
                      >
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h3 className="neo-heading text-xl">
                                {app.user.companyName || app.user.fullName}
                              </h3>
                              <span className={`px-3 py-1 neo-border neo-shadow-sm text-xs ${
                                app.status === "APPROVED" ? "bg-green-400" :
                                app.status === "REJECTED" ? "bg-red-400" :
                                "bg-yellow-400"
                              }`}>
                                {app.status}
                              </span>
                            </div>
                            <p className="neo-text text-gray-600 mb-2">{app.user.email}</p>
                            <p className="neo-text text-sm text-gray-500">
                              Submitted: {new Date(app.createdAt).toLocaleString()}
                            </p>
                            {app.reviewedAt && (
                              <p className="neo-text text-xs text-gray-500">
                                Reviewed: {new Date(app.reviewedAt).toLocaleString()}
                              </p>
                            )}
                          </div>
                          {app.status === "PENDING" && (
                            <div className="flex gap-2">
                              <Button 
                                variant="primary" 
                                className="bg-green-500 text-white"
                                onClick={() => handleApproveApplication(app.id)}
                                disabled={processing === app.id}
                              >
                                {processing === app.id ? (
                                  <Loader2 className="w-4 h-4 animate-spin" />
                                ) : (
                                  <>
                                    <CheckCircle className="w-4 h-4 mr-2" />
                                    APPROVE
                                  </>
                                )}
                              </Button>
                              <Button 
                                variant="outline" 
                                className="bg-red-500 text-white border-red-500"
                                onClick={() => handleRejectApplication(app.id)}
                                disabled={processing === app.id}
                              >
                                {processing === app.id ? (
                                  <Loader2 className="w-4 h-4 animate-spin" />
                                ) : (
                                  <>
                                    <XCircle className="w-4 h-4 mr-2" />
                                    REJECT
                                  </>
                                )}
                              </Button>
                            </div>
                          )}
                        </div>
                        <div className="bg-gray-100 p-4 neo-border mt-4">
                          <h4 className="neo-heading text-sm mb-2">APPLICATION DESCRIPTION:</h4>
                          <p className="neo-text text-sm whitespace-pre-wrap">{app.description}</p>
                        </div>
                        {app.rejectionReason && (
                          <div className="bg-red-100 p-4 neo-border mt-4">
                            <h4 className="neo-heading text-sm mb-2">REJECTION REASON:</h4>
                            <p className="neo-text text-sm">{app.rejectionReason}</p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
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
            {usersLoading ? (
              <Card>
                <CardContent className="p-12 text-center">
                  <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" />
                  <p className="neo-text">LOADING VENDORS...</p>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardContent className="p-6">
                  {users.filter(u => u.role === "VENDOR" || u.role === "ADMIN").length > 0 ? (
                    <div className="space-y-4">
                      {users
                        .filter(u => u.role === "VENDOR" || u.role === "ADMIN")
                        .map((vendor) => (
                          <div
                            key={vendor.id}
                            className="neo-border p-6 bg-white"
                          >
                            <div className="flex items-center justify-between mb-4">
                              <div>
                                <div className="flex items-center gap-3 mb-2">
                                  <h3 className="neo-heading text-xl">{vendor.fullName}</h3>
                                  {vendor.role === "ADMIN" && (
                                    <span className="bg-red-400 text-white px-2 py-1 neo-border text-xs neo-shadow-sm">
                                      ADMIN
                                    </span>
                                  )}
                                  <span className={`neo-text px-3 py-1 neo-border neo-shadow-sm text-xs ${
                                    vendor.role === "VENDOR" ? "bg-green-400" : "bg-red-400"
                                  }`}>
                                    {vendor.role}
                                  </span>
                                </div>
                                <p className="neo-text text-gray-600">{vendor.email}</p>
                                {vendor.companyName && (
                                  <p className="neo-text text-sm text-gray-500">{vendor.companyName}</p>
                                )}
                              </div>
                              <div className="text-right">
                                <p className="neo-heading text-2xl mb-1">{vendor.stats.products}</p>
                                <p className="neo-text text-gray-600">PRODUCTS</p>
                                <p className="neo-heading text-xl mt-2">{vendor.stats.orders}</p>
                                <p className="neo-text text-gray-600">ORDERS</p>
                              </div>
                            </div>
                            <div className="flex gap-2">
                              <Button variant="outline" className="flex-1">
                                VIEW DETAILS
                              </Button>
                              <Button 
                                variant="outline" 
                                className="bg-blue-500 text-white border-blue-500"
                                onClick={() => {
                                  const userId = vendor.id;
                                  const newRole = vendor.role === "VENDOR" ? "CUSTOMER" : "VENDOR";
                                  if (confirm(`Change ${vendor.fullName}'s role to ${newRole}?`)) {
                                    fetch(`/api/admin/users/${userId}/role`, {
                                      method: "PATCH",
                                      headers: { "Content-Type": "application/json" },
                                      body: JSON.stringify({ role: newRole }),
                                    })
                                      .then(res => res.json())
                                      .then(data => {
                                        if (data.success) {
                                          window.location.reload();
                                        } else {
                                          alert(data.error || "Failed to update role");
                                        }
                                      })
                                      .catch(err => alert("Failed to update role"));
                                  }
                                }}
                              >
                                {vendor.role === "VENDOR" ? "DEMOTE" : "PROMOTE"}
                              </Button>
                            </div>
                          </div>
                        ))}
                    </div>
                  ) : (
                    <p className="neo-text text-gray-600 text-center py-12">
                      NO VENDORS FOUND
                    </p>
                  )}
                </CardContent>
              </Card>
            )}
          </div>
        )}

        {/* Products Tab */}
        {activeTab === "products" && (
          <div className="space-y-6">
            <h2 className="neo-heading text-3xl">ALL PRODUCTS</h2>
            {productsLoading ? (
              <Card>
                <CardContent className="p-12 text-center">
                  <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" />
                  <p className="neo-text">LOADING PRODUCTS...</p>
                </CardContent>
              </Card>
            ) : products.length === 0 ? (
              <Card>
                <CardContent className="p-12 text-center">
                  <p className="neo-text text-gray-600">NO PRODUCTS FOUND</p>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    {products.map((product) => (
                      <div
                        key={product.id}
                        className="neo-border p-6 bg-white flex items-center justify-between"
                      >
                        <div className="flex-1">
                          <h4 className="neo-heading text-xl mb-2">{product.name}</h4>
                          <p className="neo-text text-gray-600">by {product.vendor.name}</p>
                          <p className="neo-text text-sm text-gray-500 mt-1">
                            {product.stats.orders} orders • {product.stats.inCart} in cart
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="neo-heading text-2xl mb-1">${product.price}</p>
                          <span className={`px-3 py-1 neo-border neo-shadow-sm text-xs ${
                            product.status === "ACTIVE" ? "bg-green-400" : "bg-red-400"
                          }`}>
                            {product.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        )}

        {/* Orders Tab */}
        {activeTab === "orders" && (
          <div className="space-y-6">
            <h2 className="neo-heading text-3xl">ALL ORDERS</h2>
            {ordersLoading ? (
              <Card>
                <CardContent className="p-12 text-center">
                  <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" />
                  <p className="neo-text">LOADING ORDERS...</p>
                </CardContent>
              </Card>
            ) : orders.length === 0 ? (
              <Card>
                <CardContent className="p-12 text-center">
                  <p className="neo-text text-gray-600">NO ORDERS FOUND</p>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    {orders.map((order) => (
                      <div
                        key={order.id}
                        className="neo-border p-6 bg-white"
                      >
                        <div className="flex items-center justify-between mb-4">
                          <div>
                            <h4 className="neo-heading text-xl mb-1">Order #{order.id.slice(0, 8)}</h4>
                            <p className="neo-text text-gray-600">{order.customer.name} ({order.customer.email})</p>
                            <p className="neo-text text-sm text-gray-500">
                              {new Date(order.createdAt).toLocaleString()}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="neo-heading text-2xl mb-1">${order.amount}</p>
                            <span className={`px-3 py-1 neo-border neo-shadow-sm text-xs ${
                              order.status === "COMPLETED" ? "bg-green-400" :
                              order.status === "PENDING" ? "bg-yellow-400" :
                              "bg-red-400"
                            }`}>
                              {order.status}
                            </span>
                          </div>
                        </div>
                        <div className="bg-gray-100 p-4 neo-border">
                          <h5 className="neo-heading text-sm mb-2">ITEMS:</h5>
                          {order.items.map((item) => (
                            <p key={item.id} className="neo-text text-sm">
                              {item.agentName} × {item.quantity} - ${item.price}
                            </p>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        )}

        {/* Users Tab */}
        {activeTab === "users" && (
          <div className="space-y-6">
            <h2 className="neo-heading text-3xl">ALL USERS</h2>
            {usersLoading ? (
              <Card>
                <CardContent className="p-12 text-center">
                  <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" />
                  <p className="neo-text">LOADING USERS...</p>
                </CardContent>
              </Card>
            ) : users.length === 0 ? (
              <Card>
                <CardContent className="p-12 text-center">
                  <p className="neo-text text-gray-600">NO USERS FOUND</p>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    {users.map((user) => (
                      <div
                        key={user.id}
                        className="neo-border p-6 bg-white flex items-center justify-between"
                      >
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="neo-heading text-xl">{user.fullName}</h3>
                            <span className={`px-3 py-1 neo-border neo-shadow-sm text-xs ${
                              user.role === "ADMIN" ? "bg-red-400" :
                              user.role === "VENDOR" ? "bg-green-400" :
                              "bg-blue-400"
                            }`}>
                              {user.role}
                            </span>
                          </div>
                          <p className="neo-text text-gray-600">{user.email}</p>
                          {user.companyName && (
                            <p className="neo-text text-sm text-gray-500">{user.companyName}</p>
                          )}
                        </div>
                        <div className="text-right">
                          <p className="neo-heading text-xl mb-1">{user.stats.products}</p>
                          <p className="neo-text text-gray-600">PRODUCTS</p>
                          <p className="neo-heading text-xl mt-2">{user.stats.orders}</p>
                          <p className="neo-text text-gray-600">ORDERS</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
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
