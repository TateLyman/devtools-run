import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getTokenBySlug, getAllSlugs, TOKEN_LIST } from "../tokens";

/* ------------------------------------------------------------------ */
/*  Static generation for all known tokens                            */
/* ------------------------------------------------------------------ */

export function generateStaticParams() {
  return getAllSlugs().map((slug) => ({ query: slug }));
}

/* ------------------------------------------------------------------ */
/*  Dynamic SEO metadata                                              */
/* ------------------------------------------------------------------ */

interface PageProps {
  params: Promise<{ query: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { query } = await params;
  const token = getTokenBySlug(query);

  if (!token) {
    return { title: "Token Not Found" };
  }

  const { name, symbol } = token;
  const title = `Is ${name} (${symbol}) Safe? Rug Pull Check & Safety Score`;
  const description = `Is ${symbol} safe to buy? Check if ${name} is a scam or rug pull. Free safety analysis with mint authority check, freeze authority check, holder concentration, LP lock status, and risk score.`;

  return {
    title,
    description,
    keywords: [
      `is ${symbol} safe`,
      `is ${name} safe`,
      `${symbol} rug pull`,
      `${symbol} scam`,
      `${symbol} scam or legit`,
      `is ${symbol} a rug pull`,
      `should I buy ${symbol}`,
      `${name} rug pull check`,
      `${symbol} safety check`,
      `${symbol} token review`,
      `${name} scam check`,
      `${symbol} safe to buy`,
      "solana token safety",
      "solana rug pull checker",
      "crypto scam checker",
    ],
    alternates: {
      canonical: `https://devtools-site-delta.vercel.app/is-safe/${query}`,
    },
    openGraph: {
      title,
      description,
      type: "website",
      url: `https://devtools-site-delta.vercel.app/is-safe/${query}`,
    },
    twitter: {
      card: "summary",
      title,
      description,
    },
  };
}

/* ------------------------------------------------------------------ */
/*  Safety check items (static display data)                          */
/* ------------------------------------------------------------------ */

interface SafetyCheck {
  label: string;
  icon: string;
  status: "pass" | "warning" | "unknown";
  detail: string;
  botOnly?: boolean;
}

function getSafetyChecks(symbol: string, category: string): SafetyCheck[] {
  const isEstablished = ["defi", "infrastructure", "l1"].includes(category);

  return [
    {
      label: "Mint Authority",
      icon: "M",
      status: isEstablished ? "pass" : "unknown",
      detail: isEstablished
        ? `Established ${category} projects typically have mint authority revoked or governed by multisig.`
        : `Scan ${symbol} to check if the creator can mint unlimited tokens and crash the price.`,
      botOnly: !isEstablished,
    },
    {
      label: "Freeze Authority",
      icon: "F",
      status: isEstablished ? "pass" : "unknown",
      detail: isEstablished
        ? `Major tokens like ${symbol} typically have freeze authority disabled.`
        : `Check if the ${symbol} creator can freeze your token account and prevent you from selling.`,
      botOnly: !isEstablished,
    },
    {
      label: "Top Holder Concentration",
      icon: "H",
      status: "unknown",
      detail: `See if ${symbol} supply is concentrated in a few wallets. High concentration = one wallet can dump everything.`,
      botOnly: true,
    },
    {
      label: "Liquidity Pool Lock",
      icon: "L",
      status: "unknown",
      detail: `Check whether ${symbol} liquidity is locked or can be pulled by the creator at any time.`,
      botOnly: true,
    },
    {
      label: "Liquidity Depth",
      icon: "D",
      status: "unknown",
      detail: `Verify ${symbol} has enough liquidity for you to sell without massive slippage.`,
      botOnly: true,
    },
    {
      label: "Safety Score (0-100)",
      icon: "S",
      status: "unknown",
      detail: `Get a composite safety score for ${symbol} based on all on-chain risk factors.`,
      botOnly: true,
    },
  ];
}

/* ------------------------------------------------------------------ */
/*  Page component                                                    */
/* ------------------------------------------------------------------ */

export default async function IsSafePage({ params }: PageProps) {
  const { query } = await params;
  const token = getTokenBySlug(query);

  if (!token) {
    notFound();
  }

  const { name, symbol, category, description, mint } = token;
  const checks = getSafetyChecks(symbol, category);
  const isMemecoin = category === "memecoin";
  const scanUrl = mint
    ? `https://devtools-site-delta.vercel.app/token/${mint}`
    : undefined;

  // Related tokens (same category, excluding self)
  const related = TOKEN_LIST.filter(
    (t) => t.category === category && t.slug !== query
  ).slice(0, 8);

  // FAQ data for structured markup
  const faqItems = [
    {
      question: `Is ${name} (${symbol}) a scam?`,
      answer: `To determine if ${symbol} is a scam, you need to check on-chain data: mint authority status, freeze authority, top holder concentration, and whether liquidity is locked. Use the @solscanitbot Telegram bot to run a free, instant safety scan that checks all these factors and gives you a risk score from 0 to 100.`,
    },
    {
      question: `Is ${symbol} safe to buy?`,
      answer: `Whether ${symbol} is safe depends on multiple on-chain factors. Check if mint authority is revoked (prevents infinite minting), freeze authority is disabled (prevents account freezing), liquidity is locked, and no single wallet holds a dangerous percentage of supply. Scan ${symbol} with @solscanitbot for a complete safety breakdown.`,
    },
    {
      question: `How to check if ${name} is a rug pull?`,
      answer: `The key rug pull indicators for ${symbol} are: enabled mint authority (creator can print tokens), enabled freeze authority (creator can freeze your wallet), unlocked liquidity (LP can be pulled), and concentrated holder distribution. Use a Solana scanner tool like @solscanitbot to check all of these instantly.`,
    },
    {
      question: `Should I buy ${symbol} right now?`,
      answer: `Before buying ${symbol}, always do your own research. Check the token's safety using a scanner to verify mint authority, freeze authority, LP lock status, and holder distribution. Never invest more than you can afford to lose, especially in ${isMemecoin ? "memecoins" : "crypto tokens"}. Use @solscanitbot to get a safety score before making any trade.`,
    },
    {
      question: "How do Solana rug pulls work?",
      answer: "Solana rug pulls typically happen in three ways: (1) The developer mints millions of new tokens and dumps them on buyers, (2) The developer pulls all liquidity from the pool so you can't sell, or (3) The developer uses freeze authority to lock your tokens. Always check these three factors before buying any Solana token.",
    },
  ];

  return (
    <>
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs text-[var(--text-secondary)] mb-6">
        <Link href="/" className="hover:text-white transition-colors">
          Home
        </Link>
        <span>/</span>
        <Link href="/is-safe" className="hover:text-white transition-colors">
          Token Safety
        </Link>
        <span>/</span>
        <span className="text-white">{symbol}</span>
      </nav>

      {/* Hero */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-12 h-12 rounded-full bg-[var(--bg-tertiary)] border border-[var(--border)] flex items-center justify-center text-lg font-bold text-[var(--accent)]">
            {symbol.charAt(0)}
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white leading-tight">
              Is {name} ({symbol}) Safe?
            </h1>
            <p className="text-sm text-[var(--text-secondary)]">
              Rug pull check and safety analysis for {symbol}
            </p>
          </div>
        </div>
        <p className="text-[var(--text-secondary)] text-sm max-w-2xl">
          {description} Below is a safety overview for {symbol}. For a real-time
          on-chain safety scan with a risk score, use our free Telegram bot.
        </p>
      </div>

      {/* Primary CTA */}
      <div className="mb-8 rounded-xl border-2 border-[var(--accent)] bg-gradient-to-r from-blue-900/40 to-purple-900/40 p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div className="flex-1">
            <h2 className="text-xl font-bold text-white mb-2">
              Get the Full {symbol} Safety Report
            </h2>
            <p className="text-gray-300 text-sm mb-1">
              Scan any Solana token instantly -- real-time on-chain data, not cached results.
            </p>
            <ul className="text-gray-400 text-sm space-y-1 list-none">
              <li className="flex items-center gap-2">
                <span className="text-green-400 text-xs">&#9679;</span>
                Mint & freeze authority status
              </li>
              <li className="flex items-center gap-2">
                <span className="text-green-400 text-xs">&#9679;</span>
                Top 10 holder analysis
              </li>
              <li className="flex items-center gap-2">
                <span className="text-green-400 text-xs">&#9679;</span>
                LP lock verification
              </li>
              <li className="flex items-center gap-2">
                <span className="text-green-400 text-xs">&#9679;</span>
                Safety score (0-100)
              </li>
            </ul>
          </div>
          <div className="shrink-0">
            <a
              href="https://t.me/solscanitbot"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 px-8 rounded-lg text-sm transition-colors shadow-lg shadow-blue-900/30"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
              </svg>
              Scan {symbol} Now
            </a>
            <p className="text-xs text-gray-500 mt-2 text-center">
              Free and instant on @solscanitbot
            </p>
          </div>
        </div>
      </div>

      {/* Safety Check Grid */}
      <div className="mb-8">
        <h2 className="text-lg font-bold text-white mb-4">
          {symbol} Safety Checks
        </h2>
        <div className="grid gap-3 sm:grid-cols-2">
          {checks.map((check) => (
            <div
              key={check.label}
              className={`flex gap-3 rounded-lg border p-4 ${
                check.status === "pass"
                  ? "bg-green-900/10 border-green-500/20"
                  : check.status === "warning"
                  ? "bg-yellow-900/10 border-yellow-500/20"
                  : "bg-[var(--bg-secondary)] border-[var(--border)]"
              }`}
            >
              <div
                className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                  check.status === "pass"
                    ? "bg-green-500/20 border border-green-500/30 text-green-400"
                    : check.status === "warning"
                    ? "bg-yellow-500/20 border border-yellow-500/30 text-yellow-400"
                    : "bg-[var(--accent)]/20 border border-[var(--accent)]/30 text-[var(--accent)]"
                }`}
              >
                {check.status === "pass" ? "\u2713" : check.status === "warning" ? "!" : check.icon}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="text-sm font-semibold text-white">
                    {check.label}
                  </span>
                  {check.botOnly && (
                    <span className="text-[10px] font-medium px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-400 border border-blue-500/30">
                      SCAN REQUIRED
                    </span>
                  )}
                </div>
                <p className="text-xs text-[var(--text-secondary)]">
                  {check.detail}
                </p>
              </div>
            </div>
          ))}
        </div>
        <p className="text-xs text-[var(--text-secondary)] mt-3">
          Items marked &quot;Scan Required&quot; need a real-time on-chain scan.{" "}
          <a
            href="https://t.me/solscanitbot"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[var(--accent)] hover:text-[var(--accent-hover)]"
          >
            Scan {symbol} now with @solscanitbot
          </a>
        </p>
      </div>

      {/* Risk Factors Section */}
      <div className="mb-8 rounded-xl border border-[var(--border)] bg-[var(--bg-secondary)] p-6">
        <h2 className="text-lg font-bold text-white mb-3">
          {isMemecoin ? `${symbol} Risk Factors to Watch` : `${symbol} Security Considerations`}
        </h2>
        {isMemecoin ? (
          <div className="space-y-3 text-sm text-[var(--text-secondary)]">
            <p>
              <strong className="text-white">Memecoins are inherently high-risk.</strong>{" "}
              {symbol} is a memecoin, meaning it has no underlying utility or revenue model.
              Price is driven entirely by speculation, community hype, and social media attention.
              Here is what you need to check before buying:
            </p>
            <ul className="list-disc list-inside space-y-1.5">
              <li>
                <strong className="text-gray-300">Mint authority:</strong> If the creator
                can mint new tokens, they can dilute your holdings to zero.
              </li>
              <li>
                <strong className="text-gray-300">Freeze authority:</strong> If enabled,
                the creator can freeze your wallet and prevent you from ever selling.
              </li>
              <li>
                <strong className="text-gray-300">Liquidity lock:</strong> Unlocked
                liquidity means the developer can pull the pool at any moment, crashing
                the price to zero.
              </li>
              <li>
                <strong className="text-gray-300">Holder concentration:</strong> If one
                wallet holds 20%+ of supply, a single sell can crash the price.
              </li>
              <li>
                <strong className="text-gray-300">Token age:</strong> Tokens less than a
                week old have the highest rug pull rates.
              </li>
            </ul>
          </div>
        ) : (
          <div className="space-y-3 text-sm text-[var(--text-secondary)]">
            <p>
              {symbol} is a {category} token with an established project behind it.
              While generally lower risk than memecoins, you should still verify:
            </p>
            <ul className="list-disc list-inside space-y-1.5">
              <li>
                <strong className="text-gray-300">Token authority:</strong> Verify
                governance controls are in place (multisig, DAO, or revoked).
              </li>
              <li>
                <strong className="text-gray-300">Smart contract risk:</strong> Even
                audited protocols can have vulnerabilities.
              </li>
              <li>
                <strong className="text-gray-300">Team tokens:</strong> Check vesting
                schedules and unlock dates for insider allocations.
              </li>
              <li>
                <strong className="text-gray-300">TVL and liquidity:</strong> Ensure
                sufficient on-chain liquidity for your intended trade size.
              </li>
            </ul>
          </div>
        )}
      </div>

      {/* How to Check Guide */}
      <div className="mb-8 rounded-xl border border-[var(--border)] bg-[var(--bg-secondary)] p-6">
        <h2 className="text-lg font-bold text-white mb-3">
          How to Check if {symbol} is a Rug Pull
        </h2>
        <div className="space-y-4">
          <div className="flex gap-3">
            <div className="w-7 h-7 rounded-full bg-[var(--accent)]/20 border border-[var(--accent)]/30 flex items-center justify-center text-xs font-bold text-[var(--accent)] shrink-0">
              1
            </div>
            <div>
              <p className="text-sm font-semibold text-white">
                Get the token contract address
              </p>
              <p className="text-xs text-[var(--text-secondary)] mt-0.5">
                Copy the {symbol} mint address from DexScreener, Birdeye, or the token&apos;s
                official channels. Never trust addresses shared in random Telegram groups.
              </p>
            </div>
          </div>
          <div className="flex gap-3">
            <div className="w-7 h-7 rounded-full bg-[var(--accent)]/20 border border-[var(--accent)]/30 flex items-center justify-center text-xs font-bold text-[var(--accent)] shrink-0">
              2
            </div>
            <div>
              <p className="text-sm font-semibold text-white">
                Run a safety scan
              </p>
              <p className="text-xs text-[var(--text-secondary)] mt-0.5">
                Open{" "}
                <a
                  href="https://t.me/solscanitbot"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[var(--accent)] hover:text-[var(--accent-hover)]"
                >
                  @solscanitbot
                </a>{" "}
                on Telegram and paste the contract address. The bot returns a full
                safety report in seconds.
              </p>
            </div>
          </div>
          <div className="flex gap-3">
            <div className="w-7 h-7 rounded-full bg-[var(--accent)]/20 border border-[var(--accent)]/30 flex items-center justify-center text-xs font-bold text-[var(--accent)] shrink-0">
              3
            </div>
            <div>
              <p className="text-sm font-semibold text-white">
                Read the safety report
              </p>
              <p className="text-xs text-[var(--text-secondary)] mt-0.5">
                Check that mint authority is revoked, freeze authority is disabled,
                liquidity is locked, and no single wallet holds a dangerous percentage
                of the supply. Look for a safety score above 70.
              </p>
            </div>
          </div>
          <div className="flex gap-3">
            <div className="w-7 h-7 rounded-full bg-[var(--accent)]/20 border border-[var(--accent)]/30 flex items-center justify-center text-xs font-bold text-[var(--accent)] shrink-0">
              4
            </div>
            <div>
              <p className="text-sm font-semibold text-white">
                Make your decision
              </p>
              <p className="text-xs text-[var(--text-secondary)] mt-0.5">
                If the safety score is high and all checks pass, the token has lower
                rug pull risk. If any red flags appear, proceed with extreme caution
                or avoid entirely. Never invest more than you can afford to lose.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Scanner Link (if mint address known) */}
      {scanUrl && (
        <div className="mb-8 rounded-xl border border-[var(--border)] bg-[var(--bg-secondary)] p-6">
          <h3 className="text-base font-semibold text-white mb-2">
            View {symbol} Live Market Data
          </h3>
          <p className="text-sm text-[var(--text-secondary)] mb-3">
            Check {symbol}&apos;s current price, trading volume, liquidity, and market cap
            on our free token scanner.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link
              href={`/token/${mint}`}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[var(--bg-tertiary)] border border-[var(--border)] hover:border-[var(--accent)] text-sm text-[var(--text-secondary)] hover:text-white transition-colors"
            >
              {symbol} Price & Volume <span aria-hidden="true">&rarr;</span>
            </Link>
            <Link
              href="/sol-scan"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[var(--bg-tertiary)] border border-[var(--border)] hover:border-[var(--accent)] text-sm text-[var(--text-secondary)] hover:text-white transition-colors"
            >
              Full Token Scanner <span aria-hidden="true">&rarr;</span>
            </Link>
          </div>
        </div>
      )}

      {/* Secondary CTA */}
      <div className="mb-8 rounded-xl overflow-hidden">
        <div className="bg-gradient-to-r from-red-900/30 to-orange-900/30 p-6 border border-red-700/30 rounded-xl">
          <h3 className="text-lg font-bold text-white mb-2">
            Don&apos;t Get Rugged
          </h3>
          <p className="text-gray-300 text-sm mb-3">
            80% of new Solana tokens are scams. Scan before you buy -- it takes 5
            seconds and can save your entire investment.
          </p>
          <a
            href="https://t.me/solscanitbot"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-500 text-white font-bold py-2.5 px-6 rounded-lg text-sm transition-colors"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
            </svg>
            Scan Any Token Free
          </a>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="mb-8">
        <h2 className="text-lg font-bold text-white mb-4">
          Frequently Asked Questions About {symbol}
        </h2>
        <div className="space-y-4">
          {faqItems.map((item) => (
            <details
              key={item.question}
              className="rounded-lg border border-[var(--border)] bg-[var(--bg-secondary)] group"
            >
              <summary className="px-4 py-3 text-sm font-semibold text-white cursor-pointer hover:text-[var(--accent)] transition-colors list-none flex items-center justify-between">
                {item.question}
                <span className="text-[var(--text-secondary)] group-open:rotate-180 transition-transform ml-2">
                  &#9660;
                </span>
              </summary>
              <div className="px-4 pb-4 text-sm text-[var(--text-secondary)]">
                {item.answer}
              </div>
            </details>
          ))}
        </div>
      </div>

      {/* Related Tokens */}
      {related.length > 0 && (
        <div className="mb-8">
          <h2 className="text-lg font-bold text-white mb-4">
            Other {category === "memecoin" ? "Memecoins" : "Tokens"} to Check
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {related.map((t) => (
              <Link
                key={t.slug}
                href={`/is-safe/${t.slug}`}
                className="rounded-lg border border-[var(--border)] bg-[var(--bg-secondary)] hover:border-[var(--accent)] p-3 transition-colors group"
              >
                <div className="text-sm font-semibold text-white group-hover:text-[var(--accent)] transition-colors">
                  {t.symbol}
                </div>
                <div className="text-xs text-[var(--text-secondary)]">
                  Is {t.name} safe?
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* SEO Content */}
      <section className="mt-6 text-sm text-[var(--text-secondary)] space-y-4">
        <h2 className="text-xl font-bold text-white">
          {symbol} Safety Analysis -- What You Need to Know
        </h2>
        <p>
          If you&apos;re searching &quot;is {name} safe&quot; or &quot;{symbol} scam or legit&quot;,
          you&apos;re already doing the right thing. Checking a token before buying is the
          single most important step you can take to protect yourself from rug pulls
          and scams on Solana.
        </p>
        <p>
          {description} Like all crypto tokens, {symbol} carries risk. The key
          difference between a legitimate token and a scam comes down to on-chain
          data that you can verify yourself.
        </p>

        <h3 className="text-base font-semibold text-white pt-2">
          The 5 Signs of a Solana Rug Pull
        </h3>
        <ol className="list-decimal list-inside space-y-1.5">
          <li>
            <strong className="text-gray-300">Active mint authority</strong> --
            The creator can print unlimited tokens, diluting your holdings to zero.
          </li>
          <li>
            <strong className="text-gray-300">Active freeze authority</strong> --
            The creator can freeze your wallet, trapping your tokens forever.
          </li>
          <li>
            <strong className="text-gray-300">Unlocked liquidity</strong> --
            The developer can pull all liquidity from the pool, making the token
            instantly worthless.
          </li>
          <li>
            <strong className="text-gray-300">Concentrated holder distribution</strong> --
            If a few wallets hold most of the supply, one sell can crash the price 90%+.
          </li>
          <li>
            <strong className="text-gray-300">Brand new token with no history</strong> --
            Tokens created hours ago with artificial hype have the highest scam rates.
          </li>
        </ol>

        <h3 className="text-base font-semibold text-white pt-2">
          How to Scan {symbol} for Free
        </h3>
        <p>
          The fastest way to check if {symbol} is safe is with{" "}
          <a
            href="https://t.me/solscanitbot"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[var(--accent)] hover:text-[var(--accent-hover)] underline"
          >
            @solscanitbot on Telegram
          </a>
          . Just paste the token&apos;s contract address and you&apos;ll get an instant safety
          report covering mint authority, freeze authority, holder concentration, LP
          lock status, and a composite safety score. It&apos;s free and works with any
          Solana token.
        </p>
        <p>
          You can also use our{" "}
          <Link
            href="/sol-scan"
            className="text-[var(--accent)] hover:text-[var(--accent-hover)] underline"
          >
            free web-based Solana token scanner
          </Link>{" "}
          to check {symbol}&apos;s price, volume, liquidity, and trading activity. For the
          deepest analysis, the Telegram bot is recommended as it performs direct
          on-chain lookups.
        </p>

        <h3 className="text-base font-semibold text-white pt-2">
          Bottom Line
        </h3>
        <p>
          Never buy any token -- including {symbol} -- without scanning it first.
          A 5-second safety check can save you from losing your entire investment
          to a rug pull. Use{" "}
          <a
            href="https://t.me/solscanitbot"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[var(--accent)] hover:text-[var(--accent-hover)] underline"
          >
            @solscanitbot
          </a>{" "}
          to scan {symbol} or any other Solana token for free.
        </p>
      </section>

      {/* Navigation */}
      <div className="flex flex-wrap gap-3 mt-8 mb-6">
        <Link
          href="/is-safe"
          className="px-4 py-2 rounded-lg bg-[var(--bg-tertiary)] border border-[var(--border)] hover:border-[var(--accent)] text-sm transition-colors text-[var(--text-secondary)] hover:text-white"
        >
          All Token Safety Checks
        </Link>
        <Link
          href="/sol-scan"
          className="px-4 py-2 rounded-lg bg-[var(--bg-tertiary)] border border-[var(--border)] hover:border-[var(--accent)] text-sm transition-colors text-[var(--text-secondary)] hover:text-white"
        >
          Token Scanner Tool
        </Link>
        <a
          href="https://t.me/solscanitbot"
          target="_blank"
          rel="noopener noreferrer"
          className="px-4 py-2 rounded-lg bg-[var(--bg-tertiary)] border border-[var(--border)] hover:border-[var(--accent)] text-sm transition-colors text-[var(--text-secondary)] hover:text-white"
        >
          @solscanitbot on Telegram
        </a>
      </div>

      {/* JSON-LD FAQ Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: faqItems.map((item) => ({
              "@type": "Question",
              name: item.question,
              acceptedAnswer: {
                "@type": "Answer",
                text: item.answer,
              },
            })),
          }),
        }}
      />

      {/* JSON-LD WebPage Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebPage",
            name: `Is ${name} (${symbol}) Safe? Rug Pull Check & Safety Score`,
            description: `Check if ${symbol} is safe to buy. Free rug pull analysis with safety score.`,
            url: `https://devtools-site-delta.vercel.app/is-safe/${query}`,
            isPartOf: {
              "@type": "WebSite",
              name: "DevTools.run",
              url: "https://devtools-site-delta.vercel.app",
            },
            about: {
              "@type": "Thing",
              name: `${name} (${symbol})`,
              description: description,
            },
          }),
        }}
      />

      {/* JSON-LD BreadcrumbList */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              {
                "@type": "ListItem",
                position: 1,
                name: "Home",
                item: "https://devtools-site-delta.vercel.app",
              },
              {
                "@type": "ListItem",
                position: 2,
                name: "Token Safety Check",
                item: "https://devtools-site-delta.vercel.app/is-safe",
              },
              {
                "@type": "ListItem",
                position: 3,
                name: `Is ${symbol} Safe?`,
                item: `https://devtools-site-delta.vercel.app/is-safe/${query}`,
              },
            ],
          }),
        }}
      />
    </>
  );
}
