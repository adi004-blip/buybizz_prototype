"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Key, Download, ExternalLink, Star, Calendar } from "lucide-react";
import { useUser } from "@clerk/nextjs";

export default function PurchasesPage() {
  const { user } = useUser();

  // Mock purchased agents - in real app, fetch from API
  const purchasedAgents = [
    {
      id: 1,
      name: "AI COPYWRITER PRO",
      vendor: "AIWRITER",
      purchaseDate: "2024-01-15",
      price: 97,
      apiKey: "bb_live_sk_a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6",
      status: "active",
      rating: 4.9,
      documentationUrl: "#"
    },
    {
      id: 2,
      name: "CODE ASSISTANT AGENT",
      vendor: "DEVTECH",
      purchaseDate: "2024-01-10",
      price: 149,
      apiKey: "bb_live_sk_z9y8x7w6v5u4t3s2r1q0p9o8n7m6l5k",
      status: "active",
      rating: 4.8,
      documentationUrl: "#"
    },
    {
      id: 3,
      name: "SOCIAL MEDIA MANAGER AI",
      vendor: "SOCIALAI",
      purchaseDate: "2024-01-05",
      price: 79,
      apiKey: "bb_live_sk_m5n6o7p8q9r0s1t2u3v4w5x6y7z8a9b0",
      status: "active",
      rating: 4.9,
      documentationUrl: "#"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8">
          <h1 className="neo-heading text-5xl md:text-7xl mb-2">
            MY <span className="text-pink-500">PURCHASES</span>
          </h1>
          <p className="neo-text text-xl text-gray-600">
            WELCOME BACK, {user?.firstName?.toUpperCase() || "USER"}
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-yellow-400">
            <CardContent className="p-6">
              <h3 className="neo-heading text-3xl mb-1">{purchasedAgents.length}</h3>
              <p className="neo-text">AI AGENTS OWNED</p>
            </CardContent>
          </Card>
          <Card className="bg-pink-400">
            <CardContent className="p-6">
              <h3 className="neo-heading text-3xl mb-1">
                ${purchasedAgents.reduce((sum, agent) => sum + agent.price, 0)}
              </h3>
              <p className="neo-text">TOTAL SPENT</p>
            </CardContent>
          </Card>
          <Card className="bg-cyan-400">
            <CardContent className="p-6">
              <h3 className="neo-heading text-3xl mb-1">
                {purchasedAgents.reduce((sum, agent) => sum + agent.rating, 0) / purchasedAgents.length}
              </h3>
              <p className="neo-text">AVG RATING</p>
            </CardContent>
          </Card>
        </div>

        {/* Purchased Agents */}
        <div className="space-y-6">
          {purchasedAgents.map((agent) => (
            <Card key={agent.id}>
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row gap-6">
                  {/* Agent Image/Icon */}
                  <div className="w-32 h-32 bg-gradient-to-br from-purple-400 to-pink-400 flex-shrink-0 flex items-center justify-center neo-border">
                    <span className="neo-heading text-white text-3xl">AI</span>
                  </div>

                  {/* Agent Info */}
                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="neo-heading text-2xl mb-1">{agent.name}</h3>
                        <p className="neo-text text-gray-600">by {agent.vendor}</p>
                      </div>
                      <div className="flex items-center gap-1">
                        <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                        <span className="neo-heading">{agent.rating}</span>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-4 mb-4 text-sm">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-gray-500" />
                        <span className="neo-text text-gray-600">
                          Purchased: {agent.purchaseDate}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="bg-green-500 text-white px-3 py-1 neo-border text-xs neo-shadow-sm">
                          {agent.status.toUpperCase()}
                        </span>
                      </div>
                    </div>

                    {/* API Key */}
                    <div className="bg-gray-100 neo-border p-4 mb-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <Key className="w-4 h-4 text-gray-600" />
                          <span className="neo-text text-sm font-bold">API KEY</span>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => navigator.clipboard.writeText(agent.apiKey)}
                        >
                          COPY
                        </Button>
                      </div>
                      <code className="neo-text text-xs break-all">{agent.apiKey}</code>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-wrap gap-3">
                      <Link href={`/product/${agent.id}`}>
                        <Button variant="outline" size="sm">
                          VIEW DETAILS
                        </Button>
                      </Link>
                      <Link href={agent.documentationUrl}>
                        <Button variant="outline" size="sm">
                          <ExternalLink className="w-4 h-4 mr-2" />
                          DOCUMENTATION
                        </Button>
                      </Link>
                      <Link href={`/account/downloads?agent=${agent.id}`}>
                        <Button variant="secondary" size="sm">
                          <Download className="w-4 h-4 mr-2" />
                          MANAGE ACCESS
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Empty State (if no purchases) */}
        {purchasedAgents.length === 0 && (
          <Card className="text-center py-16">
            <CardContent>
              <h2 className="neo-heading text-3xl mb-4">NO PURCHASES YET</h2>
              <p className="neo-text text-gray-600 mb-8">
                START EXPLORING AI AGENTS AND UNLOCK YOUR FIRST ONE
              </p>
              <Link href="/shop">
                <Button size="lg">
                  BROWSE AI AGENTS
                </Button>
              </Link>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
