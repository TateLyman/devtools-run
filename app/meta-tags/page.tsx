"use client";
import { useState } from "react";

export default function MetaTagsPage() {
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [url, setUrl] = useState("");
  const [image, setImage] = useState("");
  const [copied, setCopied] = useState(false);

  const code = `<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${title || "Your Page Title"}</title>
<meta name="description" content="${desc || "Your page description"}">
<meta property="og:title" content="${title || "Your Page Title"}">
<meta property="og:description" content="${desc || "Your page description"}">
<meta property="og:url" content="${url || "https://example.com"}">
${image ? `<meta property="og:image" content="${image}">` : ""}
<meta property="og:type" content="website">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${title || "Your Page Title"}">
<meta name="twitter:description" content="${desc || "Your page description"}">
${image ? `<meta name="twitter:image" content="${image}">` : ""}`;

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <div className="max-w-3xl mx-auto px-4 py-16">
        <h1 className="text-4xl font-extrabold mb-2 text-center">Meta Tag Generator</h1>
        <p className="text-gray-400 text-center mb-8">Generate Open Graph and Twitter Card meta tags for better SEO and social sharing.</p>
        <div className="bg-gray-900 rounded-xl p-6 mb-6 space-y-4">
          <div>
            <label className="text-sm text-gray-400 block mb-1">Page Title</label>
            <input type="text" value={title} onChange={e => setTitle(e.target.value)} placeholder="My Awesome Page"
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white" />
          </div>
          <div>
            <label className="text-sm text-gray-400 block mb-1">Description</label>
            <textarea value={desc} onChange={e => setDesc(e.target.value)} placeholder="A brief description of your page..."
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white h-20 resize-none" />
          </div>
          <div>
            <label className="text-sm text-gray-400 block mb-1">URL</label>
            <input type="url" value={url} onChange={e => setUrl(e.target.value)} placeholder="https://yoursite.com"
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white" />
          </div>
          <div>
            <label className="text-sm text-gray-400 block mb-1">Image URL (optional)</label>
            <input type="url" value={image} onChange={e => setImage(e.target.value)} placeholder="https://yoursite.com/og-image.jpg"
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white" />
          </div>
        </div>
        <div className="bg-gray-900 rounded-xl p-6 mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-gray-400">Generated HTML</span>
            <button onClick={() => {navigator.clipboard.writeText(code);setCopied(true);setTimeout(()=>setCopied(false),2000);}}
              className="bg-purple-600 hover:bg-purple-700 px-3 py-1 rounded text-sm font-bold">{copied ? "Copied!" : "Copy"}</button>
          </div>
          <pre className="bg-gray-800 rounded-lg p-4 text-xs text-green-400 overflow-x-auto whitespace-pre-wrap">{code}</pre>
        </div>
        <div className="text-center text-gray-500 text-sm">
          <a href="/json" className="text-purple-400 hover:underline">JSON</a>{" | "}
          <a href="/html-encode" className="text-purple-400 hover:underline">HTML Encode</a>{" | "}
          <a href="/css-minify" className="text-purple-400 hover:underline">CSS Minify</a>{" | "}
          <a href="/gradient" className="text-purple-400 hover:underline">Gradients</a>{" | "}
          <a href="/qr" className="text-purple-400 hover:underline">QR Code</a>
        </div>
      </div>
    </div>
  );
}
