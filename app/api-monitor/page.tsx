import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "API Monitor — Uptime Monitoring for Developers | $0.05 SOL/month",
  description: "Monitor your API endpoints 24/7. Get alerts when they go down. Check response times, status codes, SSL expiry. Starting at 0.05 SOL/month.",
  keywords: ["API monitoring", "uptime monitor", "API uptime", "endpoint monitoring", "website monitoring", "downtime alerts"],
};

export default function APIMonitor() {
  return (
    <div className="space-y-8">
      <section className="text-center">
        <div className="inline-block bg-blue-900/50 text-blue-400 text-xs font-bold px-3 py-1 rounded-full border border-blue-700/50 mb-4">
          COMING SOON
        </div>
        <h1 className="text-4xl font-bold mb-4">API Monitor</h1>
        <p className="text-xl text-[var(--text-secondary)] max-w-2xl mx-auto">
          Monitor your API endpoints 24/7. Get instant alerts via Telegram when they go down. Track response times and uptime.
        </p>
        <div className="mt-6 flex gap-4 justify-center items-center">
          <span className="text-3xl font-bold text-emerald-400">0.05 SOL/mo</span>
          <span className="text-gray-400">for 10 endpoints</span>
        </div>
      </section>

      <section className="grid gap-6 md:grid-cols-3">
        {[
          { icon: "📡", title: "24/7 Monitoring", desc: "Check your endpoints every 60 seconds from multiple locations worldwide." },
          { icon: "🔔", title: "Instant Alerts", desc: "Get notified via Telegram, email, or webhook the moment something goes wrong." },
          { icon: "📊", title: "Analytics Dashboard", desc: "Track response times, uptime percentage, status code history, and SSL expiry." },
          { icon: "🌍", title: "Multi-Region", desc: "Monitor from US, EU, and Asia. Know if downtime is regional or global." },
          { icon: "🔒", title: "SSL Monitoring", desc: "Get warned 30 days before your SSL certificate expires. Never miss a renewal." },
          { icon: "⚡", title: "API First", desc: "Full API access. Integrate monitoring into your CI/CD pipeline. Programmatic control." },
        ].map((f) => (
          <div key={f.title} className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-xl p-6">
            <div className="text-3xl mb-3">{f.icon}</div>
            <h3 className="font-bold text-lg mb-2">{f.title}</h3>
            <p className="text-sm text-[var(--text-secondary)]">{f.desc}</p>
          </div>
        ))}
      </section>

      <section className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-xl p-8">
        <h2 className="text-2xl font-bold mb-6 text-center">Pricing</h2>
        <div className="grid gap-4 md:grid-cols-3 max-w-3xl mx-auto">
          {[
            { name: "Starter", price: "0.05 SOL", period: "/month", endpoints: "10 endpoints", interval: "60s checks", features: ["Telegram alerts", "24h history", "SSL monitoring"] },
            { name: "Pro", price: "0.2 SOL", period: "/month", endpoints: "50 endpoints", interval: "30s checks", features: ["All alert channels", "30d history", "API access", "Multi-region", "Custom headers"], popular: true },
            { name: "Business", price: "0.5 SOL", period: "/month", endpoints: "200 endpoints", interval: "15s checks", features: ["Everything in Pro", "90d history", "Status pages", "Team access", "Priority support"] },
          ].map((plan) => (
            <div key={plan.name} className={`rounded-xl p-6 ${plan.popular ? "bg-purple-600/10 border-2 border-purple-500" : "bg-[var(--bg-primary)] border border-[var(--border)]"}`}>
              {plan.popular && <span className="text-xs text-purple-400 font-bold">MOST POPULAR</span>}
              <h3 className="text-lg font-bold text-white mt-1">{plan.name}</h3>
              <div className="mt-2">
                <span className="text-2xl font-bold text-emerald-400">{plan.price}</span>
                <span className="text-gray-400 text-sm">{plan.period}</span>
              </div>
              <p className="text-sm text-gray-400 mt-1">{plan.endpoints} · {plan.interval}</p>
              <ul className="mt-4 space-y-1">
                {plan.features.map((f) => (
                  <li key={f} className="text-xs text-[var(--text-secondary)] flex items-center gap-1">
                    <span className="text-emerald-400">✓</span> {f}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      <section className="text-center bg-gradient-to-r from-blue-900/30 to-purple-900/30 border border-blue-500/20 rounded-xl p-8">
        <h2 className="text-2xl font-bold mb-2">Join the Waitlist</h2>
        <p className="text-[var(--text-secondary)] mb-4">Be the first to know when API Monitor launches. Early adopters get 50% off for life.</p>
        <a href="https://t.me/solscanitbot" target="_blank" className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 rounded-lg font-bold inline-block">
          Join via Telegram
        </a>
      </section>
    </div>
  );
}
