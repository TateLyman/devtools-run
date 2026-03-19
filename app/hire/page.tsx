import Link from "next/link";

const TELEGRAM = "@Krbva";
const EMAIL = "lymantate2@gmail.com";
const GITHUB = "https://github.com/TateLyman";

const caseStudies = [
  {
    tag: "MCP + BLOCKCHAIN",
    tagColor: "bg-emerald-900/50 text-emerald-300 border border-emerald-700/50",
    title: "MCP Solana Server — 8 Blockchain Tools for AI Agents",
    problem:
      "AI agents need to interact with Solana — checking balances, parsing transactions, resolving domains — but no MCP servers existed for blockchain operations.",
    approach: [
      "Built MCP server exposing 8 Solana tools to any AI client (Claude, GPT, etc.)",
      "Token balance lookups, transaction parsing, .sol domain resolution, network status",
      "Helius DAS API integration for rich token metadata",
      "TypeScript + @modelcontextprotocol/sdk + @solana/web3.js + Zod validation",
    ],
    results: [
      "First public MCP server for Solana blockchain operations",
      "8 tools callable by any MCP-compatible AI assistant",
      "Sub-200ms response time for balance checks and token lookups",
      "Open source — ready to install and use immediately",
    ],
    tech: ["TypeScript", "MCP SDK", "Solana Web3.js", "Helius RPC", "Zod"],
    demoUrl: null,
    githubUrl: "https://github.com/TateLyman/mcp-solana-server",
    color: "border-emerald-800/50",
  },
  {
    tag: "PRODUCTION TRADING BOT",
    tagColor: "bg-blue-900/50 text-blue-300 border border-blue-700/50",
    title: "Solana Trading Bot — 5,400+ Lines, 44 Commands, 7 Revenue Streams",
    problem:
      "Crypto traders needed a single Telegram interface to scan tokens, execute swaps, track positions, set alerts, and manage wallets — without trusting a centralized platform.",
    approach: [
      "Built complete trading infrastructure in pure Node.js — no frameworks, no bloat",
      "Integrated Jupiter V6 for optimal swap routing with platform fee capture",
      "Added Jito MEV-protected bundles for frontrun-resistant transactions",
      "Built 12 background workers: price monitors, whale alerts, DCA engine, order execution",
    ],
    results: [
      "5,477 lines of production code running 24/7",
      "44 commands covering scan, swap, alerts, positions, premium, promotions",
      "7 built-in revenue streams: swap fees, premium subs, Telegram Stars, ads, referrals",
      "Handles real SOL transactions on Solana mainnet",
    ],
    tech: ["Node.js", "Solana Web3.js", "Jupiter V6", "Jito Bundles", "Telegram Bot API", "Helius RPC"],
    demoUrl: "https://t.me/solscanitbot",
    githubUrl: null,
    color: "border-blue-800/50",
  },
  {
    tag: "DEFI PROTOCOL",
    tagColor: "bg-purple-900/50 text-purple-300 border border-purple-700/50",
    title: "Delta-Neutral Vault Strategy on Drift Protocol",
    problem:
      "DeFi vaults earning single-digit APY needed smarter strategy — multi-market rotation across SOL, BTC, and ETH perpetuals to capture the best funding rates.",
    approach: [
      "Built adaptive strategy engine scanning 3 perp markets for optimal basis trades",
      "Implemented EMA-based funding rate trend analysis (6h/24h crossover signals)",
      "Added JitoSOL yield stacking — using liquid staking token as spot leg for +7.5% APY bonus",
      "Created comprehensive backtesting framework with side-by-side strategy comparison",
    ],
    results: [
      "24% projected APY vs 18.5% single-market baseline (+30% improvement)",
      "$6,845 additional yield per $100K deployed annually",
      "Automatic rotation when advantage exceeds 3% threshold",
      "Built for Ranger Build-A-Bear Hackathon ($200K prize pool)",
    ],
    tech: ["TypeScript", "Drift SDK", "Drift Vaults SDK", "Anchor", "JitoSOL", "Vitest"],
    demoUrl: null,
    githubUrl: null,
    color: "border-purple-800/50",
  },
  {
    tag: "AI + DATA",
    tagColor: "bg-amber-900/50 text-amber-300 border border-amber-700/50",
    title: "Real-Time Prediction Market Arbitrage Scanner",
    problem:
      "Polymarket has pricing glitches where correlated markets don't add up — creating guaranteed-profit arbitrage opportunities invisible to manual traders.",
    approach: [
      "Built scanner fetching 2,000+ active markets via Gamma API (free, no auth)",
      "Implemented 4 arbitrage detection algorithms: event, complement, temporal, cross-market",
      "Added negRisk group analysis for mutually exclusive outcome mispricing",
      "Fuzzy date matching for temporal arbitrage across different timeframe markets",
    ],
    results: [
      "104 arbitrage opportunities detected in first scan",
      "Identifies markets with 25-40% guaranteed profit margins",
      "Scans 2,000 markets in under 5 seconds",
      "Zero dependencies — pure Node.js, native https module",
    ],
    tech: ["Node.js", "Polymarket Gamma API", "Real-time data", "Statistical analysis"],
    demoUrl: null,
    githubUrl: null,
    color: "border-amber-800/50",
  },
];

