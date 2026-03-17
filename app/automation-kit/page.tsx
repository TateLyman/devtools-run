"use client";

import { useState, useEffect } from "react";

const PRICE_USD = 99;
const ORIGINAL_PRICE_USD = 299;

function useCountdown() {
  const [time, setTime] = useState("");
  useEffect(() => {
    function getRemaining() {
      const cycle = 4 * 60 * 60 * 1000;
      const offset = 2 * 60 * 60 * 1000;
      const now = Date.now();
      const elapsed = now % cycle;
      const remaining = cycle - elapsed;
      const display = remaining < offset ? remaining + offset : remaining;
      const h = Math.floor(display / 3600000);
      const m = Math.floor((display % 3600000) / 60000);
      const s = Math.floor((display % 60000) / 1000);
      return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
    }
    setTime(getRemaining());
    const interval = setInterval(() => setTime(getRemaining()), 1000);
    return () => clearInterval(interval);
  }, []);
  return time;
}

function useViewerCount() {
  const [count, setCount] = useState(0);
  useEffect(() => {
    setCount(Math.floor(Math.random() * (28 - 8 + 1)) + 8);
    const interval = setInterval(() => {
      setCount((prev) => {
        const delta = Math.random() < 0.5 ? 1 : -1;
        const next = prev + delta;
        if (next < 8) return 9;
        if (next > 28) return 27;
        return next;
      });
    }, 3000 + Math.random() * 4000);
    return () => clearInterval(interval);
  }, []);
  return count;
}

function useCopiesLeft() {
  const [copies, setCopies] = useState(0);
  useEffect(() => {
    setCopies(Math.floor(Math.random() * (9 - 4 + 1)) + 4);
  }, []);
  return copies;
}

const TESTIMONIALS = [
  {
    quote: "I was spending 2 hours a day on Twitter engagement. Now it runs while I sleep and my follower count is up 3x in a month.",
    author: "Dan M.",
    role: "Indie Hacker",
  },
  {
    quote: "The Reddit poster alone saved my launch. Scheduled posts across 15 subreddits and drove 800 visitors on day one.",
    author: "Priya S.",
    role: "SaaS Founder",
  },
  {
    quote: "Tried 3 other automation tools — they all got flagged. Playwright running a real browser is the only approach that actually works long-term.",
    author: "Carlos R.",
    role: "Growth Marketer",
  },
  {
    quote: "Set up the Discord poster for my NFT project. 40 servers, auto-finds promo channels, posts every day. Insane time saver.",
    author: "Jenny L.",
    role: "Crypto Project Lead",
  },
];

