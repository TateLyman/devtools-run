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
    "code-review", "ai-writer", "resume-builder", "invoice-generator",
    "link-shortener", "color-palette-generator", "readme-generator",
    "html-to-jsx", "svg-to-css", "css-grid-generator", "flexbox-generator",
    "json-formatter", "text-to-speech", "speech-to-text", "image-to-base64",
    "code-formatter", "pixel-art", "text-compare", "markdown-preview",
    "css-animation-generator", "crontab", "sql-formatter",
    "lorem-ipsum-generator", "hash-generator", "jwt-decoder",
    "base64-encoder", "url-encoder", "password-generator",
    "regex-tester", "uuid-generator", "timestamp-converter",
    "color-converter", "qr-code-generator",
    "mortgage-calculator", "bmi-calculator", "tip-calculator",
    "compound-interest", "stopwatch", "character-counter",
    "age-calculator", "percentage-calculator", "free-api",
    "unit-converter", "scientific-calculator",
    "random-number", "gpa-calculator",
    "countdown", "world-clock", "text-to-image", "timezone-converter", "css-glassmorphism", "email-validator", "css-text-shadow", "json-to-csv", "html-minifier", "js-minifier", "daily-dev-quote", "extension", "font-size-converter", "html-to-markdown", "yaml-validator", "xml-formatter", "stripe-fee", "salary-calculator", "markdown-to-html", "css-specificity", "paypal-fee", "css-clip-path", "loan-calculator", "date-calculator", "swap", "github-profile", "dns-lookup", "whois", "ssl-checker", "http-header-checker", "sitemap-generator", "htaccess-generator", "nginx-config", "docker-compose", "ip-lookup", "csp-generator", "json-to-typescript", "meta-tag-generator", "open-graph-preview", "privacy-policy-generator", "color-blindness", "terms-generator", "json-editor", "svg-editor", "tailwind-to-css", "tap-game", "telegram-bot-template", "newsletter", "css-to-tailwind", "og-image-generator", "hosting-compare", "prompt-engineering", "webhook-tester", "json-schema", "cors-tester", "typescript-playground", "regex-to-english", "api-key-generator", "env-generator", "github-actions", "package-json", "sol-scanner-extension", "npm-package-size", "sql-to-mongodb", "html-preview", "api-monitor", "seo-audit", "scrape-api", "ai-image-prompt", "readme-badge", "json-diff", "css-gradient-generator", "social-scheduler", "tweet-generator", "youtube-thumbnail", "linkedin-post", "hashtag-generator", "instagram-bio", "caption-generator", "business-name", "domain-checker", "email-subject-tester", "color-picker", "font-preview", "cover-letter", "meme-generator", "paraphrase", "plagiarism-checker", "grammar-checker", "text-to-binary", "fancy-text", "word-to-pdf", "text-repeater", "image-resizer", "image-cropper", "coin-flip", "dice-roller", "spin-wheel", "would-you-rather", "truth-or-dare", "name-generator", "wifi-qr", "love-calculator", "tic-tac-toe", "rock-paper-scissors", "number-to-words", "text-case", "typing-speed", "emoji-kitchen", "drawing-pad", "flashcard", "meditation-timer", "habit-tracker", "recipe-scaler", "birth-chart", "never-have-i-ever", "2048", "math-solver", "font-awesome-search", "snake-game", "color-name-lookup", "hangman", "dog-age", "electric-bill", "pregnancy-calculator", "calorie-calculator", "sleep-calculator", "job-alerts", "learn-solana",
    "budget-tracker", "barcode-generator", "subnet-calculator",
    "minesweeper", "wordle", "tax-calculator", "sudoku", "download-calculator", "pixel-converter", "color-gradient", "morse-code", "roman-numeral", "number-converter", "hex-to-color", "ascii-art-text", "password-strength", "emoji-search", "reading-time", "percent-calc", "screen-resolution", "internet-speed", "image-colors", "json-to-csv-converter", "tts", "markdown-table", "border-radius-gen",
  ];

  const products = [
    "sol-bot", "sol-bot-source", "sol-grid-bot", "sol-defi-toolkit",
    "sol-trading-guide", "prompt-pack", "white-label",
    "bot-builder", "api-access",
    "sniper", "whale-tracker", "sol-pay", "templates",
    "sol-balance", "sol-price", "airdrop-checker", "nft-checker",
    "tx-history", "staking-calc", "sol-usd",
    "vanity-address", "create-token", "rpc-status",
    "webhooks", "gradient", "meta-tags", "favicon", "placeholder",
    "sol-usd", "bundle", "json-to-ts", "ip", "useragent",
    "word-counter", "box-shadow", "tailwind-colors", "emoji", "regex-cheatsheet",
    "regex-patterns", "http-status", "curl-builder", "md-editor", "contrast",
    "meme", "screen-size", "json-validator", "hex-rgb", "launch-token",
    "portfolio", "store", "resources", "merch", "deals", "submit-tool",
    "alpha", "telegram", "changelog", "pricing", "hire", "jobs",
    "seo-checklist", "pomodoro", "typing-test", "project-ideas", "stack-picker",
    "privacy", "daily", "api-docs", "shortcuts", "ascii",
    "startup-toolkit", "notion-templates", "animations",
    "border-radius", "text-diff", "palette", "json-path", "responsive",
    "github-readme", "case-converter", "gitignore", "npm-name",
    "og-preview", "image-compress", "csv-viewer", "robots-generator",
    "font-pairs", "calculator", "token-research", "playground",
    "tech-detector", "readme", "color-name", "notes", "todo", "whiteboard",
    "base-converter", "jwt-create", "cron-monitor", "marketplace",
    "speed-test", "tech-quiz", "blog", "about",
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
    // Converter pages (programmatic SEO — 40 pages)
    ...["json-to-yaml","yaml-to-json","json-to-csv","csv-to-json","json-to-xml","xml-to-json",
      "json-to-typescript","markdown-to-html","html-to-markdown","hex-to-rgb","rgb-to-hex","hex-to-hsl",
      "celsius-to-fahrenheit","fahrenheit-to-celsius","px-to-rem","rem-to-px","px-to-em",
      "base64-to-text","text-to-base64","url-encode","url-decode",
      "binary-to-decimal","decimal-to-binary","hex-to-decimal","decimal-to-hex","octal-to-decimal",
      "unix-to-date","date-to-unix","km-to-miles","miles-to-km","kg-to-lbs","lbs-to-kg",
      "usd-to-sol","sol-to-usd","eth-to-usd","btc-to-usd",
      "inches-to-cm","cm-to-inches","bytes-to-kb","mb-to-gb",
    ].map((slug) => ({
      url: `${base}/convert/${slug}`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.7,
    })),
    // Crypto & fiat price conversion pages (programmatic SEO — 900+ pages)
    ...(() => {
      const tokens = ["sol","btc","eth","usdc","usdt","bnb","xrp","ada","doge","dot","avax","matic","link","uni","atom","near","apt","sui","arb","op","jup","bonk","wif","pepe","shib","usd","eur","gbp","jpy","aud","cad","inr"];
      const pairs: string[] = [];
      for (const from of tokens) {
        for (const to of tokens) {
          if (from !== to) pairs.push(`${from}-to-${to}`);
        }
      }
      return pairs;
    })().map((pair) => ({
      url: `${base}/price/${pair}`,
      lastModified: now,
      changeFrequency: "daily" as const,
      priority: 0.6,
    })),
  ];
}
