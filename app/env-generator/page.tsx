"use client";
import { useState } from "react";

const templates: Record<string, string> = {
  nextjs: `# Next.js
NEXT_PUBLIC_API_URL=http://localhost:3000
DATABASE_URL=postgresql://user:password@localhost:5432/mydb
NEXTAUTH_SECRET=your-secret-here
NEXTAUTH_URL=http://localhost:3000`,
  express: `# Express.js
PORT=3000
NODE_ENV=development
DATABASE_URL=mongodb://localhost:27017/mydb
JWT_SECRET=your-jwt-secret
CORS_ORIGIN=http://localhost:3000`,
  django: `# Django
DEBUG=True
SECRET_KEY=your-django-secret-key
DATABASE_URL=postgres://user:password@localhost:5432/mydb
ALLOWED_HOSTS=localhost,127.0.0.1
REDIS_URL=redis://localhost:6379`,
  react: `# React (Create React App / Vite)
VITE_API_URL=http://localhost:3000/api
VITE_APP_NAME=My App
VITE_STRIPE_KEY=pk_test_xxx`,
  rails: `# Ruby on Rails
RAILS_ENV=development
SECRET_KEY_BASE=your-secret-key-base
DATABASE_URL=postgres://user:password@localhost:5432/mydb_dev
REDIS_URL=redis://localhost:6379/0`,
};

export default function EnvGenerator() {
  const [env, setEnv] = useState(templates.nextjs);
  const [showValues, setShowValues] = useState(true);
  const [copied, setCopied] = useState(false);

  const generateExample = () => {
    const lines = env.split("\n");
    return lines.map((line) => {
      if (line.startsWith("#") || !line.includes("=")) return line;
      const [key] = line.split("=");
      return `${key}=`;
    }).join("\n");
  };

  const download = (content: string, filename: string) => {
    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.download = filename;
    a.href = url;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold mb-2">.env File Generator</h1>
        <p className="text-[var(--text-secondary)]">
          Generate .env files from templates. Next.js, Express, Django, React, Rails presets. Download .env and .env.example.
        </p>
      </div>

      <div className="flex gap-2 flex-wrap">
        {Object.keys(templates).map((t) => (
          <button key={t} onClick={() => setEnv(templates[t])} className="px-3 py-1 rounded text-xs bg-[var(--bg-secondary)] text-[var(--text-secondary)] hover:text-white capitalize">{t}</button>
        ))}
      </div>

      <textarea value={env} onChange={(e) => setEnv(e.target.value)} className="w-full bg-[var(--bg-secondary)] border border-[var(--border)] rounded px-4 py-3 text-white h-64 resize-none font-mono text-sm" spellCheck={false} />

      <div className="flex gap-2 flex-wrap">
        <button onClick={() => download(env, ".env")} className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded text-sm font-bold">Download .env</button>
        <button onClick={() => download(generateExample(), ".env.example")} className="bg-gray-700 hover:bg-gray-600 text-white px-3 py-2 rounded text-sm">Download .env.example</button>
        <button onClick={() => { navigator.clipboard.writeText(env); setCopied(true); setTimeout(() => setCopied(false), 2000); }} className="text-sm text-purple-400 hover:text-purple-300">{copied ? "Copied!" : "Copy"}</button>
      </div>

      <div className="text-xs text-[var(--text-secondary)]">
        <p>Tip: The .env.example file strips all values so you can safely commit it to git. Never commit your actual .env file.</p>
      </div>
    </div>
  );
}
