"use client";
import { useState } from "react";

const QUESTIONS = [
  { q: "What are you building?", options: [
    { label: "Web app", value: "web" },
    { label: "API / Backend", value: "api" },
    { label: "Mobile app", value: "mobile" },
    { label: "CLI tool", value: "cli" },
  ]},
  { q: "Team size?", options: [
    { label: "Just me", value: "solo" },
    { label: "Small team (2-5)", value: "small" },
    { label: "Large team (5+)", value: "large" },
  ]},
  { q: "Priority?", options: [
    { label: "Ship fast", value: "speed" },
    { label: "Scale later", value: "scale" },
    { label: "Best performance", value: "perf" },
  ]},
];

const STACKS: Record<string, { name: string; tools: string[]; why: string }> = {
  "web-solo-speed": { name: "Solo Speedrun Stack", tools: ["Next.js", "Tailwind CSS", "Supabase", "Vercel"], why: "Ship a full-stack app in a weekend. Auth, database, hosting all included." },
  "web-solo-scale": { name: "Solo Scale Stack", tools: ["Next.js", "PostgreSQL", "Prisma", "Railway"], why: "Start simple, scale to millions. Proper database from day one." },
  "web-solo-perf": { name: "Performance Stack", tools: ["Astro", "Svelte", "Tailwind", "Cloudflare Pages"], why: "Smallest bundles, fastest loads. Perfect for content-heavy sites." },
  "api-solo-speed": { name: "Quick API Stack", tools: ["Hono", "Cloudflare Workers", "D1"], why: "Deploy globally in minutes. Zero cold starts, edge computing." },
  "api-solo-scale": { name: "Scalable API Stack", tools: ["Express/Fastify", "PostgreSQL", "Redis", "Docker"], why: "Battle-tested, tons of libraries, easy to hire for." },
  "web-small-speed": { name: "Team Sprint Stack", tools: ["Next.js", "TypeScript", "Prisma", "Vercel"], why: "Type safety keeps the team aligned. Fast deploys, great DX." },
  "web-large-scale": { name: "Enterprise Stack", tools: ["Next.js", "TypeScript", "PostgreSQL", "Kubernetes", "GitHub Actions"], why: "Production-grade. CI/CD, testing, monitoring built in." },
};

export default function StackPickerPage() {
  const [answers, setAnswers] = useState<string[]>([]);
  const [step, setStep] = useState(0);

  const pick = (val: string) => {
    const next = [...answers, val];
    setAnswers(next);
    setStep(step + 1);
  };

  const key = answers.join("-");
  const result = STACKS[key] || STACKS["web-solo-speed"];
  const done = step >= QUESTIONS.length;

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <div className="max-w-3xl mx-auto px-4 py-16 text-center">
        <h1 className="text-4xl font-extrabold mb-2">Stack Picker</h1>
        <p className="text-gray-400 mb-8">Answer 3 questions. Get a recommended tech stack.</p>
        {!done ? (
          <div className="bg-gray-900 rounded-2xl p-8">
            <div className="text-sm text-gray-400 mb-2">Question {step + 1} of {QUESTIONS.length}</div>
            <h2 className="text-xl font-bold mb-6">{QUESTIONS[step].q}</h2>
            <div className="grid grid-cols-2 gap-3">
              {QUESTIONS[step].options.map((o, i) => (
                <button key={i} onClick={() => pick(o.value)} className="bg-gray-800 hover:bg-purple-600 py-4 rounded-xl font-bold transition-colors">{o.label}</button>
              ))}
            </div>
          </div>
        ) : (
          <div className="bg-gray-900 rounded-2xl p-8">
            <div className="text-xs text-purple-400 mb-2">Recommended Stack</div>
            <h2 className="text-2xl font-extrabold mb-2">{result.name}</h2>
            <p className="text-gray-400 mb-4">{result.why}</p>
            <div className="flex flex-wrap gap-2 justify-center mb-6">
              {result.tools.map((t, i) => <span key={i} className="bg-purple-600/20 text-purple-300 px-3 py-1 rounded-lg text-sm font-bold">{t}</span>)}
            </div>
            <button onClick={() => { setAnswers([]); setStep(0); }} className="bg-purple-600 hover:bg-purple-700 px-6 py-2 rounded-lg font-bold">Try Again</button>
          </div>
        )}
        <div className="mt-8 text-center text-gray-500 text-sm">
          <a href="/compare/react-vs-vue" className="text-purple-400 hover:underline">Comparisons</a>{" | "}
          <a href="/best/javascript-frameworks" className="text-purple-400 hover:underline">Best Frameworks</a>{" | "}
          <a href="/project-ideas" className="text-purple-400 hover:underline">Project Ideas</a>{" | "}
          <a href="/" className="text-purple-400 hover:underline">All Tools</a>
        </div>
      </div>
    </div>
  );
}
