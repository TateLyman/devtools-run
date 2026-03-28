import { NextRequest, NextResponse } from "next/server";

interface ProductConfig {
  name: string;
  priceUsd: number;
  mode: "payment" | "subscription";
}

const PRODUCTS: Record<string, ProductConfig> = {
  "sol-bot-source": {
    name: "Solana Telegram Trading Bot — Full Source Code",
    priceUsd: 149,
    mode: "payment",
  },
  "sol-grid-bot": {
    name: "SOL Grid Trading Bot",
    priceUsd: 79,
    mode: "payment",
  },
  "sol-defi-toolkit": {
    name: "Solana DeFi Toolkit (10 Scripts)",
    priceUsd: 49,
    mode: "payment",
  },
  "sol-trading-guide": {
    name: "Solana Trading Guide",
    priceUsd: 69,
    mode: "payment",
  },
  "prompt-pack": {
    name: "AI Prompt Templates Pack",
    priceUsd: 14.99,
    mode: "payment",
  },
  bundle: {
    name: "Complete Bundle (All Products)",
    priceUsd: 399,
    mode: "payment",
  },
  "bot-builder": {
    name: "Bot Builder Kit",
    priceUsd: 149,
    mode: "payment",
  },
  "code-review-pro": {
    name: "Code Review Pro (Monthly)",
    priceUsd: 9.99,
    mode: "subscription",
  },
  "api-pro": {
    name: "API Pro Access (Monthly)",
    priceUsd: 29.99,
    mode: "subscription",
  },
  "api-unlimited": {
    name: "API Unlimited Access (Monthly)",
    priceUsd: 99.99,
    mode: "subscription",
  },
  "automation-kit": {
    name: "Social Media Automation Kit",
    priceUsd: 99,
    mode: "payment",
  },
  "tools-pro": {
    name: "DevTools Pro (Monthly)",
    priceUsd: 4.99,
    mode: "subscription",
  },
};

export async function GET(req: NextRequest) {
  const productId = req.nextUrl.searchParams.get("product");

  if (!productId || !PRODUCTS[productId]) {
    return NextResponse.json(
      { error: "Invalid product" },
      { status: 400 }
    );
  }

  const secretKey = process.env.STRIPE_SECRET_KEY?.trim();
  if (!secretKey) {
    return NextResponse.json({ error: "Payments not configured" }, { status: 503 });
  }

  const product = PRODUCTS[productId];
  const origin = req.nextUrl.origin;

  try {
    // Use Stripe REST API directly with fetch (avoids SDK network issues on Vercel)
    const params = new URLSearchParams();
    params.append("payment_method_types[]", "card");
    params.append("line_items[0][price_data][currency]", "usd");
    params.append("line_items[0][price_data][product_data][name]", product.name);
    params.append("line_items[0][price_data][unit_amount]", String(Math.round(product.priceUsd * 100)));
    if (product.mode === "subscription") {
      params.append("line_items[0][price_data][recurring][interval]", "month");
    }
    params.append("line_items[0][quantity]", "1");
    params.append("mode", product.mode);
    params.append("success_url", `${origin}/api/stripe-success?session_id={CHECKOUT_SESSION_ID}`);
    params.append("cancel_url", `${origin}/${productId}`);
    params.append("metadata[product_id]", productId);

    if (product.mode === "subscription") {
      params.append("subscription_data[metadata][product_id]", productId);
    }

    const res = await fetch("https://api.stripe.com/v1/checkout/sessions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${secretKey}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: params.toString(),
    });

    const data = await res.json();

    if (!res.ok) {
      console.error("Stripe API error:", data);
      return NextResponse.json(
        { error: "Failed to create checkout session", detail: data.error?.message },
        { status: 500 }
      );
    }

    return NextResponse.redirect(data.url, 303);
  } catch (e: unknown) {
    const errMsg = e instanceof Error ? e.message : String(e);
    console.error("Stripe checkout error:", errMsg);
    return NextResponse.json(
      { error: "Failed to create checkout session", detail: errMsg },
      { status: 500 }
    );
  }
}
