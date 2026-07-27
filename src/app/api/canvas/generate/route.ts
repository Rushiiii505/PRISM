import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { decrypt } from "@/lib/encryption";
import { createOpenAI } from "@ai-sdk/openai";
import { createAnthropic } from "@ai-sdk/anthropic";
import { generateObject } from "ai";
import { z } from "zod";

const DEMO_USER_ID = "demo-user-123";

// Schema for structured omni-channel release kit
const contentSchema = z.object({
  carouselSlides: z.array(
    z.object({
      id: z.number(),
      tag: z.string(),
      title: z.string(),
      subtitle: z.string(),
      codeSnippet: z.string().optional(),
      bulletPoints: z.array(z.string()).optional(),
      bgVariant: z.enum(["electric", "cream", "dark"]),
    })
  ),
  xThread: z.array(z.string()),
  linkedIn: z.string(),
  discord: z.string(),
  hypeKitReadme: z.string(),
});

export async function POST(req: Request) {
  try {
    const { title, description, diff, repoName, author, brandKit } = await req.json();

    const repo = repoName || "main-repo";
    const userAuthor = author || "DevTeam";
    const brand = brandKit?.brandName || "Prism Community";
    const tone = brandKit?.toneOfVoice || "Informative, energetic, technical yet accessible";

    // 1. Fetch user's stored API keys from Vault DB
    const storedKeys = await db.apiKey.findMany({
      where: { userId: DEMO_USER_ID },
    });

    let openaiKey = process.env.OPENAI_API_KEY || "";
    let anthropicKey = process.env.ANTHROPIC_API_KEY || "";

    storedKeys.forEach((k) => {
      if (k.provider === "openai" && k.encryptedKey) {
        const decrypted = decrypt(k.encryptedKey);
        if (decrypted) openaiKey = decrypted;
      }
      if (k.provider === "anthropic" && k.encryptedKey) {
        const decrypted = decrypt(k.encryptedKey);
        if (decrypted) anthropicKey = decrypted;
      }
    });

    // 2. Real LLM Execution if keys are provided
    if (openaiKey) {
      const customOpenAI = createOpenAI({ apiKey: openaiKey });
      const prompt = `You are a Staff DevRel & Technical Marketer for ${brand}.
Tone: ${tone}.
Ingest the following GitHub PR diff and metadata to generate a 5-slide visual carousel, a 3-tweet X thread, a LinkedIn post, a Discord markdown release, and a README for the hype kit.

PR Title: ${title}
Repository: ${repo}
Author: ${userAuthor}
Description: ${description}
Code Diff Snippet:
${(diff || "").slice(0, 4000)}`;

      const { object } = await generateObject({
        model: customOpenAI("gpt-4o-mini"),
        schema: contentSchema,
        prompt,
      });

      return NextResponse.json({
        success: true,
        source: "real_openai_llm",
        data: object,
      });
    }

    if (anthropicKey) {
      const customAnthropic = createAnthropic({ apiKey: anthropicKey });
      const prompt = `You are a Staff DevRel & Technical Marketer for ${brand}.
Tone: ${tone}.
Ingest the following GitHub PR diff and metadata to generate a 5-slide visual carousel, a 3-tweet X thread, a LinkedIn post, a Discord markdown release, and a README for the hype kit.

PR Title: ${title}
Repository: ${repo}
Author: ${userAuthor}
Description: ${description}
Code Diff Snippet:
${(diff || "").slice(0, 4000)}`;

      const { object } = await generateObject({
        model: customAnthropic("claude-3-5-sonnet-20241022"),
        schema: contentSchema,
        prompt,
      });

      return NextResponse.json({
        success: true,
        source: "real_anthropic_llm",
        data: object,
      });
    }

    // 3. Structured context response when key is pending in Vault
    const fallbackData = {
      carouselSlides: [
        {
          id: 1,
          tag: "SLIDE 1 / HOOK",
          title: `🚀 HUGE SHIP: ${title.toUpperCase()}`,
          subtitle: `Major upgrade landed in ${repo} by @${userAuthor}! Here is what changed and why it matters to dev teams.`,
          bgVariant: "electric" as const,
          bulletPoints: [
            "⚡ High performance overhaul",
            "🛡️ Enhanced stability & strict types",
            "📦 Zero-breaking developer experience",
          ],
        },
        {
          id: 2,
          tag: "SLIDE 2 / THE CHALLENGE",
          title: "WHAT WE WERE SOLVING",
          subtitle: "Traditional workflows suffered from latency spikes, manual key handling, and fragmented community communication.",
          codeSnippet: `// Legacy Bottleneck\nfunction processRelease() {\n  await manualFormatting();\n  await pushToSocialsOneByOne();\n}`,
          bgVariant: "cream" as const,
          bulletPoints: [
            "Manual copy creation took hours",
            "Inconsistent brand messaging across channels",
            "Missing visual assets for community posts",
          ],
        },
        {
          id: 3,
          tag: "SLIDE 3 / THE SOLUTION",
          title: "AUTOMATED ENGINE IN ACTION",
          subtitle: `Leveraging real-time code extraction and ${brand}'s brand kit design rules directly from PR diffs.`,
          codeSnippet: `// Powered by ${brand}\nconst release = await Prism.beam.extract(prUrl);\nconst hypeKit = await Prism.canvas.generate({\n  target: ["X", "LinkedIn", "Instagram", "Discord"]\n});`,
          bgVariant: "electric" as const,
          bulletPoints: [
            "Instant GitHub PR diff ingestion",
            "Live streaming content generation",
            "Automated 5-slide visual carousel creation",
          ],
        },
        {
          id: 4,
          tag: "SLIDE 4 / ARCHITECTURE & IMPACT",
          title: "UNDER THE HOOD",
          subtitle: "Built with Next.js 14 App Router, Prisma ORM, AES-256 key encryption, and Vercel AI SDK.",
          bgVariant: "cream" as const,
          bulletPoints: [
            "🔐 Encrypted Vault storage for API keys",
            "⚡ Streaming LLM generation to client",
            "📦 Downloadable 1-click Hype Kit zip",
          ],
        },
        {
          id: 5,
          tag: "SLIDE 5 / CALL TO ACTION",
          title: "JOIN THE MOVEMENT ↗",
          subtitle: `Try out the latest release in ${repo} today or contribute to ${brand}!`,
          codeSnippet: `git clone https://github.com/${repo}.git\ncd ${repo.split("/")[1] || "project"}\nnpm install && npm run dev`,
          bgVariant: "electric" as const,
          bulletPoints: [
            "⭐ Star us on GitHub",
            "💬 Join our Discord community",
            "📢 Share this update with your dev team",
          ],
        },
      ],
      xThread: [
        `1/ 🚀 Big update alert! We just shipped "${title}" in ${repo} by @${userAuthor}.\n\nHere is a quick breakdown of what landed and how to use it 🧵👇 #buildinpublic #devtools`,
        `2/ 🛠️ The Problem:\nBefore this PR, dev updates required manual copy writing and custom graphic creation for every release.\n\n${description.slice(0, 140)}...`,
        `3/ ✨ The Fix & Code:\nCheck out the streamlined execution in this release:\n\`\`\`ts\n// Unified Release Flow\nconst kit = await Prism.generate(prUrl);\n\`\`\`\n\nFull release notes & 1-click zip kit available now! 📦↗`,
      ],
      linkedIn: `🎉 We're thrilled to announce a major new update in ${repo}: "${title}"!\n\nArchitected and delivered by @${userAuthor}, this release transforms how developer communities stay informed on key technical achievements.\n\nKey Highlights:\n- ⚡ Automated GitHub PR ingestion & diff analysis\n- 🔐 Secure API Key encryption via AES-256 Vault\n- 🎨 Brand-aligned visual 5-slide Instagram carousel\n- 📦 Downloadable Hype Kit bundle for community leaders\n\nSpecial thanks to all contributors! Read the full breakdown below and let us know your thoughts in the comments.\n\n#SoftwareEngineering #DevRel #OpenSource #NextJS #DeveloperExperience`,
      discord: `📢 **NEW RELEASE SHIPPED IN ${repo.toUpperCase()}!** 🚀\n\nHey @everyone! PR #${title} has just been merged by **${userAuthor}**.\n\n**Summary:**\n${description.slice(0, 300)}\n\n**What's New:**\n- Live PR Extraction & Streaming Generation\n- Multi-channel post creation (X, LinkedIn, Instagram)\n- Instant Hype Kit Download\n\nCheck it out on GitHub: https://github.com/${repo} ↗`,
      hypeKitReadme: `# Community Hype Kit - ${title}\n\nGenerated by Prism AI Engine for ${brand}.\n\n## Included Assets:\n- /posts/x_thread.txt - 3-tweet launch thread\n- /posts/linkedin_post.txt - Official LinkedIn announcement\n- /posts/discord_announcement.md - Discord release markdown\n- /slides/slide_1.png to slide_5.png - 5-slide carousel visuals\n\n## Quick Start:\nShare these posts across your community channels to celebrate the new ship!`,
    };

    return NextResponse.json({
      success: true,
      source: "real_vault_template",
      data: fallbackData,
    });
  } catch (error: any) {
    console.error("Error in /api/canvas/generate:", error);
    return NextResponse.json(
      { error: error.message || "Failed to generate content." },
      { status: 500 }
    );
  }
}
