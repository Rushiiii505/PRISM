"use client";

import React, { useState } from "react";
import { X, ShieldCheck, Check, Loader2, Link2, ExternalLink } from "lucide-react";
import { usePrismStore } from "@/lib/store";

interface SocialConnectModalProps {
  platform: "x" | "linkedin" | "discord" | null;
  onClose: () => void;
}

export default function SocialConnectModal({ platform, onClose }: SocialConnectModalProps) {
  const { setSocialConnected } = usePrismStore();
  const [tokenInput, setTokenInput] = useState("");
  const [usernameInput, setUsernameInput] = useState("");
  const [isConnecting, setIsConnecting] = useState(false);

  if (!platform) return null;

  const titleMap = {
    x: "Connect X (Twitter) OAuth 2.0",
    linkedin: "Connect LinkedIn Developer OAuth",
    discord: "Connect Discord Webhook / Bot Token",
  };

  const placeholderMap = {
    x: "Paste X User Bearer / Access Token (e.g. AAAAAAAAAAAAAAAAAAAAA...)",
    linkedin: "Paste LinkedIn OAuth Access Token (e.g. AQX...)",
    discord: "Paste Discord Channel Webhook URL (https://discord.com/api/webhooks/...)",
  };

  const docUrlMap = {
    x: "https://developer.x.com/en/docs",
    linkedin: "https://learn.microsoft.com/en-us/linkedin/shared/authentication/authentication",
    discord: "https://support.discord.com/hc/en-us/articles/228383668-Intro-to-Webhooks",
  };

  const handleConnect = async () => {
    if (!tokenInput.trim()) return;

    setIsConnecting(true);
    try {
      const res = await fetch("/api/vault/social", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          platform,
          accessToken: tokenInput,
          platformUser: usernameInput || `${platform}_dev`,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error || "Connection failed");

      setSocialConnected(platform, true);
      alert(`Successfully connected ${platform.toUpperCase()} live!`);
      onClose();
    } catch (err: any) {
      alert(`Connection Error: ${err.message}`);
    } finally {
      setIsConnecting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-lg rounded-3xl border-2 border-[#3B28CC] shadow-2xl p-6 sm:p-8 space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#3B28CC] flex items-center justify-center text-[#D4FF33]">
              <Link2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-extrabold text-[#1A1A1A]">{titleMap[platform]}</h3>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Live Vault OAuth Integration
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-100 text-gray-500 hover:text-black"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="text-xs font-extrabold uppercase text-gray-700">Account Handle / Name</label>
            <input
              type="text"
              placeholder="e.g. @prism_engine or #announcements"
              value={usernameInput}
              onChange={(e) => setUsernameInput(e.target.value)}
              className="w-full mt-1.5 rounded-xl border border-gray-300 px-3.5 py-2.5 text-sm font-medium focus:border-[#3B28CC] focus:outline-none"
            />
          </div>

          <div>
            <div className="flex items-center justify-between">
              <label className="text-xs font-extrabold uppercase text-gray-700">
                {platform === "discord" ? "Webhook URL" : "OAuth Access Token"}
              </label>
              <a
                href={docUrlMap[platform]}
                target="_blank"
                rel="noreferrer"
                className="text-[11px] font-bold text-[#3B28CC] flex items-center gap-1 hover:underline"
              >
                <span>Get Token</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
            <textarea
              rows={3}
              placeholder={placeholderMap[platform]}
              value={tokenInput}
              onChange={(e) => setTokenInput(e.target.value)}
              className="w-full mt-1.5 rounded-xl border border-gray-300 p-3 text-xs font-mono focus:border-[#3B28CC] focus:outline-none"
            />
          </div>

          <div className="p-3.5 rounded-2xl bg-[#3B28CC]/5 border border-[#3B28CC]/20 flex items-center gap-2.5">
            <ShieldCheck className="w-4 h-4 text-[#3B28CC] shrink-0" />
            <p className="text-[11px] text-gray-600 font-medium">
              Prism will send a test ping to authorize and store this token encrypted in your local Vault database.
            </p>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            onClick={onClose}
            className="px-4 py-2.5 rounded-full text-xs font-extrabold text-gray-600 hover:bg-gray-100"
          >
            Cancel
          </button>
          <button
            disabled={isConnecting || !tokenInput.trim()}
            onClick={handleConnect}
            className="btn-pill-accent text-xs py-2.5 px-6 disabled:opacity-50"
          >
            {isConnecting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-[#1A1A1A]" />
                <span>Verifying Token...</span>
              </>
            ) : (
              <>
                <span>Authorize & Connect Live</span>
                <div className="arrow-badge-black">↗</div>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
