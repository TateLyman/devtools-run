import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

function getStripe() {
  if (!process.env.STRIPE_SECRET_KEY) return null;
  return new Stripe(process.env.STRIPE_SECRET_KEY, {});
}

interface ProductConfig {
  name: string;
  priceUsd: number;
  mode: "payment" | "subscription";
}

const PRODUCTS: Record<string, ProductConfig> = {
  "sol-bot-source": {
    name: "Solana Telegram Trading Bot — Full Source Code",
    priceUsd: 299,
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
};

export async function GET(req: NextRequest) {
  const productId = req.nextUrl.searchParams.get("product");

  if (!productId || !PRODUCTS[productId]) {
    return NextResponse.json(
      { error: "Invalid product" },
      { status: 400 }
    );
  }

  const product = PRODUCTS[productId];
  const origin = req.nextUrl.origin;

  const stripe = getStripe();
  if (!stripe) {
    return NextResponse.json({ error: "Payments not configured" }, { status: 503 });
  }

  try {
    const sessionParams: Stripe.Checkout.SessionCreateParams = {
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: product.name,
            },
            unit_amount: Math.round(product.priceUsd * 100),
            ...(product.mode === "subscription" && {
              recurring: { interval: "month" as const },
            }),
          },
          quantity: 1,
        },
      ],
      mode: product.mode,
      success_url: `${origin}/api/stripe-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/${productId}`,
      metadata: {
        product_id: productId,
      },
    };

    // For subscriptions, also store product_id on subscription metadata
    if (product.mode === "subscription") {
      sessionParams.subscription_data = {
        metadata: { product_id: productId },
      };
    }

    const session = await stripe.checkout.sessions.create(sessionParams);

    return NextResponse.redirect(session.url!, 303);
  } catch (e) {
    console.error("Stripe checkout error:", e);
    return NextResponse.json(
      { error: "Failed to create checkout session" },
      { status: 500 }
    );
  }
}
