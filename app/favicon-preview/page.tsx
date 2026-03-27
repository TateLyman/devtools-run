"use client";
import { useState } from "react";
export default function FaviconPreview() {
  const [url, setUrl] = useState("");
  const [title, setTitle] = useState("My Website — Home");
  const [fileUrl, setFileUrl] = useState("");

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) { const r = new FileReader(); r.onload = () => setFileUrl(r.result as string); r.readAsDataURL(file); }
  };

  const faviconSrc = fileUrl || (url ? `https://www.google.com/s2/favicons?domain=${url}&sz=32` : "");

  return (
    <div className="space-y-6">
      <section className="text-center"><h1 className="text-4xl font-bold mb-2">Favicon Preview</h1><p className="text-[var(--text-secondary)]">See how your favicon looks in context</p></section>
      <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-xl p-4 space-y-3">
        <div className="flex gap-2"><input value={url} onChange={e => { setUrl(e.target.value); setFileUrl(""); }} placeholder="Enter domain (e.g., github.com)" className="flex-1 bg-[var(--bg-primary)] border border-[var(--border)] rounded-lg px-3 py-2 text-sm" /><span className="text-[var(--text-secondary)] py-2">or</span><label className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-bold cursor-pointer"><input type="file" accept="image/*" onChange={handleFile} className="hidden" />Upload</label></div>
        <input value={title} onChange={e => setTitle(e.target.value)} placeholder="Page title" className="w-full bg-[var(--bg-primary)] border border-[var(--border)] rounded-lg px-3 py-2 text-sm" />
      </div>
      {(faviconSrc || url) && (
        <div className="space-y-4">
          <div className="bg-gray-800 rounded-t-xl p-0">
            <div className="flex items-center bg-gray-700 rounded-t-xl px-2 pt-2">
              <div className="flex items-center bg-gray-800 rounded-t-lg px-3 py-1.5 max-w-[200px]">
                {faviconSrc && <img src={faviconSrc} alt="favicon" className="w-4 h-4 mr-2 shrink-0" />}
                <span className="text-xs text-gray-300 truncate">{title || "Untitled"}</span>
                <span className="text-gray-500 ml-2 text-xs">×</span>
              </div>
              <div className="flex items-center bg-gray-700/50 rounded-t-lg px-3 py-1.5 ml-1"><span className="text-xs text-gray-500">+</span></div>
            </div>
            <div className="bg-gray-800 px-3 py-2 flex items-center gap-2">
              <div className="flex gap-1"><div className="w-3 h-3 rounded-full bg-gray-600" /><div className="w-3 h-3 rounded-full bg-gray-600" /></div>
              <div className="flex-1 bg-gray-700 rounded-full px-3 py-1 flex items-center gap-2">{faviconSrc && <img src={faviconSrc} alt="" className="w-3 h-3" />}<span className="text-xs text-gray-400">{url || "example.com"}</span></div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-4">
            <div className="flex items-center gap-2 mb-1">{faviconSrc && <img src={faviconSrc} alt="" className="w-4 h-4" />}<span className="text-sm text-green-700">{url || "example.com"}</span></div>
            <div className="text-blue-700 text-lg hover:underline cursor-pointer">{title}</div>
            <div className="text-gray-600 text-sm">A description of the page content appears here in search results...</div>
          </div>
        </div>
      )}
    </div>
  );
}
