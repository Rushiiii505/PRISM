"use client";

import React, { useState } from "react";
import { usePrismStore, CarouselSlide } from "@/lib/store";
import { ChevronLeft, ChevronRight, Edit2, Code, Sparkles, Layers } from "lucide-react";

export default function InstagramCarouselView() {
  const { generatedContent, updateCarouselSlide, brandKit } = usePrismStore();
  const [editingSlideId, setEditingSlideId] = useState<number | null>(null);

  if (!generatedContent || !generatedContent.carouselSlides) return null;

  const slides = generatedContent.carouselSlides;

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-[#3B28CC]/5 border border-[#3B28CC]/10">
        <div className="flex items-center gap-2">
          <Layers className="w-5 h-5 text-[#3B28CC]" />
          <span className="text-sm font-extrabold text-[#1A1A1A]">
            INSTAGRAM 5-SLIDE VISUAL CAROUSEL
          </span>
          <span className="asterisk-star text-base font-black text-[#3B28CC]">✦</span>
        </div>
        <p className="text-xs text-gray-500 font-semibold">
          Scroll horizontally to preview slides. Click any slide text to edit.
        </p>
      </div>

      {/* Horizontal Carousel Container */}
      <div className="relative group">
        <div className="flex items-stretch gap-6 overflow-x-auto pb-6 pt-2 px-2 snap-x snap-mandatory scrollbar-thin scrollbar-thumb-gray-300">
          {slides.map((slide, index) => {
            const isElectric = slide.bgVariant === "electric";
            const isEditing = editingSlideId === slide.id;

            return (
              <div
                key={slide.id}
                className={`snap-center shrink-0 w-[310px] sm:w-[360px] min-h-[460px] rounded-3xl p-6 sm:p-7 flex flex-col justify-between transition-all border-2 relative shadow-lg ${
                  isElectric
                    ? "bg-[#3B28CC] text-white border-[#3B28CC]"
                    : "bg-[#F7F7F5] text-[#1A1A1A] border-gray-300"
                }`}
              >
                {/* Slide Tag Header */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span
                      className={`text-[10px] font-black tracking-widest px-3 py-1 rounded-full uppercase ${
                        isElectric
                          ? "bg-[#D4FF33] text-[#1A1A1A]"
                          : "bg-[#3B28CC] text-white"
                      }`}
                    >
                      {slide.tag}
                    </span>

                    <button
                      onClick={() => setEditingSlideId(isEditing ? null : slide.id)}
                      className={`p-1.5 rounded-full transition-colors ${
                        isElectric
                          ? "hover:bg-white/20 text-white"
                          : "hover:bg-gray-200 text-gray-700"
                      }`}
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Title & Subtitle */}
                  {isEditing ? (
                    <div className="space-y-2 mb-4">
                      <textarea
                        rows={2}
                        value={slide.title}
                        onChange={(e) =>
                          updateCarouselSlide(index, { title: e.target.value })
                        }
                        className="w-full text-sm font-extrabold rounded-lg p-2 bg-black/10 border border-white/20 focus:outline-none"
                      />
                      <textarea
                        rows={3}
                        value={slide.subtitle}
                        onChange={(e) =>
                          updateCarouselSlide(index, { subtitle: e.target.value })
                        }
                        className="w-full text-xs font-medium rounded-lg p-2 bg-black/10 border border-white/20 focus:outline-none"
                      />
                    </div>
                  ) : (
                    <>
                      <h3
                        className={`text-xl sm:text-2xl font-black tracking-tight leading-tight mb-3 ${
                          isElectric ? "text-white" : "text-[#1A1A1A]"
                        }`}
                      >
                        {slide.title}
                      </h3>
                      <p
                        className={`text-xs sm:text-sm font-medium leading-relaxed mb-4 ${
                          isElectric ? "text-white/80" : "text-gray-600"
                        }`}
                      >
                        {slide.subtitle}
                      </p>
                    </>
                  )}

                  {/* Bullet points */}
                  {slide.bulletPoints && slide.bulletPoints.length > 0 && (
                    <ul className="space-y-1.5 mb-4 text-xs font-semibold">
                      {slide.bulletPoints.map((b, i) => (
                        <li key={i} className="flex items-start gap-1.5">
                          <span
                            className={
                              isElectric ? "text-[#D4FF33]" : "text-[#3B28CC]"
                            }
                          >
                            ✦
                          </span>
                          <span>{b}</span>
                        </li>
                      ))}
                    </ul>
                  )}

                  {/* Code Snippet Box if available */}
                  {slide.codeSnippet && (
                    <div
                      className={`p-3 rounded-2xl font-mono text-[11px] leading-relaxed overflow-x-auto border ${
                        isElectric
                          ? "bg-black/30 text-[#D4FF33] border-white/10"
                          : "bg-gray-900 text-[#D4FF33] border-gray-800"
                      }`}
                    >
                      <div className="flex items-center gap-1.5 text-[9px] text-gray-400 mb-1 font-sans font-bold uppercase">
                        <Code className="w-3 h-3 text-[#D4FF33]" />
                        <span>Code Extract</span>
                      </div>
                      <pre>{slide.codeSnippet}</pre>
                    </div>
                  )}
                </div>

                {/* Footer Brand Credit */}
                <div className="pt-4 border-t border-current/10 flex items-center justify-between text-[11px] font-extrabold uppercase tracking-wider opacity-80">
                  <span>{brandKit.brandName}</span>
                  <span>SLIDE {slide.id} / 5</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
