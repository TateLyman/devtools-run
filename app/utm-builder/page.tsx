"use client";
import { useState } from "react";

export default function UTMBuilder() {
  const [url, setUrl] = useState("https://example.com");
  const [source, setSource] = useState("google");
  const [medium, setMedium] = useState("cpc");
  const [campaign, setCampaign] = useState("spring_sale");
  const [content, setContent] = useState("");
  const [term, setTerm] = useState("");

  const params = new URLSearchParams();
  if (source) params.set("utm_source", source);
  if (medium) params.set("utm_medium", medium);
  if (campaign) params.set("utm_campaign", campaign);
  if (content) params.set("utm_content", content);
  if (term) params.set("utm_term", term);

  const fullUrl = `${url}${url.includes("?") ? "&" : "?"}${params.toString()}`;
  const copy = () => navigator.clipboard.writeText(fullUrl);

  const presets = [
    { name: "Google Ads", source: "google", medium: "cpc" },
    { name: "Facebook", source: "facebook", medium: "social" },
    { name: "Twitter", source: "twitter", medium: "social" },
    { name: "Email", source: "newsletter", medium: "email" },
    { name: "LinkedIn", source: "linkedin", medium: "social" },
    { name: "Reddit", source: "reddit", medium: "social" },
  ];

  return (
    <div className="space-y-6">
      <section className="text-center">
        <h1 className="text-4xl font-bold mb-2">UTM Builder</h1>
        <p className="text-[var(--text-secondary)]">Generate campaign tracking URLs</p>
      </section>

      <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-xl p-6 space-y-3">
        <div><label className="text-xs text-[var(--text-secondary)]">Website URL *</label><input value={url} onChange={e => setUrl(e.target.value)} className="w-full bg-[var(--bg-primary)] border border-[var(--border)] rounded-lg px-3 py-2 font-mono" /></div>
        <div className="grid gap-3 md:grid-cols-2">
          <div><label className="text-xs text-[var(--text-secondary)]">Source * (utm_source)</label><input value={source} onChange={e => setSource(e.target.value)} placeholder="google, facebook, newsletter" className="w-full bg-[var(--bg-primary)] border border-[var(--border)] rounded-lg px-3 py-2 text-sm" /></div>
          <div><label className="text-xs text-[var(--text-secondary)]">Medium * (utm_medium)</label><input value={medium} onChange={e => setMedium(e.target.value)} placeholder="cpc, social, email" className="w-full bg-[var(--bg-primary)] border border-[var(--border)] rounded-lg px-3 py-2 text-sm" /></div>
          <div><label className="text-xs text-[var(--text-secondary)]">Campaign * (utm_campaign)</label><input value={campaign} onChange={e => setCampaign(e.target.value)} placeholder="spring_sale" className="w-full bg-[var(--bg-primary)] border border-[var(--border)] rounded-lg px-3 py-2 text-sm" /></div>
          <div><label className="text-xs text-[var(--text-secondary)]">Content (utm_content)</label><input value={content} onChange={e => setContent(e.target.value)} placeholder="header_link" className="w-full bg-[var(--bg-primary)] border border-[var(--border)] rounded-lg px-3 py-2 text-sm" /></div>
        </div>
        <div><label className="text-xs text-[var(--text-secondary)]">Term (utm_term)</label><input value={term} onChange={e => setTerm(e.target.value)} placeholder="running+shoes" className="w-full bg-[var(--bg-primary)] border border-[var(--border)] rounded-lg px-3 py-2 text-sm" /></div>
        <div className="flex flex-wrap gap-2">
          {presets.map(p => <button key={p.name} onClick={() => { setSource(p.source); setMedium(p.medium); }} className="bg-[var(--bg-primary)] border border-[var(--border)] px-2 py-1 rounded text-xs hover:border-blue-500/50">{p.name}</button>)}
        </div>
      </div>

      <div className="bg-gradient-to-r from-blue-900/30 to-purple-900/30 border border-blue-500/20 rounded-xl p-4">
        <div className="flex justify-between items-start">
          <code className="font-mono text-sm text-blue-400 break-all flex-1">{fullUrl}</code>
          <button onClick={copy} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-bold ml-3 shrink-0">Copy</button>
        </div>
      </div>
    </div>
  );
}
