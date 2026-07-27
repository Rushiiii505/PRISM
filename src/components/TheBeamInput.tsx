"use client";

import React, { useState } from "react";
import { usePrismStore } from "@/lib/store";
import { Sparkles, GitPullRequest, ArrowRight, Loader2, FileCode, CheckCircle2 } from "lucide-react";

export default function TheBeamInput() {
  const {
    inputUrlOrText,
    setInputUrlOrText,
    isExtracting,
    setIsExtracting,
    setExtractedPr,
    isGenerating,
    setIsGenerating,
    setGeneratedContent,
    brandKit,
  } = usePrismStore();

  const [extractedInfo, setLocalExtractedInfo] = useState<any>(null);

  const DEMO_PRS = [
    {
      label: "React PR #28000 (Compiler Update)",
      url: "https://github.com/facebook/react/pull/28000",
    },
    {
      label: "Next.js App Router Optimizations",
      url: "https://github.com/vercel/next.js/pull/60000",
    },
    {
      label: "Prisma v6 Engine Enhancement",
      url: "https://github.com/prisma/prisma/pull/24000",
    },
  ];

  const handleBeamExtractionAndGeneration = async (overrideInput?: string) => {
    const targetInput = overrideInput || inputUrlOrText;
    if (!targetInput.trim()) return;

    setIsExtracting(true);
    setLocalExtractedInfo(null);

    try {
      // Step 1: Extract PR details via /api/beam/extract
      const extractRes = await fetch("/api/beam/extract", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ input: targetInput }),
      });

      const extractData = await extractRes.json();
      if (!extractRes.ok || !extractData.success) {
        throw new Error(extractData.error || "Extraction failed.");
      }

      setExtractedPr(extractData);
      setLocalExtractedInfo(extractData);
      setIsExtracting(false);

      // Step 2: Trigger AI Content Generation via /api/canvas/generate
      setIsGenerating(true);
      const generateRes = await fetch("/api/canvas/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: extractData.title,
          description: extractData.description,
          diff: extractData.diff,
          repoName: extractData.repoName,
          author: extractData.author,
          brandKit,
        }),
      });

      const generateData = await generateRes.json();
      if (!generateRes.ok || !generateData.success) {
        throw new Error(generateData.error || "Generation failed.");
      }

      setGeneratedContent(generateData.data);
    } catch (err: any) {
      console.error(err);
      alert(`Beam Processing Error: ${err.message}`);
    } finally {
      setIsExtracting(false);
      setIsGenerating(false);
    }
  };

  return (
    <section className="w-full max-w-4xl mx-auto px-4 py-8">
      {/* Hero Heading */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#3B28CC]/10 text-[#3B28CC] font-bold text-xs uppercase tracking-widest mb-4">
          <span>THE BEAM</span>
          <span className="text-[#3B28CC]">✦</span>
          <span>LIVE PR INGESTION</span>
        </div>

        <h1 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight text-[#1A1A1A] leading-[1.1]">
          TRANSLATE CODE SHIPS <br />
          <span className="text-[#3B28CC] underline decoration-[#D4FF33] decoration-wavy decoration-4">
            INTO COMMUNITY HYPE.
          </span>
        </h1>

        <p className="mt-4 text-base sm:text-lg font-medium text-gray-600 max-w-2xl mx-auto">
          Paste any technical GitHub PR URL or release notes. Prism securely ingests diffs and creates multi-channel posts & 5-slide visual carousels in real time.
        </p>
      </div>

      {/* Main Input Card */}
      <div className="prism-card p-6 sm:p-8 border-2 border-gray-300 relative shadow-xl">
        <div className="flex flex-col gap-4">
          <label className="text-xs font-black uppercase tracking-wider text-gray-700 flex items-center justify-between">
            <span className="flex items-center gap-2">
              <GitPullRequest className="w-4 h-4 text-[#3B28CC]" />
              GitHub PR URL or Release Notes Payload
            </span>
            <span className="text-gray-400 font-normal">Supports .diff & raw context</span>
          </label>

          <div className="relative">
            <textarea
              rows={3}
              value={inputUrlOrText}
              onChange={(e) => setInputUrlOrText(e.target.value)}
              placeholder="https://github.com/facebook/react/pull/28000 or paste release notes..."
              className="w-full rounded-2xl border-2 border-gray-200 p-4 text-sm sm:text-base font-medium text-[#1A1A1A] bg-gray-50 focus:bg-white focus:border-[#3B28CC] focus:outline-none transition-all placeholder:text-gray-400"
            />

            {/* Submit Button */}
            <div className="mt-4 flex flex-wrap items-center justify-between gap-4">
              {/* Preset Buttons */}
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-bold text-gray-400">Quick Try:</span>
                {DEMO_PRS.map((demo, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      setInputUrlOrText(demo.url);
                      handleBeamExtractionAndGeneration(demo.url);
                    }}
                    className="text-xs font-semibold px-3 py-1.5 rounded-full bg-gray-100 hover:bg-[#3B28CC]/10 hover:text-[#3B28CC] border border-gray-200 transition-colors"
                  >
                    {demo.label}
                  </button>
                ))}
              </div>

              {/* Action Button */}
              <button
                disabled={isExtracting || isGenerating || !inputUrlOrText.trim()}
                onClick={() => handleBeamExtractionAndGeneration()}
                className="btn-pill-accent py-3.5 px-7 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
              >
                {isExtracting || isGenerating ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin text-[#1A1A1A]" />
                    <span>{isExtracting ? "Extracting PR Diffs..." : "Generating Suite..."}</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5 text-[#3B28CC]" />
                    <span className="text-[#1A1A1A]">Generate Hype Kit</span>
                    <div className="arrow-badge-black">↗</div>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Live Extracted Banner */}
        {extractedInfo && (
          <div className="mt-6 p-4 rounded-2xl bg-[#3B28CC]/5 border border-[#3B28CC]/20 flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-[#3B28CC] shrink-0 mt-0.5" />
            <div>
              <p className="text-xs font-bold text-[#3B28CC] uppercase tracking-wider">
                Successfully Extracted from {extractedInfo.repoName || "GitHub"}
              </p>
              <h4 className="text-sm font-bold text-[#1A1A1A] mt-0.5">{extractedInfo.title}</h4>
              <p className="text-xs text-gray-600 line-clamp-1 mt-1">{extractedInfo.description}</p>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
