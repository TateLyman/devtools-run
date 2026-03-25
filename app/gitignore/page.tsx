"use client";
import { useState } from "react";

const TEMPLATES: Record<string, string> = {
  "Node.js": "node_modules/\n.env\n.env.local\ndist/\nbuild/\n*.log\n.DS_Store\ncoverage/\n.next/\n.turbo/",
  "Python": "__pycache__/\n*.pyc\n.env\nvenv/\n*.egg-info/\ndist/\nbuild/\n.pytest_cache/\n.mypy_cache/",
  "React/Next.js": "node_modules/\n.next/\nout/\n.env.local\n.env\n*.log\n.DS_Store\ncoverage/\n.vercel/",
  "Rust": "target/\nCargo.lock\n*.pdb\n.env",
  "Go": "bin/\n*.exe\n*.out\n.env\nvendor/",
  "Java": "*.class\n*.jar\ntarget/\n.idea/\n*.iml\nbuild/\n.gradle/",
  "macOS": ".DS_Store\n.AppleDouble\n.LSOverride\n._*\n.Spotlight-V100\n.Trashes",
  "Windows": "Thumbs.db\nehthumbs.db\nDesktop.ini\n$RECYCLE.BIN/\n*.lnk",
  "IDE": ".idea/\n.vscode/\n*.swp\n*.swo\n*~\n.project\n.settings/",
};

export default function GitignorePage() {
  const [selected, setSelected] = useState<Set<string>>(new Set(["Node.js"]));
  const toggle = (k: string) => { const n = new Set(selected); n.has(k)?n.delete(k):n.add(k); setSelected(n); };
  const output = [...selected].map(k => `# ${k}\n${TEMPLATES[k]}`).join("\n\n");

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <div className="max-w-3xl mx-auto px-4 py-16">
        <h1 className="text-4xl font-extrabold mb-2 text-center">.gitignore Generator</h1>
        <p className="text-gray-400 text-center mb-8">Select your stack. Get a .gitignore file.</p>
        <div className="flex flex-wrap gap-2 mb-6">
          {Object.keys(TEMPLATES).map(k => (
            <button key={k} onClick={()=>toggle(k)} className={`px-3 py-1.5 rounded-lg text-sm font-bold ${selected.has(k)?"bg-purple-600":"bg-gray-800 hover:bg-gray-700"}`}>{k}</button>
          ))}
        </div>
        <div className="bg-gray-900 rounded-xl p-4 mb-4">
          <div className="flex justify-between mb-2">
            <span className="text-xs text-gray-400">.gitignore</span>
            <button onClick={()=>navigator.clipboard.writeText(output)} className="text-xs text-purple-400 hover:underline">Copy</button>
          </div>
          <pre className="text-sm text-green-400 font-mono whitespace-pre overflow-x-auto">{output || "Select a template above"}</pre>
        </div>
        <div className="text-center text-gray-500 text-sm">
          <a href="/cheatsheet/git" className="text-purple-400 hover:underline">Git Cheatsheet</a>{" | "}
          <a href="/github-readme" className="text-purple-400 hover:underline">README Gen</a>{" | "}
          <a href="/json" className="text-purple-400 hover:underline">JSON</a>{" | "}
          <a href="/" className="text-purple-400 hover:underline">All Tools</a>
        </div>
      </div>
    </div>
  );
}
