import React from "react";
import HeaderNav from "@/components/HeaderNav";
import TheBeamInput from "@/components/TheBeamInput";
import TheCanvasWorkspace from "@/components/TheCanvasWorkspace";
import VaultModal from "@/components/VaultModal";
import CurvedLoop from "@/components/ui/CurvedLoop";
import GradualBlur from "@/components/ui/GradualBlur";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[#F7F7F5] text-[#1A1A1A] relative flex flex-col justify-between overflow-x-hidden selection:bg-[#D4FF33] selection:text-[#1A1A1A]">
      <div>
        {/* Navigation */}
        <HeaderNav />

        {/* Curved Loop Marquee Banner from React Bits */}
        <div className="py-2 bg-[#3B28CC]/5 border-y border-[#3B28CC]/10 my-4 overflow-hidden">
          <CurvedLoop
            marqueeText="PRISM ✦ AUTOMATED CONTENT ENGINE ✦ GITHUB PR INGESTION ✦ 5-SLIDE VISUAL CAROUSEL ✦ OMNI-CHANNEL PUBLISHING ✦ "
            speed={1.2}
            curveAmount={40}
            className="text-[#3B28CC] text-2xl font-black uppercase tracking-wider"
          />
        </div>

        {/* Module 2: The Beam (Live PR Input) */}
        <TheBeamInput />

        {/* Module 3 & 4: The Canvas & Wavelengths (Live Streaming Generation + Instagram Carousel) */}
        <TheCanvasWorkspace />

        {/* Module 1: The Vault Modal (API Keys & Brand Kit) */}
        <VaultModal />
      </div>

      {/* Footer matching reference design */}
      <footer className="w-full max-w-7xl mx-auto px-6 py-12 border-t border-gray-200 mt-16 relative">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <span className="font-black text-xl tracking-tight text-[#1A1A1A]">PRISM</span>
            <span className="asterisk-star text-base font-black text-[#3B28CC]">✦</span>
            <span className="text-xs text-gray-500 font-semibold">
              © 2026 Prism AI Engine. All rights reserved.
            </span>
          </div>

          {/* Slogan */}
          <div className="text-center sm:text-right">
            <p className="text-xs font-black uppercase tracking-widest text-[#3B28CC]">
              KEEP <span className="bg-[#D4FF33] px-2 py-0.5 rounded-full text-[#1A1A1A]">SHIPPING</span> UNTIL YOU FIND YOUR AUDIENCE.
            </p>
          </div>
        </div>

        {/* Gradual Blur overlay at the very bottom */}
        <GradualBlur preset="bottom" height="4rem" strength={1.5} />
      </footer>
    </main>
  );
}
