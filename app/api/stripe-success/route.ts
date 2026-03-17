import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import crypto from "crypto";

function getStripe() {
  if (!process.env.STRIPE_SECRET_KEY) return null;
  return new Stripe(process.env.STRIPE_SECRET_KEY, {
    maxNetworkRetries: 3,
    timeout: 30000,
  });
}

const SECRET = process.env.DOWNLOAD_SECRET || "";

// Products that have downloadable files (one-time purchases)
const DOWNLOADABLE_PRODUCTS = new Set([
  "sol-bot-source",
  "sol-grid-bot",
  "sol-defi-toolkit",
  "sol-trading-guide",
  "prompt-pack",
  "bundle",
  "bot-builder",
]);

// Subscription products — no download, show confirmation
const SUBSCRIPTION_PRODUCTS = new Set([
  "code-review-pro",
  "api-pro",
  "api-unlimited",
]);

function generateToken(product: string): string {
  const expires = Date.now() + 10 * 60 * 1000; // 10 minutes
  const payload = `${product}:${expires}`;
  const hmac = crypto.createHmac("sha256", SECRET).update(payload).digest("hex");
  return Buffer.from(`${payload}:${hmac}`).toString("base64url");
}

export async function GET(req: NextRequest) {
  const sessionId = req.nextUrl.searchParams.get("session_id");

  if (!sessionId) {
    return NextResponse.json({ error: "Missing session_id" }, { status: 400 });
  }

  const stripe = getStripe();
  if (!stripe) {
    return NextResponse.json({ error: "Payments not configured" }, { status: 503 });
  }

  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    // Verify payment was successful
    if (session.payment_status !== "paid") {
      return NextResponse.json(
        { error: "Payment not completed. Please try again." },
        { status: 400 }
      );
    }

    const productId = session.metadata?.product_id;

    if (!productId) {
      return NextResponse.json(
        { error: "Invalid session — missing product info." },
        { status: 400 }
      );
    }

    // For downloadable products, generate token and redirect to download
    if (DOWNLOADABLE_PRODUCTS.has(productId)) {
      const token = generateToken(productId);
      const origin = req.nextUrl.origin;
      return NextResponse.redirect(
        `${origin}/api/download?token=${token}`,
        303
      );
    }

    // For subscription products, redirect to a thank-you / dashboard page
    if (SUBSCRIPTION_PRODUCTS.has(productId)) {
      const origin = req.nextUrl.origin;
      return NextResponse.redirect(
        `${origin}/${productId}?subscribed=true`,
        303
      );
    }

    // Fallback — unknown product
    return NextResponse.json(
      { error: "Unknown product. Contact support." },
      { status: 400 }
    );
  } catch (e) {
    console.error("Stripe success verification error:", e);
    return NextResponse.json(
      { error: "Failed to verify payment. Please contact support." },
      { status: 500 }
    );
  }
}
