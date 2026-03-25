import { Metadata } from "next";

const ROLES: Record<string, { title: string; tools: { name: string; link: string; desc: string }[] }> = {
  "frontend-developers": { title: "Frontend Developers", tools: [
    { name: "CSS Gradient Generator", link: "/gradient", desc: "Create CSS gradients visually" },
    { name: "Box Shadow Generator", link: "/box-shadow", desc: "Design shadows and copy CSS" },
    { name: "Tailwind Colors", link: "/tailwind-colors", desc: "Full Tailwind color palette" },
    { name: "Color Contrast Checker", link: "/contrast", desc: "WCAG accessibility testing" },
    { name: "Meta Tag Generator", link: "/meta-tags", desc: "Open Graph + Twitter Card tags" },
    { name: "Favicon Generator", link: "/favicon", desc: "Create letter-based favicons" },
    { name: "Screen Size Checker", link: "/screen-size", desc: "Viewport + Tailwind breakpoint" },
    { name: "CSS Minifier", link: "/css-minify", desc: "Minify CSS code" },
    { name: "Hex to RGB", link: "/hex-rgb", desc: "Color format converter" },
    { name: "Placeholder Images", link: "/placeholder", desc: "SVG placeholder API" },
  ]},
  "backend-developers": { title: "Backend Developers", tools: [
    { name: "JSON Formatter", link: "/json", desc: "Format and validate JSON" },
    { name: "JWT Decoder", link: "/jwt", desc: "Inspect JWT tokens" },
    { name: "cURL Builder", link: "/curl-builder", desc: "Build cURL commands visually" },
    { name: "Regex Tester", link: "/regex", desc: "Test patterns in real-time" },
    { name: "Base64 Encoder", link: "/base64", desc: "Encode/decode Base64" },
    { name: "Hash Generator", link: "/hash", desc: "MD5, SHA-256 hashes" },
    { name: "UUID Generator", link: "/uuid", desc: "Generate UUID v4" },
    { name: "HTTP Status Codes", link: "/http-status", desc: "Quick reference" },
    { name: "SQL Formatter", link: "/sql", desc: "Format SQL queries" },
    { name: "Epoch Converter", link: "/epoch", desc: "Unix timestamps" },
  ]},
  "crypto-traders": { title: "Crypto Traders", tools: [
    { name: "Trading Bot", link: "/sol-bot", desc: "1-tap buying, copy trading, DCA" },
    { name: "Token Scanner", link: "/is-safe", desc: "Safety score 0-100" },
    { name: "Portfolio Tracker", link: "/portfolio", desc: "Track all holdings" },
    { name: "Whale Tracker", link: "/whale-tracker", desc: "Follow smart money" },
    { name: "Price Tracker", link: "/sol-price", desc: "Live SOL + token prices" },
    { name: "SOL/USD Converter", link: "/sol-usd", desc: "Quick conversion" },
    { name: "Airdrop Checker", link: "/airdrop-checker", desc: "Find unclaimed tokens" },
    { name: "Staking Calculator", link: "/staking-calc", desc: "Estimate staking rewards" },
    { name: "Sniper Service", link: "/sniper", desc: "Auto-buy new launches" },
    { name: "Token Creator", link: "/create-token", desc: "Launch on pump.fun" },
  ]},
  "devops-engineers": { title: "DevOps Engineers", tools: [
    { name: "Uptime Monitor", link: "/uptime", desc: "Check if sites are up" },
    { name: "RPC Status", link: "/rpc-status", desc: "Solana RPC health" },
    { name: "Cron Generator", link: "/cron", desc: "Build cron expressions" },
    { name: "Chmod Calculator", link: "/chmod", desc: "Linux permissions" },
    { name: "IP Lookup", link: "/ip", desc: "Your IP + location" },
    { name: "User Agent", link: "/useragent", desc: "Browser detection" },
    { name: "JSON Validator", link: "/json-validator", desc: "Validate config files" },
    { name: "Password Generator", link: "/password", desc: "Secure passwords" },
    { name: "Base64", link: "/base64", desc: "Encode secrets" },
    { name: "Hash Generator", link: "/hash", desc: "Verify file integrity" },
  ]},
  "freelancers": { title: "Freelancers", tools: [
    { name: "Invoice Generator", link: "/invoice", desc: "Create professional invoices" },
    { name: "Sol Pay Buttons", link: "/sol-pay", desc: "Accept SOL payments" },
    { name: "Link in Bio", link: "/bio", desc: "Free Linktree alternative" },
    { name: "QR Code Generator", link: "/qr", desc: "Payment QR codes" },
    { name: "Word Counter", link: "/word-counter", desc: "Count words for articles" },
    { name: "Markdown Editor", link: "/md-editor", desc: "Write with live preview" },
    { name: "Meta Tags", link: "/meta-tags", desc: "SEO for your portfolio" },
    { name: "Favicon", link: "/favicon", desc: "Brand your site" },
    { name: "SOL/USD", link: "/sol-usd", desc: "Convert crypto invoices" },
    { name: "Password Gen", link: "/password", desc: "Secure client accounts" },
  ]},
};

export function generateStaticParams() { return Object.keys(ROLES).map(slug => ({ slug })); }
export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const r = ROLES[params.slug];
  if (!r) return { title: "Tools" };
  return { title: `Best Free Tools for ${r.title}`, description: `Curated collection of free online tools for ${r.title}. No signup required.` };
}
export default function ToolsForPage({ params }: { params: { slug: string } }) {
  const r = ROLES[params.slug];
  if (!r) return <div>Not found</div>;
  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <div className="max-w-3xl mx-auto px-4 py-16">
        <h1 className="text-3xl font-extrabold mb-2 text-center">Tools for {r.title}</h1>
        <p className="text-gray-400 text-center mb-8">Curated collection of free tools. No signup needed.</p>
        <div className="flex flex-wrap gap-2 justify-center mb-8">
          {Object.entries(ROLES).map(([slug, role]) => (
            <a key={slug} href={`/tools-for/${slug}`} className={`text-xs px-3 py-1 rounded-lg ${slug === params.slug ? "bg-purple-600" : "bg-gray-800 hover:bg-gray-700"}`}>{role.title}</a>
          ))}
        </div>
        <div className="space-y-3">
          {r.tools.map((t, i) => (
            <a key={i} href={t.link} className="flex items-center justify-between bg-gray-900 rounded-xl p-4 hover:bg-gray-800 transition-colors">
              <div>
                <div className="font-bold">{t.name}</div>
                <div className="text-xs text-gray-400">{t.desc}</div>
              </div>
              <span className="text-purple-400 text-sm">Open &rarr;</span>
            </a>
          ))}
        </div>
        <div className="mt-8 text-center text-gray-500 text-sm">
          <a href="/store" className="text-purple-400 hover:underline">Digital Store</a>{" | "}
          <a href="/resources" className="text-purple-400 hover:underline">Resources</a>{" | "}
          <a href="/" className="text-purple-400 hover:underline">All 700+ Tools</a>
        </div>
      </div>
    </div>
  );
}
