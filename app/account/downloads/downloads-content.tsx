"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Key, Copy, RefreshCw, Download, Shield, AlertCircle, CheckCircle } from "lucide-react";

interface Agent {
  id: string;
  name: string;
  vendor: string;
  apiKeys: string[];
  purchasedAt: string;
  documentationUrl: string | null;
}

export default function DownloadsPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const agentFilter = searchParams.get("agent");
  const [agents, setAgents] = useState<Agent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copiedKeys, setCopiedKeys] = useState<Set<string>>(new Set());

  useEffect(() => {
    const fetchAgents = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/user/agents");
        if (!response.ok) {
          if (response.status === 401) {
            router.push("/sign-in");
            return;
          }
          throw new Error("Failed to fetch agents");
        }
        const data = await response.json();
        let agentsData = data.agents || [];

        // Filter by agent if query param provided
        if (agentFilter) {
          agentsData = agentsData.filter((a: Agent) => a.id === agentFilter);
        }

        // Transform to match component format
        const transformedAgents = agentsData.map((agent: any) => ({
          id: agent.id,
          name: agent.name,
          vendor: agent.vendor.name,
          apiKeys: agent.apiKeys,
          purchasedAt: agent.purchasedAt,
          documentationUrl: agent.documentationUrl,
        }));

        setAgents(transformedAgents);
        setError(null);
      } catch (err: any) {
        console.error("Error fetching agents:", err);
        setError(err.message || "Failed to load agents");
      } finally {
        setLoading(false);
      }
    };

    fetchAgents();
  }, [router, agentFilter]);

  const copyToClipboard = (text: string, keyId: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKeys(prev => new Set(prev).add(keyId));
    setTimeout(() => {
      setCopiedKeys(prev => {
        const newSet = new Set(prev);
        newSet.delete(keyId);
        return newSet;
      });
    }, 2000);
  };

  const regenerateKey = (agentId: string) => {
    // TODO: Implement API key regeneration in Phase 6
    alert("API key regeneration will be available soon");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8 px-4 flex items-center justify-center">
        <div className="text-center">
          <p className="neo-heading text-4xl mb-4">LOADING API KEYS...</p>
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
          <Link href="/account/purchases">
            <Button>BACK TO PURCHASES</Button>
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
            ACCESS <span className="text-pink-500">KEYS</span>
          </h1>
          <p className="neo-text text-xl text-gray-600">
            MANAGE YOUR API KEYS AND DOWNLOADS
          </p>
        </div>

        {/* Security Notice */}
        <Card className="mb-6 bg-yellow-400">
          <CardContent className="p-6">
            <div className="flex items-start gap-3">
              <Shield className="w-6 h-6 flex-shrink-0 mt-1" />
              <div>
                <h3 className="neo-heading text-lg mb-2">KEEP YOUR API KEYS SECURE</h3>
                <p className="neo-text text-sm">
                  NEVER SHARE YOUR API KEYS PUBLICLY. IF COMPROMISED, REGENERATE THEM IMMEDIATELY.
                  THESE KEYS PROVIDE FULL ACCESS TO YOUR AI AGENTS.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Agents List */}
        {agents.length === 0 ? (
          <Card className="text-center py-16">
            <CardContent>
              <h2 className="neo-heading text-3xl mb-4">NO API KEYS FOUND</h2>
              <p className="neo-text text-gray-600 mb-8">
                {agentFilter ? "No keys found for this agent." : "You haven't purchased any agents yet."}
              </p>
              <Link href="/shop">
                <Button size="lg">BROWSE AI AGENTS</Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {agents.map((agent) => (
              <Card key={agent.id}>
                <CardContent className="p-6">
                  <div className="mb-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <Link href={`/product/${agent.id}`}>
                          <h3 className="neo-heading text-2xl mb-1 hover:text-pink-500 transition-colors">
                            {agent.name}
                          </h3>
                        </Link>
                        <p className="neo-text text-gray-600">by {agent.vendor}</p>
                      </div>
                      {agent.apiKeys.length > 1 && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => regenerateKey(agent.id)}
                          className="text-red-500 hover:bg-red-50"
                          disabled
                        >
                          <RefreshCw className="w-4 h-4 mr-2" />
                          REGENERATE KEY
                        </Button>
                      )}
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
                                {copiedKeys.has(keyId) ? (
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

                    {/* Key Stats */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                      <div className="bg-white neo-border p-4">
                        <p className="neo-text text-xs text-gray-600 mb-1">PURCHASED</p>
                        <p className="neo-heading">
                          {new Date(agent.purchasedAt).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="bg-white neo-border p-4">
                        <p className="neo-text text-xs text-gray-600 mb-1">TOTAL KEYS</p>
                        <p className="neo-heading">{agent.apiKeys.length}</p>
                      </div>
                    </div>

                    {/* Downloads */}
                    {agent.documentationUrl && (
                      <div>
                        <h4 className="neo-heading text-lg mb-4">DOCUMENTATION</h4>
                        <Card className="bg-white">
                          <CardContent className="p-4">
                            <div className="flex items-center justify-between mb-2">
                              <Download className="w-5 h-5 text-gray-600" />
                              <span className="neo-text text-xs bg-gray-200 px-2 py-1 neo-border">
                                LINK
                              </span>
                            </div>
                            <h5 className="neo-heading text-sm mb-2">API DOCUMENTATION</h5>
                            <Link href={agent.documentationUrl} target="_blank" rel="noopener noreferrer">
                              <Button variant="outline" size="sm" className="w-full">
                                VIEW DOCS
                              </Button>
                            </Link>
                          </CardContent>
                        </Card>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Warning */}
        <Card className="mt-6 bg-red-500 text-white">
          <CardContent className="p-6">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-6 h-6 flex-shrink-0 mt-1" />
              <div>
                <h3 className="neo-heading text-lg mb-2">SECURITY BEST PRACTICES</h3>
                <ul className="neo-text text-sm space-y-1">
                  <li>• NEVER COMMIT API KEYS TO VERSION CONTROL</li>
                  <li>• USE ENVIRONMENT VARIABLES IN YOUR APPLICATIONS</li>
                  <li>• ROTATE KEYS REGULARLY FOR SECURITY</li>
                  <li>• REPORT SUSPICIOUS ACTIVITY IMMEDIATELY</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

