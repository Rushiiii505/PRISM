import { NextResponse } from "next/server";
import { db } from "@/lib/db";

const DEMO_USER_ID = "demo-user-123";

async function getOrCreateDemoUser() {
  let user = await db.user.findUnique({ where: { id: DEMO_USER_ID } });
  if (!user) {
    user = await db.user.create({
      data: {
        id: DEMO_USER_ID,
        name: "Demo Developer",
        email: "dev@prism.ai",
      },
    });
  }
  return user;
}

export async function GET() {
  try {
    const user = await getOrCreateDemoUser();
    let brandKit = await db.brandKit.findFirst({
      where: { userId: user.id },
    });

    if (!brandKit) {
      brandKit = await db.brandKit.create({
        data: {
          userId: user.id,
          brandName: "Prism Open Source",
          primaryColor: "#3B28CC",
          accentColor: "#D4FF33",
          fontStyle: "Inter",
          toneOfVoice: "Informative, energetic, technical yet accessible",
          targetAudience: "Open Source Developers & Tech Leaders",
        },
      });
    }

    return NextResponse.json({ success: true, brandKit });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const data = await req.json();
    const user = await getOrCreateDemoUser();

    const existing = await db.brandKit.findFirst({ where: { userId: user.id } });

    let brandKit;
    if (existing) {
      brandKit = await db.brandKit.update({
        where: { id: existing.id },
        data: {
          brandName: data.brandName,
          primaryColor: data.primaryColor,
          accentColor: data.accentColor,
          fontStyle: data.fontStyle,
          toneOfVoice: data.toneOfVoice,
          targetAudience: data.targetAudience,
          logoUrl: data.logoUrl,
        },
      });
    } else {
      brandKit = await db.brandKit.create({
        data: {
          userId: user.id,
          brandName: data.brandName || "Prism Open Source",
          primaryColor: data.primaryColor || "#3B28CC",
          accentColor: data.accentColor || "#D4FF33",
          fontStyle: data.fontStyle || "Inter",
          toneOfVoice: data.toneOfVoice || "Informative, energetic, technical",
          targetAudience: data.targetAudience || "Open Source Developers",
          logoUrl: data.logoUrl,
        },
      });
    }

    return NextResponse.json({ success: true, brandKit });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
