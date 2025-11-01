"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Key, Download, ExternalLink, Star, Calendar, Copy, CheckCircle } from "lucide-react";
import { useUser } from "@clerk/nextjs";

interface PurchasedAgent {
  id: string;
  name: string;
  shortDescription: string | null;
  imageUrl: string | null;
  category: string | null;
  features: string[];
  demoUrl: string | null;
  documentationUrl: string | null;
  vendor: {
    id: string;
    name: string;
  };
  apiKeys: string[];
  apiKeyCount: number;
  purchasedAt: string;
  totalSpent: string;
}

export default function PurchasesPage() {
  const { user } = useUser();
  const router = useRouter();
  const [agents, setAgents] = useState<PurchasedAgent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  useEffect(() => {
    const fetchPurchases = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/user/agents");
        if (!response.ok) {
          if (response.status === 401) {
            router.push("/sign-in");
            return;
          }
          throw new Error("Failed to fetch purchases");
        }
        const data = await response.json();
        setAgents(data.agents || []);
        setError(null);
      } catch (err: any) {
        console.error("Error fetching purchases:", err);
        setError(err.message || "Failed to load purchases");
      } finally {
        setLoading(false);
      }
    };

    fetchPurchases();
  }, [router]);

  const copyToClipboard = (text: string, keyId: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(keyId);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const totalAgents = agents.length;
  const totalSpent = agents.reduce((sum, agent) => sum + parseFloat(agent.totalSpent), 0);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8 px-4 flex items-center justify-center">
        <div className="text-center">
          <p className="neo-heading text-4xl mb-4">LOADING PURCHASES...</p>
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
          <Link href="/shop">
            <Button>BACK TO SHOP</Button>
          </Link>
        </div>
      </div>
    );
  }

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
              <h3 className="neo-heading text-3xl mb-1">{totalAgents}</h3>
              <p className="neo-text">AI AGENTS OWNED</p>
            </CardContent>
          </Card>
          <Card className="bg-pink-400">
            <CardContent className="p-6">
              <h3 className="neo-heading text-3xl mb-1">
                ${totalSpent.toFixed(2)}
              </h3>
              <p className="neo-text">TOTAL SPENT</p>
            </CardContent>
          </Card>
          <Card className="bg-cyan-400">
            <CardContent className="p-6">
              <h3 className="neo-heading text-3xl mb-1">
                {agents.reduce((sum, agent) => sum + agent.apiKeys.length, 0)}
              </h3>
              <p className="neo-text">TOTAL API KEYS</p>
            </CardContent>
          </Card>
        </div>

        {/* Purchased Agents */}
        {agents.length === 0 ? (
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
        ) : (
          <div className="space-y-6">
            {agents.map((agent) => (
              <Card key={agent.id}>
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row gap-6">
                    {/* Agent Image/Icon */}
                    <div className="w-32 h-32 bg-gradient-to-br from-purple-400 to-pink-400 flex-shrink-0 flex items-center justify-center neo-border overflow-hidden">
                      {agent.imageUrl ? (
                        <img src={agent.imageUrl} alt={agent.name} className="w-full h-full object-cover" />
                      ) : (
                        <span className="neo-heading text-white text-3xl">AI</span>
                      )}
                    </div>

                    {/* Agent Info */}
                    <div className="flex-1">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <Link href={`/product/${agent.id}`}>
                            <h3 className="neo-heading text-2xl mb-1 hover:text-pink-500 transition-colors">
                              {agent.name}
                            </h3>
                          </Link>
                          <p className="neo-text text-gray-600">by {agent.vendor.name}</p>
                        </div>
                        {agent.category && (
                          <span className="neo-text text-xs bg-yellow-400 px-3 py-1 neo-border">
                            {agent.category.toUpperCase()}
                          </span>
                        )}
                      </div>

                      {agent.shortDescription && (
                        <p className="neo-text text-sm text-gray-600 mb-4">
                          {agent.shortDescription}
                        </p>
                      )}

                      <div className="flex flex-wrap gap-4 mb-4 text-sm">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-gray-500" />
                          <span className="neo-text text-gray-600">
                            Purchased: {new Date(agent.purchasedAt).toLocaleDateString()}
                          </span>
                        </div>
                        {agent.apiKeyCount > 1 && (
                          <div className="flex items-center gap-2">
                            <Key className="w-4 h-4 text-gray-500" />
                            <span className="neo-text text-gray-600">
                              {agent.apiKeyCount} API Keys
                            </span>
                          </div>
                        )}
                        <div className="flex items-center gap-2">
                          <span className="bg-green-500 text-white px-3 py-1 neo-border text-xs neo-shadow-sm">
                            ACTIVE
                          </span>
                        </div>
                      </div>

                      {/* API Keys */}
                      <div className="space-y-3 mb-4">
                        {agent.apiKeys.map((apiKey, index) => {
                          const keyId = `${agent.id}-${index}`;
                          return (
                            <div key={keyId} className="bg-gray-100 neo-border p-4">
                              <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center gap-2">
                                  <Key className="w-4 h-4 text-gray-600" />
                                  <span className="neo-text text-sm font-bold">
                                    API KEY {agent.apiKeys.length > 1 ? `${index + 1}` : ""}
                                  </span>
                                </div>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => copyToClipboard(apiKey, keyId)}
                                >
                                  {copiedKey === keyId ? (
                                    <>
                                      <CheckCircle className="w-4 h-4 mr-2" />
                                      COPIED!
                                    </>
                                  ) : (
                                    <>
                                      <Copy className="w-4 h-4 mr-2" />
                                      COPY
                                    </>
                                  )}
                                </Button>
                              </div>
                              <code className="neo-text text-xs break-all">{apiKey}</code>
                            </div>
                          );
                        })}
                      </div>

                      {/* Actions */}
                      <div className="flex flex-wrap gap-3">
                        <Link href={`/product/${agent.id}`}>
                          <Button variant="outline" size="sm">
                            VIEW DETAILS
                          </Button>
                        </Link>
                        {agent.documentationUrl && (
                          <Link href={agent.documentationUrl} target="_blank" rel="noopener noreferrer">
                            <Button variant="outline" size="sm">
                              <ExternalLink className="w-4 h-4 mr-2" />
                              DOCUMENTATION
                            </Button>
                          </Link>
                        )}
                        {agent.demoUrl && (
                          <Link href={agent.demoUrl} target="_blank" rel="noopener noreferrer">
                            <Button variant="outline" size="sm">
                              <ExternalLink className="w-4 h-4 mr-2" />
                              TRY DEMO
                            </Button>
                          </Link>
                        )}
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
        )}
      </div>
    </div>
  );
}
