import { NextRequest, NextResponse } from "next/server";
import { Connection, PublicKey } from "@solana/web3.js";
import crypto from "crypto";
import fs from "fs";
import path from "path";

const RECIPIENT = "NaTTUfDDQ8U1RBqb9q5rz6vJ22cWrrT5UAsXuxnb2Wr";
const SOLANA_RPC = "https://api.mainnet-beta.solana.com";
const SECRET = process.env.DOWNLOAD_SECRET || "";

const PRODUCTS: Record<string, { price: number; repo: string }> = {
  "sol-bot-source": { price: 2, repo: "TateLyman/sol-telegram-bot-source" },
  "sol-grid-bot": { price: 0.5, repo: "TateLyman/sol-grid-bot" },
  "sol-defi-toolkit": { price: 0.3, repo: "TateLyman/sol-defi-toolkit" },
  "prompt-pack": { price: 0.1, repo: "TateLyman/ai-prompt-pack" },
  "bundle": { price: 2, repo: "TateLyman/sol-telegram-bot-source" },
};

// Simple file-based store for used transaction signatures
const USED_TX_FILE = "/tmp/used-transactions.json";
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

function generateToken(product: string): string {
  const expires = Date.now() + 10 * 60 * 1000; // 10 minutes
  const payload = `${product}:${expires}`;
  const hmac = crypto.createHmac("sha256", SECRET).update(payload).digest("hex");
  return Buffer.from(`${payload}:${hmac}`).toString("base64url");
}

export async function POST(req: NextRequest) {
  try {
    const { txSig, product } = await req.json();

    if (!txSig || !product || !PRODUCTS[product]) {
      return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    }

    const { price } = PRODUCTS[product];

    // Check if tx already used
    if (getUsedTxs().has(txSig)) {
      return NextResponse.json(
        { error: "This transaction has already been used for a download." },
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
        if (dest === RECIPIENT && lamports >= price * 1e9 * 0.95) {
          paid = true;
          break;
        }
      }
    }

    if (!paid) {
      return NextResponse.json(
        {
          error: `Payment not found. Expected ${price} SOL to ${RECIPIENT.slice(0, 8)}...`,
        },
        { status: 400 }
      );
    }

    // Mark transaction as used
    markTxUsed(txSig);

    // Generate download token
    const token = generateToken(product);

    return NextResponse.json({ token, product });
  } catch (e) {
    console.error("Verify error:", e);
    return NextResponse.json(
      { error: "Verification failed. Please try again." },
      { status: 500 }
    );
  }
}
