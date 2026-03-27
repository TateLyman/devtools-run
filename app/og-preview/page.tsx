"use client";
import { useState } from "react";
export default function OgPreview() {
  const [title, setTitle] = useState("My Awesome Article — Blog Name");
  const [desc, setDesc] = useState("A comprehensive guide to building modern web applications with the latest tools and techniques.");
  const [image, setImage] = useState("https://picsum.photos/1200/630");
  const [url, setUrl] = useState("https://example.com/my-article");
  const [site, setSite] = useState("@myblog");
  return (
    <div className="space-y-6">
      <section className="text-center"><h1 className="text-4xl font-bold mb-2">OG Image Preview</h1><p className="text-[var(--text-secondary)]">Preview social media share cards</p></section>
      <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-xl p-6 space-y-3">
        <input value={title} onChange={e=>setTitle(e.target.value)} placeholder="Page title" className="w-full bg-[var(--bg-primary)] border border-[var(--border)] rounded-lg px-3 py-2 text-sm" />
        <textarea value={desc} onChange={e=>setDesc(e.target.value)} rows={2} placeholder="Description" className="w-full bg-[var(--bg-primary)] border border-[var(--border)] rounded-lg px-3 py-2 text-sm resize-none" />
        <input value={image} onChange={e=>setImage(e.target.value)} placeholder="OG image URL (1200x630)" className="w-full bg-[var(--bg-primary)] border border-[var(--border)] rounded-lg px-3 py-2 text-sm font-mono" />
        <div className="flex gap-2"><input value={url} onChange={e=>setUrl(e.target.value)} placeholder="Page URL" className="flex-1 bg-[var(--bg-primary)] border border-[var(--border)] rounded-lg px-3 py-2 text-sm font-mono" /><input value={site} onChange={e=>setSite(e.target.value)} placeholder="@handle" className="w-32 bg-[var(--bg-primary)] border border-[var(--border)] rounded-lg px-3 py-2 text-sm" /></div>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <div><h3 className="text-sm font-bold mb-2">Twitter / X</h3><div className="bg-white rounded-xl overflow-hidden border border-gray-200 max-w-[500px]">{image && <img src={image} alt="OG" className="w-full h-52 object-cover" />}<div className="p-3"><div className="text-gray-500 text-xs">{new URL(url || "https://example.com").hostname}</div><div className="text-gray-900 font-bold text-sm mt-1 line-clamp-2">{title}</div><div className="text-gray-500 text-sm mt-1 line-clamp-2">{desc}</div></div></div></div>
        <div><h3 className="text-sm font-bold mb-2">Facebook / LinkedIn</h3><div className="bg-[#f0f2f5] rounded-xl overflow-hidden border border-gray-300 max-w-[500px]">{image && <img src={image} alt="OG" className="w-full h-52 object-cover" />}<div className="p-3 bg-[#f0f2f5]"><div className="text-gray-500 text-xs uppercase">{new URL(url || "https://example.com").hostname}</div><div className="text-gray-900 font-bold text-sm mt-1">{title}</div><div className="text-gray-600 text-xs mt-1 line-clamp-1">{desc}</div></div></div></div>
      </div>
      <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-xl p-4"><div className="flex justify-between mb-2"><label className="text-sm font-bold">Meta Tags</label><button onClick={()=>navigator.clipboard.writeText(`<meta property="og:title" content="${title}" />\n<meta property="og:description" content="${desc}" />\n<meta property="og:image" content="${image}" />\n<meta property="og:url" content="${url}" />\n<meta name="twitter:card" content="summary_large_image" />\n<meta name="twitter:site" content="${site}" />`)} className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-xs font-bold">Copy</button></div><pre className="font-mono text-xs text-emerald-400 whitespace-pre-wrap">{`<meta property="og:title" content="${title}" />\n<meta property="og:description" content="${desc}" />\n<meta property="og:image" content="${image}" />\n<meta property="og:url" content="${url}" />\n<meta name="twitter:card" content="summary_large_image" />\n<meta name="twitter:site" content="${site}" />`}</pre></div>
    </div>
  );
}
