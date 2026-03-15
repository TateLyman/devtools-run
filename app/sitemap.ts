import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://devtools-site-delta.vercel.app";
  const now = new Date().toISOString();

  const tools = [
    "", "json", "base64", "url", "hash", "jwt", "regex", "sql",
    "timestamp", "color", "uuid", "password", "cron", "chmod",
    "lorem", "markdown", "qr", "diff", "aspect-ratio", "yaml-json",
    "sol-calc", "sol-scan", "sol-token", "sol-wallet",
    "html-encode", "css-minify", "number-base", "text-count", "epoch",
  ];

  const products = [
    "sol-bot", "sol-bot-source", "sol-grid-bot", "sol-defi-toolkit",
    "sol-trading-guide", "prompt-pack",
  ];

  const pages = ["services", "links"];

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
  ];
}
