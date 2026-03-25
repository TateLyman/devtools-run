"use client";
import { useState } from "react";

const badgeStyles = ["flat", "flat-square", "for-the-badge", "plastic", "social"];
const colors = ["brightgreen", "green", "yellow", "orange", "red", "blue", "blueviolet", "ff69b4", "informational", "success", "important", "critical"];

export default function ReadmeBadge() {
  const [label, setLabel] = useState("build");
  const [message, setMessage] = useState("passing");
  const [color, setColor] = useState("brightgreen");
  const [style, setStyle] = useState("flat");
  const [logo, setLogo] = useState("");
  const [copied, setCopied] = useState(false);

  const badgeUrl = `https://img.shields.io/badge/${encodeURIComponent(label)}-${encodeURIComponent(message)}-${color}?style=${style}${logo ? `&logo=${logo}&logoColor=white` : ""}`;
  const markdown = `![${label}](${badgeUrl})`;
  const html = `<img src="${badgeUrl}" alt="${label}" />`;

  const presets = [
    { label: "build", message: "passing", color: "brightgreen", logo: "github" },
    { label: "license", message: "MIT", color: "blue", logo: "" },
    { label: "npm", message: "v1.0.0", color: "red", logo: "npm" },
    { label: "TypeScript", message: "5.0", color: "blue", logo: "typescript" },
    { label: "PRs", message: "welcome", color: "brightgreen", logo: "" },
    { label: "Node.js", message: "20+", color: "green", logo: "nodedotjs" },
    { label: "React", message: "18", color: "61DAFB", logo: "react" },
    { label: "Docker", message: "ready", color: "2496ED", logo: "docker" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold mb-2">README Badge Generator</h1>
        <p className="text-[var(--text-secondary)]">
          Generate shields.io badges for your GitHub README. Custom labels, colors, logos, and styles. Copy as Markdown or HTML.
        </p>
      </div>

      <div className="flex gap-2 flex-wrap">
        {presets.map((p, i) => (
          <button key={i} onClick={() => { setLabel(p.label); setMessage(p.message); setColor(p.color); setLogo(p.logo); }} className="px-2 py-1 rounded text-xs bg-[var(--bg-secondary)] text-[var(--text-secondary)] hover:text-white">{p.label}: {p.message}</button>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-xs text-gray-400 mb-1">Label</label>
              <input value={label} onChange={(e) => setLabel(e.target.value)} className="w-full bg-[var(--bg-secondary)] border border-[var(--border)] rounded px-3 py-2 text-white text-sm" />
            </div>
            <div>
              <label className="block text-xs text-gray-400 mb-1">Message</label>
              <input value={message} onChange={(e) => setMessage(e.target.value)} className="w-full bg-[var(--bg-secondary)] border border-[var(--border)] rounded px-3 py-2 text-white text-sm" />
            </div>
          </div>

          <div>
            <label className="block text-xs text-gray-400 mb-1">Color</label>
            <div className="flex gap-1 flex-wrap">
              {colors.map((c) => (
                <button key={c} onClick={() => setColor(c)} className={`px-2 py-1 rounded text-[10px] ${color === c ? "ring-2 ring-white" : ""}`} style={{ backgroundColor: c.startsWith("#") ? c : undefined, color: "white" }}>{c}</button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs text-gray-400 mb-1">Style</label>
            <div className="flex gap-1">
              {badgeStyles.map((s) => (
                <button key={s} onClick={() => setStyle(s)} className={`px-2 py-1 rounded text-xs ${style === s ? "bg-purple-600 text-white" : "bg-[var(--bg-secondary)] text-gray-400"}`}>{s}</button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs text-gray-400 mb-1">Logo (optional, e.g. github, npm, react)</label>
            <input value={logo} onChange={(e) => setLogo(e.target.value)} placeholder="github, npm, react, typescript..." className="w-full bg-[var(--bg-secondary)] border border-[var(--border)] rounded px-3 py-2 text-white text-sm" />
          </div>
        </div>

        <div className="space-y-4">
          <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-lg p-6 text-center">
            <p className="text-xs text-gray-400 mb-3">Preview</p>
            <img src={badgeUrl} alt="badge preview" className="mx-auto" />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs text-gray-400">Markdown</label>
              <button onClick={() => { navigator.clipboard.writeText(markdown); setCopied(true); setTimeout(() => setCopied(false), 2000); }} className="text-xs text-purple-400">{copied ? "Copied!" : "Copy"}</button>
            </div>
            <code className="block bg-[var(--bg-secondary)] border border-[var(--border)] rounded p-2 text-xs text-emerald-400 font-mono break-all">{markdown}</code>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs text-gray-400">HTML</label>
              <button onClick={() => navigator.clipboard.writeText(html)} className="text-xs text-purple-400">Copy</button>
            </div>
            <code className="block bg-[var(--bg-secondary)] border border-[var(--border)] rounded p-2 text-xs text-blue-400 font-mono break-all">{html}</code>
          </div>

          <div>
            <label className="text-xs text-gray-400">Direct URL</label>
            <code className="block bg-[var(--bg-secondary)] border border-[var(--border)] rounded p-2 text-xs text-gray-400 font-mono break-all">{badgeUrl}</code>
          </div>
        </div>
      </div>
    </div>
  );
}