const services = [
  {
    title: "MCP Server Development",
    subtitle: "Connect AI agents to your APIs, databases, or blockchain",
    price: "$1,500 - $5,000",
    bullets: [
      "Custom MCP servers for Claude, ChatGPT, or any MCP-compatible client",
      "Tool definitions, resource management, authentication handling",
      "Solana/EVM blockchain MCP integrations",
      "Full source code, documentation, and deployment guide",
    ],
  },
  {
    title: "Trading Bot Development",
    subtitle: "Telegram, Discord, or standalone — any chain, any strategy",
    price: "$2,000 - $10,000",
    bullets: [
      "Sniping, copy trading, grid trading, DCA, arbitrage bots",
      "Jupiter, Raydium, Pump.fun, Uniswap integration",
      "Jito MEV protection, priority fee optimization",
      "Full source code, deployment docs, 30-day support",
    ],
  },
  {
    title: "AI Automation & Agentic Workflows",
    subtitle: "Systems that plan, decide, and act across multiple steps",
    price: "$1,000 - $8,000",
    bullets: [
      "Agentic AI systems with multi-step planning and execution",
      "RAG pipelines with your company's data",
      "Automated workflows connecting AI to CRMs, Slack, email, databases",
      "Custom LLM integrations with prompt engineering and token optimization",
    ],
  },
  {
    title: "DeFi & Smart Contract Development",
    subtitle: "Vaults, staking, lending — production-grade Solana protocols",
    price: "$5,000 - $25,000",
    bullets: [
      "Anchor smart contracts with comprehensive testing",
      "Vault strategies, staking mechanisms, swap protocols",
      "Drift Protocol, Jupiter, Meteora integrations",
      "Security-first development with audit documentation",
    ],
  },
  {
    title: "Full-Stack Web Applications",
    subtitle: "Next.js, React, Node.js — shipped and deployed",
    price: "$3,000 - $20,000",
    bullets: [
      "Next.js / React frontends with Tailwind CSS",
      "Node.js / Python backends with REST or GraphQL APIs",
      "Solana wallet integration and payment verification",
      "Vercel/AWS deployment with CI/CD",
    ],
  },
];

const techStack = [
  { category: "Languages", items: ["TypeScript", "JavaScript", "Rust", "Python"] },
  { category: "Blockchain", items: ["Solana Web3.js", "Anchor", "Jupiter V6", "Drift SDK", "Jito", "Helius", "SPL Tokens"] },
  { category: "AI / MCP", items: ["Model Context Protocol", "Claude API", "LLM Integration", "RAG Pipelines", "Agentic AI"] },
  { category: "Frontend", items: ["Next.js", "React", "Tailwind CSS", "Vercel"] },
  { category: "Backend", items: ["Node.js", "Express", "PostgreSQL", "Redis", "WebSockets"] },
  { category: "APIs", items: ["Telegram Bot API", "Jupiter Aggregator", "Polymarket Gamma", "Helius DAS"] },
];

