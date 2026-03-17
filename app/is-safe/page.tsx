import { Metadata } from "next";
import Link from "next/link";
import { TOKEN_LIST } from "./tokens";

/* ------------------------------------------------------------------ */
/*  Metadata                                                          */
/* ------------------------------------------------------------------ */

export const metadata: Metadata = {
  title: "Is This Token Safe? Solana Rug Pull Checker & Scam Scanner",
  description:
    "Free Solana token safety checker. Check if any token is a rug pull or scam. Verify mint authority, freeze authority, holder concentration, LP lock status, and get a safety score. Works with BONK, WIF, JUP, TRUMP, and 50+ tokens.",
  keywords: [
    "is this token safe",
    "solana rug pull checker",
    "solana scam checker",
    "crypto scam check",
    "token safety checker",
    "solana token safe",
    "rug pull detector",
    "is bonk safe",
    "is wif safe",
    "memecoin scam check",
    "solana token scanner",
    "crypto rug pull",
  ],
  alternates: {
    canonical: "https://devtools-site-delta.vercel.app/is-safe",
  },
  openGraph: {
    title: "Is This Token Safe? Solana Rug Pull Checker",
    description:
      "Free Solana rug pull checker. Scan any token for scam signals -- mint authority, freeze authority, LP lock, holder concentration, and safety score.",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Is This Token Safe? Solana Rug Pull Checker",
    description:
      "Free Solana rug pull checker. Scan any token for scam signals -- mint authority, freeze authority, LP lock, holder concentration, and safety score.",
  },
};

/* ------------------------------------------------------------------ */
/*  Group tokens by category                                          */
/* ------------------------------------------------------------------ */

const categories = [
  { key: "memecoin", label: "Memecoins", desc: "High-risk, high-reward tokens driven by community hype" },
  { key: "defi", label: "DeFi Tokens", desc: "Decentralized finance protocols on Solana" },
  { key: "infrastructure", label: "Infrastructure", desc: "Blockchain infrastructure and tooling projects" },
  { key: "ai", label: "AI Tokens", desc: "Artificial intelligence and AI agent tokens" },
  { key: "nft", label: "NFT Tokens", desc: "NFT ecosystem and community tokens" },
] as const;

/* ------------------------------------------------------------------ */
/*  Page                                                              */
/* ------------------------------------------------------------------ */

