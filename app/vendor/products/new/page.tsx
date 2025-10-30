"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Upload, Save } from "lucide-react";

export default function NewProductPage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);

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
    tags: ""
  });

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
    // In real app, this would submit to API
    setTimeout(() => {
      setSaving(false);
      router.push("/vendor/products");
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="mx-auto max-w-4xl">
        <Link href="/vendor" className="inline-flex items-center gap-2 mb-6 hover:text-pink-500 transition-colors">
          <ArrowLeft className="w-5 h-5" />
          <span className="neo-text">BACK TO DASHBOARD</span>
        </Link>

        <h1 className="neo-heading text-5xl md:text-7xl mb-8">
          CREATE NEW <span className="text-pink-500">AI AGENT</span>
        </h1>

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
                  placeholder="E.G. AI COPYWRITER PRO"
                  required
                />
              </div>
              <div>
                <label className="neo-text text-sm mb-2 block">SHORT DESCRIPTION *</label>
                <Input
                  value={formData.shortDescription}
                  onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
                  placeholder="ONE-LINE DESCRIPTION FOR LISTINGS"
                  required
                />
              </div>
              <div>
                <label className="neo-text text-sm mb-2 block">FULL DESCRIPTION *</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="DETAILED DESCRIPTION OF YOUR AI AGENT..."
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
                  <option value="">SELECT CATEGORY</option>
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
                    placeholder="97"
                    required
                  />
                </div>
                <div>
                  <label className="neo-text text-sm mb-2 block">ORIGINAL PRICE ($) *</label>
                  <Input
                    type="number"
                    value={formData.originalPrice}
                    onChange={(e) => setFormData({ ...formData, originalPrice: e.target.value })}
                    placeholder="297"
                    required
                  />
                </div>
              </div>
              <p className="neo-text text-xs text-gray-600">
                SHOW CUSTOMERS THE VALUE THEY'RE GETTING WITH YOUR LIFETIME DEAL
              </p>
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
                  />
                  {formData.features.length > 1 && (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => handleRemoveFeature(index)}
                      className="text-red-500"
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

          {/* Links & Media */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="neo-heading text-2xl">LINKS & MEDIA</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="neo-text text-sm mb-2 block">DEMO URL</label>
                <Input
                  type="url"
                  value={formData.demoUrl}
                  onChange={(e) => setFormData({ ...formData, demoUrl: e.target.value })}
                  placeholder="HTTPS://DEMO.EXAMPLE.COM"
                />
              </div>
              <div>
                <label className="neo-text text-sm mb-2 block">DOCUMENTATION URL</label>
                <Input
                  type="url"
                  value={formData.documentationUrl}
                  onChange={(e) => setFormData({ ...formData, documentationUrl: e.target.value })}
                  placeholder="HTTPS://DOCS.EXAMPLE.COM"
                />
              </div>
              <div>
                <label className="neo-text text-sm mb-2 block">PRODUCT IMAGE</label>
                <div className="border-2 border-dashed border-black p-8 text-center">
                  <Upload className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                  <p className="neo-text text-gray-600 mb-2">DRAG & DROP OR CLICK TO UPLOAD</p>
                  <p className="neo-text text-xs text-gray-500">PNG, JPG UP TO 10MB</p>
                  <Button type="button" variant="outline" className="mt-4">
                    SELECT FILE
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Tags */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="neo-heading text-2xl">TAGS</CardTitle>
            </CardHeader>
            <CardContent>
              <Input
                value={formData.tags}
                onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                placeholder="AI, COPYWRITING, MARKETING (COMMA SEPARATED)"
              />
              <p className="neo-text text-xs text-gray-600 mt-2">
                ADD TAGS TO HELP CUSTOMERS FIND YOUR AI AGENT
              </p>
            </CardContent>
          </Card>

          {/* Submit */}
          <div className="flex gap-4">
            <Button type="submit" size="lg" disabled={saving} className="bg-yellow-400">
              <Save className="w-5 h-5 mr-2" />
              {saving ? "SAVING..." : "CREATE AI AGENT"}
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
