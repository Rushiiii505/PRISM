"use client";

import React, { useState } from "react";
import { GeneratedPosts } from "@/lib/store";
import { downloadHypeKitZip } from "@/lib/zipExporter";
import { Download, PackageCheck, Sparkles, Loader2 } from "lucide-react";

interface ScatterDownloadBarProps {
  title: string;
  content: GeneratedPosts;
}

export default function ScatterDownloadBar({ title, content }: ScatterDownloadBarProps) {
  const [isZipping, setIsZipping] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  const handleDownloadZip = async () => {
    setIsZipping(true);
    setDownloadSuccess(false);
    try {
      await downloadHypeKitZip(title, content);
      setDownloadSuccess(true);
      setTimeout(() => setDownloadSuccess(false), 4000);
    } catch (err: any) {
      alert(`Zip Download Error: ${err.message}`);
    } finally {
      setIsZipping(false);
    }
  };

  return (
    <div className="sticky bottom-6 z-40 w-full max-w-4xl mx-auto px-4">
      <div className="prism-card-highlight p-4 sm:p-5 flex flex-wrap items-center justify-between gap-4 shadow-2xl border-2 border-[#3B28CC] animate-in slide-in-from-bottom duration-300">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-[#D4FF33] flex items-center justify-center text-[#1A1A1A]">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-black uppercase tracking-widest text-[#D4FF33]">
                SCATTER MULTIPLIER ENGINE
              </span>
              <span className="asterisk-star text-[#D4FF33] text-sm">✦</span>
            </div>
            <h4 className="text-sm sm:text-base font-extrabold text-white">
              Package Entire Suite into Downloadable Hype Kit (.zip)
            </h4>
          </div>
        </div>

        <button
          disabled={isZipping}
          onClick={handleDownloadZip}
          className="btn-pill-accent py-3 px-6 text-xs sm:text-sm font-extrabold text-[#1A1A1A] shadow-lg"
        >
          {isZipping ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin text-[#1A1A1A]" />
              <span>Packaging Assets...</span>
            </>
          ) : downloadSuccess ? (
            <>
              <PackageCheck className="w-4 h-4 text-[#3B28CC]" />
              <span>Hype Kit Downloaded!</span>
            </>
          ) : (
            <>
              <Download className="w-4 h-4 text-[#3B28CC]" />
              <span>Download Hype Kit .zip</span>
              <div className="arrow-badge-black">↗</div>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
