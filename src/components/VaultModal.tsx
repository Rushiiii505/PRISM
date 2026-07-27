"use client";

import React, { useState } from "react";
import Image from "next/image";
import { usePrismStore } from "@/lib/store";
import SocialConnectModal from "./SocialConnectModal";
import { X, Key, ShieldCheck, Palette, Share2, Check, Lock, Sparkles, Loader2 } from "lucide-react";

export default function VaultModal() {
  const {
    isVaultOpen,
    setIsVaultOpen,
    brandKit,
    setBrandKit,
    apiKeysConfigured,
    setApiKeyConfigured,
    connectedSocials,
    setSocialConnected,
  } = usePrismStore();

  const [activeTab, setActiveTab] = useState<"keys" | "brand" | "socials">("keys");

  // API Key Inputs
  const [keyValues, setKeyValues] = useState<Record<string, string>>({
    openai: "",
    anthropic: "",
    replicate: "",
    fal: "",
  });
  const [savingKey, setSavingKey] = useState<string | null>(null);

  // Social Connect Modal State
  const [connectPlatformModal, setConnectPlatformModal] = useState<"x" | "linkedin" | "discord" | null>(null);

  // Brand Kit local form
  const [brandForm, setBrandForm] = useState(brandKit);

  if (!isVaultOpen) return null;

  const handleSaveKey = async (provider: "openai" | "anthropic" | "replicate" | "fal") => {
    const val = keyValues[provider];
    if (!val.trim()) return;

    setSavingKey(provider);
    try {
      const res = await fetch("/api/vault/keys", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ provider, apiKey: val }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error || "Save failed");

      setApiKeyConfigured(provider, true);
      setKeyValues((prev) => ({ ...prev, [provider]: "" }));
      alert(`API Key for ${provider.toUpperCase()} verified live & encrypted in Vault! 🔐`);
    } catch (err: any) {
      alert(`Vault Key Error: ${err.message}`);
    } finally {
      setSavingKey(null);
    }
  };

  const handleSaveBrandKit = async () => {
    try {
      const res = await fetch("/api/vault/brand", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(brandForm),
      });

      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error || "Brand save failed");

      setBrandKit(brandForm);
      alert("Brand Kit settings updated successfully!");
    } catch (err: any) {
      alert(`Brand Save Error: ${err.message}`);
    }
  };

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
        <div className="bg-[#F7F7F5] w-full max-w-2xl rounded-3xl border-2 border-gray-300 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
          {/* Header with Prism.png Logo */}
          <div className="p-6 bg-white border-b border-gray-200 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-[#3B28CC] p-1.5 flex items-center justify-center text-white shadow-md relative overflow-hidden">
                <Image
                  src="/prism.png"
                  alt="Prism Logo"
                  width={40}
                  height={40}
                  className="object-contain rounded-xl"
                  unoptimized
                />
              </div>
              <div>
                <h2 className="text-xl font-extrabold text-[#1A1A1A]">THE VAULT</h2>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  AES-256 Encrypted API Key & Brand Engine
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsVaultOpen(false)}
              className="p-2 rounded-full hover:bg-gray-100 text-gray-500 hover:text-black transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Tab Selection */}
          <div className="flex border-b border-gray-200 bg-gray-100/60 p-1.5 gap-2 px-6">
            <button
              onClick={() => setActiveTab("keys")}
              className={`flex-1 py-2 px-4 rounded-xl text-xs font-extrabold transition-all flex items-center justify-center gap-2 ${
                activeTab === "keys"
                  ? "bg-white text-[#3B28CC] shadow-sm border border-gray-200"
                  : "text-gray-600 hover:text-black"
              }`}
            >
              <Key className="w-3.5 h-3.5" />
              <span>API Keys</span>
            </button>
            <button
              onClick={() => setActiveTab("brand")}
              className={`flex-1 py-2 px-4 rounded-xl text-xs font-extrabold transition-all flex items-center justify-center gap-2 ${
                activeTab === "brand"
                  ? "bg-white text-[#3B28CC] shadow-sm border border-gray-200"
                  : "text-gray-600 hover:text-black"
              }`}
            >
              <Palette className="w-3.5 h-3.5" />
              <span>Brand Kit</span>
            </button>
            <button
              onClick={() => setActiveTab("socials")}
              className={`flex-1 py-2 px-4 rounded-xl text-xs font-extrabold transition-all flex items-center justify-center gap-2 ${
                activeTab === "socials"
                  ? "bg-white text-[#3B28CC] shadow-sm border border-gray-200"
                  : "text-gray-600 hover:text-black"
              }`}
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>Social OAuth</span>
            </button>
          </div>

          {/* Body Content */}
          <div className="p-6 overflow-y-auto space-y-6">
            {/* TAB 1: API KEYS */}
            {activeTab === "keys" && (
              <div className="space-y-4">
                <div className="p-3.5 rounded-2xl bg-[#3B28CC]/5 border border-[#3B28CC]/20 flex items-center gap-3">
                  <Lock className="w-4 h-4 text-[#3B28CC]" />
                  <p className="text-xs text-gray-700 font-medium">
                    Your keys are verified live against provider APIs, then encrypted with <strong>AES-256-GCM</strong> in your Vault database.
                  </p>
                </div>

                {[
                  { provider: "openai", name: "OpenAI API Key", desc: "For real GPT-4o streaming generation" },
                  { provider: "anthropic", name: "Anthropic Claude API Key", desc: "For Claude 3.5 Sonnet technical writing" },
                  { provider: "replicate", name: "Replicate API Key", desc: "For Stable Diffusion slide assets" },
                  { provider: "fal", name: "fal.ai API Key", desc: "For high-speed SDXL image generation" },
                ].map(({ provider, name, desc }) => {
                  const isConfigured = apiKeysConfigured[provider as keyof typeof apiKeysConfigured];
                  return (
                    <div key={provider} className="p-4 rounded-2xl bg-white border border-gray-200 space-y-2">
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="font-bold text-sm text-[#1A1A1A]">{name}</span>
                          <p className="text-xs text-gray-500">{desc}</p>
                        </div>
                        {isConfigured ? (
                          <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                            <Check className="w-3.5 h-3.5" /> Verified Live
                          </span>
                        ) : (
                          <span className="text-xs font-bold text-amber-600 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200">
                            Not Set
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-2">
                        <input
                          type="password"
                          placeholder={isConfigured ? "••••••••••••••••••••••••" : `Paste ${provider} key...`}
                          value={keyValues[provider]}
                          onChange={(e) => setKeyValues((prev) => ({ ...prev, [provider]: e.target.value }))}
                          className="flex-1 rounded-xl border border-gray-300 px-3 py-2 text-xs font-mono focus:border-[#3B28CC] focus:outline-none"
                        />
                        <button
                          disabled={savingKey === provider || !keyValues[provider]?.trim()}
                          onClick={() => handleSaveKey(provider as any)}
                          className="btn-pill-primary text-xs py-2 px-4 disabled:opacity-50"
                        >
                          {savingKey === provider ? (
                            <>
                              <Loader2 className="w-3.5 h-3.5 animate-spin" />
                              <span>Verifying...</span>
                            </>
                          ) : (
                            <span>Verify & Save</span>
                          )}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* TAB 2: BRAND KIT */}
            {activeTab === "brand" && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold uppercase text-gray-700">Brand Name</label>
                    <input
                      type="text"
                      value={brandForm.brandName}
                      onChange={(e) => setBrandForm({ ...brandForm, brandName: e.target.value })}
                      className="w-full mt-1 rounded-xl border border-gray-300 px-3 py-2 text-sm font-medium focus:border-[#3B28CC] focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold uppercase text-gray-700">Primary Color</label>
                    <div className="flex items-center gap-2 mt-1">
                      <input
                        type="color"
                        value={brandForm.primaryColor}
                        onChange={(e) => setBrandForm({ ...brandForm, primaryColor: e.target.value })}
                        className="w-9 h-9 rounded-lg border border-gray-300 cursor-pointer"
                      />
                      <input
                        type="text"
                        value={brandForm.primaryColor}
                        onChange={(e) => setBrandForm({ ...brandForm, primaryColor: e.target.value })}
                        className="flex-1 rounded-xl border border-gray-300 px-3 py-2 text-sm font-mono focus:border-[#3B28CC] focus:outline-none"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold uppercase text-gray-700">Tone of Voice</label>
                  <input
                    type="text"
                    value={brandForm.toneOfVoice}
                    onChange={(e) => setBrandForm({ ...brandForm, toneOfVoice: e.target.value })}
                    className="w-full mt-1 rounded-xl border border-gray-300 px-3 py-2 text-sm font-medium focus:border-[#3B28CC] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold uppercase text-gray-700">Target Audience</label>
                  <input
                    type="text"
                    value={brandForm.targetAudience}
                    onChange={(e) => setBrandForm({ ...brandForm, targetAudience: e.target.value })}
                    className="w-full mt-1 rounded-xl border border-gray-300 px-3 py-2 text-sm font-medium focus:border-[#3B28CC] focus:outline-none"
                  />
                </div>

                <div className="pt-2 flex justify-end">
                  <button onClick={handleSaveBrandKit} className="btn-pill-accent text-xs py-2.5 px-6">
                    <span>Save Brand Kit</span>
                    <div className="arrow-badge-black">↗</div>
                  </button>
                </div>
              </div>
            )}

            {/* TAB 3: SOCIAL OAUTH */}
            {activeTab === "socials" && (
              <div className="space-y-4">
                <p className="text-xs text-gray-600 font-medium">
                  Connect your community accounts to enable 1-click publishing directly from Prism Wavelengths.
                </p>

                {[
                  { key: "x", name: "X (Twitter) API OAuth 2.0", icon: "🐦" },
                  { key: "linkedin", name: "LinkedIn Organization OAuth", icon: "💼" },
                  { key: "discord", name: "Discord Webhook / Bot Token", icon: "💬" },
                ].map(({ key, name, icon }) => {
                  const isConnected = connectedSocials[key as keyof typeof connectedSocials];
                  return (
                    <div key={key} className="p-4 rounded-2xl bg-white border border-gray-200 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{icon}</span>
                        <div>
                          <h4 className="font-bold text-sm text-[#1A1A1A]">{name}</h4>
                          <p className="text-xs text-gray-500">
                            {isConnected ? "Connected & authorized in Vault" : "Not connected"}
                          </p>
                        </div>
                      </div>

                      <button
                        onClick={() => {
                          if (isConnected) {
                            setSocialConnected(key as any, false);
                          } else {
                            setConnectPlatformModal(key as any);
                          }
                        }}
                        className={`btn-pill-primary text-xs py-1.5 px-4 ${
                          isConnected ? "bg-gray-200 text-black hover:bg-gray-300 shadow-none" : ""
                        }`}
                      >
                        {isConnected ? "Disconnect" : "Connect OAuth ↗"}
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Social Account Connection Popup */}
      <SocialConnectModal
        platform={connectPlatformModal}
        onClose={() => setConnectPlatformModal(null)}
      />
    </>
  );
}
