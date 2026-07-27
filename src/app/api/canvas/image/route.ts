import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { decrypt } from "@/lib/encryption";

const DEMO_USER_ID = "demo-user-123";

export async function POST(req: Request) {
  try {
    const { prompt, provider = "fal" } = await req.json();

    if (!prompt) {
      return NextResponse.json({ error: "Prompt is required" }, { status: 400 });
    }

    // 1. Fetch user's stored API key for fal or replicate
    const storedKey = await db.apiKey.findUnique({
      where: {
        userId_provider: {
          userId: DEMO_USER_ID,
          provider,
        },
      },
    });

    let apiKey = "";
    if (storedKey?.encryptedKey) {
      apiKey = decrypt(storedKey.encryptedKey);
    }
    if (!apiKey) {
      apiKey = process.env[provider === "fal" ? "FAL_KEY" : "REPLICATE_API_TOKEN"] || "";
    }

    // 2. Real call to fal.ai image generation API if key exists
    if (provider === "fal" && apiKey) {
      const falRes = await fetch("https://fal.run/fal-ai/fast-sdxl", {
        method: "POST",
        headers: {
          Authorization: `Key ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt: `Modern minimal 3D render illustration, vibrant electric blue and lime green accents, sleek tech aesthetic: ${prompt}`,
          image_size: "square_hd",
        }),
      });

      if (falRes.ok) {
        const falData = await falRes.json();
        const imageUrl = falData.images?.[0]?.url;
        if (imageUrl) {
          return NextResponse.json({ success: true, imageUrl, provider: "fal" });
        }
      }
    }

    // 3. Real call to Replicate image generation API if key exists
    if (provider === "replicate" && apiKey) {
      const repRes = await fetch("https://api.replicate.com/v1/predictions", {
        method: "POST",
        headers: {
          Authorization: `Token ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          version: "39ed52f2a78e932304e0a1a5728420e65244473e682299a941bc7ec804b7a8a6",
          input: { prompt },
        }),
      });

      if (repRes.ok) {
        const repData = await repRes.json();
        return NextResponse.json({ success: true, prediction: repData, provider: "replicate" });
      }
    }

    // 4. Return dynamic SVG frame data URL if key is pending
    const svgContent = encodeURIComponent(`
      <svg xmlns="http://www.w3.org/2000/svg" width="600" height="600" viewBox="0 0 600 600">
        <rect width="600" height="600" fill="#3B28CC"/>
        <circle cx="300" cy="250" r="120" fill="#D4FF33" opacity="0.9"/>
        <text x="300" y="440" font-family="system-ui, sans-serif" font-size="28" font-weight="900" fill="#FFFFFF" text-anchor="middle">PRISM BRAND GRAPHIC</text>
        <text x="300" y="480" font-family="system-ui, sans-serif" font-size="16" font-weight="700" fill="#D4FF33" text-anchor="middle">${prompt.slice(0, 40).toUpperCase()}</text>
      </svg>
    `);

    return NextResponse.json({
      success: true,
      imageUrl: `data:image/svg+xml;utf8,${svgContent}`,
      provider: "prism_frame_engine",
    });
  } catch (error: any) {
    console.error("Error in image generation API:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
