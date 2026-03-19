import { MetadataRoute } from "next";
import { getAllSlugs } from "./is-safe/tokens";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://devtools-site-delta.vercel.app";
  const now = new Date().toISOString();

  const tools = [
    "", "json", "base64", "url", "hash", "jwt", "regex", "sql",
    "timestamp", "color", "uuid", "password", "cron", "chmod",
    "lorem", "markdown", "qr", "diff", "aspect-ratio", "yaml-json",
    "sol-calc", "sol-scan", "sol-token", "sol-wallet",
    "sol-staking", "sol-converter", "gas-tracker",
    "html-encode", "css-minify", "number-base", "text-count", "epoch",
    "code-review",
  ];

  const products = [
    "sol-bot", "sol-bot-source", "sol-grid-bot", "sol-defi-toolkit",
    "sol-trading-guide", "prompt-pack", "white-label",
    "bot-builder", "api-access",
  ];

  const pages = ["services", "links", "hire", "advertise"];

  const conversions = [
    "json/yaml", "yaml/json", "json/csv", "csv/json",
    "hex/rgb", "rgb/hex", "hex/decimal", "decimal/hex",
    "binary/decimal", "decimal/binary",
    "celsius/fahrenheit", "fahrenheit/celsius",
    "km/miles", "miles/km",
    "kg/lbs", "lbs/kg",
    "px/rem", "rem/px",
    "unix/date", "date/unix",
    "base64/text", "text/base64",
    "md/html",
  ];

  // Top Solana tokens — individual safety check pages for SEO
  const topTokenMints = [
    "So11111111111111111111111111111111111111112",
    "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
    "Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB",
    "DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263",
    "EKpQGSJtjMFqKZ9KQanSqYXRcF8fBopzLHYxdM65zcjm",
    "JUPyiwrYJFskUPiHa7hkeR8VUtAeFoSYbKedZNsDvCN",
    "4k3Dyjzvzp8eMZWUXbBCjEvwSkkk59S5iCNLY3QrkX6R",
    "HZ1JovNiVvGrGNiiYvEozEVgZ58xaU3RKwX8eACQBCt3",
    "jtojtomepa8beP8AuQc6eXt5FriJwfFMwQx2v2f9mCL",
    "85VBFQZC9TZkfaptBWjvUw7YbZjy52A6mjtPGjstQAmQ",
    "orcaEKTdK7LKz57vaAYr9QeNsVEPfiu6QeMU1kektZE",
    "7GCihgDB8fe6KNjn2MYtkzZcRjQy3t9GHdC8uHYmW2hr",
    "MEW1gQWJ3nEXg2qgERiKu7FAFj79PHvQVREQUzScPP5",
    "rndrizKT3MK1iimdxRdWabcF7Zg7AR5T4nud4EkHBof",
    "hntyVP6YFm1Hg25TN9WGLqM12b8TQmcknKrdu1oxWux",
    "6p6xgHyF7AeE6TZkSmFsko444wqoP15icUSqi2jfGiPN",
    "9BB6NFEcjBCtnNLFko2FqVQBq8HHM13kCyYcdQbgpump",
    "HeLp6NuQkmYB4pYWo2zYs22mESHXPQYzXbB8n4V98jwC",
    "2zMMhcVQEXDtdE6vsFS7S7D5oUodfJHE8vd1gnBouauv",
    "ukHH6c7mMyiWCf6HyRELbMTJBPF43WRmu3MsAMa4VBa",
  ];

  return [
    ...tools.map((t) => ({
      url: `${base}/${t}`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: t === "" ? 1.0 : 0.7,
    })),
    ...products.map((p) => ({
      url: `${base}/${p}`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.9,
    })),
    ...pages.map((p) => ({
      url: `${base}/${p}`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.6,
    })),
    ...conversions.map((c) => ({
      url: `${base}/convert/${c}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
    // Airdrops tracker page
    {
      url: `${base}/airdrops`,
      lastModified: now,
      changeFrequency: "daily" as const,
      priority: 0.9,
    },
    // Token checker landing page
    {
      url: `${base}/token`,
      lastModified: now,
      changeFrequency: "daily" as const,
      priority: 0.8,
    },
    // Individual token pages
    ...topTokenMints.map((mint) => ({
      url: `${base}/token/${mint}`,
      lastModified: now,
      changeFrequency: "daily" as const,
      priority: 0.7,
    })),
    // Token safety check landing page
    {
      url: `${base}/is-safe`,
      lastModified: now,
      changeFrequency: "daily" as const,
      priority: 0.9,
    },
    // Individual token safety check pages (programmatic SEO)
    ...getAllSlugs().map((slug) => ({
      url: `${base}/is-safe/${slug}`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.7,
    })),
  ];
}