export default function IsSafeLandingPage() {
  return (
    <>
      {/* Hero */}
      <div className="mb-10">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white mb-3 leading-tight">
          Is This Token Safe?
        </h1>
        <p className="text-[var(--text-secondary)] text-base max-w-2xl mb-2">
          Free Solana token safety checker. Select a token below to see its
          rug pull analysis, or scan any token instantly with our Telegram bot.
        </p>
        <p className="text-[var(--text-secondary)] text-sm max-w-2xl">
          We check mint authority, freeze authority, holder concentration, LP
          lock status, and give you a safety score from 0 to 100.
        </p>
      </div>

      {/* Primary CTA */}
      <div className="mb-10 rounded-xl border-2 border-[var(--accent)] bg-gradient-to-r from-blue-900/40 to-purple-900/40 p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div className="flex-1">
            <h2 className="text-xl font-bold text-white mb-2">
              Scan Any Solana Token Instantly
            </h2>
            <p className="text-gray-300 text-sm">
              Paste any contract address into @solscanitbot on Telegram and get a
              full safety report in seconds. Free, no signup required.
            </p>
          </div>
          <a
            href="https://t.me/solscanitbot"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 px-8 rounded-lg text-sm transition-colors shadow-lg shadow-blue-900/30 shrink-0"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
            </svg>
            Open Scanner Bot
          </a>
        </div>
      </div>

      {/* Token Grid by Category */}
      {categories.map(({ key, label, desc }) => {
        const tokens = TOKEN_LIST.filter((t) => t.category === key);
        if (tokens.length === 0) return null;

        return (
          <div key={key} className="mb-10">
            <div className="mb-4">
              <h2 className="text-xl font-bold text-white">{label}</h2>
              <p className="text-sm text-[var(--text-secondary)]">{desc}</p>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
              {tokens.map((token) => (
                <Link
                  key={token.slug}
                  href={`/is-safe/${token.slug}`}
                  className="rounded-lg border border-[var(--border)] bg-[var(--bg-secondary)] hover:border-[var(--accent)] p-4 transition-colors group"
                >
                  <div className="flex items-center gap-2 mb-1.5">
                    <div className="w-8 h-8 rounded-full bg-[var(--bg-tertiary)] border border-[var(--border)] flex items-center justify-center text-xs font-bold text-[var(--accent)] group-hover:border-[var(--accent)] transition-colors">
                      {token.symbol.charAt(0)}
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-white group-hover:text-[var(--accent)] transition-colors">
                        {token.symbol}
                      </div>
                      <div className="text-[10px] text-[var(--text-secondary)] leading-tight">
                        {token.name}
                      </div>
                    </div>
                  </div>
                  <div className="text-xs text-[var(--text-secondary)]">
                    Is {token.symbol} safe?
                  </div>
                </Link>
              ))}
            </div>
          </div>
        );
      })}

      {/* What We Check */}
      <div className="mb-10 rounded-xl border border-[var(--border)] bg-[var(--bg-secondary)] p-6">
        <h2 className="text-lg font-bold text-white mb-4">
          What Our Safety Scanner Checks
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[
            {
              icon: "M",
              label: "Mint Authority",
              desc: "Can the creator print unlimited tokens and crash the price? If mint authority is active, the supply is not fixed.",
            },
            {
              icon: "F",
              label: "Freeze Authority",
              desc: "Can the creator freeze your wallet? If freeze authority is enabled, your tokens can be locked permanently.",
            },
            {
              icon: "H",
              label: "Holder Concentration",
              desc: "Are a few wallets holding most of the supply? High concentration means one wallet can dump and crash the price.",
            },
            {
              icon: "L",
              label: "LP Lock Status",
              desc: "Is liquidity locked? If LP tokens are unlocked, the developer can pull all liquidity at any time.",
            },
            {
              icon: "D",
              label: "Liquidity Depth",
              desc: "How much real liquidity exists? Low liquidity means high slippage -- you can't sell without massive price impact.",
            },
            {
              icon: "S",
              label: "Safety Score",
              desc: "A composite 0-100 risk score based on all checks. Anything below 50 is high risk. Above 80 is relatively safe.",
            },
          ].map((item) => (
            <div
              key={item.label}
              className="flex gap-3 rounded-lg bg-[var(--bg-tertiary)] border border-[var(--border)] p-4"
            >
              <div className="w-9 h-9 rounded-full bg-[var(--accent)]/20 border border-[var(--accent)]/30 flex items-center justify-center text-xs font-bold text-[var(--accent)] shrink-0">
                {item.icon}
              </div>
              <div>
                <div className="text-sm font-semibold text-white">
                  {item.label}
                </div>
                <p className="text-xs text-[var(--text-secondary)] mt-0.5">
                  {item.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Stats/Social Proof */}
      <div className="mb-10 grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { value: "50+", label: "Tokens Covered" },
          { value: "Free", label: "No Cost Ever" },
          { value: "5s", label: "Scan Time" },
          { value: "24/7", label: "Always Available" },
        ].map((stat) => (
          <div
            key={stat.label}
            className="rounded-lg border border-[var(--border)] bg-[var(--bg-secondary)] p-4 text-center"
          >
            <div className="text-2xl font-bold text-[var(--accent)]">
              {stat.value}
            </div>
            <div className="text-xs text-[var(--text-secondary)] mt-1">
              {stat.label}
            </div>
          </div>
        ))}
      </div>

      {/* SEO Content */}
      <section className="mt-8 text-sm text-[var(--text-secondary)] space-y-4">
        <h2 className="text-xl font-bold text-white">
          How to Check if a Solana Token is Safe
        </h2>
        <p>
          The Solana ecosystem has thousands of tokens launching every day. While
          many are legitimate projects, a significant percentage are scams or rug
          pulls designed to steal your money. Before buying any Solana token, you
          need to verify its safety using on-chain data -- not promises from anonymous
          Telegram groups.
        </p>

        <h3 className="text-base font-semibold text-white pt-2">
          What is a Rug Pull?
        </h3>
        <p>
          A rug pull is when a token developer creates a token, generates hype to
          attract buyers, and then extracts value by either: (1) minting millions
          of new tokens and dumping them, (2) pulling all liquidity from the pool,
          or (3) freezing buyer wallets. These tactics are easy to detect with the
          right tools -- which is exactly what our scanner does.
        </p>

        <h3 className="text-base font-semibold text-white pt-2">
          Why You Need a Token Safety Checker
        </h3>
        <p>
          Looking at a token&apos;s price chart alone tells you nothing about its
          safety. A token can be going up 1000% and still be a rug pull in progress.
          The only way to know if a token is safe is to check the on-chain data: mint
          authority, freeze authority, holder distribution, and LP lock status. Our
          scanner checks all of these automatically.
        </p>

        <h3 className="text-base font-semibold text-white pt-2">
          Popular Tokens to Check
        </h3>
        <p>
          Use the links above to check the safety of popular Solana tokens like{" "}
          <Link href="/is-safe/bonk" className="text-[var(--accent)] hover:text-[var(--accent-hover)]">BONK</Link>,{" "}
          <Link href="/is-safe/wif" className="text-[var(--accent)] hover:text-[var(--accent-hover)]">WIF</Link>,{" "}
          <Link href="/is-safe/jup" className="text-[var(--accent)] hover:text-[var(--accent-hover)]">JUP</Link>,{" "}
          <Link href="/is-safe/trump" className="text-[var(--accent)] hover:text-[var(--accent-hover)]">TRUMP</Link>,{" "}
          <Link href="/is-safe/fartcoin" className="text-[var(--accent)] hover:text-[var(--accent-hover)]">FARTCOIN</Link>,{" "}
          <Link href="/is-safe/ai16z" className="text-[var(--accent)] hover:text-[var(--accent-hover)]">AI16Z</Link>,{" "}
          and many more. For tokens not listed here, paste any contract address into{" "}
          <a
            href="https://t.me/solscanitbot"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[var(--accent)] hover:text-[var(--accent-hover)] underline"
          >
            @solscanitbot on Telegram
          </a>{" "}
          for an instant safety report.
        </p>

        <h3 className="text-base font-semibold text-white pt-2">
          Solana Token Safety Checklist
        </h3>
        <ul className="list-disc list-inside space-y-1">
          <li>Mint authority should be revoked (prevents infinite minting)</li>
          <li>Freeze authority should be revoked (prevents account freezing)</li>
          <li>No single wallet should hold more than 20% of supply</li>
          <li>Liquidity should be locked or burned</li>
          <li>Look for at least $50K+ in liquidity for safer entries</li>
          <li>Check for consistent organic trading volume</li>
          <li>Verify the token has been live for more than 24 hours</li>
          <li>Look for a community beyond just a Telegram group</li>
        </ul>
      </section>

      {/* Bottom CTA */}
      <div className="mt-10 mb-6 rounded-xl overflow-hidden">
        <div className="bg-gradient-to-r from-blue-900/60 to-purple-900/60 p-6 sm:p-8 border border-blue-700/40 rounded-xl text-center">
          <h3 className="text-xl font-bold text-white mb-2">
            Don&apos;t See Your Token?
          </h3>
          <p className="text-gray-300 text-sm mb-4">
            Scan any Solana token by pasting its contract address. Works with every
            SPL token -- memecoins, DeFi tokens, NFT tokens, everything.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <a
              href="https://t.me/solscanitbot"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 px-8 rounded-lg text-sm transition-colors"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
              </svg>
              Scan on Telegram
            </a>
            <Link
              href="/sol-scan"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-[var(--bg-tertiary)] border border-[var(--border)] hover:border-[var(--accent)] text-sm text-[var(--text-secondary)] hover:text-white transition-colors"
            >
              Use Web Scanner <span aria-hidden="true">&rarr;</span>
            </Link>
          </div>
        </div>
      </div>

      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebApplication",
            name: "Solana Token Safety Checker",
            description:
              "Free Solana token rug pull checker and scam scanner. Check mint authority, freeze authority, holder concentration, LP lock status, and safety score for any Solana token.",
            url: "https://devtools-site-delta.vercel.app/is-safe",
            applicationCategory: "FinanceApplication",
            operatingSystem: "Any",
            offers: {
              "@type": "Offer",
              price: "0",
              priceCurrency: "USD",
            },
            creator: {
              "@type": "Organization",
              name: "DevTools.run",
            },
          }),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: [
              {
                "@type": "Question",
                name: "How do I know if a Solana token is safe?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "Check for revoked mint authority, revoked freeze authority, locked liquidity, distributed holders, and sufficient trading volume. Use the @solscanitbot Telegram bot for an automated safety scan with a 0-100 risk score.",
                },
              },
              {
                "@type": "Question",
                name: "What is a rug pull in crypto?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "A rug pull is when a token developer creates a token, attracts buyers, then steals their money by minting unlimited tokens, pulling liquidity, or freezing wallets. These can be detected by checking on-chain data before buying.",
                },
              },
              {
                "@type": "Question",
                name: "Is this token safety checker free?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "Yes, both the web-based scanner and the @solscanitbot Telegram bot are completely free. No wallet connection, no payment, no signup required.",
                },
              },
              {
                "@type": "Question",
                name: "What tokens can I scan?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "You can scan any Solana SPL token. This page covers 50+ popular tokens including BONK, WIF, JUP, TRUMP, and more. For any other token, paste its contract address into @solscanitbot on Telegram.",
                },
              },
            ],
          }),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "CollectionPage",
            name: "Solana Token Safety Checks",
            description: "Safety checks for 50+ popular Solana tokens",
            url: "https://devtools-site-delta.vercel.app/is-safe",
            hasPart: TOKEN_LIST.slice(0, 20).map((t) => ({
              "@type": "WebPage",
              name: `Is ${t.symbol} Safe?`,
              url: `https://devtools-site-delta.vercel.app/is-safe/${t.slug}`,
            })),
          }),
        }}
      />
    </>
  );
}
