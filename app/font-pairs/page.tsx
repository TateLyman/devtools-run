"use client";

const PAIRS = [
  { heading: "Inter", body: "Inter", style: "clean, modern", tags: ["SaaS", "Tech"] },
  { heading: "Playfair Display", body: "Source Sans Pro", style: "elegant, editorial", tags: ["Blog", "Magazine"] },
  { heading: "Montserrat", body: "Open Sans", style: "professional, versatile", tags: ["Business", "Corporate"] },
  { heading: "Poppins", body: "Roboto", style: "friendly, modern", tags: ["App", "Startup"] },
  { heading: "Space Grotesk", body: "Inter", style: "techy, geometric", tags: ["Dev tools", "Web3"] },
  { heading: "DM Serif Display", body: "DM Sans", style: "sophisticated, readable", tags: ["Blog", "Portfolio"] },
  { heading: "Bebas Neue", body: "Lato", style: "bold, impactful", tags: ["Landing page", "Marketing"] },
  { heading: "JetBrains Mono", body: "Inter", style: "developer-focused", tags: ["Code", "Documentation"] },
];

export default function FontPairsPage() {
  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <div className="max-w-3xl mx-auto px-4 py-16">
        <h1 className="text-4xl font-extrabold mb-2 text-center">Font Pair Suggestions</h1>
        <p className="text-gray-400 text-center mb-8">Curated heading + body font combinations for your projects.</p>
        <div className="space-y-4">
          {PAIRS.map((p, i) => (
            <div key={i} className="bg-gray-900 rounded-xl p-6">
              <div className="flex justify-between mb-3">
                <div className="flex gap-2">{p.tags.map((t,j)=><span key={j} className="text-xs bg-purple-600/20 text-purple-300 px-2 py-0.5 rounded">{t}</span>)}</div>
                <span className="text-xs text-gray-500">{p.style}</span>
              </div>
              <div className="mb-2">
                <div className="text-2xl font-bold" style={{fontFamily:p.heading+", sans-serif"}}>{p.heading}</div>
                <div className="text-sm text-gray-400 mt-1" style={{fontFamily:p.body+", sans-serif"}}>{p.body} — The quick brown fox jumps over the lazy dog. Pack my box with five dozen liquor jugs.</div>
              </div>
              <div className="text-xs text-gray-500 mt-2">
                Heading: <span className="text-purple-400">{p.heading}</span> · Body: <span className="text-purple-400">{p.body}</span>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-8 text-center text-gray-500 text-sm">
          <a href="/gradient" className="text-purple-400 hover:underline">Gradients</a>{" | "}
          <a href="/tailwind-colors" className="text-purple-400 hover:underline">Tailwind Colors</a>{" | "}
          <a href="/favicon" className="text-purple-400 hover:underline">Favicon</a>{" | "}
          <a href="/" className="text-purple-400 hover:underline">All Tools</a>
        </div>
      </div>
    </div>
  );
}
