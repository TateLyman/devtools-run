import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "TateLyman — Solana Tools, Trading Bots, and Developer Products",
  description: "Solana trading bot, grid bot, DeFi toolkit, trading guide, developer tools. All by TateLyman.",
};

export default function LinksPage() {
  return (
    <div className="min-h-screen bg-gray-950 text-white flex items-center justify-center">
      <div className="w-full max-w-md px-4 py-12">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold mb-1">TateLyman</h1>
          <p className="text-gray-400 text-sm">Solana tools, bots, and developer products</p>
        </div>

        <div className="space-y-3">
          <LinkCard href="https://t.me/solscanitbot" label="Solana Trading Bot (Free)" sub="44+ commands on Telegram" color="blue" external />
          <LinkCard href="/sol-bot-source" label="Bot Source Code — 2 SOL" sub="4,500 lines, 7 revenue streams" color="blue" />
          <LinkCard href="/sol-grid-bot" label="Grid Trading Bot — 0.5 SOL" sub="Python, +11.7% backtested" color="green" />
          <LinkCard href="/sol-defi-toolkit" label="DeFi Toolkit — 0.3 SOL" sub="10 production Node.js scripts" color="cyan" />
          <LinkCard href="/sol-trading-guide" label="Trading Guide — 0.2 SOL" sub="8 chapters, beginner to advanced" color="yellow" />
          <LinkCard href="/prompt-pack" label="AI Prompt Pack — 0.1 SOL" sub="50+ templates for devs and founders" color="purple" />
          <LinkCard href="/" label="Free Developer Tools" sub="22 browser-based tools, no tracking" color="gray" />
          <LinkCard href="https://dev.to/tatelyman" label="Dev.to Articles" sub="25+ technical articles" color="gray" external />
          <LinkCard href="https://github.com/TateLyman" label="GitHub" sub="Open source projects" color="gray" external />
        </div>

        <p className="text-center text-gray-600 text-xs mt-8">
          SOL tips: NaTTUfDDQ8U1RBqb9q5rz6vJ22cWrrT5UAsXuxnb2Wr
        </p>
      </div>
    </div>
  );
}

function LinkCard({ href, label, sub, color, external }: { href: string; label: string; sub: string; color: string; external?: boolean }) {
  const colors: Record<string, string> = {
    blue: "border-blue-700/50 hover:border-blue-500",
    green: "border-green-700/50 hover:border-green-500",
    cyan: "border-cyan-700/50 hover:border-cyan-500",
    yellow: "border-yellow-700/50 hover:border-yellow-500",
    purple: "border-purple-700/50 hover:border-purple-500",
    gray: "border-gray-700/50 hover:border-gray-500",
  };

  const cls = `block w-full rounded-xl border ${colors[color] || colors.gray} bg-gray-900 p-4 transition-colors text-center`;

  if (external) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={cls}>
        <p className="font-semibold">{label}</p>
        <p className="text-gray-400 text-xs mt-1">{sub}</p>
      </a>
    );
  }

  return (
    <Link href={href} className={cls}>
      <p className="font-semibold">{label}</p>
      <p className="text-gray-400 text-xs mt-1">{sub}</p>
    </Link>
  );
}