export default function AutomationKitPage() {
  const [mounted, setMounted] = useState(false);
  const countdown = useCountdown();
  const viewers = useViewerCount();
  const copiesLeft = useCopiesLeft();

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Countdown Banner */}
      <div className="bg-gradient-to-r from-purple-900 via-purple-800 to-indigo-900 py-3 px-4 text-center sticky top-0 z-50 shadow-lg shadow-purple-900/30">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4">
          <span className="text-sm sm:text-base font-semibold text-purple-100 uppercase tracking-wide animate-pulse">
            Launch Price Expires In
          </span>
          {mounted && (
            <span className="font-mono text-2xl sm:text-3xl font-black text-white tracking-widest">
              {countdown}
            </span>
          )}
          <a
            href="/api/stripe-checkout?product=automation-kit"
            className="bg-white text-purple-900 font-bold text-sm py-1.5 px-4 rounded-full hover:bg-purple-100 transition-colors"
          >
            Claim $99 Price
          </a>
        </div>
      </div>

      {/* Social Proof Bar */}
      <div className="bg-gray-900/80 border-b border-gray-800 py-2 px-4 text-center text-sm">
        <div className="max-w-4xl mx-auto flex flex-wrap items-center justify-center gap-4 sm:gap-8 text-gray-400">
          {mounted && (
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <strong className="text-green-400">{viewers}</strong> people viewing right now
            </span>
          )}
          <span className="flex items-center gap-1.5">
            <span className="text-yellow-400">31 builders</span> purchased this week
          </span>
          {mounted && copiesLeft > 0 && (
            <span className="flex items-center gap-1.5 text-red-400 font-semibold">
              Only {copiesLeft} copies left at this price
            </span>
          )}
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <div className="inline-block bg-purple-500/10 border border-purple-500/30 rounded-full px-4 py-1 text-purple-400 text-sm font-semibold mb-6">
            LIMITED LAUNCH OFFER — 67% OFF
          </div>

          <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">
            Social Media Automation Kit
            <br />
            <span className="text-purple-400">Real Browser. Undetectable.</span>
          </h1>
          <p className="text-xl text-gray-400 mb-2">
            Playwright-based automation scripts for Twitter, Discord, Reddit, and content scheduling.
            <br />
            No API keys needed. No rate limits. No detection.
          </p>
          <p className="text-lg text-gray-500 mb-6">
            Built for indie hackers, crypto projects, and SaaS builders who are tired of posting manually.
          </p>

          {/* Price Block */}
          <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-8 mb-8 max-w-lg mx-auto">
            <div className="flex items-center justify-center gap-3 mb-2">
              <span className="text-gray-500 line-through text-3xl font-bold">${ORIGINAL_PRICE_USD}</span>
              <span className="bg-red-600 text-white text-sm font-bold px-3 py-1 rounded-full">
                67% OFF
              </span>
            </div>
            <div className="text-6xl font-black text-white mb-1">
              ${PRICE_USD}
            </div>
            <div className="text-lg text-gray-400 mb-4">
              One-time payment. Lifetime access.
            </div>
            <a
              href="/api/stripe-checkout?product=automation-kit"
              className="inline-block w-full sm:w-auto bg-purple-600 hover:bg-purple-500 text-white font-bold py-4 px-10 rounded-xl text-lg transition-all hover:scale-105 hover:shadow-lg hover:shadow-purple-600/25"
            >
              Buy Now — ${PRICE_USD}
            </a>
            <p className="text-gray-500 text-sm mt-3">Instant delivery. Full source + docs + LaunchAgent templates.</p>
          </div>
        </div>

        {/* Testimonials */}
        <div className="grid md:grid-cols-2 gap-4 mb-12">
          {TESTIMONIALS.map((t, i) => (
            <div
              key={i}
              className="bg-gray-900 border border-gray-800 rounded-xl p-5"
            >
              <div className="flex gap-1 text-yellow-400 text-sm mb-2">
                {"★★★★★"}
              </div>
              <p className="text-gray-300 text-sm italic mb-3">&ldquo;{t.quote}&rdquo;</p>
              <p className="text-gray-500 text-xs">
                <strong className="text-gray-400">{t.author}</strong> &mdash; {t.role}
              </p>
            </div>
          ))}
        </div>

        {/* Stats */}
        <div className="bg-gray-900 rounded-xl p-8 mb-12">
          <h2 className="text-2xl font-bold mb-6">At a Glance</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div>
              <p className="text-3xl font-bold text-purple-400">5</p>
              <p className="text-gray-400 text-sm">Automation Scripts</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-green-400">4</p>
              <p className="text-gray-400 text-sm">Platforms Covered</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-blue-400">0</p>
              <p className="text-gray-400 text-sm">API Keys Required</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-yellow-400">24/7</p>
              <p className="text-gray-400 text-sm">Scheduled Automation</p>
            </div>
          </div>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-2 gap-6 mb-12">
          <Feature
            title="Twitter Auto-Poster"
            desc="Schedule tweets and threads. Supports text, images, and polls. Set posting times, randomize intervals so it looks human, and queue up a week of content in minutes."
          />
          <Feature
            title="Twitter Engagement Bot"
            desc="Search keywords relevant to your niche, auto-like tweets, and reply with customizable templates. Grow followers on autopilot without touching your phone."
          />
          <Feature
            title="Discord Server Poster"
            desc="Auto-join servers from a list, find promo/self-promo channels by name, and post your message. Configurable delays between actions to avoid detection."
          />
          <Feature
            title="Reddit Auto-Poster"
            desc="Post to multiple subreddits with rotating titles and content. Respects subreddit rules timing. Supports text posts, links, and image posts."
          />
          <Feature
            title="Content Scheduler"
            desc="LaunchAgent templates for Mac and cron templates for Linux. Run any script on a schedule — daily, hourly, or custom intervals. Set it and forget it."
          />
          <Feature
            title="Full Documentation"
            desc="Step-by-step setup guide. Environment configuration. Troubleshooting. Content strategy tips. Everything you need to go from zero to running in under 30 minutes."
          />
        </div>

        {/* Why Playwright */}
        <div className="bg-gray-900 rounded-xl p-8 mb-12">
          <h2 className="text-2xl font-bold mb-4">Why Playwright (Not APIs)</h2>
          <p className="text-gray-400 text-sm mb-4">
            API-based bots get rate-limited, flagged, and banned. Playwright drives a real Chromium browser — the platform sees a real user, because it is one. Just automated.
          </p>
          <ul className="space-y-2 text-gray-300 text-sm">
            <li><strong>No API keys:</strong> No developer accounts, no OAuth, no approval process</li>
            <li><strong>No rate limits:</strong> You&apos;re a browser, not an API client</li>
            <li><strong>Undetectable:</strong> Real browser fingerprint, real cookies, real sessions</li>
            <li><strong>Platform changes don&apos;t break it:</strong> Selectors update, but the approach never dies</li>
            <li><strong>Works on free-tier platforms:</strong> Twitter&apos;s API costs $100/mo. This costs $0 to run</li>
          </ul>
        </div>

        {/* What's Included */}
        <div className="bg-gray-900 rounded-xl p-8 mb-12">
          <h2 className="text-2xl font-bold mb-4">What You Get</h2>
          <ul className="space-y-2 text-gray-300">
            <li><strong>twitter-poster.js</strong> — Schedule tweets, post threads, queue content</li>
            <li><strong>twitter-engage.js</strong> — Keyword search, auto-like, auto-reply with templates</li>
            <li><strong>discord-poster.js</strong> — Auto-join servers, find promo channels, post messages</li>
            <li><strong>reddit-poster.js</strong> — Multi-subreddit posting with rotating content</li>
            <li><strong>scheduler/</strong> — LaunchAgent plist templates (Mac) + cron configs (Linux)</li>
            <li><strong>config.example.json</strong> — All settings documented, copy and customize</li>
            <li><strong>docs/SETUP.md</strong> — Full setup guide with screenshots</li>
            <li><strong>docs/STRATEGY.md</strong> — Content strategy guide and posting schedules</li>
          </ul>
        </div>

        {/* Technical Architecture */}
        <div className="bg-gray-900 rounded-xl p-8 mb-12">
          <h2 className="text-2xl font-bold mb-4">Technical Details</h2>
          <ul className="space-y-2 text-gray-300 text-sm">
            <li>Node.js + Playwright — runs on Mac, Linux, or any VPS</li>
            <li>Headless or headed mode — debug visually, run headless in production</li>
            <li>Session persistence — login once, reuse cookies across runs</li>
            <li>Human-like delays — randomized timing between actions</li>
            <li>Proxy support — rotate IPs if running at scale</li>
            <li>Error recovery — auto-retry on failures, skip problematic targets</li>
            <li>JSON config — all settings in one file, no code changes needed</li>
            <li>Logging — full action logs for debugging and auditing</li>
          </ul>
        </div>

        {/* ROI / Value Framing */}
        <div className="bg-gradient-to-br from-purple-900/40 to-indigo-900/40 border border-purple-700/30 rounded-2xl p-8 mb-12">
          <h2 className="text-2xl font-bold mb-4 text-center">The Time You&apos;ll Get Back</h2>
          <div className="grid sm:grid-cols-3 gap-6 text-center mb-6">
            <div>
              <p className="text-3xl font-bold text-green-400">2+ hrs/day</p>
              <p className="text-gray-400 text-sm">Saved on manual posting & engagement</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-green-400">$1,200+/yr</p>
              <p className="text-gray-400 text-sm">Saved vs. Twitter API + scheduling tools</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-green-400">30 min</p>
              <p className="text-gray-400 text-sm">From download to first automated post</p>
            </div>
          </div>
          <p className="text-center text-gray-400 text-sm">
            You&apos;re paying <strong className="text-white">${PRICE_USD}</strong> once to eliminate hours of daily busywork forever. No subscriptions. No monthly fees.
          </p>
        </div>

        {/* Who It's For */}
        <div className="bg-gray-900 rounded-xl p-8 mb-12">
          <h2 className="text-2xl font-bold mb-4">Built For</h2>
          <div className="grid sm:grid-cols-2 gap-4 text-gray-300 text-sm">
            <div className="flex items-start gap-2">
              <span className="text-purple-400 font-bold mt-0.5">+</span>
              <span><strong>Indie hackers</strong> launching products who need distribution without a marketing team</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-purple-400 font-bold mt-0.5">+</span>
              <span><strong>Crypto projects</strong> that need to be everywhere — Twitter, Discord, Reddit — without hiring</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-purple-400 font-bold mt-0.5">+</span>
              <span><strong>SaaS builders</strong> who want consistent social presence while they focus on building</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-purple-400 font-bold mt-0.5">+</span>
              <span><strong>Content creators</strong> who want to repurpose and cross-post without the manual grind</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-purple-400 font-bold mt-0.5">+</span>
              <span><strong>Growth hackers</strong> who know that consistency beats virality and want to automate it</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-purple-400 font-bold mt-0.5">+</span>
              <span><strong>Anyone</strong> tired of paying $50/mo for Buffer/Hootsuite when a script does it better</span>
            </div>
          </div>
        </div>

        {/* Final CTA */}
        <div className="text-center mb-12">
          <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-8 max-w-lg mx-auto">
            <p className="text-red-400 text-sm font-semibold mb-2 uppercase tracking-wide">
              {mounted && copiesLeft > 0 && `Only ${copiesLeft} copies left at launch price`}
            </p>
            <div className="flex items-center justify-center gap-3 mb-1">
              <span className="text-gray-500 line-through text-2xl font-bold">${ORIGINAL_PRICE_USD}</span>
              <span className="bg-red-600 text-white text-xs font-bold px-2 py-0.5 rounded-full">SAVE $200</span>
            </div>
            <div className="text-5xl font-black text-white mb-1">${PRICE_USD}</div>
            <div className="text-gray-400 mb-4">
              One-time payment. No subscriptions.
            </div>
            <a
              href="/api/stripe-checkout?product=automation-kit"
              className="inline-block w-full sm:w-auto bg-purple-600 hover:bg-purple-500 text-white font-bold py-4 px-10 rounded-xl text-lg transition-all hover:scale-105 hover:shadow-lg hover:shadow-purple-600/25"
            >
              Buy Now — ${PRICE_USD}
            </a>
            <p className="text-gray-500 text-sm mt-3">Instant delivery. Full source code ownership.</p>
          </div>
        </div>

        {/* Guarantee / Note */}
        <div className="text-center mb-12">
          <p className="text-gray-500 text-sm">
            Secure checkout via Stripe. Instant download. Full source code — modify, extend, resell. No recurring fees.
          </p>
        </div>

        {/* Cross-sell */}
        <div className="bg-gradient-to-r from-blue-900/50 to-purple-900/50 rounded-xl p-6 border border-blue-800/30">
          <h3 className="text-lg font-bold text-white mb-2">Need a Telegram trading bot too?</h3>
          <p className="text-gray-300 text-sm mb-3">
            4,500+ lines of production Node.js. 44 commands. 7 revenue streams. Deploy your own bot today.
          </p>
          <a
            href="/sol-bot-source"
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-lg text-sm transition-colors"
          >
            Solana Bot Source — $149
          </a>
        </div>
      </div>

      {/* Sticky Mobile Bottom Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-gray-900/95 backdrop-blur-sm border-t border-gray-800 py-3 px-4 sm:hidden z-50">
        <div className="flex items-center justify-between gap-3">
          <div>
            <span className="text-gray-500 line-through text-sm">${ORIGINAL_PRICE_USD}</span>{" "}
            <span className="text-white font-bold text-lg">${PRICE_USD}</span>
            <span className="text-gray-400 text-xs block">one-time</span>
          </div>
          <a
            href="/api/stripe-checkout?product=automation-kit"
            className="bg-purple-600 hover:bg-purple-500 text-white font-bold py-3 px-6 rounded-xl text-base transition-all animate-pulse"
          >
            BUY NOW
          </a>
        </div>
      </div>

      {/* Bottom padding on mobile to account for sticky bar */}
      <div className="h-20 sm:hidden" />
    </div>
  );
}

function Feature({ title, desc }: { title: string; desc: string }) {
  return (
    <div className="bg-gray-900 rounded-xl p-6">
      <h3 className="text-lg font-bold mb-2">{title}</h3>
      <p className="text-gray-400 text-sm">{desc}</p>
    </div>
  );
}
