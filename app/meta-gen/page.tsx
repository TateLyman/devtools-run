"use client";
import { useState } from "react";

export default function MetaGen() {
  const [title, setTitle] = useState("My Awesome Page");
  const [desc, setDesc] = useState("A description of my awesome page that is optimized for search engines.");
  const [url, setUrl] = useState("https://example.com");
  const [image, setImage] = useState("https://example.com/og-image.jpg");
  const [type, setType] = useState("website");
  const [twitter, setTwitter] = useState("@username");
  const [robots, setRobots] = useState("index, follow");

  const html = `<!-- Primary Meta Tags -->
<title>${title}</title>
<meta name="title" content="${title}" />
<meta name="description" content="${desc}" />
<meta name="robots" content="${robots}" />

<!-- Open Graph / Facebook -->
<meta property="og:type" content="${type}" />
<meta property="og:url" content="${url}" />
<meta property="og:title" content="${title}" />
<meta property="og:description" content="${desc}" />
<meta property="og:image" content="${image}" />

<!-- Twitter -->
<meta property="twitter:card" content="summary_large_image" />
<meta property="twitter:url" content="${url}" />
<meta property="twitter:title" content="${title}" />
<meta property="twitter:description" content="${desc}" />
<meta property="twitter:image" content="${image}" />
<meta property="twitter:creator" content="${twitter}" />`;

  const copy = () => navigator.clipboard.writeText(html);

  return (
    <div className="space-y-6">
      <section className="text-center">
        <h1 className="text-4xl font-bold mb-2">Meta Tag Generator</h1>
        <p className="text-[var(--text-secondary)]">Generate SEO meta tags and Open Graph tags</p>
      </section>

      <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-xl p-6 space-y-3">
        <div><label className="text-xs text-[var(--text-secondary)]">Page Title <span className="text-blue-400">{title.length}/60</span></label><input value={title} onChange={e => setTitle(e.target.value)} maxLength={60} className="w-full bg-[var(--bg-primary)] border border-[var(--border)] rounded-lg px-3 py-2" /></div>
        <div><label className="text-xs text-[var(--text-secondary)]">Description <span className="text-blue-400">{desc.length}/160</span></label><textarea value={desc} onChange={e => setDesc(e.target.value)} maxLength={160} rows={2} className="w-full bg-[var(--bg-primary)] border border-[var(--border)] rounded-lg px-3 py-2 resize-none" /></div>
        <div className="grid gap-3 md:grid-cols-2">
          <div><label className="text-xs text-[var(--text-secondary)]">URL</label><input value={url} onChange={e => setUrl(e.target.value)} className="w-full bg-[var(--bg-primary)] border border-[var(--border)] rounded-lg px-3 py-2 text-sm" /></div>
          <div><label className="text-xs text-[var(--text-secondary)]">OG Image URL</label><input value={image} onChange={e => setImage(e.target.value)} className="w-full bg-[var(--bg-primary)] border border-[var(--border)] rounded-lg px-3 py-2 text-sm" /></div>
          <div><label className="text-xs text-[var(--text-secondary)]">Type</label><select value={type} onChange={e => setType(e.target.value)} className="w-full bg-[var(--bg-primary)] border border-[var(--border)] rounded-lg px-3 py-2 text-sm">{["website","article","product","profile"].map(t => <option key={t}>{t}</option>)}</select></div>
          <div><label className="text-xs text-[var(--text-secondary)]">Twitter Handle</label><input value={twitter} onChange={e => setTwitter(e.target.value)} className="w-full bg-[var(--bg-primary)] border border-[var(--border)] rounded-lg px-3 py-2 text-sm" /></div>
        </div>
        <div><label className="text-xs text-[var(--text-secondary)]">Robots</label><select value={robots} onChange={e => setRobots(e.target.value)} className="w-full bg-[var(--bg-primary)] border border-[var(--border)] rounded-lg px-3 py-2 text-sm">{["index, follow","noindex, follow","index, nofollow","noindex, nofollow"].map(r => <option key={r}>{r}</option>)}</select></div>
      </div>

      <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-xl p-4">
        <div className="flex justify-between mb-2">
          <label className="text-sm font-bold">Generated HTML</label>
          <button onClick={copy} className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-xs font-bold">Copy</button>
        </div>
        <pre className="font-mono text-xs text-emerald-400 whitespace-pre-wrap max-h-64 overflow-y-auto">{html}</pre>
      </div>

      <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-xl p-4">
        <h2 className="text-sm font-bold mb-2">Google Preview</h2>
        <div className="bg-white rounded-lg p-3 text-sm">
          <div className="text-blue-600 text-lg">{title}</div>
          <div className="text-green-700 text-xs">{url}</div>
          <div className="text-gray-600">{desc}</div>
        </div>
      </div>
    </div>
  );
}
