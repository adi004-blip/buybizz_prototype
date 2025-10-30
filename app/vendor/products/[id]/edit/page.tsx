"use client";

import { useState } from "react";
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

  // Mock product data - in real app, fetch from API
  const [formData, setFormData] = useState({
    name: "AI COPYWRITER PRO",
    description: "PREMIUM AI-POWERED COPYWRITING AGENT WITH ADVANCED FEATURES",
    shortDescription: "LIFETIME ACCESS TO AI-POWERED COPYWRITING AGENT",
    price: "97",
    originalPrice: "297",
    category: "writing",
    demoUrl: "https://demo.example.com",
    documentationUrl: "https://docs.example.com",
    features: [
      "ACTIVE NOISE CANCELLATION",
      "30-HOUR BATTERY LIFE",
      "PREMIUM SOUND QUALITY"
    ],
    tags: "AI, COPYWRITING, MARKETING",
    status: "active"
  });

  const categories = [
    { value: "writing", label: "WRITING AI" },
    { value: "coding", label: "CODE ASSISTANTS" },
    { value: "marketing", label: "MARKETING AI" },
    { value: "analytics", label: "ANALYTICS" },
    { value: "design", label: "DESIGN AI" }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    // In real app, this would update via API
    setTimeout(() => {
      setSaving(false);
      router.push("/vendor/products");
    }, 2000);
  };

  const handleDelete = () => {
    if (confirm("ARE YOU SURE YOU WANT TO DELETE THIS AI AGENT?")) {
      // In real app, this would delete via API
      router.push("/vendor/products");
    }
  };

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
