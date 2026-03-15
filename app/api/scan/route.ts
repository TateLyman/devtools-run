import { NextRequest, NextResponse } from "next/server";
import fs from "fs";

const API_KEYS_FILE = "/tmp/scan-api-keys.json";
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
const RATE_LIMIT_MAX = 10;

interface ApiKeyRecord {
  apiKey: string;
  email: string;
  createdAt: string;
  requestCount: number;
  requestsThisMonth: number;
  monthReset: string;
}

interface RateLimitEntry {
  timestamps: number[];
}

const rateLimitMap = new Map<string, RateLimitEntry>();

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

function checkRateLimit(apiKey: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(apiKey) || { timestamps: [] };
  entry.timestamps = entry.timestamps.filter(
    (t) => now - t < RATE_LIMIT_WINDOW
  );
  if (entry.timestamps.length >= RATE_LIMIT_MAX) {
    return false;
  }
  entry.timestamps.push(now);
  rateLimitMap.set(apiKey, entry);
  return true;
}

function calculateRiskScore(data: {
  mintAuthority: boolean;
  freezeAuthority: boolean;
  liquidity: number;
  volume24h: number;
  priceUsd: number;
}): { score: number; level: string; reasons: string[] } {
  let score = 0;
  const reasons: string[] = [];

  // Mint authority not renounced = major risk
  if (data.mintAuthority) {
    score += 30;
    reasons.push("Mint authority is active — supply can be inflated");
  }

  // Freeze authority active = major risk
  if (data.freezeAuthority) {
    score += 25;
    reasons.push("Freeze authority is active — tokens can be frozen");
  }

  // Low liquidity
  if (data.liquidity < 1000) {
    score += 25;
    reasons.push("Very low liquidity (< $1,000)");
  } else if (data.liquidity < 10000) {
    score += 15;
    reasons.push("Low liquidity (< $10,000)");
  } else if (data.liquidity < 50000) {
    score += 5;
    reasons.push("Moderate liquidity");
  }

  // Low volume
  if (data.volume24h < 100) {
    score += 15;
    reasons.push("Very low 24h volume (< $100)");
  } else if (data.volume24h < 1000) {
    score += 10;
    reasons.push("Low 24h volume (< $1,000)");
  } else if (data.volume24h < 10000) {
    score += 5;
    reasons.push("Moderate 24h volume");
  }

  // No price data
  if (data.priceUsd <= 0) {
    score += 5;
    reasons.push("No price data available");
  }

  score = Math.min(100, Math.max(0, score));

  let level = "LOW";
  if (score >= 60) level = "HIGH";
  else if (score >= 30) level = "MEDIUM";

  return { score, level, reasons };
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const mint = searchParams.get("mint");
    const apiKey = searchParams.get("apiKey");

    if (!apiKey) {
      return NextResponse.json(
        { error: "Missing apiKey parameter. Get one at /api-access" },
        { status: 401 }
      );
    }

    if (!mint) {
      return NextResponse.json(
        { error: "Missing mint parameter. Provide a Solana token mint address." },
        { status: 400 }
      );
    }

    // Validate mint address format (base58, 32-44 chars)
    if (!/^[1-9A-HJ-NP-Za-km-z]{32,44}$/.test(mint)) {
      return NextResponse.json(
        { error: "Invalid mint address format." },
        { status: 400 }
      );
    }

    // Validate API key
    const keys = getApiKeys();
    const keyRecord = keys.find((k) => k.apiKey === apiKey);
    if (!keyRecord) {
      return NextResponse.json(
        { error: "Invalid API key. Get one at /api-access" },
        { status: 401 }
      );
    }

    // Check monthly limit (1000 requests/month)
    const now = new Date();
    const monthKey = `${now.getFullYear()}-${now.getMonth()}`;
    if (keyRecord.monthReset !== monthKey) {
      keyRecord.requestsThisMonth = 0;
      keyRecord.monthReset = monthKey;
    }
    if (keyRecord.requestsThisMonth >= 1000) {
      return NextResponse.json(
        { error: "Monthly request limit (1000) exceeded. Contact support or purchase another key." },
        { status: 429 }
      );
    }

    // Rate limit check (10/min)
    if (!checkRateLimit(apiKey)) {
      return NextResponse.json(
        { error: "Rate limit exceeded. Max 10 requests per minute." },
        { status: 429 }
      );
    }

    // Increment request counts
    keyRecord.requestCount++;
    keyRecord.requestsThisMonth++;
    saveApiKeys(keys);

    // Fetch token data from Solana RPC (mint account info)
    const rpcBody = {
      jsonrpc: "2.0",
      id: 1,
      method: "getAccountInfo",
      params: [
        mint,
        { encoding: "jsonParsed" },
      ],
    };

    const [rpcRes, jupiterRes, dexRes] = await Promise.allSettled([
      fetch(`https://mainnet.helius-rpc.com/?api-key=${process.env.HELIUS_API_KEY || "d56fdc82-51fb-4718-b521-6af1e99b83ea"}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(rpcBody),
      }),
      fetch(`https://api.jup.ag/price/v2?ids=${mint}`),
      fetch(`https://api.dexscreener.com/latest/dex/tokens/${mint}`),
    ]);

    // Parse RPC response
    let tokenName = "Unknown";
    let tokenSymbol = "Unknown";
    let decimals = 0;
    let supply = "0";
    let mintAuthority: string | null = null;
    let freezeAuthority: string | null = null;
    let mintAuthorityActive = false;
    let freezeAuthorityActive = false;

    if (rpcRes.status === "fulfilled") {
      const rpcData = await rpcRes.value.json();
      const parsed = rpcData?.result?.value?.data?.parsed;
      if (parsed?.type === "mint" && parsed.info) {
        const info = parsed.info;
        decimals = info.decimals || 0;
        supply = info.supply || "0";
        mintAuthority = info.mintAuthority || null;
        freezeAuthority = info.freezeAuthority || null;
        mintAuthorityActive = !!mintAuthority;
        freezeAuthorityActive = !!freezeAuthority;
      } else if (!rpcData?.result?.value) {
        return NextResponse.json(
          { error: "Token mint account not found on Solana." },
          { status: 404 }
        );
      }
    }

    // Parse Jupiter price response
    let priceUsd = 0;
    if (jupiterRes.status === "fulfilled") {
      try {
        const jupData = await jupiterRes.value.json();
        if (jupData?.data?.[mint]?.price) {
          priceUsd = parseFloat(jupData.data[mint].price);
        }
      } catch { /* ignore parse errors */ }
    }

    // Parse DexScreener response
    let liquidity = 0;
    let volume24h = 0;
    let pairCount = 0;
    let topPairUrl = "";
    if (dexRes.status === "fulfilled") {
      try {
        const dexData = await dexRes.value.json();
        if (dexData?.pairs && dexData.pairs.length > 0) {
          pairCount = dexData.pairs.length;
          // Use first pair (highest liquidity typically)
          const topPair = dexData.pairs[0];
          liquidity = topPair.liquidity?.usd || 0;
          volume24h = topPair.volume?.h24 || 0;
          topPairUrl = topPair.url || "";

          // Get name/symbol from DexScreener if available
          if (topPair.baseToken?.address === mint) {
            tokenName = topPair.baseToken.name || tokenName;
            tokenSymbol = topPair.baseToken.symbol || tokenSymbol;
          } else if (topPair.quoteToken?.address === mint) {
            tokenName = topPair.quoteToken.name || tokenName;
            tokenSymbol = topPair.quoteToken.symbol || tokenSymbol;
          }

          // Aggregate liquidity and volume across all pairs
          let totalLiquidity = 0;
          let totalVolume = 0;
          for (const pair of dexData.pairs) {
            totalLiquidity += pair.liquidity?.usd || 0;
            totalVolume += pair.volume?.h24 || 0;
          }
          liquidity = totalLiquidity;
          volume24h = totalVolume;
        }
      } catch { /* ignore parse errors */ }
    }

    // Calculate risk
    const risk = calculateRiskScore({
      mintAuthority: mintAuthorityActive,
      freezeAuthority: freezeAuthorityActive,
      liquidity,
      volume24h,
      priceUsd,
    });

    // Format supply with decimals
    const supplyNum = parseInt(supply);
    const adjustedSupply = decimals > 0 ? supplyNum / Math.pow(10, decimals) : supplyNum;

    const result = {
      success: true,
      data: {
        mint,
        name: tokenName,
        symbol: tokenSymbol,
        decimals,
        supply: adjustedSupply,
        supplyRaw: supply,
        mintAuthority: {
          status: mintAuthorityActive ? "ACTIVE" : "RENOUNCED",
          address: mintAuthority,
        },
        freezeAuthority: {
          status: freezeAuthorityActive ? "ACTIVE" : "RENOUNCED",
          address: freezeAuthority,
        },
        price: {
          usd: priceUsd,
        },
        market: {
          liquidityUsd: liquidity,
          volume24hUsd: volume24h,
          pairCount,
          topPairUrl,
        },
        risk: {
          score: risk.score,
          level: risk.level,
          reasons: risk.reasons,
        },
      },
      timestamp: new Date().toISOString(),
    };

    return NextResponse.json(result);
  } catch (e) {
    console.error("Scan error:", e);
    return NextResponse.json(
      { error: "Internal server error. Please try again." },
      { status: 500 }
    );
  }
}
