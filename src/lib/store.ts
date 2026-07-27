import { create } from "zustand";

export interface CarouselSlide {
  id: number;
  title: string;
  subtitle: string;
  codeSnippet?: string;
  bulletPoints?: string[];
  tag: string;
  bgVariant?: "electric" | "cream" | "dark";
}

export interface GeneratedPosts {
  xThread: string[];
  linkedIn: string;
  discord: string;
  carouselSlides: CarouselSlide[];
  hypeKitReadme: string;
}

export interface BrandKitState {
  brandName: string;
  primaryColor: string;
  accentColor: string;
  fontStyle: string;
  toneOfVoice: string;
  targetAudience: string;
  logoUrl?: string;
}

export interface ApiKeysState {
  openai: boolean;
  anthropic: boolean;
  replicate: boolean;
  fal: boolean;
}

export interface PrismStore {
  // Input Beam State
  inputUrlOrText: string;
  setInputUrlOrText: (val: string) => void;
  extractedPr: {
    title?: string;
    description?: string;
    diff?: string;
    repoName?: string;
    author?: string;
    prNumber?: number;
  } | null;
  setExtractedPr: (data: any) => void;

  // Generation Canvas State
  isExtracting: boolean;
  setIsExtracting: (val: boolean) => void;
  isGenerating: boolean;
  setIsGenerating: (val: boolean) => void;
  generatedContent: GeneratedPosts | null;
  setGeneratedContent: (content: GeneratedPosts | null) => void;
  updateCarouselSlide: (index: number, updatedSlide: Partial<CarouselSlide>) => void;
  updatePostContent: (key: "linkedIn" | "discord" | "xThread", value: any) => void;

  // Vault State
  brandKit: BrandKitState;
  setBrandKit: (kit: Partial<BrandKitState>) => void;
  apiKeysConfigured: ApiKeysState;
  setApiKeyConfigured: (provider: keyof ApiKeysState, configured: boolean) => void;
  connectedSocials: {
    x: boolean;
    linkedin: boolean;
    discord: boolean;
  };
  setSocialConnected: (platform: "x" | "linkedin" | "discord", connected: boolean) => void;

  // Active Tab / View
  activeWavelengthTab: "carousel" | "x" | "linkedin" | "discord";
  setActiveWavelengthTab: (tab: "carousel" | "x" | "linkedin" | "discord") => void;
  isVaultOpen: boolean;
  setIsVaultOpen: (open: boolean) => void;
}

export const usePrismStore = create<PrismStore>((set) => ({
  inputUrlOrText: "",
  setInputUrlOrText: (val) => set({ inputUrlOrText: val }),
  extractedPr: null,
  setExtractedPr: (data) => set({ extractedPr: data }),

  isExtracting: false,
  setIsExtracting: (val) => set({ isExtracting: val }),
  isGenerating: false,
  setIsGenerating: (val) => set({ isGenerating: val }),
  generatedContent: null,
  setGeneratedContent: (content) => set({ generatedContent: content }),

  updateCarouselSlide: (index, updatedSlide) =>
    set((state) => {
      if (!state.generatedContent) return state;
      const slides = [...state.generatedContent.carouselSlides];
      slides[index] = { ...slides[index], ...updatedSlide };
      return {
        generatedContent: {
          ...state.generatedContent,
          carouselSlides: slides,
        },
      };
    }),

  updatePostContent: (key, value) =>
    set((state) => {
      if (!state.generatedContent) return state;
      return {
        generatedContent: {
          ...state.generatedContent,
          [key]: value,
        },
      };
    }),

  brandKit: {
    brandName: "Prism Open Source",
    primaryColor: "#3B28CC",
    accentColor: "#D4FF33",
    fontStyle: "Inter",
    toneOfVoice: "Informative, energetic, technical yet accessible",
    targetAudience: "Open Source Developers & Tech Leaders",
  },
  setBrandKit: (kit) =>
    set((state) => ({ brandKit: { ...state.brandKit, ...kit } })),

  apiKeysConfigured: {
    openai: true,
    anthropic: true,
    replicate: false,
    fal: false,
  },
  setApiKeyConfigured: (provider, configured) =>
    set((state) => ({
      apiKeysConfigured: { ...state.apiKeysConfigured, [provider]: configured },
    })),

  connectedSocials: {
    x: true,
    linkedin: true,
    discord: true,
  },
  setSocialConnected: (platform, connected) =>
    set((state) => ({
      connectedSocials: { ...state.connectedSocials, [platform]: connected },
    })),

  activeWavelengthTab: "carousel",
  setActiveWavelengthTab: (tab) => set({ activeWavelengthTab: tab }),
  isVaultOpen: false,
  setIsVaultOpen: (open) => set({ isVaultOpen: open }),
}));
