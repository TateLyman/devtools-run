import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

const SECRET = process.env.DOWNLOAD_SECRET || "";
const GITHUB_TOKEN = process.env.GITHUB_TOKEN || "";

const PRODUCTS: Record<string, string> = {
  "sol-bot-source": "TateLyman/sol-telegram-bot-source",
  "sol-grid-bot": "TateLyman/sol-grid-bot",
  "sol-defi-toolkit": "TateLyman/sol-defi-toolkit",
  "prompt-pack": "TateLyman/ai-prompt-pack",
  "automation-kit": "TateLyman/social-media-automation-kit",
};

function verifyToken(token: string): string | null {
  try {
    const decoded = Buffer.from(token, "base64url").toString("utf8");
    const parts = decoded.split(":");
    if (parts.length !== 3) return null;

    const [product, expiresStr, signature] = parts;
    const expires = parseInt(expiresStr, 10);

    // Check expiry
    if (Date.now() > expires) return null;

    // Verify signature
    const payload = `${product}:${expiresStr}`;
    const expected = crypto
      .createHmac("sha256", SECRET)
      .update(payload)
      .digest("hex");
    if (signature !== expected) return null;

    return product;
  } catch {
    return null;
  }
}

export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get("token");

  if (!token) {
    return NextResponse.json({ error: "Missing token" }, { status: 400 });
  }

  const product = verifyToken(token);
  if (!product || !PRODUCTS[product]) {
    return NextResponse.json(
      { error: "Invalid or expired download link. Please verify payment again." },
      { status: 403 }
    );
  }

  const repo = PRODUCTS[product];

  // Fetch from GitHub API (private repo access via token)
  const ghUrl = `https://api.github.com/repos/${repo}/zipball/main`;
  const ghRes = await fetch(ghUrl, {
    headers: {
      Authorization: `Bearer ${GITHUB_TOKEN}`,
      Accept: "application/vnd.github+json",
    },
    redirect: "follow",
  });

  if (!ghRes.ok) {
    console.error(`GitHub download failed: ${ghRes.status}`);
    return NextResponse.json(
      { error: "Download failed. Please try again or contact support." },
      { status: 500 }
    );
  }

  const blob = await ghRes.blob();
  return new NextResponse(blob, {
    headers: {
      "Content-Type": "application/zip",
      "Content-Disposition": `attachment; filename="${product}.zip"`,
    },
  });
}
