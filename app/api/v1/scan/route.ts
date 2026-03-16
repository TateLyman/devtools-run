import { NextRequest, NextResponse } from "next/server";
import fs from "fs";

const API_KEYS_FILE = "/tmp/scan-api-keys.json";
const FREE_RATE_FILE = "/tmp/scan-free-rate.json";
const FREE_DAILY_LIMIT = 10;
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute

// Tier limits: requests per day
const TIER_LIMITS: Record<string, number> = {
  pro: 1000,
  unlimited: 100000,
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

interface FreeRateEntry {
  ip: string;
  count: number;
  date: string;
}

interface RateLimitEntry {
  timestamps: number[];
}

const rateLimitMap = new Map<string, RateLimitEntry>();

// ---- Helpers ----

function getApiKeys(): ApiKeyRecord[] {
  try {
    const raw = JSON.parse(fs.readFileSync(API_KEYS_FILE, "utf8"));
    // Support legacy keys that lack a tier field
    return raw.map((k: ApiKeyRecord & { tier?: string }) => ({
      ...k,
      tier: k.tier || "pro",
    }));
  } catch {
    return [];
  }
}

function saveApiKeys(keys: ApiKeyRecord[]) {
  fs.writeFileSync(API_KEYS_FILE, JSON.stringify(keys, null, 2));
}

function getFreeRates(): FreeRateEntry[] {
  try {
    return JSON.parse(fs.readFileSync(FREE_RATE_FILE, "utf8"));
  } catch {
    return [];
  }
}

function saveFreeRates(rates: FreeRateEntry[]) {
  fs.writeFileSync(FREE_RATE_FILE, JSON.stringify(rates, null, 2));
}

function todayKey(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function checkMinuteRateLimit(key: string, max: number = 10): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(key) || { timestamps: [] };
  entry.timestamps = entry.timestamps.filter((t) => now - t < RATE_LIMIT_WINDOW);
  if (entry.timestamps.length >= max) return false;
  entry.timestamps.push(now);
  rateLimitMap.set(key, entry);
  return true;
}

function getClientIp(req: NextRequest): string {
  return (
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    req.headers.get("x-real-ip") ||
    "unknown"
  );
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

  if (data.mintAuthority) {
    score += 30;
    reasons.push("Mint authority is active — supply can be inflated");
  }
  if (data.freezeAuthority) {
    score += 25;
    reasons.push("Freeze authority is active — tokens can be frozen");
  }
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

// ---- Main handler ----

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const mint = searchParams.get("token") || searchParams.get("mint");
    const apiKey = searchParams.get("key") || searchParams.get("apiKey");

    if (!mint) {
      return NextResponse.json(
        {
          error: "Missing token parameter. Usage: /api/v1/scan?token=<MINT_ADDRESS>",
          docs: "https://devtools.run/api-access",
        },
        { status: 400 }
      );
    }

    // Validate mint address format (base58, 32-44 chars)
    if (!/^[1-9A-HJ-NP-Za-km-z]{32,44}$/.test(mint)) {
      return NextResponse.json({ error: "Invalid token mint address format." }, { status: 400 });
    }

    // Determine tier
    let tier: "free" | "pro" | "unlimited" = "free";
    let keyRecord: ApiKeyRecord | undefined;

    if (apiKey) {
      const keys = getApiKeys();
      keyRecord = keys.find((k) => k.apiKey === apiKey);
      if (!keyRecord) {
        return NextResponse.json(
          { error: "Invalid API key. Get one at https://devtools.run/api-access" },
          { status: 401 }
        );
      }
      tier = keyRecord.tier;

      // Daily limit check
      const today = todayKey();
      if (keyRecord.dayReset !== today) {
        keyRecord.requestsToday = 0;
        keyRecord.dayReset = today;
      }
      const dailyLimit = TIER_LIMITS[tier] || 1000;
      if (keyRecord.requestsToday >= dailyLimit) {
        return NextResponse.json(
          {
            error: `Daily request limit (${dailyLimit.toLocaleString()}) exceeded. Resets at midnight UTC.`,
            upgrade: "https://devtools.run/api-access",
          },
          { status: 429 }
        );
      }

      // Per-minute rate limit
      if (!checkMinuteRateLimit(apiKey, tier === "unlimited" ? 60 : 15)) {
        return NextResponse.json(
          { error: "Rate limit exceeded. Please slow down." },
          { status: 429 }
        );
      }

      // Increment counters
      keyRecord.requestCount++;
      keyRecord.requestsToday++;
      saveApiKeys(keys);
    } else {
      // Free tier: IP-based daily limit
      const ip = getClientIp(req);
      const today = todayKey();
      const rates = getFreeRates();

      // Clean old entries
      const currentRates = rates.filter((r) => r.date === today);
      const ipEntry = currentRates.find((r) => r.ip === ip);

      if (ipEntry && ipEntry.count >= FREE_DAILY_LIMIT) {
        return NextResponse.json(
          {
            error: `Free tier limit reached (${FREE_DAILY_LIMIT} scans/day). Get an API key for higher limits.`,
            upgrade: "https://devtools.run/api-access",
          },
          { status: 429 }
        );
      }

      // Per-minute rate limit for free
      if (!checkMinuteRateLimit(`free:${ip}`, 5)) {
        return NextResponse.json(
          { error: "Rate limit exceeded. Please slow down." },
          { status: 429 }
        );
      }

      // Increment free counter
      if (ipEntry) {
        ipEntry.count++;
      } else {
        currentRates.push({ ip, count: 1, date: today });
      }
      saveFreeRates(currentRates);
    }

    // ---- Fetch token data ----

    const rpcBody = {
      jsonrpc: "2.0",
      id: 1,
      method: "getAccountInfo",
      params: [mint, { encoding: "jsonParsed" }],
    };

    const [rpcRes, jupiterRes, dexRes] = await Promise.allSettled([
      fetch(
        `https://mainnet.helius-rpc.com/?api-key=${process.env.HELIUS_API_KEY || "d56fdc82-51fb-4718-b521-6af1e99b83ea"}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(rpcBody),
        }
      ),
      fetch(`https://api.jup.ag/price/v2?ids=${mint}`),
      fetch(`https://api.dexscreener.com/latest/dex/tokens/${mint}`),
    ]);

    // Parse RPC
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

    // Parse Jupiter price
    let priceUsd = 0;
    if (jupiterRes.status === "fulfilled") {
      try {
        const jupData = await jupiterRes.value.json();
        if (jupData?.data?.[mint]?.price) {
          priceUsd = parseFloat(jupData.data[mint].price);
        }
      } catch {
        /* ignore */
      }
    }

    // Parse DexScreener
    let liquidity = 0;
    let volume24h = 0;
    let pairCount = 0;
    let topPairUrl = "";
    let priceChange24h = 0;
    let marketCap = 0;

    if (dexRes.status === "fulfilled") {
      try {
        const dexData = await dexRes.value.json();
        if (dexData?.pairs && dexData.pairs.length > 0) {
          pairCount = dexData.pairs.length;
          const topPair = dexData.pairs[0];
          topPairUrl = topPair.url || "";
          priceChange24h = topPair.priceChange?.h24 || 0;
          marketCap = topPair.marketCap || topPair.fdv || 0;

          if (topPair.baseToken?.address === mint) {
            tokenName = topPair.baseToken.name || tokenName;
            tokenSymbol = topPair.baseToken.symbol || tokenSymbol;
          } else if (topPair.quoteToken?.address === mint) {
            tokenName = topPair.quoteToken.name || tokenName;
            tokenSymbol = topPair.quoteToken.symbol || tokenSymbol;
          }

          // Aggregate across all pairs
          let totalLiquidity = 0;
          let totalVolume = 0;
          for (const pair of dexData.pairs) {
            totalLiquidity += pair.liquidity?.usd || 0;
            totalVolume += pair.volume?.h24 || 0;
          }
          liquidity = totalLiquidity;
          volume24h = totalVolume;
        }
      } catch {
        /* ignore */
      }
    }

    // Use DexScreener price if Jupiter didn't return one
    if (priceUsd <= 0 && dexRes.status === "fulfilled") {
      try {
        const dexData = await dexRes.value.json();
        if (dexData?.pairs?.[0]?.priceUsd) {
          priceUsd = parseFloat(dexData.pairs[0].priceUsd);
        }
      } catch {
        /* ignore */
      }
    }

    // Supply
    const supplyNum = parseInt(supply);
    const adjustedSupply = decimals > 0 ? supplyNum / Math.pow(10, decimals) : supplyNum;

    // ---- Build response based on tier ----

    if (tier === "free") {
      // Free tier: basic info only
      return NextResponse.json({
        token: mint,
        name: tokenName,
        symbol: tokenSymbol,
        price: priceUsd,
        price_change_24h: priceChange24h,
        market_cap: marketCap,
        pairs: pairCount,
        tier: "free",
        scan_url: "https://t.me/solscanitbot",
        upgrade: "https://devtools.run/api-access",
        timestamp: new Date().toISOString(),
      });
    }

    // Paid tier: full scan
    const risk = calculateRiskScore({
      mintAuthority: mintAuthorityActive,
      freezeAuthority: freezeAuthorityActive,
      liquidity,
      volume24h,
      priceUsd,
    });

    return NextResponse.json({
      token: mint,
      name: tokenName,
      symbol: tokenSymbol,
      decimals,
      supply: adjustedSupply,
      price: priceUsd,
      price_change_24h: priceChange24h,
      liquidity_usd: liquidity,
      volume_24h: volume24h,
      market_cap: marketCap,
      pairs: pairCount,
      top_pair_url: topPairUrl,
      mint_authority: {
        status: mintAuthorityActive ? "ACTIVE" : "RENOUNCED",
        address: mintAuthority,
      },
      freeze_authority: {
        status: freezeAuthorityActive ? "ACTIVE" : "RENOUNCED",
        address: freezeAuthority,
      },
      risk: {
        score: risk.score,
        level: risk.level,
        reasons: risk.reasons,
      },
      tier,
      scan_url: "https://t.me/solscanitbot",
      timestamp: new Date().toISOString(),
    });
  } catch (e) {
    console.error("v1 Scan error:", e);
    return NextResponse.json(
      { error: "Internal server error. Please try again." },
      { status: 500 }
    );
  }
}
