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
    const accounts = await db.socialAccount.findMany({
      where: { userId: user.id },
    });

    const statusMap: Record<string, { connected: boolean; username?: string }> = {
      x: { connected: false },
      linkedin: { connected: false },
      discord: { connected: false },
    };

    accounts.forEach((acc) => {
      statusMap[acc.platform] = {
        connected: true,
        username: acc.platformUser || undefined,
      };
    });

    return NextResponse.json({ success: true, accounts: statusMap });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { platform, accessToken, refreshToken, platformUser } = await req.json();

    if (!platform || !accessToken) {
      return NextResponse.json(
        { error: "Platform and Access Token / Webhook URL are required." },
        { status: 400 }
      );
    }

    // 1. Real Test Connection Ping
    if (platform === "discord") {
      if (accessToken.startsWith("https://discord.com/api/webhooks/")) {
        const testPing = await fetch(accessToken, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            content: "✦ **Prism Vault Connected!** OAuth Webhook connection verified successfully.",
            username: "Prism Engine",
          }),
        });

        if (!testPing.ok) {
          return NextResponse.json(
            { error: `Discord Webhook test failed with HTTP ${testPing.status}` },
            { status: 400 }
          );
        }
      }
    }

    const user = await getOrCreateDemoUser();

    // Upsert into Prisma SQLite SocialAccount
    const account = await db.socialAccount.upsert({
      where: {
        userId_platform: {
          userId: user.id,
          platform,
        },
      },
      update: {
        accessToken,
        refreshToken,
        platformUser: platformUser || `${platform}_user`,
      },
      create: {
        userId: user.id,
        platform,
        accessToken,
        refreshToken,
        platformUser: platformUser || `${platform}_user`,
      },
    });

    return NextResponse.json({
      success: true,
      message: `Connected ${platform.toUpperCase()} OAuth token live in Vault! 🚀`,
      account,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
