import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Freelance Job Alerts — Get Notified Instantly via Telegram",
  description: "Get freelance job alerts via Telegram the second they're posted. Upwork, Freelancer, Reddit. Filter by skills. Beat the competition. 0.05 SOL/month.",
  keywords: ["freelance job alerts", "Upwork notifications", "freelance job bot", "job alert Telegram", "freelance job finder"],
};

export default function JobAlerts() {
  return (
    <div className="space-y-8">
      <section className="text-center">
        <div className="inline-block bg-emerald-900/50 text-emerald-400 text-xs font-bold px-3 py-1 rounded-full border border-emerald-700/50 mb-4">
          COMING SOON
        </div>
        <h1 className="text-4xl font-bold mb-4">Freelance Job Alerts</h1>
        <p className="text-xl text-[var(--text-secondary)] max-w-2xl mx-auto">
          Get freelance gigs delivered to your Telegram the SECOND they're posted. Be the first to apply. Win more clients.
        </p>
        <div className="mt-6 flex gap-4 justify-center items-center">
          <span className="text-3xl font-bold text-emerald-400">0.05 SOL/mo</span>
          <span className="text-sm text-gray-400">~$7.50/month</span>
        </div>
      </section>

      <section className="grid gap-6 md:grid-cols-3">
        {[
          { icon: "⚡", title: "Instant Alerts", desc: "Jobs hit your Telegram within seconds of being posted. Before they show up in search feeds." },
          { icon: "🎯", title: "Smart Filters", desc: "Set your skills (JS, Python, Bots, etc.) and budget range. Only get jobs YOU can win." },
          { icon: "📝", title: "Auto Proposals", desc: "AI-generated proposal drafts tailored to each job. Edit and send in 30 seconds." },
        ].map((f) => (
          <div key={f.title} className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-xl p-6">
            <div className="text-3xl mb-3">{f.icon}</div>
            <h3 className="font-bold text-lg mb-2">{f.title}</h3>
            <p className="text-sm text-[var(--text-secondary)]">{f.desc}</p>
          </div>
        ))}
      </section>

      <section className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-xl p-8">
        <h2 className="text-2xl font-bold mb-4 text-center">The Problem</h2>
        <div className="grid gap-4 md:grid-cols-2 max-w-2xl mx-auto text-sm">
          <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4">
            <h3 className="font-bold text-red-400 mb-2">Without Job Alerts</h3>
            <ul className="space-y-1 text-[var(--text-secondary)]">
              <li>• Manually refreshing job boards</li>
              <li>• Finding jobs 30+ minutes after posting</li>
              <li>• Competing with 50+ applicants</li>
              <li>• Writing proposals from scratch</li>
              <li>• Missing perfect-fit gigs</li>
            </ul>
          </div>
          <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-lg p-4">
            <h3 className="font-bold text-emerald-400 mb-2">With Job Alerts</h3>
            <ul className="space-y-1 text-[var(--text-secondary)]">
              <li>• Instant Telegram notification</li>
              <li>• Apply within 60 seconds</li>
              <li>• Be the 1st-3rd applicant</li>
              <li>• AI proposal draft ready to send</li>
              <li>• Only jobs matching YOUR skills</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="text-center bg-gradient-to-r from-emerald-900/30 to-blue-900/30 border border-emerald-500/20 rounded-xl p-8">
        <h2 className="text-2xl font-bold mb-2">Join the Waitlist</h2>
        <p className="text-[var(--text-secondary)] mb-4">Be first to get access. Early adopters get 50% off forever.</p>
        <a href="https://t.me/solscanitbot" target="_blank" className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-3 rounded-lg font-bold inline-block">
          Join via Telegram
        </a>
        <p className="text-xs text-gray-500 mt-2">DM @solscanitbot with "job alerts"</p>
      </section>
    </div>
  );
}
