"use client";

const APIS = [
  { name: "Random Data", base: "/api/random", endpoints: [
    { method: "GET", path: "?type=quote", desc: "Random developer quote" },
    { method: "GET", path: "?type=fact", desc: "Random tech fact" },
    { method: "GET", path: "?type=color", desc: "Random color (hex + name)" },
    { method: "GET", path: "?type=uuid", desc: "Random UUID v4" },
    { method: "GET", path: "?type=number&min=1&max=100", desc: "Random number in range" },
  ]},
  { name: "Placeholder Image", base: "/api/placeholder", endpoints: [
    { method: "GET", path: "?w=800&h=400", desc: "SVG placeholder image" },
    { method: "GET", path: "?w=400&h=300&bg=333&fg=aaa&text=Hello", desc: "Custom colors + text" },
  ]},
  { name: "Password Generator", base: "/api/password", endpoints: [
    { method: "GET", path: "?length=32", desc: "Random secure password" },
    { method: "GET", path: "?length=16&symbols=false", desc: "No special characters" },
  ]},
  { name: "Uptime Check", base: "/api/uptime", endpoints: [
    { method: "GET", path: "?url=google.com", desc: "Check if site is up + latency" },
  ]},
  { name: "Token Scanner", base: "/api/scan", endpoints: [
    { method: "GET", path: "?mint=TOKEN_ADDRESS", desc: "Safety score 0-100 (free: 10/min)" },
    { method: "GET", path: "?mint=TOKEN&key=API_KEY", desc: "Paid: 1000/day" },
  ]},
  { name: "URL Shortener", base: "/api/shorten", endpoints: [
    { method: "POST", path: "", desc: "Create short link. Body: {url}" },
  ]},
];

export default function ApiDocsPage() {
  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <div className="max-w-4xl mx-auto px-4 py-16">
        <h1 className="text-4xl font-extrabold mb-2 text-center">API Documentation</h1>
        <p className="text-gray-400 text-center mb-8">Free APIs. No auth required. CORS enabled. Use from any frontend.</p>
        <div className="space-y-8">
          {APIS.map((api, i) => (
            <div key={i} className="bg-gray-900 rounded-xl p-6">
              <h2 className="text-xl font-bold mb-1 text-purple-400">{api.name} API</h2>
              <div className="text-xs text-gray-400 mb-4 font-mono">Base: devtools-site-delta.vercel.app{api.base}</div>
              <div className="space-y-2">
                {api.endpoints.map((ep, j) => (
                  <div key={j} className="flex items-start gap-3 bg-gray-800 rounded-lg p-3">
                    <span className={`text-xs font-bold px-2 py-0.5 rounded ${ep.method === "GET" ? "bg-green-600/20 text-green-400" : "bg-blue-600/20 text-blue-400"}`}>{ep.method}</span>
                    <div className="flex-1">
                      <code className="text-sm text-green-400 font-mono">{api.base}{ep.path}</code>
                      <div className="text-xs text-gray-400 mt-1">{ep.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
        <div className="bg-gray-900 rounded-xl p-6 mt-8 text-center">
          <h2 className="font-bold mb-2">Need Higher Limits?</h2>
          <p className="text-gray-400 text-sm mb-4">Get a paid API key for 1,000+ scans/day.</p>
          <a href="/api-access" className="inline-block bg-purple-600 hover:bg-purple-700 py-2 px-6 rounded-lg font-bold">Get API Key (0.08 SOL)</a>
        </div>
        <div className="mt-8 text-center text-gray-500 text-sm">
          <a href="/store" className="text-purple-400 hover:underline">Store</a>{" | "}
          <a href="/resources" className="text-purple-400 hover:underline">Resources</a>{" | "}
          <a href="/" className="text-purple-400 hover:underline">All Tools</a>
        </div>
      </div>
    </div>
  );
}
