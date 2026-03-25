import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Telegram Bot Template — Production-Ready Node.js Bot Starter",
  description: "Production-ready Telegram bot template. Node.js, 20+ commands, user management, admin panel, Stars payments, inline keyboards. Deploy in 5 minutes. 0.3 SOL.",
  keywords: ["Telegram bot template", "Telegram bot starter", "Node.js Telegram bot", "buy Telegram bot", "bot source code"],
};

export default function TelegramBotTemplate() {
  return (
    <div className="space-y-8">
      <section className="text-center">
        <div className="inline-block bg-purple-900/50 text-purple-400 text-xs font-bold px-3 py-1 rounded-full border border-purple-700/50 mb-4">
          DIGITAL PRODUCT
        </div>
        <h1 className="text-4xl font-bold mb-4">Telegram Bot Template</h1>
        <p className="text-xl text-[var(--text-secondary)] max-w-2xl mx-auto">
          Production-ready Telegram bot in Node.js. 20+ commands, user management, admin panel, Stars payments, inline keyboards. Deploy in 5 minutes.
        </p>
        <div className="mt-6 flex gap-4 justify-center items-center">
          <span className="text-3xl font-bold text-emerald-400">0.3 SOL</span>
          <span className="text-gray-500 line-through text-lg">0.5 SOL</span>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {[
          { icon: "🤖", title: "20+ Commands", desc: "/start, /help, /settings, /admin, /broadcast, /stats, /ban, /premium, /stars and more" },
          { icon: "👤", title: "User Management", desc: "SQLite database, user profiles, preferences, ban system, admin roles" },
          { icon: "⭐", title: "Stars Payments", desc: "Built-in Telegram Stars payment flow for premium features" },
          { icon: "📊", title: "Admin Dashboard", desc: "/admin command with user stats, broadcast messages, ban users" },
          { icon: "⌨️", title: "Inline Keyboards", desc: "Beautiful inline keyboard menus, callbacks, pagination" },
          { icon: "🔧", title: "Easy Config", desc: "Single .env file, no complex setup. Works on any Node.js host" },
          { icon: "📡", title: "Webhook + Polling", desc: "Supports both webhook (production) and polling (development) modes" },
          { icon: "🛡️", title: "Rate Limiting", desc: "Built-in rate limiting, spam protection, and error handling" },
          { icon: "📦", title: "Zero Dependencies", desc: "Pure Node.js, no frameworks. Uses built-in https module. Tiny footprint." },
        ].map((f) => (
          <div key={f.title} className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-lg p-4">
            <div className="text-2xl mb-2">{f.icon}</div>
            <h3 className="font-bold text-sm text-white mb-1">{f.title}</h3>
            <p className="text-xs text-[var(--text-secondary)]">{f.desc}</p>
          </div>
        ))}
      </section>

      <section className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-xl p-8">
        <h2 className="text-2xl font-bold mb-4">What You Get</h2>
        <ul className="space-y-2 text-sm">
          <li className="flex items-start gap-2"><span className="text-emerald-400">✓</span> Complete bot source code (~800 lines, well-commented)</li>
          <li className="flex items-start gap-2"><span className="text-emerald-400">✓</span> SQLite user database with migrations</li>
          <li className="flex items-start gap-2"><span className="text-emerald-400">✓</span> Telegram Stars payment integration</li>
          <li className="flex items-start gap-2"><span className="text-emerald-400">✓</span> Admin panel with broadcast, stats, ban</li>
          <li className="flex items-start gap-2"><span className="text-emerald-400">✓</span> Rate limiting and spam protection</li>
          <li className="flex items-start gap-2"><span className="text-emerald-400">✓</span> Deployment guide (VPS, Railway, Render)</li>
          <li className="flex items-start gap-2"><span className="text-emerald-400">✓</span> BotFather setup instructions</li>
          <li className="flex items-start gap-2"><span className="text-emerald-400">✓</span> Full commercial license — use however you want</li>
        </ul>
      </section>

      <section className="text-center bg-gradient-to-r from-purple-900/30 to-emerald-900/30 border border-purple-500/20 rounded-xl p-8">
        <h2 className="text-2xl font-bold mb-2">Get the Template</h2>
        <p className="text-[var(--text-secondary)] mb-4">Pay with SOL. Instant download after payment verification.</p>
        <div className="bg-[var(--bg-primary)] rounded-lg p-4 max-w-md mx-auto text-left space-y-2 text-sm">
          <p className="text-gray-400">1. Send <span className="text-emerald-400 font-bold">0.3 SOL</span> to:</p>
          <code className="block text-xs text-purple-400 select-all break-all bg-[var(--bg-secondary)] p-2 rounded">NaTTUfDDQ8U1RBqb9q5rz6vJ22cWrrT5UAsXuxnb2Wr</code>
          <p className="text-gray-400">2. Send your transaction signature to <a href="https://t.me/solscanitbot" className="text-purple-400">@solscanitbot</a></p>
          <p className="text-gray-400">3. Receive your download link instantly</p>
        </div>
        <p className="text-xs text-gray-500 mt-4">Questions? DM <a href="https://t.me/solscanitbot" className="text-purple-400">@solscanitbot</a></p>
      </section>
    </div>
  );
}
