"use client";
import { useState } from "react";

export default function MetaTagGenerator() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [keywords, setKeywords] = useState("");
  const [url, setUrl] = useState("");
  const [image, setImage] = useState("");
  const [siteName, setSiteName] = useState("");
  const [type, setType] = useState("website");
  const [twitterCard, setTwitterCard] = useState("summary_large_image");
  const [twitterHandle, setTwitterHandle] = useState("");
  const [robots, setRobots] = useState("index, follow");
  const [canonical, setCanonical] = useState("");
  const [viewport, setViewport] = useState("width=device-width, initial-scale=1");
  const [charset, setCharset] = useState("UTF-8");
  const [copied, setCopied] = useState(false);

  const generateTags = (): string => {
    const tags: string[] = [];
    tags.push(`<meta charset="${charset}">`);
    tags.push(`<meta name="viewport" content="${viewport}">`);
    if (title) tags.push(`<title>${title}</title>`);
    if (description) tags.push(`<meta name="description" content="${description}">`);
    if (keywords) tags.push(`<meta name="keywords" content="${keywords}">`);
    if (robots) tags.push(`<meta name="robots" content="${robots}">`);
    if (canonical) tags.push(`<link rel="canonical" href="${canonical}">`);

    // Open Graph
    tags.push("");
    tags.push("<!-- Open Graph -->");
    if (title) tags.push(`<meta property="og:title" content="${title}">`);
    if (description) tags.push(`<meta property="og:description" content="${description}">`);
    if (type) tags.push(`<meta property="og:type" content="${type}">`);
    if (url) tags.push(`<meta property="og:url" content="${url}">`);
    if (image) tags.push(`<meta property="og:image" content="${image}">`);
    if (siteName) tags.push(`<meta property="og:site_name" content="${siteName}">`);

    // Twitter
    tags.push("");
    tags.push("<!-- Twitter Card -->");
    tags.push(`<meta name="twitter:card" content="${twitterCard}">`);
    if (title) tags.push(`<meta name="twitter:title" content="${title}">`);
    if (description) tags.push(`<meta name="twitter:description" content="${description}">`);
    if (image) tags.push(`<meta name="twitter:image" content="${image}">`);
    if (twitterHandle) tags.push(`<meta name="twitter:site" content="${twitterHandle}">`);

    return tags.join("\n");
  };

  const output = generateTags();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold mb-2">Meta Tag Generator</h1>
        <p className="text-[var(--text-secondary)]">
          Generate HTML meta tags for SEO, Open Graph, and Twitter Cards. Preview and copy the generated code. Free meta tag generator.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-3">
          <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-lg p-4 space-y-3">
            <h2 className="font-bold text-sm">Basic SEO</h2>
            <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Page Title (50-60 chars)" className="w-full bg-[var(--bg-primary)] border border-[var(--border)] rounded px-3 py-2 text-white text-sm" />
            <div className="text-right text-xs text-gray-400">{title.length}/60</div>
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Meta Description (150-160 chars)" className="w-full bg-[var(--bg-primary)] border border-[var(--border)] rounded px-3 py-2 text-white text-sm h-16 resize-none" />
            <div className="text-right text-xs text-gray-400">{description.length}/160</div>
            <input value={keywords} onChange={(e) => setKeywords(e.target.value)} placeholder="Keywords (comma separated)" className="w-full bg-[var(--bg-primary)] border border-[var(--border)] rounded px-3 py-2 text-white text-sm" />
            <input value={url} onChange={(e) => setUrl(e.target.value)} placeholder="Page URL" className="w-full bg-[var(--bg-primary)] border border-[var(--border)] rounded px-3 py-2 text-white text-sm font-mono" />
            <input value={canonical} onChange={(e) => setCanonical(e.target.value)} placeholder="Canonical URL (optional)" className="w-full bg-[var(--bg-primary)] border border-[var(--border)] rounded px-3 py-2 text-white text-sm font-mono" />
          </div>

          <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-lg p-4 space-y-3">
            <h2 className="font-bold text-sm">Open Graph / Twitter</h2>
            <input value={image} onChange={(e) => setImage(e.target.value)} placeholder="OG Image URL (1200x630 recommended)" className="w-full bg-[var(--bg-primary)] border border-[var(--border)] rounded px-3 py-2 text-white text-sm font-mono" />
            <input value={siteName} onChange={(e) => setSiteName(e.target.value)} placeholder="Site Name" className="w-full bg-[var(--bg-primary)] border border-[var(--border)] rounded px-3 py-2 text-white text-sm" />
            <input value={twitterHandle} onChange={(e) => setTwitterHandle(e.target.value)} placeholder="@twitter_handle" className="w-full bg-[var(--bg-primary)] border border-[var(--border)] rounded px-3 py-2 text-white text-sm" />
            <div className="grid grid-cols-2 gap-2">
              <select value={type} onChange={(e) => setType(e.target.value)} className="bg-[var(--bg-primary)] border border-[var(--border)] rounded px-2 py-1.5 text-white text-sm">
                <option value="website">website</option>
                <option value="article">article</option>
                <option value="product">product</option>
                <option value="profile">profile</option>
              </select>
              <select value={twitterCard} onChange={(e) => setTwitterCard(e.target.value)} className="bg-[var(--bg-primary)] border border-[var(--border)] rounded px-2 py-1.5 text-white text-sm">
                <option value="summary_large_image">Large Image</option>
                <option value="summary">Summary</option>
              </select>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          {title && (
            <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-lg p-4">
              <h3 className="text-xs text-gray-400 mb-2">Google Preview</h3>
              <div className="space-y-1">
                <p className="text-blue-400 text-lg hover:underline cursor-pointer">{title.slice(0, 60)}</p>
                <p className="text-emerald-400 text-xs">{url || "https://example.com"}</p>
                <p className="text-sm text-gray-400">{description.slice(0, 160)}</p>
              </div>
            </div>
          )}

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-sm font-medium">Generated Tags</label>
              <button onClick={() => { navigator.clipboard.writeText(output); setCopied(true); setTimeout(() => setCopied(false), 2000); }} className="text-xs text-purple-400">{copied ? "Copied!" : "Copy"}</button>
            </div>
            <pre className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded p-3 text-xs font-mono text-emerald-400 overflow-auto max-h-[400px] whitespace-pre-wrap">{output}</pre>
          </div>
        </div>
      </div>
    </div>
  );
}
