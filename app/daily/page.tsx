"use client";
import { useState, useEffect } from "react";

const TIPS = [
  { tip: "Use optional chaining (?.) to safely access nested properties", code: "const name = user?.profile?.name ?? 'Unknown';", lang: "JavaScript" },
  { tip: "Tailwind's 'group' class lets you style children on parent hover", code: '<div className="group">\n  <span className="group-hover:text-blue-500">Hover parent</span>\n</div>', lang: "CSS" },
  { tip: "Use structuredClone() instead of JSON.parse(JSON.stringify()) for deep cloning", code: "const copy = structuredClone(originalObject);", lang: "JavaScript" },
  { tip: "Python f-strings can contain expressions, not just variables", code: "print(f'{2**10 = }')  # outputs: 2**10 = 1024", lang: "Python" },
  { tip: "git stash can save your work without committing", code: "git stash\n# do other work\ngit stash pop  # restore", lang: "Git" },
  { tip: "CSS :has() selector lets you style parents based on children", code: ".card:has(img) { padding: 0; }\n.form:has(:invalid) { border-color: red; }", lang: "CSS" },
  { tip: "Use AbortController to cancel fetch requests", code: "const ctrl = new AbortController();\nfetch(url, { signal: ctrl.signal });\nctrl.abort(); // cancel", lang: "JavaScript" },
];

export default function DailyPage() {
  const [tip, setTip] = useState(TIPS[0]);
  useEffect(() => {
    const day = Math.floor(Date.now() / 86400000);
    setTip(TIPS[day % TIPS.length]);
  }, []);

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <div className="max-w-3xl mx-auto px-4 py-16">
        <h1 className="text-4xl font-extrabold mb-2 text-center">Daily Dev Tip</h1>
        <p className="text-gray-400 text-center mb-8">A new tip every day. Bookmark this page.</p>
        <div className="bg-gray-900 rounded-2xl p-8 mb-8">
          <div className="text-xs text-purple-400 font-bold mb-2">{tip.lang}</div>
          <h2 className="text-xl font-bold mb-4">{tip.tip}</h2>
          <pre className="bg-gray-800 rounded-xl p-4 text-sm text-green-400 font-mono overflow-x-auto whitespace-pre">{tip.code}</pre>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
          <a href="/snippets/javascript-snippets" className="bg-gray-900 rounded-lg p-3 text-center hover:bg-gray-800 text-sm font-bold">JS Snippets</a>
          <a href="/cheatsheet/javascript" className="bg-gray-900 rounded-lg p-3 text-center hover:bg-gray-800 text-sm font-bold">Cheat Sheets</a>
          <a href="/howto/center-a-div" className="bg-gray-900 rounded-lg p-3 text-center hover:bg-gray-800 text-sm font-bold">How-Tos</a>
          <a href="/interview/javascript" className="bg-gray-900 rounded-lg p-3 text-center hover:bg-gray-800 text-sm font-bold">Interview Prep</a>
        </div>
        <div className="text-center text-gray-500 text-sm">
          <a href="/" className="text-purple-400 hover:underline">All 700+ Tools</a>
        </div>
      </div>
    </div>
  );
}
