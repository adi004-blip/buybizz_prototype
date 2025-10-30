"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Key, Copy, RefreshCw, Download, Shield, AlertCircle } from "lucide-react";

export default function DownloadsPage() {
  const [copiedKeys, setCopiedKeys] = useState<Set<string>>(new Set());

  // Mock data - in real app, fetch from API
  const agents = [
    {
      id: 1,
      name: "AI COPYWRITER PRO",
      vendor: "AIWRITER",
      apiKey: "bb_live_sk_a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6",
      createdAt: "2024-01-15",
      lastUsed: "2024-01-20",
      usage: 1247,
      downloads: [
        { name: "API Documentation", url: "#", type: "PDF" },
        { name: "Quick Start Guide", url: "#", type: "PDF" },
        { name: "SDK Package", url: "#", type: "ZIP" }
      ]
    },
    {
      id: 2,
      name: "CODE ASSISTANT AGENT",
      vendor: "DEVTECH",
      apiKey: "bb_live_sk_z9y8x7w6v5u4t3s2r1q0p9o8n7m6l5k",
      createdAt: "2024-01-10",
      lastUsed: "2024-01-19",
      usage: 892,
      downloads: [
        { name: "API Documentation", url: "#", type: "PDF" },
        { name: "Code Examples", url: "#", type: "ZIP" }
      ]
    }
  ];

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
    // In real app, this would call API to regenerate key
    alert("API key regeneration would be handled here");
  };

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
        <div className="space-y-6">
          {agents.map((agent) => (
            <Card key={agent.id}>
              <CardContent className="p-6">
                <div className="mb-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="neo-heading text-2xl mb-1">{agent.name}</h3>
                      <p className="neo-text text-gray-600">by {agent.vendor}</p>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => regenerateKey(agent.id.toString())}
                      className="text-red-500 hover:bg-red-50"
                    >
                      <RefreshCw className="w-4 h-4 mr-2" />
                      REGENERATE KEY
                    </Button>
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
                        onClick={() => copyToClipboard(agent.apiKey, agent.id.toString())}
                      >
                        {copiedKeys.has(agent.id.toString()) ? (
                          <>
                            <Copy className="w-4 h-4 mr-2" />
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
                    <code className="neo-text text-xs break-all">{agent.apiKey}</code>
                  </div>

                  {/* Key Stats */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <div className="bg-white neo-border p-4">
                      <p className="neo-text text-xs text-gray-600 mb-1">CREATED</p>
                      <p className="neo-heading">{agent.createdAt}</p>
                    </div>
                    <div className="bg-white neo-border p-4">
                      <p className="neo-text text-xs text-gray-600 mb-1">LAST USED</p>
                      <p className="neo-heading">{agent.lastUsed}</p>
                    </div>
                    <div className="bg-white neo-border p-4">
                      <p className="neo-text text-xs text-gray-600 mb-1">API CALLS</p>
                      <p className="neo-heading">{agent.usage.toLocaleString()}</p>
                    </div>
                  </div>

                  {/* Downloads */}
                  <div>
                    <h4 className="neo-heading text-lg mb-4">DOWNLOADS</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {agent.downloads.map((download, index) => (
                        <Card key={index} className="bg-white">
                          <CardContent className="p-4">
                            <div className="flex items-center justify-between mb-2">
                              <Download className="w-5 h-5 text-gray-600" />
                              <span className="neo-text text-xs bg-gray-200 px-2 py-1 neo-border">
                                {download.type}
                              </span>
                            </div>
                            <h5 className="neo-heading text-sm mb-2">{download.name}</h5>
                            <Link href={download.url}>
                              <Button variant="outline" size="sm" className="w-full">
                                DOWNLOAD
                              </Button>
                            </Link>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

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
