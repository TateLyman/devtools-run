"use client";

import { useState } from "react";
import Link from "next/link";

const WALLET = "NaTTUfDDQ8U1RBqb9q5rz6vJ22cWrrT5UAsXuxnb2Wr";
const TELEGRAM = "@Krbva";

const stats = [
  { value: "22+", label: "Developer Tools", color: "text-amber-400" },
  { value: "44", label: "Bot Commands", color: "text-orange-400" },
  { value: "50+", label: "Published Articles", color: "text-amber-400" },
  { value: "6+", label: "Platforms", color: "text-orange-400" },
];

const websiteTiers = [
  {
    name: "Starter",
    price: "$50/mo",
    sol: "0.3 SOL/mo",
    features: [
      "Footer link on all pages",
      "Listed on sponsors page",
      "1 month minimum",
    ],
  },
  {
    name: "Standard",
    price: "$100/mo",
    sol: "0.5 SOL/mo",
    highlight: true,
    features: [
      "Sidebar placement on all tool pages",
      "Footer link on all pages",
      "Listed on sponsors page with logo",
      "Link in site navigation",
    ],
  },
  {
    name: "Premium",
    price: "$200/mo",
    sol: "1 SOL/mo",
    features: [
      "Banner ad on homepage — seen by every visitor",
      "Sidebar placement on all tool pages",
      "Footer link on all pages",
      "Priority sponsor listing with logo + description",
      "Link in site navigation",
    ],
  },
];

const botTiers = [
  {
    name: "Basic",
    price: "$100/mo",
    sol: "0.5 SOL/mo",
    features: [
      "Your project mentioned in the daily trending digest",
      "Sent to all active bot users automatically",
      "1 month minimum",
    ],
  },
  {
    name: "Pro",
    price: "$250/mo",
    sol: "1.5 SOL/mo",
    highlight: true,
    features: [
      "Pinned message in /trending command output",
      "Daily digest mentions with your token/project",
      "Your logo + link shown to every user who checks trending",
      "Priority placement above organic results",
    ],
  },
  {
    name: "Enterprise",
    price: "$500/mo",
    sol: "3 SOL/mo",
    features: [
      "Custom /sponsor command dedicated to your project",
      "Pinned message in /trending",
      "Daily digest mentions",
      "Bot welcome message includes your project",
      "Custom inline keyboard button linking to your project",
    ],
  },
];

const contentTiers = [
  {
    name: "Single Post",
    price: "$25",
    sol: "0.2 SOL",
    features: [
      "Sponsored article on Dev.to OR Hashnode",
      "Naturally written, SEO-optimized",
      "Permanent backlink to your project",
    ],
  },
  {
    name: "Full Package",
    price: "$50",
    sol: "0.3 SOL",
    highlight: true,
    features: [
      "Sponsored article on both Dev.to + Hashnode",
      "Social media mentions on Bluesky + Mastodon",
      "Reddit post in relevant subreddits",
      "Cross-linked across all platforms",
    ],
  },
  {
    name: "Campaign",
    price: "$100",
    sol: "0.5 SOL",
    features: [
      "3 sponsored articles across Dev.to + Hashnode",
      "Social media mentions on all platforms",
      "Reddit posts in multiple subreddits",
      "Ongoing mentions in future content for 30 days",
      "Analytics report on reach + engagement",
    ],
  },
];

