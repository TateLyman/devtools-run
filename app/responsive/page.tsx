"use client";
import { useState } from "react";

const SIZES = [
  { name: "iPhone SE", w: 375, h: 667 },
  { name: "iPhone 14", w: 390, h: 844 },
  { name: "iPad", w: 768, h: 1024 },
  { name: "iPad Pro", w: 1024, h: 1366 },
  { name: "Laptop", w: 1366, h: 768 },
  { name: "Desktop", w: 1920, h: 1080 },
];

export default function ResponsivePage() {
  const [url, setUrl] = useState("");
  const [size, setSize] = useState(SIZES[0]);
  const [loaded, setLoaded] = useState(false);

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <div className="max-w-5xl mx-auto px-4 py-16">
        <h1 className="text-4xl font-extrabold mb-2 text-center">Responsive Design Tester</h1>
        <p className="text-gray-400 text-center mb-8">Preview any URL at different screen sizes.</p>
        <div className="flex gap-2 mb-4">
          <input type="url" value={url} onChange={e=>setUrl(e.target.value)} placeholder="https://yoursite.com"
            className="flex-1 bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white" />
          <button onClick={()=>setLoaded(true)} className="bg-purple-600 hover:bg-purple-700 px-6 py-2 rounded-lg font-bold">Preview</button>
        </div>
        <div className="flex flex-wrap gap-2 mb-6">
          {SIZES.map((s,i)=>(
            <button key={i} onClick={()=>setSize(s)} className={`px-3 py-1 rounded text-xs font-bold ${size.name===s.name?"bg-purple-600":"bg-gray-800 hover:bg-gray-700"}`}>
              {s.name} ({s.w}x{s.h})
            </button>
          ))}
        </div>
        {loaded && url && (
          <div className="flex justify-center">
            <div className="bg-gray-800 rounded-xl p-2 inline-block" style={{maxWidth:"100%"}}>
              <div className="text-xs text-gray-400 text-center mb-1">{size.name} — {size.w}x{size.h}</div>
              <iframe src={url} width={Math.min(size.w, 800)} height={Math.min(size.h, 600)}
                className="bg-white rounded-lg" style={{maxWidth:"100%"}} />
            </div>
          </div>
        )}
        <div className="mt-8 text-center text-gray-500 text-sm">
          <a href="/screen-size" className="text-purple-400 hover:underline">Screen Size</a>{" | "}
          <a href="/meta-tags" className="text-purple-400 hover:underline">Meta Tags</a>{" | "}
          <a href="/seo-checklist" className="text-purple-400 hover:underline">SEO Checklist</a>{" | "}
          <a href="/" className="text-purple-400 hover:underline">All Tools</a>
        </div>
      </div>
    </div>
  );
}
