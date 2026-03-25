import { Metadata } from "next";
import PriceClient from "./client";

const TOKENS: Record<string, { name: string; symbol: string; coingeckoId?: string }> = {
  sol: { name: "Solana", symbol: "SOL", coingeckoId: "solana" },
  btc: { name: "Bitcoin", symbol: "BTC", coingeckoId: "bitcoin" },
  eth: { name: "Ethereum", symbol: "ETH", coingeckoId: "ethereum" },
  usdc: { name: "USD Coin", symbol: "USDC" },
  usdt: { name: "Tether", symbol: "USDT" },
  bnb: { name: "BNB", symbol: "BNB", coingeckoId: "binancecoin" },
  xrp: { name: "XRP", symbol: "XRP", coingeckoId: "ripple" },
  ada: { name: "Cardano", symbol: "ADA", coingeckoId: "cardano" },
  doge: { name: "Dogecoin", symbol: "DOGE", coingeckoId: "dogecoin" },
  dot: { name: "Polkadot", symbol: "DOT", coingeckoId: "polkadot" },
  avax: { name: "Avalanche", symbol: "AVAX", coingeckoId: "avalanche-2" },
  matic: { name: "Polygon", symbol: "MATIC", coingeckoId: "matic-network" },
  link: { name: "Chainlink", symbol: "LINK", coingeckoId: "chainlink" },
  uni: { name: "Uniswap", symbol: "UNI", coingeckoId: "uniswap" },
  atom: { name: "Cosmos", symbol: "ATOM", coingeckoId: "cosmos" },
  near: { name: "NEAR", symbol: "NEAR", coingeckoId: "near" },
  apt: { name: "Aptos", symbol: "APT", coingeckoId: "aptos" },
  sui: { name: "Sui", symbol: "SUI", coingeckoId: "sui" },
  arb: { name: "Arbitrum", symbol: "ARB", coingeckoId: "arbitrum" },
  op: { name: "Optimism", symbol: "OP", coingeckoId: "optimism" },
  jup: { name: "Jupiter", symbol: "JUP", coingeckoId: "jupiter-exchange-solana" },
  bonk: { name: "Bonk", symbol: "BONK", coingeckoId: "bonk" },
  wif: { name: "dogwifhat", symbol: "WIF", coingeckoId: "dogwifcoin" },
  pepe: { name: "Pepe", symbol: "PEPE", coingeckoId: "pepe" },
  shib: { name: "Shiba Inu", symbol: "SHIB", coingeckoId: "shiba-inu" },
  usd: { name: "US Dollar", symbol: "USD" },
  eur: { name: "Euro", symbol: "EUR" },
  gbp: { name: "British Pound", symbol: "GBP" },
  jpy: { name: "Japanese Yen", symbol: "JPY" },
  aud: { name: "Australian Dollar", symbol: "AUD" },
  cad: { name: "Canadian Dollar", symbol: "CAD" },
  inr: { name: "Indian Rupee", symbol: "INR" },
};

function getAllPairs(): string[] {
  const pairs: string[] = [];
  const tokens = Object.keys(TOKENS);
  for (const from of tokens) {
    for (const to of tokens) {
      if (from !== to) pairs.push(`${from}-to-${to}`);
    }
  }
  return pairs;
}

function parsePair(pair: string): { from: string; to: string } | null {
  const match = pair.match(/^(.+)-to-(.+)$/);
  if (!match) return null;
  const [, from, to] = match;
  if (from in TOKENS && to in TOKENS) return { from, to };
  return null;
}

// Dynamic rendering — too many pairs for static build on hobby plan
export const dynamicParams = true;

export async function generateMetadata({ params }: { params: Promise<{ pair: string }> }): Promise<Metadata> {
  const { pair } = await params;
  const parsed = parsePair(pair);
  if (!parsed) return { title: "Price Converter" };
  const from = TOKENS[parsed.from];
  const to = TOKENS[parsed.to];
  return {
    title: `${from.name} to ${to.name} Price Calculator — ${from.symbol}/${to.symbol} Converter`,
    description: `Convert ${from.name} (${from.symbol}) to ${to.name} (${to.symbol}). Live price calculator with real-time rates. Free ${from.symbol} to ${to.symbol} converter.`,
    keywords: [`${from.symbol} to ${to.symbol}`, `${from.name} to ${to.name}`, `convert ${from.symbol}`, `${from.symbol} ${to.symbol} calculator`, `${from.symbol} price`],
  };
}

export default async function PricePage({ params }: { params: Promise<{ pair: string }> }) {
  const { pair } = await params;
  const parsed = parsePair(pair);
  if (!parsed) return <div>Invalid pair</div>;
  const from = TOKENS[parsed.from];
  const to = TOKENS[parsed.to];
  const allTokens = Object.entries(TOKENS).map(([k, v]) => ({ id: k, ...v }));
  return <PriceClient fromId={parsed.from} toId={parsed.to} fromToken={from} toToken={to} allTokens={allTokens} />;
}
