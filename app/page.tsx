import Link from "next/link";
import TipButton from "./components/TipButton";

const tools = [
  {
    href: "/json",
    name: "JSON Formatter & Validator",
    description:
      "Paste JSON to format, validate, and minify. Instant syntax highlighting and error detection.",
    icon: "{ }",
  },
  {
    href: "/base64",
    name: "Base64 Encoder / Decoder",
    description:
      "Encode or decode text and files to and from Base64. Supports UTF-8 and binary files.",
    icon: "B64",
  },
  {
    href: "/hash",
    name: "Hash Generator",
    description:
      "Generate MD5, SHA-1, and SHA-256 hashes from any text input using the Web Crypto API.",
    icon: "#",
  },
  {
    href: "/jwt",
    name: "JWT Decoder",
    description:
      "Paste a JSON Web Token to decode and inspect the header, payload, and signature.",
    icon: "JWT",
  },
  {
    href: "/timestamp",
    name: "Unix Timestamp Converter",
    description:
      "Convert between Unix timestamps and human-readable dates. Supports seconds and milliseconds.",
    icon: "T",
  },
  {
    href: "/sol-calc",
    name: "SOL / USD Calculator",
    description:
      "Convert between Solana (SOL) and USD with live prices from CoinGecko.",
    icon: "$",
  },
  {
    href: "/sol-token",
    name: "Solana Token Lookup",
    description:
      "Look up any Solana token by mint address. See name, symbol, supply, price, and more.",
    icon: "SOL",
  },
  {
    href: "/sol-wallet",
    name: "Solana Wallet Checker",
    description:
      "Check any Solana wallet balance, token holdings, and recent transactions.",
    icon: "W",
  },
  {
    href: "/sol-scan",
    name: "Token Safety Scanner",
    description:
      "Scan any Solana token for rug pull risks. Checks mint authority, freeze authority, top holders, and more. 0.01 SOL per scan.",
    icon: "\ud83d\udd0d",
  },
  {
    href: "/regex",
    name: "Regex Tester",
    description:
      "Test regular expression patterns against text with real-time match highlighting.",
    icon: ".*",
  },
  {
    href: "/color",
    name: "Color Converter",
    description:
      "Convert colors between HEX, RGB, and HSL formats with a live preview swatch.",
    icon: "C",
  },
  {
    href: "/markdown",
    name: "Markdown Preview",
    description:
      "Write Markdown and see rendered HTML in real-time. Supports headings, bold, italic, links, code blocks, lists, and blockquotes.",
    icon: "MD",
  },
  {
    href: "/url",
    name: "URL Encoder / Decoder",
    description:
      "Encode or decode URLs and URL components using encodeURI or encodeURIComponent with instant output.",
    icon: "%",
  },
  {
    href: "/lorem",
    name: "Lorem Ipsum Generator",
    description:
      "Generate placeholder paragraphs, sentences, or words for your designs and mockups.",
    icon: "Li",
  },
  {
    href: "/diff",
    name: "Text Diff Tool",
    description:
      "Compare two pieces of text side by side with line-by-line diff highlighting for added and removed lines.",
    icon: "+-",
  },
  {
    href: "/password",
    name: "Password Generator",
    description:
      "Generate strong, random passwords with customizable length, character types, and a strength indicator.",
    icon: "**",
  },
  {
    href: "/cron",
    name: "Cron Expression Parser",
    description:
      "Enter a cron expression to get a human-readable description and upcoming run times. Includes common presets.",
    icon: "CT",
  },
  {
    href: "/qr",
    name: "QR Code Generator",
    description:
      "Enter text or a URL to generate a QR code. Adjustable size and download as PNG. Canvas-based with no external library.",
    icon: "QR",
  },
  {
    href: "/uuid",
    name: "UUID Generator",
    description:
      "Generate random v4 UUIDs. Bulk generate up to 100 at once, copy individual or all, and toggle hyphens on or off.",
    icon: "ID",
  },
  {
    href: "/chmod",
    name: "Unix Permissions Calculator",
    description:
      "Toggle read, write, and execute for owner, group, and other. See numeric (755) and symbolic (rwxr-xr-x) in real-time.",
    icon: "RW",
  },
  {
    href: "/sql",
    name: "SQL Formatter",
    description:
      "Paste messy SQL to format with proper indentation and keyword uppercasing. Supports SELECT, INSERT, UPDATE, DELETE, CREATE, and ALTER.",
    icon: "SQ",
  },
  {
    href: "/yaml-json",
    name: "YAML / JSON Converter",
    description:
      "Convert between YAML and JSON formats with a built-in parser. Handles nested objects, arrays, strings, numbers, and booleans.",
    icon: "YJ",
  },
  {
    href: "/aspect-ratio",
    name: "Aspect Ratio Calculator",
    description:
      "Calculate dimensions from an aspect ratio (16:9, 4:3, 1:1, 21:9, 9:16) or enter any two dimensions to detect the ratio.",
    icon: "AR",
  },
];

