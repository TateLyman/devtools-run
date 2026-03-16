import { NextRequest, NextResponse } from "next/server";
import { Connection } from "@solana/web3.js";
import crypto from "crypto";
import fs from "fs";

const RECIPIENT = "NaTTUfDDQ8U1RBqb9q5rz6vJ22cWrrT5UAsXuxnb2Wr";
const SOLANA_RPC = "https://api.mainnet-beta.solana.com";
const API_KEYS_FILE = "/tmp/scan-api-keys.json";
const USED_TX_FILE = "/tmp/scan-used-transactions.json";

// Pricing tiers in SOL
const TIER_PRICES: Record<string, number> = {
  pro: 0.08,       // ~$9.99 at ~$125 SOL
  unlimited: 0.4,  // ~$49.99 at ~$125 SOL
};

const TIER_LIMITS: Record<string, { daily: number; ratePerMin: number }> = {
  pro: { daily: 1000, ratePerMin: 15 },
  unlimited: { daily: 100000, ratePerMin: 60 },
};

interface ApiKeyRecord {
  apiKey: string;
  email: string;
  tier: "pro" | "unlimited";
  createdAt: string;
  requestCount: number;
  requestsToday: number;
  dayReset: string;
  requestsThisMonth: number;
  monthReset: string;
}

function getApiKeys(): ApiKeyRecord[] {
  try {
    return JSON.parse(fs.readFileSync(API_KEYS_FILE, "utf8"));
  } catch {
    return [];
  }
}

function saveApiKeys(keys: ApiKeyRecord[]) {
  fs.writeFileSync(API_KEYS_FILE, JSON.stringify(keys, null, 2));
}

function getUsedTxs(): Set<string> {
  try {
    return new Set(JSON.parse(fs.readFileSync(USED_TX_FILE, "utf8")));
  } catch {
    return new Set();
  }
}

function markTxUsed(sig: string) {
  const used = getUsedTxs();
  used.add(sig);
  fs.writeFileSync(USED_TX_FILE, JSON.stringify([...used]));
}

export async function POST(req: NextRequest) {
  try {
    const { txSig, email, tier: requestedTier } = await req.json();

    if (!txSig || !email) {
      return NextResponse.json(
        { error: "Missing txSig or email." },
        { status: 400 }
      );
    }

    // Validate tier
    const tier = (requestedTier === "unlimited" ? "unlimited" : "pro") as "pro" | "unlimited";
    const expectedPrice = TIER_PRICES[tier];

    // Basic email validation
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        { error: "Invalid email address." },
        { status: 400 }
      );
    }

    // Check if tx already used
    if (getUsedTxs().has(txSig)) {
      return NextResponse.json(
        { error: "This transaction has already been used to register an API key." },
        { status: 400 }
      );
    }

    // Verify on-chain
    const connection = new Connection(SOLANA_RPC, "confirmed");
    const tx = await connection.getParsedTransaction(txSig, {
      maxSupportedTransactionVersion: 0,
    });

    if (!tx) {
      return NextResponse.json(
        { error: "Transaction not found. Please wait a moment and try again." },
        { status: 404 }
      );
    }

    // Check for SOL transfer to our wallet
    const instructions = tx.transaction.message.instructions;
    let paid = false;
    for (const ix of instructions) {
      if ("parsed" in ix && ix.parsed?.type === "transfer") {
        const dest = ix.parsed.info?.destination;
        const lamports = ix.parsed.info?.lamports;
        if (dest === RECIPIENT && lamports >= expectedPrice * 1e9 * 0.95) {
          paid = true;
          break;
        }
      }
    }

    if (!paid) {
      return NextResponse.json(
        {
          error: `Payment not found. Expected ${expectedPrice} SOL to ${RECIPIENT.slice(0, 8)}... for ${tier} tier.`,
        },
        { status: 400 }
      );
    }

    // Mark transaction as used
    markTxUsed(txSig);

    // Generate API key
    const apiKey = crypto.randomUUID();

    // Store API key
    const keys = getApiKeys();
    const now = new Date();
    const today = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
    keys.push({
      apiKey,
      email,
      tier,
      createdAt: now.toISOString(),
      requestCount: 0,
      requestsToday: 0,
      dayReset: today,
      requestsThisMonth: 0,
      monthReset: `${now.getFullYear()}-${now.getMonth()}`,
    });
    saveApiKeys(keys);

    const limits = TIER_LIMITS[tier];

    return NextResponse.json({
      success: true,
      apiKey,
      email,
      tier,
      limits: {
        requestsPerDay: limits.daily,
        rateLimit: `${limits.ratePerMin} requests/minute`,
      },
    });
  } catch (e) {
    console.error("Register error:", e);
    return NextResponse.json(
      { error: "Registration failed. Please try again." },
      { status: 500 }
    );
  }
}
