"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Save, Trash2 } from "lucide-react";

export default function EditProductPage() {
  const router = useRouter();
  const params = useParams();
  const productId = params.id as string;
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    shortDescription: "",
    price: "",
    originalPrice: "",
    category: "",
    demoUrl: "",
    documentationUrl: "",
    features: [""],
    tags: "",
    status: "ACTIVE"
  });

  // Fetch product data
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/agents/${productId}`);
        if (!response.ok) {
          throw new Error("Failed to fetch product");
        }
        const product = await response.json();
        setFormData({
          name: product.name || "",
          description: product.description || "",
          shortDescription: product.shortDescription || "",
          price: product.price?.toString() || "",
          originalPrice: product.originalPrice?.toString() || "",
          category: product.category || "",
          demoUrl: product.demoUrl || "",
          documentationUrl: product.documentationUrl || "",
          features: product.features && product.features.length > 0 ? product.features : [""],
          tags: product.tags || "",
          status: product.status || "ACTIVE"
        });
        setError(null);
      } catch (err: any) {
        console.error("Error fetching product:", err);
        setError(err.message || "Failed to load product");
      } finally {
        setLoading(false);
      }
    };

    if (productId) {
      fetchProduct();
    }
  }, [productId]);

  const categories = [
    { value: "writing", label: "WRITING AI" },
    { value: "coding", label: "CODE ASSISTANTS" },
    { value: "marketing", label: "MARKETING AI" },
    { value: "analytics", label: "ANALYTICS" },
    { value: "design", label: "DESIGN AI" }
  ];

  const handleAddFeature = () => {
    setFormData({ ...formData, features: [...formData.features, ""] });
  };

  const handleFeatureChange = (index: number, value: string) => {
    const newFeatures = [...formData.features];
    newFeatures[index] = value;
    setFormData({ ...formData, features: newFeatures });
  };

  const handleRemoveFeature = (index: number) => {
    const newFeatures = formData.features.filter((_, i) => i !== index);
    setFormData({ ...formData, features: newFeatures });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    
    try {
      const response = await fetch(`/api/agents/${productId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name,
          description: formData.description,
          shortDescription: formData.shortDescription,
          price: formData.price,
          originalPrice: formData.originalPrice || null,
          category: formData.category || null,
          tags: formData.tags || null,
          features: formData.features.filter((f) => f.trim()),
          demoUrl: formData.demoUrl || null,
          documentationUrl: formData.documentationUrl || null,
          status: formData.status,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to update agent");
      }

      router.push("/vendor");
    } catch (error: any) {
      console.error("Error updating agent:", error);
      alert(`Error: ${error.message || "Failed to update agent"}`);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("ARE YOU SURE YOU WANT TO DELETE THIS AI AGENT?")) {
      return;
    }

    try {
      const response = await fetch(`/api/agents/${productId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to delete agent");
      }

      router.push("/vendor");
    } catch (error: any) {
      console.error("Error deleting agent:", error);
      alert(`Error: ${error.message || "Failed to delete agent"}`);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8 px-4 flex items-center justify-center">
        <div className="text-center">
          <p className="neo-heading text-4xl mb-4">LOADING PRODUCT...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 py-8 px-4 flex items-center justify-center">
        <div className="text-center">
          <p className="neo-heading text-4xl mb-4 text-red-500">ERROR</p>
          <p className="neo-text text-xl mb-4">{error}</p>
          <Link href="/vendor">
            <Button>BACK TO DASHBOARD</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="mx-auto max-w-4xl">
        <Link href="/vendor" className="inline-flex items-center gap-2 mb-6 hover:text-pink-500 transition-colors">
          <ArrowLeft className="w-5 h-5" />
          <span className="neo-text">BACK TO DASHBOARD</span>
        </Link>

        <div className="flex justify-between items-center mb-8">
          <h1 className="neo-heading text-5xl md:text-7xl">
            EDIT <span className="text-pink-500">AI AGENT</span>
          </h1>
          <Button
            variant="outline"
            onClick={handleDelete}
            className="text-red-500 hover:bg-red-50"
          >
            <Trash2 className="w-5 h-5 mr-2" />
            DELETE
          </Button>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Basic Information */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="neo-heading text-2xl">BASIC INFORMATION</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="neo-text text-sm mb-2 block">AI AGENT NAME *</label>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>
              <div>
                <label className="neo-text text-sm mb-2 block">SHORT DESCRIPTION *</label>
                <Input
                  value={formData.shortDescription}
                  onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
                  required
                />
              </div>
              <div>
                <label className="neo-text text-sm mb-2 block">FULL DESCRIPTION *</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="neo-input w-full min-h-[200px] resize-y"
                  required
                />
              </div>
              <div>
                <label className="neo-text text-sm mb-2 block">CATEGORY *</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="neo-input w-full"
                  required
                >
                  {categories.map((cat) => (
                    <option key={cat.value} value={cat.value}>
                      {cat.label}
                    </option>
                  ))}
                </select>
              </div>
            </CardContent>
          </Card>

          {/* Pricing */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="neo-heading text-2xl">PRICING</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="neo-text text-sm mb-2 block">LIFETIME DEAL PRICE ($) *</label>
                  <Input
                    type="number"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <label className="neo-text text-sm mb-2 block">ORIGINAL PRICE ($) *</label>
                  <Input
                    type="number"
                    value={formData.originalPrice}
                    onChange={(e) => setFormData({ ...formData, originalPrice: e.target.value })}
                    required
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Links */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="neo-heading text-2xl">LINKS</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="neo-text text-sm mb-2 block">DEMO URL</label>
                <Input
                  type="url"
                  value={formData.demoUrl}
                  onChange={(e) => setFormData({ ...formData, demoUrl: e.target.value })}
                />
              </div>
              <div>
                <label className="neo-text text-sm mb-2 block">DOCUMENTATION URL</label>
                <Input
                  type="url"
                  value={formData.documentationUrl}
                  onChange={(e) => setFormData({ ...formData, documentationUrl: e.target.value })}
                />
              </div>
            </CardContent>
          </Card>

          {/* Features */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="neo-heading text-2xl">KEY FEATURES</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {formData.features.map((feature, index) => (
                <div key={index} className="flex gap-2">
                  <Input
                    value={feature}
                    onChange={(e) => handleFeatureChange(index, e.target.value)}
                    placeholder={`FEATURE ${index + 1}`}
                    className="flex-1"
                  />
                  {formData.features.length > 1 && (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => handleRemoveFeature(index)}
                    >
                      REMOVE
                    </Button>
                  )}
                </div>
              ))}
              <Button type="button" variant="outline" onClick={handleAddFeature}>
                ADD FEATURE
              </Button>
            </CardContent>
          </Card>

          {/* Tags & Status */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="neo-heading text-2xl">ADDITIONAL INFO</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="neo-text text-sm mb-2 block">TAGS (COMMA SEPARATED)</label>
                <Input
                  value={formData.tags}
                  onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                  placeholder="AI, COPYWRITING, MARKETING"
                />
              </div>
              <div>
                <label className="neo-text text-sm mb-2 block">STATUS</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  className="neo-input w-full"
                >
                  <option value="ACTIVE">ACTIVE</option>
                  <option value="INACTIVE">INACTIVE</option>
                </select>
              </div>
            </CardContent>
          </Card>

          {/* Submit */}
          <div className="flex gap-4">
            <Button type="submit" size="lg" disabled={saving} className="bg-yellow-400">
              <Save className="w-5 h-5 mr-2" />
              {saving ? "SAVING..." : "SAVE CHANGES"}
            </Button>
            <Link href="/vendor">
              <Button type="button" variant="outline" size="lg">
                CANCEL
              </Button>
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
