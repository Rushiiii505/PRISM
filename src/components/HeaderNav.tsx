"use client";

import React from "react";
import Image from "next/image";
import { usePrismStore } from "@/lib/store";
import { Key, ShieldCheck } from "lucide-react";

export default function HeaderNav() {
  const { setIsVaultOpen, apiKeysConfigured } = usePrismStore();

  const configuredCount = Object.values(apiKeysConfigured).filter(Boolean).length;

  return (
    <header className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-4">
      <div className="flex items-center justify-between">
        {/* Logo & Brand */}
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
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-2xl tracking-tight text-[#1A1A1A]">PRISM</span>
              <span className="asterisk-star text-lg font-black text-[#3B28CC]">✦</span>
            </div>
            <p className="text-xs font-semibold tracking-wider text-gray-500 uppercase">
              AI Content Engine for Dev Communities
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-3">
          {/* Status Badge */}
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-white border border-gray-200 text-xs font-semibold text-gray-700">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <ShieldCheck className="w-3.5 h-3.5 text-[#3B28CC]" />
            <span>Vault Live ({configuredCount}/4 Keys Verified)</span>
          </div>

          {/* Vault Settings Pill Button */}
          <button
            onClick={() => setIsVaultOpen(true)}
            className="btn-pill-primary text-sm py-2.5 px-5"
          >
            <Key className="w-4 h-4 text-[#D4FF33]" />
            <span>The Vault</span>
            <div className="arrow-badge-white">↗</div>
          </button>
        </div>
      </div>
    </header>
  );
}
