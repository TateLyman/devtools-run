import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "AI Prompt Engineering Toolkit — 100+ Prompts for Developers",
  description: "100+ battle-tested AI prompts for coding, debugging, writing, marketing, and business. Works with ChatGPT, Claude, Gemini. 0.15 SOL.",
  keywords: ["AI prompts", "prompt engineering", "ChatGPT prompts", "Claude prompts", "developer prompts", "AI prompt templates"],
};

const categories = [
  {
    name: "Coding & Development",
    icon: "💻",
    prompts: [
      "Write a [language] function that [task] with error handling and tests",
      "Debug this code and explain what's wrong: [paste code]",
      "Refactor this code for performance and readability: [paste code]",
      "Write a comprehensive test suite for: [paste code]",
      "Convert this code from [language A] to [language B]",
    ],
  },
  {
    name: "Code Review",
    icon: "🔍",
    prompts: [
      "Review this PR for security vulnerabilities, performance issues, and code quality",
      "What are the edge cases this code doesn't handle?",
      "Suggest improvements for this API design",
    ],
  },
  {
    name: "DevOps & Infrastructure",
    icon: "🏗️",
    prompts: [
      "Write a Docker Compose file for [stack description]",
      "Create a GitHub Actions CI/CD pipeline for [project type]",
      "Write a Terraform config for [infrastructure]",
    ],
  },
  {
    name: "SEO & Marketing",
    icon: "📈",
    prompts: [
      "Write 10 SEO-optimized blog post titles about [topic]",
      "Create meta descriptions for these pages: [list]",
      "Write a product launch tweet thread for [product]",
    ],
  },
  {
    name: "Business & Strategy",
    icon: "🎯",
    prompts: [
      "Analyze this business model and suggest 5 revenue streams",
      "Write a pitch deck outline for [startup idea]",
      "Create a 90-day launch plan for [product]",
    ],
  },
];

export default function PromptEngineering() {
  return (
    <div className="space-y-8">
      <section className="text-center">
        <div className="inline-block bg-yellow-900/50 text-yellow-400 text-xs font-bold px-3 py-1 rounded-full border border-yellow-700/50 mb-4">
          100+ PROMPTS
        </div>
        <h1 className="text-4xl font-bold mb-4">AI Prompt Engineering Toolkit</h1>
        <p className="text-xl text-[var(--text-secondary)] max-w-2xl mx-auto">
          100+ battle-tested prompts for coding, debugging, writing, SEO, marketing, and business. Works with ChatGPT, Claude, Gemini, and any LLM.
        </p>
        <div className="mt-6 flex gap-4 justify-center items-center">
          <span className="text-3xl font-bold text-emerald-400">0.15 SOL</span>
          <span className="text-gray-500 line-through text-lg">0.3 SOL</span>
          <span className="bg-red-600 text-white text-xs font-bold px-2 py-0.5 rounded">50% OFF</span>
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-bold mb-4">Free Preview — 20 Prompts</h2>
        <div className="space-y-4">
          {categories.map((cat) => (
            <div key={cat.name} className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-lg p-4">
              <h3 className="font-bold text-white mb-2">{cat.icon} {cat.name}</h3>
              <div className="space-y-1">
                {cat.prompts.map((p, i) => (
                  <p key={i} className="text-sm text-[var(--text-secondary)] flex items-start gap-2">
                    <span className="text-purple-400 shrink-0">•</span> {p}
                  </p>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-xl p-8">
        <h2 className="text-2xl font-bold mb-4">Full Toolkit Includes</h2>
        <div className="grid gap-3 md:grid-cols-2">
          {[
            "25 Coding & Development prompts",
            "15 Code Review prompts",
            "10 DevOps & Infrastructure prompts",
            "15 SEO & Content prompts",
            "10 Business & Strategy prompts",
            "10 Email & Communication prompts",
            "10 Data Analysis prompts",
            "5 Interview Prep prompts",
            "Markdown format (easy to copy-paste)",
            "Works with ALL LLMs (ChatGPT, Claude, Gemini, Llama)",
            "Lifetime updates — new prompts added monthly",
            "Commercial license included",
          ].map((item) => (
            <p key={item} className="text-sm flex items-start gap-2">
              <span className="text-emerald-400">✓</span> {item}
            </p>
          ))}
        </div>
      </section>

      <section className="text-center bg-gradient-to-r from-yellow-900/30 to-purple-900/30 border border-yellow-500/20 rounded-xl p-8">
        <h2 className="text-2xl font-bold mb-2">Get the Toolkit</h2>
        <p className="text-[var(--text-secondary)] mb-4">Pay with SOL. Instant download after payment.</p>
        <div className="bg-[var(--bg-primary)] rounded-lg p-4 max-w-md mx-auto text-left space-y-2 text-sm">
          <p className="text-gray-400">1. Send <span className="text-emerald-400 font-bold">0.15 SOL</span> to:</p>
          <code className="block text-xs text-purple-400 select-all break-all bg-[var(--bg-secondary)] p-2 rounded">NaTTUfDDQ8U1RBqb9q5rz6vJ22cWrrT5UAsXuxnb2Wr</code>
          <p className="text-gray-400">2. Send your tx signature to <a href="https://t.me/solscanitbot" className="text-purple-400">@solscanitbot</a></p>
          <p className="text-gray-400">3. Receive download link instantly</p>
        </div>
      </section>
    </div>
  );
}
