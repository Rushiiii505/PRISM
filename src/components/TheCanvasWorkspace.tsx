"use client";

import React, { useState } from "react";
import { usePrismStore } from "@/lib/store";
import InstagramCarouselView from "./InstagramCarouselView";
import ScatterDownloadBar from "./ScatterDownloadBar";
import {
  Layers,
  MessageSquare,
  Send,
  CheckCircle,
  Copy,
  Sparkles,
  Loader2,
  Share2,
} from "lucide-react";

// Inline brand icon SVGs
const XIcon = () => (
  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

const LinkedInIcon = () => (
  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
    <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9v8.37H9.25V10.9H6.46M7.86 6.6a1.64 1.64 0 1 0 0 3.28 1.64 1.64 0 0 0 0-3.28z" />
  </svg>
);

export default function TheCanvasWorkspace() {
  const {
    generatedContent,
    activeWavelengthTab,
    setActiveWavelengthTab,
    updatePostContent,
    isGenerating,
    extractedPr,
  } = usePrismStore();

  const [publishingPlatform, setPublishingPlatform] = useState<string | null>(null);
  const [publishStatus, setPublishStatus] = useState<string | null>(null);
  const [discordWebhookUrl, setDiscordWebhookUrl] = useState("");
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  if (isGenerating) {
    return (
      <div className="w-full max-w-4xl mx-auto px-4 py-16 text-center">
        <div className="prism-card p-12 flex flex-col items-center justify-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-[#3B28CC]/10 flex items-center justify-center text-[#3B28CC] animate-bounce">
            <Sparkles className="w-8 h-8" />
          </div>
          <h3 className="text-2xl font-black text-[#1A1A1A]">STREAMING CONTENT ENGINE...</h3>
          <p className="text-sm font-semibold text-gray-500 max-w-md">
            Analyzing PR diffs and generating X threads, LinkedIn breakdown, Discord release notes, and 5-slide Instagram visual carousel.
          </p>
          <div className="w-48 h-2 bg-gray-200 rounded-full overflow-hidden">
            <div className="w-full h-full bg-[#3B28CC] animate-pulse"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!generatedContent) return null;

  const handleCopyText = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleDirectPublish = async (platform: "x" | "linkedin" | "discord") => {
    setPublishingPlatform(platform);
    setPublishStatus(null);

    let bodyContent = "";
    if (platform === "x") bodyContent = generatedContent.xThread.join("\n\n");
    if (platform === "linkedin") bodyContent = generatedContent.linkedIn;
    if (platform === "discord") bodyContent = generatedContent.discord;

    try {
      const res = await fetch("/api/wavelengths/publish", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          platform,
          content: bodyContent,
          webhookUrl: platform === "discord" ? discordWebhookUrl : undefined,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error || "Publish failed");

      setPublishStatus(data.message);
    } catch (err: any) {
      alert(`Publish Error: ${err.message}`);
    } finally {
      setPublishingPlatform(null);
    }
  };

  return (
    <section className="w-full max-w-6xl mx-auto px-4 py-8 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-300">
      {/* Workspace Navigation Bar */}
      <div className="prism-card p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <span className="text-xs font-black uppercase tracking-widest text-gray-400">
            WAVELENGTHS OMNI-CHANNEL OUTPUT
          </span>
          <span className="asterisk-star text-sm font-black text-[#3B28CC]">✦</span>
        </div>

        {/* Tab Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setActiveWavelengthTab("carousel")}
            className={`btn-pill-primary text-xs py-2 px-4 ${
              activeWavelengthTab === "carousel"
                ? "bg-[#3B28CC] text-white"
                : "bg-gray-100 text-gray-700 shadow-none hover:bg-gray-200"
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Instagram Carousel (5 Slides)</span>
          </button>

          <button
            onClick={() => setActiveWavelengthTab("x")}
            className={`btn-pill-primary text-xs py-2 px-4 ${
              activeWavelengthTab === "x"
                ? "bg-[#3B28CC] text-white"
                : "bg-gray-100 text-gray-700 shadow-none hover:bg-gray-200"
            }`}
          >
            <XIcon />
            <span>X / Twitter Thread</span>
          </button>

          <button
            onClick={() => setActiveWavelengthTab("linkedin")}
            className={`btn-pill-primary text-xs py-2 px-4 ${
              activeWavelengthTab === "linkedin"
                ? "bg-[#3B28CC] text-white"
                : "bg-gray-100 text-gray-700 shadow-none hover:bg-gray-200"
            }`}
          >
            <LinkedInIcon />
            <span>LinkedIn Post</span>
          </button>

          <button
            onClick={() => setActiveWavelengthTab("discord")}
            className={`btn-pill-primary text-xs py-2 px-4 ${
              activeWavelengthTab === "discord"
                ? "bg-[#3B28CC] text-white"
                : "bg-gray-100 text-gray-700 shadow-none hover:bg-gray-200"
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Discord Announcement</span>
          </button>
        </div>
      </div>

      {/* Main Workspace Body */}
      <div className="prism-card p-6 sm:p-8">
        {/* TAB 1: INSTAGRAM CAROUSEL */}
        {activeWavelengthTab === "carousel" && <InstagramCarouselView />}

        {/* TAB 2: X / TWITTER THREAD */}
        {activeWavelengthTab === "x" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-extrabold text-[#1A1A1A] flex items-center gap-2">
                  <XIcon />
                  X / TWITTER TECHNICAL THREAD
                </h3>
                <p className="text-xs font-semibold text-gray-500">
                  3-tweet high engagement technical breakdown with code snippets.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() =>
                    handleCopyText(generatedContent.xThread.join("\n\n---\n\n"), "x")
                  }
                  className="btn-pill-primary text-xs py-2 px-4 bg-gray-100 text-black shadow-none hover:bg-gray-200"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>{copiedKey === "x" ? "Copied!" : "Copy Thread"}</span>
                </button>

                <button
                  disabled={publishingPlatform === "x"}
                  onClick={() => handleDirectPublish("x")}
                  className="btn-pill-accent text-xs py-2 px-4"
                >
                  {publishingPlatform === "x" ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Send className="w-3.5 h-3.5" />
                  )}
                  <span>Publish to X</span>
                  <div className="arrow-badge-black">↗</div>
                </button>
              </div>
            </div>

            {/* Tweet List */}
            <div className="space-y-4">
              {generatedContent.xThread.map((tweet, i) => (
                <div key={i} className="p-4 rounded-2xl bg-gray-50 border border-gray-200">
                  <span className="text-[10px] font-black text-[#3B28CC] uppercase tracking-widest">
                    TWEET {i + 1} OF 3
                  </span>
                  <textarea
                    rows={3}
                    value={tweet}
                    onChange={(e) => {
                      const newThread = [...generatedContent.xThread];
                      newThread[i] = e.target.value;
                      updatePostContent("xThread", newThread);
                    }}
                    className="w-full mt-2 font-medium text-sm text-[#1A1A1A] bg-transparent focus:outline-none"
                  />
                  <div className="mt-2 text-[10px] font-bold text-gray-400 text-right">
                    {tweet.length} / 280 chars
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: LINKEDIN POST */}
        {activeWavelengthTab === "linkedin" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-extrabold text-[#1A1A1A] flex items-center gap-2">
                  <LinkedInIcon />
                  LINKEDIN EXECUTIVE & ENG LEAD BREAKDOWN
                </h3>
                <p className="text-xs font-semibold text-gray-500">
                  Thoughtful leadership release announcement for technical communities.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleCopyText(generatedContent.linkedIn, "linkedin")}
                  className="btn-pill-primary text-xs py-2 px-4 bg-gray-100 text-black shadow-none hover:bg-gray-200"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>{copiedKey === "linkedin" ? "Copied!" : "Copy Post"}</span>
                </button>

                <button
                  disabled={publishingPlatform === "linkedin"}
                  onClick={() => handleDirectPublish("linkedin")}
                  className="btn-pill-accent text-xs py-2 px-4"
                >
                  {publishingPlatform === "linkedin" ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Send className="w-3.5 h-3.5" />
                  )}
                  <span>Publish to LinkedIn</span>
                  <div className="arrow-badge-black">↗</div>
                </button>
              </div>
            </div>

            <textarea
              rows={10}
              value={generatedContent.linkedIn}
              onChange={(e) => updatePostContent("linkedIn", e.target.value)}
              className="w-full rounded-2xl border border-gray-300 p-4 text-sm font-medium text-[#1A1A1A] bg-gray-50 focus:bg-white focus:border-[#3B28CC] focus:outline-none"
            />
          </div>
        )}

        {/* TAB 4: DISCORD ANNOUNCEMENT */}
        {activeWavelengthTab === "discord" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-extrabold text-[#1A1A1A] flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 text-[#3B28CC]" />
                  DISCORD COMMUNITY MARKDOWN RELEASE
                </h3>
                <p className="text-xs font-semibold text-gray-500">
                  Formatted markdown announcement ready for developer Discord channels.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleCopyText(generatedContent.discord, "discord")}
                  className="btn-pill-primary text-xs py-2 px-4 bg-gray-100 text-black shadow-none hover:bg-gray-200"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>{copiedKey === "discord" ? "Copied!" : "Copy Markdown"}</span>
                </button>

                <button
                  disabled={publishingPlatform === "discord"}
                  onClick={() => handleDirectPublish("discord")}
                  className="btn-pill-accent text-xs py-2 px-4"
                >
                  {publishingPlatform === "discord" ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Send className="w-3.5 h-3.5" />
                  )}
                  <span>Broadcast Webhook</span>
                  <div className="arrow-badge-black">↗</div>
                </button>
              </div>
            </div>

            {/* Optional Discord Webhook Input */}
            <div className="p-4 rounded-2xl bg-[#3B28CC]/5 border border-[#3B28CC]/20 space-y-2">
              <label className="text-xs font-bold uppercase text-[#3B28CC]">
                Optional: Direct Discord Webhook URL
              </label>
              <input
                type="text"
                placeholder="https://discord.com/api/webhooks/123456789/abc..."
                value={discordWebhookUrl}
                onChange={(e) => setDiscordWebhookUrl(e.target.value)}
                className="w-full rounded-xl border border-gray-300 px-3 py-2 text-xs font-mono focus:border-[#3B28CC] focus:outline-none bg-white"
              />
            </div>

            <textarea
              rows={8}
              value={generatedContent.discord}
              onChange={(e) => updatePostContent("discord", e.target.value)}
              className="w-full rounded-2xl border border-gray-300 p-4 text-sm font-mono text-[#1A1A1A] bg-gray-900 text-[#D4FF33] focus:outline-none"
            />
          </div>
        )}

        {/* Live Publishing Feedback Banner */}
        {publishStatus && (
          <div className="mt-4 p-4 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center gap-3 text-emerald-800 text-xs font-extrabold animate-in fade-in duration-200">
            <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />
            <span>{publishStatus}</span>
          </div>
        )}
      </div>

      {/* Floating Exporter Bar ("Scatter") */}
      <ScatterDownloadBar
        title={extractedPr?.title || "Dev Update"}
        content={generatedContent}
      />
    </section>
  );
}
