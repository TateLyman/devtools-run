import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "DevTools.run Chrome Extension - 50+ Dev Tools in One Click",
  description: "Get 50+ developer tools right in your browser toolbar. JSON formatter, regex tester, UUID generator, password generator, and more. One-click access, Alt+D shortcut.",
  keywords: ["Chrome extension", "developer tools extension", "browser dev tools", "DevTools extension", "web developer extension"],
};

export default function ExtensionPage() {
  return (
    <div className="space-y-8">
      <section className="text-center">
        <h1 className="text-4xl font-bold mb-4">DevTools.run Chrome Extension</h1>
        <p className="text-xl text-[var(--text-secondary)] max-w-2xl mx-auto">
          50+ developer tools in your browser toolbar. JSON, regex, base64, hash, UUID, timestamps, CSS generators — everything one click away.
        </p>
        <div className="mt-6 flex gap-4 justify-center">
          <a href="https://github.com/TateLyman/devtools-extension" target="_blank" className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 rounded-lg font-bold text-lg">
            Get the Extension
          </a>
        </div>
      </section>

      <section className="grid gap-6 md:grid-cols-3">
        <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-xl p-6 text-center">
          <div className="text-4xl mb-3">⚡</div>
          <h3 className="font-bold text-lg mb-2">Instant Access</h3>
          <p className="text-sm text-[var(--text-secondary)]">
            Press Alt+D or click the icon. Generate UUIDs, passwords, timestamps, and encode base64 without leaving your current tab.
          </p>
        </div>
        <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-xl p-6 text-center">
          <div className="text-4xl mb-3">🔧</div>
          <h3 className="font-bold text-lg mb-2">50+ Tools</h3>
          <p className="text-sm text-[var(--text-secondary)]">
            JSON formatter, regex tester, CSS grid/flexbox generators, hash calculator, JWT decoder, code formatter, and many more.
          </p>
        </div>
        <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-xl p-6 text-center">
          <div className="text-4xl mb-3">🔒</div>
          <h3 className="font-bold text-lg mb-2">100% Private</h3>
          <p className="text-sm text-[var(--text-secondary)]">
            All tools run client-side. No data collection, no tracking, no analytics. Your data never leaves your browser.
          </p>
        </div>
      </section>

      <section className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-xl p-8">
        <h2 className="text-2xl font-bold mb-4">Quick Actions (built into popup)</h2>
        <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-5">
          {["UUID Generator", "Timestamp", "Password Gen", "Base64 Encode", "Base64 Decode"].map((tool) => (
            <div key={tool} className="bg-[var(--bg-primary)] border border-[var(--border)] rounded-lg p-3 text-center text-sm font-medium">
              {tool}
            </div>
          ))}
        </div>
        <p className="text-sm text-[var(--text-secondary)] mt-4">
          These work instantly in the popup — no new tab needed. Results copy to clipboard with one click.
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-bold mb-4">All Categories</h2>
        <div className="grid gap-4 md:grid-cols-4">
          {[
            { name: "Dev Tools", count: 16, items: "JSON, Regex, JWT, Hash, Code Format, SQL, Crontab" },
            { name: "CSS & Design", count: 10, items: "Grid, Flexbox, Glass, Animations, Shadows, Palette" },
            { name: "Converters", count: 8, items: "Timestamp, Base64, URL, Image, Units, Timezone" },
            { name: "Calculators", count: 8, items: "Scientific, Percentage, Mortgage, BMI, GPA, Tip" },
          ].map((cat) => (
            <div key={cat.name} className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-lg p-4">
              <h3 className="font-bold text-purple-400">{cat.name}</h3>
              <p className="text-2xl font-bold text-white">{cat.count} tools</p>
              <p className="text-xs text-[var(--text-secondary)] mt-1">{cat.items}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="text-center bg-gradient-to-r from-purple-900/30 to-blue-900/30 border border-purple-500/20 rounded-xl p-8">
        <h2 className="text-2xl font-bold mb-2">Ready to boost your workflow?</h2>
        <p className="text-[var(--text-secondary)] mb-4">Join developers who use DevTools.run every day.</p>
        <a href="https://github.com/TateLyman/devtools-extension" target="_blank" className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 rounded-lg font-bold text-lg inline-block">
          Install Extension
        </a>
      </section>
    </div>
  );
}
