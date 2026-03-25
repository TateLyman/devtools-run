"use client";
import { useState } from "react";

export default function OpenGraphPreview() {
  const [url, setUrl] = useState("");
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const preview = async () => {
    if (!url.trim()) return;
    setLoading(true);
    try {
      let fullUrl = url.trim();
      if (!fullUrl.startsWith("http")) fullUrl = "https://" + fullUrl;
      const res = await fetch(`https://api.allorigins.win/raw?url=${encodeURIComponent(fullUrl)}`);
      const html = await res.text();

      const getMetaContent = (name: string): string => {
        const match = html.match(new RegExp(`<meta[^>]*(?:property|name)=["']${name}["'][^>]*content=["']([^"']*)["']`, "i"))
          || html.match(new RegExp(`<meta[^>]*content=["']([^"']*)["'][^>]*(?:property|name)=["']${name}["']`, "i"));
        return match?.[1] || "";
      };

      const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);

      setData({
        title: getMetaContent("og:title") || titleMatch?.[1] || "",
        description: getMetaContent("og:description") || getMetaContent("description") || "",
        image: getMetaContent("og:image") || "",
        siteName: getMetaContent("og:site_name") || "",
        type: getMetaContent("og:type") || "",
        url: getMetaContent("og:url") || fullUrl,
        twitterCard: getMetaContent("twitter:card") || "",
        twitterTitle: getMetaContent("twitter:title") || "",
        twitterDescription: getMetaContent("twitter:description") || "",
        twitterImage: getMetaContent("twitter:image") || "",
      });
    } catch {
      setData({ error: true });
    }
    setLoading(false);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold mb-2">Open Graph Preview</h1>
        <p className="text-[var(--text-secondary)]">
          Preview how a URL will look when shared on social media. See Open Graph tags, Twitter Cards, and link previews.
        </p>
      </div>

      <div className="flex gap-2 max-w-lg mx-auto">
        <input value={url} onChange={(e) => setUrl(e.target.value)} onKeyDown={(e) => e.key === "Enter" && preview()} placeholder="Enter URL to preview..." className="flex-1 bg-[var(--bg-secondary)] border border-[var(--border)] rounded px-4 py-3 text-white font-mono text-sm" />
        <button onClick={preview} disabled={loading} className="bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white px-6 py-3 rounded font-bold">{loading ? "..." : "Preview"}</button>
      </div>

      {data && !data.error && (
        <div className="max-w-lg mx-auto space-y-6">
          {/* Facebook/LinkedIn Preview */}
          <div>
            <h3 className="text-sm font-bold mb-2 text-gray-400">Facebook / LinkedIn Preview</h3>
            <div className="bg-white rounded-lg overflow-hidden border border-gray-300 max-w-md">
              {data.image && <img src={data.image} alt="" className="w-full h-48 object-cover" onError={(e) => (e.currentTarget.style.display = "none")} />}
              <div className="p-3">
                <p className="text-[10px] text-gray-500 uppercase">{new URL(data.url).hostname}</p>
                <p className="text-sm font-bold text-gray-900 mt-1">{data.title}</p>
                <p className="text-xs text-gray-600 mt-1 line-clamp-2">{data.description}</p>
              </div>
            </div>
          </div>

          {/* Twitter Preview */}
          <div>
            <h3 className="text-sm font-bold mb-2 text-gray-400">Twitter / X Preview</h3>
            <div className="bg-gray-900 rounded-xl overflow-hidden border border-gray-700 max-w-md">
              {(data.twitterImage || data.image) && <img src={data.twitterImage || data.image} alt="" className="w-full h-48 object-cover" onError={(e) => (e.currentTarget.style.display = "none")} />}
              <div className="p-3">
                <p className="text-sm font-bold text-white">{data.twitterTitle || data.title}</p>
                <p className="text-xs text-gray-400 mt-1 line-clamp-2">{data.twitterDescription || data.description}</p>
                <p className="text-xs text-gray-500 mt-1">{new URL(data.url).hostname}</p>
              </div>
            </div>
          </div>

          {/* Raw Tags */}
          <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-lg p-4">
            <h3 className="font-bold text-sm mb-2">Detected Tags</h3>
            <div className="space-y-1 text-xs">
              {Object.entries(data).filter(([k, v]) => k !== "error" && v).map(([key, value]) => (
                <div key={key} className="flex gap-2 font-mono">
                  <span className="text-purple-400 w-40 shrink-0">{key}</span>
                  <span className="text-white break-all">{value as string}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {data?.error && <p className="text-red-400 text-center">Could not fetch URL. Make sure it is accessible.</p>}
    </div>
  );
}
