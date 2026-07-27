import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { encrypt } from "@/lib/encryption";

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
    const keys = await db.apiKey.findMany({
      where: { userId: user.id },
      select: { provider: true, updatedAt: true },
    });

    const configuredMap: Record<string, boolean> = {
      openai: false,
      anthropic: false,
      replicate: false,
      fal: false,
    };

    keys.forEach((k) => {
      configuredMap[k.provider] = true;
    });

    return NextResponse.json({ success: true, keys: configuredMap });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { provider, apiKey } = await req.json();

    if (!provider || !apiKey) {
      return NextResponse.json(
        { error: "Provider and API Key are required." },
        { status: 400 }
      );
    }

    const user = await getOrCreateDemoUser();
    const encryptedKey = encrypt(apiKey);

    await db.apiKey.upsert({
      where: {
        userId_provider: {
          userId: user.id,
          provider,
        },
      },
      update: {
        encryptedKey,
      },
      create: {
        userId: user.id,
        provider,
        encryptedKey,
      },
    });

    return NextResponse.json({
      success: true,
      message: `API Key for ${provider} encrypted & stored securely in Vault.`,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
