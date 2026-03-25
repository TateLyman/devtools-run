"use client";
import { useState } from "react";

export default function GithubReadmePage() {
  const [name, setName] = useState("Your Name");
  const [tagline, setTagline] = useState("Full-stack developer building cool things");
  const [skills, setSkills] = useState("JavaScript, TypeScript, React, Node.js, Python, Solana");
  const [github, setGithub] = useState("username");

  const md = `# Hi, I'm ${name} 👋

${tagline}

## 🛠 Tech Stack
${skills.split(",").map(s => `- ${s.trim()}`).join("\n")}

## 📊 GitHub Stats
![GitHub Stats](https://github-readme-stats.vercel.app/api?username=${github}&show_icons=true&theme=tokyonight)

## 🔗 Links
- [Portfolio](https://devtools-site-delta.vercel.app)
- [Twitter](https://x.com/${github})

---
*Generated with [DevTools GitHub README Generator](https://devtools-site-delta.vercel.app/github-readme)*`;

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <div className="max-w-4xl mx-auto px-4 py-16">
        <h1 className="text-4xl font-extrabold mb-2 text-center">GitHub README Generator</h1>
        <p className="text-gray-400 text-center mb-8">Create a profile README for your GitHub. Copy the Markdown.</p>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <div><label className="text-xs text-gray-400">Name</label><input type="text" value={name} onChange={e=>setName(e.target.value)} className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white" /></div>
            <div><label className="text-xs text-gray-400">Tagline</label><input type="text" value={tagline} onChange={e=>setTagline(e.target.value)} className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white" /></div>
            <div><label className="text-xs text-gray-400">Skills (comma-separated)</label><input type="text" value={skills} onChange={e=>setSkills(e.target.value)} className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white" /></div>
            <div><label className="text-xs text-gray-400">GitHub Username</label><input type="text" value={github} onChange={e=>setGithub(e.target.value)} className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white" /></div>
            <button onClick={()=>navigator.clipboard.writeText(md)} className="w-full bg-purple-600 hover:bg-purple-700 py-2 rounded-lg font-bold">Copy Markdown</button>
          </div>
          <div>
            <div className="text-xs text-gray-400 mb-1">Preview (Markdown)</div>
            <pre className="bg-gray-900 rounded-xl p-4 text-xs text-green-400 font-mono h-80 overflow-y-auto whitespace-pre-wrap">{md}</pre>
          </div>
        </div>
        <div className="mt-8 text-center text-gray-500 text-sm">
          <a href="/bio" className="text-purple-400 hover:underline">Link in Bio</a>{" | "}
          <a href="/md-editor" className="text-purple-400 hover:underline">Markdown Editor</a>{" | "}
          <a href="/meta-tags" className="text-purple-400 hover:underline">Meta Tags</a>{" | "}
          <a href="/" className="text-purple-400 hover:underline">All Tools</a>
        </div>
      </div>
    </div>
  );
}
