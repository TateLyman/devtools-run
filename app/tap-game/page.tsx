import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "SOL Tap - Free Telegram Tap Game | Earn Points & Compete",
  description: "Play SOL Tap on Telegram! Tap to earn points, compete on leaderboards, buy boosts with Stars. Free Telegram Mini App game.",
  keywords: ["Telegram game", "tap game", "Telegram Mini App", "SOL Tap", "crypto game", "Telegram tap to earn"],
};

export default function TapGamePage() {
  return (
    <div className="space-y-8">
      <section className="text-center">
        <h1 className="text-4xl font-bold mb-4">SOL Tap</h1>
        <p className="text-xl text-[var(--text-secondary)] max-w-2xl mx-auto">
          The addictive tap game on Telegram. Earn SOL Points, compete on leaderboards, buy boosts with Stars.
        </p>
        <div className="mt-6">
          <a href="https://t.me/solscanitbot?start=tap" target="_blank" className="bg-[#0088cc] hover:bg-[#0077b5] text-white px-8 py-4 rounded-lg font-bold text-lg inline-flex items-center gap-2">
            Play on Telegram
          </a>
        </div>
      </section>

      <section className="grid gap-6 md:grid-cols-3">
        <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-xl p-6 text-center">
          <div className="text-4xl mb-3">🎮</div>
          <h3 className="font-bold text-lg mb-2">Tap to Earn</h3>
          <p className="text-sm text-[var(--text-secondary)]">
            Tap the button to earn SOL Points. Build combos for multipliers. Level up for more power.
          </p>
        </div>
        <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-xl p-6 text-center">
          <div className="text-4xl mb-3">⚡</div>
          <h3 className="font-bold text-lg mb-2">Power-Ups</h3>
          <p className="text-sm text-[var(--text-secondary)]">
            Buy boosts with Telegram Stars: 2x Multiplier, Auto-Tap, Mega Tap, Energy Refill.
          </p>
        </div>
        <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-xl p-6 text-center">
          <div className="text-4xl mb-3">🏆</div>
          <h3 className="font-bold text-lg mb-2">Compete</h3>
          <p className="text-sm text-[var(--text-secondary)]">
            Climb the global leaderboard. Invite friends for bonus points. Daily login streak rewards.
          </p>
        </div>
      </section>

      <section className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-xl p-8 text-center">
        <h2 className="text-2xl font-bold mb-4">How to Play</h2>
        <div className="grid gap-4 md:grid-cols-4 text-sm">
          <div>
            <div className="text-2xl mb-2">1️⃣</div>
            <p>Open <a href="https://t.me/solscanitbot" className="text-purple-400">@solscanitbot</a> on Telegram</p>
          </div>
          <div>
            <div className="text-2xl mb-2">2️⃣</div>
            <p>Type /game or tap the menu button</p>
          </div>
          <div>
            <div className="text-2xl mb-2">3️⃣</div>
            <p>Tap the big button to earn points</p>
          </div>
          <div>
            <div className="text-2xl mb-2">4️⃣</div>
            <p>Watch ads for 500 bonus points</p>
          </div>
        </div>
      </section>

      <section className="text-center">
        <a href="https://t.me/solscanitbot?start=tap" target="_blank" className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-4 rounded-lg font-bold text-lg inline-block">
          Start Playing Now
        </a>
        <p className="text-xs text-gray-500 mt-2">Free to play. No downloads needed.</p>
      </section>
    </div>
  );
}