export default function HomePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebApplication",
            "name": "DevTools.run",
            "url": "https://devtools-site-delta.vercel.app",
            "description": "22 free browser-based developer tools and a Solana Scanner Telegram bot. JSON formatter, Base64 encoder, JWT decoder, Solana tools, and more.",
            "applicationCategory": "DeveloperApplication",
            "operatingSystem": "Any",
            "offers": {
              "@type": "Offer",
              "price": "0",
              "priceCurrency": "USD"
            },
            "author": {
              "@type": "Person",
              "name": "Tate Lyman",
              "url": "https://github.com/TateLyman"
            }
          })
        }}
      />
      <section className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-3 tracking-tight">
          Free Online Developer Tools
        </h1>
        <p className="text-[var(--text-secondary)] text-lg max-w-xl mx-auto">
          Fast, private, and free. Every tool runs entirely in your browser
          &mdash; nothing is sent to a server.
        </p>
      </section>

      <div className="grid gap-4 sm:grid-cols-2">
        {tools.map((tool) => (
          <Link
            key={tool.href}
            href={tool.href}
            className="group block rounded-xl border border-[var(--border)] bg-[var(--bg-secondary)] p-5 hover:border-[var(--accent)] transition-colors"
          >
            <div className="flex items-start gap-4">
              <div className="shrink-0 w-11 h-11 rounded-lg bg-[var(--bg-tertiary)] border border-[var(--border)] flex items-center justify-center text-sm font-mono font-bold text-[var(--accent)]">
                {tool.icon}
              </div>
              <div>
                <h2 className="font-semibold text-white group-hover:text-[var(--accent)] transition-colors mb-1">
                  {tool.name}
                </h2>
                <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
                  {tool.description}
                </p>
              </div>
            </div>
          </Link>
        ))}
      </div>

      <div className="mt-8 rounded-xl border border-[var(--border)] bg-gradient-to-r from-[#0088cc]/10 to-[var(--bg-secondary)] p-6">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h3 className="text-lg font-semibold text-white mb-1">Solana Scanner Bot on Telegram</h3>
            <p className="text-sm text-[var(--text-secondary)]">
              Check token prices, wallet balances, and run rug checks — all from Telegram.
            </p>
          </div>
          <a
            href="https://t.me/solscanitbot"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium bg-[#0088cc] text-white hover:bg-[#0088cc]/90 transition-colors"
          >
            Open in Telegram →
          </a>
        </div>
      </div>

      <div className="mt-10 rounded-xl border border-[var(--border)] bg-[var(--bg-secondary)] p-6">
        <h3 className="text-lg font-semibold text-white mb-2 text-center">Support this project</h3>
        <p className="text-sm text-[var(--text-secondary)] text-center mb-4">
          All tools are 100% free, open source, and run client-side. Tips help keep it that way.
        </p>
        <div className="flex flex-col sm:flex-row items-center gap-4 justify-center">
          <TipButton />
          <div className="flex items-center gap-2 bg-[var(--bg-tertiary)] rounded-lg px-4 py-2.5 border border-[var(--border)] w-full sm:w-auto">
            <span className="text-sm font-medium text-[var(--accent)]">SOL</span>
            <code className="text-xs text-[var(--text-secondary)] select-all break-all">NaTTUfDDQ8U1RBqb9q5rz6vJ22cWrrT5UAsXuxnb2Wr</code>
          </div>
          <a
            href="https://github.com/TateLyman/devtools-run"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm text-[var(--text-secondary)] hover:text-white transition-colors"
          >
            Star on GitHub →
          </a>
        </div>
      </div>
    </>
  );
}