function TierCard({
  tier,
}: {
  tier: {
    name: string;
    price: string;
    sol: string;
    highlight?: boolean;
    features: string[];
  };
}) {
  return (
    <div
      className={`bg-gray-900 rounded-xl p-6 border ${
        tier.highlight
          ? "border-amber-600/60 ring-1 ring-amber-500/20"
          : "border-gray-800"
      } flex flex-col`}
    >
      {tier.highlight && (
        <span className="bg-amber-600 text-white text-xs font-bold uppercase tracking-wide px-3 py-1 rounded-full w-fit mb-4">
          Most Popular
        </span>
      )}
      <h3 className="text-xl font-bold mb-1">{tier.name}</h3>
      <p className="text-2xl font-bold text-amber-400 mb-1">{tier.price}</p>
      <p className="text-amber-600 text-sm mb-5">{tier.sol}</p>
      <ul className="space-y-2 flex-1">
        {tier.features.map((f, i) => (
          <li key={i} className="text-gray-400 text-sm flex items-start gap-2">
            <span className="text-amber-500 mt-0.5 flex-shrink-0">&#10003;</span>
            {f}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function AdvertisePage() {
  const [copied, setCopied] = useState(false);

  function copyWallet() {
    navigator.clipboard.writeText(WALLET);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <div className="max-w-5xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-16">
          <p className="text-amber-500 font-semibold uppercase tracking-wide text-sm mb-3">
            Sponsorship &amp; Advertising
          </p>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Get Your Project in Front of{" "}
            <span className="text-amber-400">Solana Developers</span>
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-3">
            Reach builders, traders, and crypto-native developers across our
            tools site, Telegram bot, and content network.
          </p>
          <p className="text-gray-500">
            Pay in SOL or USD. Flexible terms. Real audience, not bots.
          </p>
        </div>

        {/* Stats */}
        <div className="bg-gray-900 rounded-xl p-8 mb-16 border border-gray-800">
          <h2 className="text-xl font-bold text-center mb-6 text-gray-300">
            Your Ad Reaches
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {stats.map((s, i) => (
              <div key={i}>
                <p className={`text-3xl font-bold ${s.color}`}>{s.value}</p>
                <p className="text-gray-400 text-sm">{s.label}</p>
              </div>
            ))}
          </div>
          <p className="text-gray-500 text-sm text-center mt-6">
            22 developer tools on{" "}
            <Link href="/" className="text-amber-400 hover:underline">
              devtools.run
            </Link>{" "}
            &middot; 44-command Telegram bot{" "}
            <a
              href="https://t.me/solscanitbot"
              target="_blank"
              rel="noopener noreferrer"
              className="text-amber-400 hover:underline"
            >
              @solscanitbot
            </a>{" "}
            &middot; 50+ articles on Dev.to + Hashnode &middot; Bluesky, Mastodon, Reddit
          </p>
        </div>

        {/* Website Sponsorship */}
        <div className="mb-16">
          <div className="flex items-center gap-3 mb-2">
            <svg
              className="w-7 h-7 text-amber-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 21a9.004 9.004 0 0 0 8.716-6.747M12 21a9.004 9.004 0 0 1-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 0 1 7.843 4.582M12 3a8.997 8.997 0 0 0-7.843 4.582m15.686 0A11.953 11.953 0 0 1 12 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0 1 21 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0 1 12 16.5a17.92 17.92 0 0 1-8.716-2.247m0 0A8.966 8.966 0 0 1 3 12c0-1.264.26-2.467.732-3.558"
              />
            </svg>
            <h2 className="text-2xl md:text-3xl font-bold">
              Website Sponsorship
            </h2>
          </div>
          <p className="text-gray-400 mb-6 ml-10">
            Banner ads, sidebar placements, and footer links across 22+ tool pages on devtools.run.
          </p>
          <div className="grid md:grid-cols-3 gap-4">
            {websiteTiers.map((tier, i) => (
              <TierCard key={i} tier={tier} />
            ))}
          </div>
        </div>

        {/* Bot Sponsorship */}
        <div className="mb-16">
          <div className="flex items-center gap-3 mb-2">
            <svg
              className="w-7 h-7 text-orange-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M8.625 12a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H8.25m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H12m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 0 1-2.555-.337A5.972 5.972 0 0 1 5.41 20.97a5.969 5.969 0 0 1-.474-.065 4.48 4.48 0 0 0 .978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25Z"
              />
            </svg>
            <h2 className="text-2xl md:text-3xl font-bold">
              Bot Sponsorship
            </h2>
          </div>
          <p className="text-gray-400 mb-6 ml-10">
            Get your token or project directly in front of active Solana traders using{" "}
            <a
              href="https://t.me/solscanitbot"
              target="_blank"
              rel="noopener noreferrer"
              className="text-orange-400 hover:underline"
            >
              @solscanitbot
            </a>
            . 44 commands, 12 background workers, real daily active users.
          </p>
          <div className="grid md:grid-cols-3 gap-4">
            {botTiers.map((tier, i) => (
              <TierCard key={i} tier={tier} />
            ))}
          </div>
        </div>

        {/* Content Sponsorship */}
        <div className="mb-16">
          <div className="flex items-center gap-3 mb-2">
            <svg
              className="w-7 h-7 text-amber-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 7.5h1.5m-1.5 3h1.5m-7.5 3h7.5m-7.5 3h7.5m3-9h3.375c.621 0 1.125.504 1.125 1.125V18a2.25 2.25 0 0 1-2.25 2.25M16.5 7.5V18a2.25 2.25 0 0 0 2.25 2.25M16.5 7.5V4.875c0-.621-.504-1.125-1.125-1.125H4.125C3.504 3.75 3 4.254 3 4.875V18a2.25 2.25 0 0 0 2.25 2.25h13.5M6 7.5h3v3H6v-3Z"
              />
            </svg>
            <h2 className="text-2xl md:text-3xl font-bold">
              Content Sponsorship
            </h2>
          </div>
          <p className="text-gray-400 mb-6 ml-10">
            Sponsored articles, social posts, and Reddit coverage across our content network.
            30+ articles on Dev.to, 12+ on Hashnode, plus Bluesky, Mastodon, and Reddit.
          </p>
          <div className="grid md:grid-cols-3 gap-4">
            {contentTiers.map((tier, i) => (
              <TierCard key={i} tier={tier} />
            ))}
          </div>
        </div>

        {/* Why Advertise With Us */}
        <div className="bg-gray-900 rounded-xl p-8 mb-16 border border-gray-800">
          <h2 className="text-2xl font-bold mb-6 text-center">
            Why Advertise Here
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="flex gap-3">
              <div className="w-10 h-10 bg-amber-900/40 rounded-lg flex items-center justify-center flex-shrink-0">
                <svg
                  className="w-5 h-5 text-amber-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={1.5}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z"
                  />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold mb-1">Targeted Audience</h3>
                <p className="text-gray-400 text-sm">
                  Our visitors are Solana developers, DeFi traders, and crypto builders.
                  Not random traffic -- people who actually use and build on Solana.
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="w-10 h-10 bg-amber-900/40 rounded-lg flex items-center justify-center flex-shrink-0">
                <svg
                  className="w-5 h-5 text-amber-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={1.5}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3.75 3v11.25A2.25 2.25 0 0 0 6 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0 1 18 16.5h-2.25m-7.5 0h7.5m-7.5 0-1 3m8.5-3 1 3m0 0 .5 1.5m-.5-1.5h-9.5m0 0-.5 1.5m.75-9 3-3 2.148 2.148A12.061 12.061 0 0 1 16.5 7.605"
                  />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold mb-1">Multi-Platform Reach</h3>
                <p className="text-gray-400 text-sm">
                  Your brand appears across our website, Telegram bot, Dev.to, Hashnode,
                  Bluesky, Mastodon, and Reddit simultaneously.
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="w-10 h-10 bg-amber-900/40 rounded-lg flex items-center justify-center flex-shrink-0">
                <svg
                  className="w-5 h-5 text-amber-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={1.5}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M2.25 18.75a60.07 60.07 0 0 1 15.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 0 1 3 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 0 0-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 0 1-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 0 0 3 15h-.75M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm3 0h.008v.008H18V10.5Zm-12 0h.008v.008H6V10.5Z"
                  />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold mb-1">Affordable & Flexible</h3>
                <p className="text-gray-400 text-sm">
                  Starting at $25 for content sponsorship. Pay in SOL or USD.
                  No contracts beyond the minimum term. Cancel anytime.
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="w-10 h-10 bg-amber-900/40 rounded-lg flex items-center justify-center flex-shrink-0">
                <svg
                  className="w-5 h-5 text-amber-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={1.5}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z"
                  />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold mb-1">Authentic Integration</h3>
                <p className="text-gray-400 text-sm">
                  No generic banner farms. Your sponsorship is woven into real content
                  and real tools that developers actually use daily.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Contact / CTA */}
        <div className="bg-gradient-to-br from-amber-900/30 to-orange-900/30 rounded-xl p-8 mb-12 border border-amber-800/30">
          <h2 className="text-2xl font-bold mb-2 text-center">
            Ready to Sponsor?
          </h2>
          <p className="text-gray-400 text-center mb-6">
            Message me with your project details and which tier interests you.
            Custom packages available for larger campaigns.
          </p>
          <div className="flex flex-col items-center gap-4">
            <a
              href={`https://t.me/${TELEGRAM.replace("@", "")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-amber-600 hover:bg-amber-700 text-white font-bold py-3 px-8 rounded-lg text-lg transition-colors"
            >
              <svg
                className="w-5 h-5"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.479.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
              </svg>
              Message {TELEGRAM} on Telegram
            </a>
            <p className="text-gray-400 text-sm text-center">
              Include your project name, preferred tier, and any questions.
              I respond within 24 hours.
            </p>

            <div className="w-full max-w-lg mt-4">
              <p className="text-gray-500 text-xs uppercase tracking-wide text-center mb-2">
                SOL Payment Address
              </p>
              <div
                onClick={copyWallet}
                className="bg-gray-800 rounded-lg p-3 font-mono text-sm text-center break-all select-all border border-gray-700 cursor-pointer hover:border-amber-600/50 transition-colors"
              >
                {WALLET}
              </div>
              <p className="text-gray-600 text-xs text-center mt-1">
                {copied ? "Copied!" : "Click to copy"}
              </p>
            </div>
          </div>
        </div>

        {/* FAQ */}
        <div className="bg-gray-900 rounded-xl p-8 mb-12 border border-gray-800">
          <h2 className="text-2xl font-bold mb-6 text-center">
            Common Questions
          </h2>
          <div className="space-y-5 max-w-3xl mx-auto">
            <div>
              <h3 className="font-semibold text-amber-400 mb-1">
                Can I combine tiers across categories?
              </h3>
              <p className="text-gray-400 text-sm">
                Absolutely. Most sponsors grab a website tier + content package together.
                Message me for a bundled rate.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-amber-400 mb-1">
                What kind of projects do you accept?
              </h3>
              <p className="text-gray-400 text-sm">
                Solana projects, developer tools, DeFi protocols, trading platforms, and
                crypto infrastructure. No outright scams or rug pulls -- I vet every sponsor
                since my reputation is on the line too.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-amber-400 mb-1">
                How fast can my sponsorship go live?
              </h3>
              <p className="text-gray-400 text-sm">
                Website and bot placements: within 24 hours of payment. Content
                sponsorships: articles published within 48 hours.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-amber-400 mb-1">
                Do you offer custom packages?
              </h3>
              <p className="text-gray-400 text-sm">
                Yes. If you want something specific -- like a dedicated tool page, custom bot
                integration, or a longer campaign -- just ask. Happy to scope it out.
              </p>
            </div>
          </div>
        </div>

        {/* Cross-links */}
        <div className="text-center">
          <p className="text-gray-500 text-sm">
            <Link href="/" className="text-amber-400 hover:underline">
              devtools.run
            </Link>
            {" "}&middot;{" "}
            <a
              href="https://t.me/solscanitbot"
              target="_blank"
              rel="noopener noreferrer"
              className="text-amber-400 hover:underline"
            >
              @solscanitbot
            </a>
            {" "}&middot;{" "}
            <Link href="/services" className="text-amber-400 hover:underline">
              Development Services
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