export default function HirePage() {
  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <div className="max-w-5xl mx-auto px-4 py-12">
        {/* Hero — client-focused */}
        <div className="text-center mb-20">
          <div className="inline-block bg-emerald-900/30 text-emerald-400 text-sm font-medium px-4 py-1.5 rounded-full mb-6 border border-emerald-800/50">
            Available for freelance projects
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
            Your Trading Bot in 72 Hours.<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-blue-400 to-purple-400">
              Your MCP Server in 48.
            </span>
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-8">
            Production code on Solana mainnet. Not tutorials — real systems handling real transactions.
            MCP servers, trading bots, DeFi protocols, and AI automation.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href={`https://t.me/${TELEGRAM.replace("@", "")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-blue-600 hover:bg-blue-500 text-white font-semibold py-3 px-8 rounded-lg transition-colors"
            >
              Message on Telegram
            </a>
            <a
              href={`mailto:${EMAIL}`}
              className="bg-gray-800 hover:bg-gray-700 text-white font-semibold py-3 px-8 rounded-lg transition-colors border border-gray-700"
            >
              Send Email
            </a>
          </div>
        </div>

        {/* Stats bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-20">
          {[
            { number: "5,400+", label: "Lines of production code" },
            { number: "44", label: "Bot commands shipped" },
            { number: "45+", label: "Technical articles published" },
            { number: "8", label: "MCP tools built" },
          ].map((s, i) => (
            <div key={i} className="bg-gray-900 rounded-xl p-5 text-center border border-gray-800">
              <div className="text-2xl md:text-3xl font-bold text-white mb-1">{s.number}</div>
              <div className="text-gray-500 text-sm">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Social proof */}
        <div className="flex flex-wrap justify-center gap-6 mb-20 text-sm text-gray-500">
          <a href="https://dev.to/tatelyman" target="_blank" rel="noopener noreferrer" className="hover:text-gray-300 transition-colors">
            45+ articles on Dev.to
          </a>
          <span className="text-gray-700">|</span>
          <a href={GITHUB} target="_blank" rel="noopener noreferrer" className="hover:text-gray-300 transition-colors">
            Open source on GitHub
          </a>
          <span className="text-gray-700">|</span>
          <a href="https://devtools-site-delta.vercel.app" target="_blank" rel="noopener noreferrer" className="hover:text-gray-300 transition-colors">
            Live DevTools site
          </a>
          <span className="text-gray-700">|</span>
          <a href="https://t.me/solscanitbot" target="_blank" rel="noopener noreferrer" className="hover:text-gray-300 transition-colors">
            Live Telegram bot
          </a>
        </div>

        {/* Portfolio / Case Studies */}
        <div id="portfolio" className="mb-20">
          <h2 className="text-3xl font-bold mb-2 text-center">Portfolio</h2>
          <p className="text-gray-500 text-center mb-10">Production systems. Real results. Verified on-chain.</p>

          <div className="space-y-8">
            {caseStudies.map((cs, i) => (
              <div key={i} className={`bg-gray-900 rounded-xl border ${cs.color} overflow-hidden`}>
                <div className="p-6 md:p-8">
                  <div className="flex flex-wrap items-center gap-3 mb-4">
                    <span className={`text-xs font-bold px-3 py-1 rounded-full ${cs.tagColor}`}>
                      {cs.tag}
                    </span>
                    {cs.demoUrl && (
                      <a
                        href={cs.demoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-blue-400 hover:text-blue-300 underline"
                      >
                        Live Demo &rarr;
                      </a>
                    )}
                    {cs.githubUrl && (
                      <a
                        href={cs.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-gray-400 hover:text-gray-300 underline"
                      >
                        Source Code &rarr;
                      </a>
                    )}
                  </div>

                  <h3 className="text-xl md:text-2xl font-bold mb-4">{cs.title}</h3>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2">Problem</h4>
                      <p className="text-gray-300 text-sm mb-4">{cs.problem}</p>

                      <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2">Approach</h4>
                      <ul className="space-y-1.5">
                        {cs.approach.map((a, j) => (
                          <li key={j} className="text-gray-400 text-sm flex items-start gap-2">
                            <span className="text-gray-600 mt-0.5 flex-shrink-0">&bull;</span>
                            {a}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2">Results</h4>
                      <ul className="space-y-2 mb-4">
                        {cs.results.map((r, j) => (
                          <li key={j} className="text-sm flex items-start gap-2">
                            <span className="text-emerald-400 mt-0.5 flex-shrink-0">&#10003;</span>
                            <span className="text-gray-200">{r}</span>
                          </li>
                        ))}
                      </ul>

                      <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2">Tech Stack</h4>
                      <div className="flex flex-wrap gap-1.5">
                        {cs.tech.map((t, j) => (
                          <span key={j} className="text-xs bg-gray-800 text-gray-400 px-2 py-0.5 rounded border border-gray-700">
                            {t}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Services */}
        <div className="mb-20">
          <h2 className="text-3xl font-bold mb-2 text-center">Services</h2>
          <p className="text-gray-500 text-center mb-10">Clear scope. Fixed pricing. Production-quality delivery.</p>

          <div className="space-y-6">
            {services.map((svc, i) => (
              <div key={i} className="bg-gray-900 rounded-xl border border-gray-800 p-6 md:p-8">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-1">
                  <h3 className="text-xl font-bold">{svc.title}</h3>
                  <span className="text-emerald-400 font-semibold whitespace-nowrap text-sm bg-emerald-900/20 px-3 py-1 rounded-full border border-emerald-800/50">
                    {svc.price}
                  </span>
                </div>
                <p className="text-gray-500 text-sm mb-4">{svc.subtitle}</p>
                <ul className="grid md:grid-cols-2 gap-1.5">
                  {svc.bullets.map((b, j) => (
                    <li key={j} className="text-gray-400 text-sm flex items-start gap-2">
                      <span className="text-gray-600 mt-0.5 flex-shrink-0">&#10003;</span>
                      {b}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Tech Stack */}
        <div className="mb-20">
          <h2 className="text-3xl font-bold mb-8 text-center">Tech Stack</h2>
          <div className="grid md:grid-cols-3 gap-4">
            {techStack.map((cat, i) => (
              <div key={i} className="bg-gray-900 rounded-xl border border-gray-800 p-5">
                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">{cat.category}</h3>
                <div className="flex flex-wrap gap-1.5">
                  {cat.items.map((item, j) => (
                    <span key={j} className="text-xs bg-gray-800 text-gray-300 px-2.5 py-1 rounded border border-gray-700">
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="bg-gradient-to-br from-gray-900 to-gray-900 rounded-2xl border border-gray-800 p-8 md:p-12 text-center">
          <h2 className="text-3xl font-bold mb-4">Let&apos;s Build Something</h2>
          <p className="text-gray-400 mb-8 max-w-lg mx-auto">
            Fast turnaround. Clean code. Clear communication. 30-day support on every project.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href={`https://t.me/${TELEGRAM.replace("@", "")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-blue-600 hover:bg-blue-500 text-white font-semibold py-3 px-8 rounded-lg transition-colors"
            >
              Telegram: {TELEGRAM}
            </a>
            <a
              href={`mailto:${EMAIL}`}
              className="bg-gray-800 hover:bg-gray-700 text-white font-semibold py-3 px-8 rounded-lg transition-colors border border-gray-700"
            >
              {EMAIL}
            </a>
          </div>
          <div className="flex flex-wrap justify-center gap-4 mt-6 text-sm text-gray-600">
            <a href={GITHUB} target="_blank" rel="noopener noreferrer" className="hover:text-gray-400 transition-colors">
              GitHub
            </a>
            <span>|</span>
            <a href="https://dev.to/tatelyman" target="_blank" rel="noopener noreferrer" className="hover:text-gray-400 transition-colors">
              Dev.to
            </a>
            <span>|</span>
            <span>Also on Upwork, Fiverr, and Contra</span>
          </div>
        </div>

        {/* Footer link */}
        <div className="text-center mt-8">
          <Link href="/" className="text-gray-600 hover:text-gray-400 text-sm">
            &larr; Back to DevTools
          </Link>
        </div>
      </div>
    </div>
  );
}
