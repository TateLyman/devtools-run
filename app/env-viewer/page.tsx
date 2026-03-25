"use client";
import { useState } from "react";

export default function EnvViewerPage() {
  const [env, setEnv] = useState("DATABASE_URL=postgres://localhost:5432/mydb\nAPI_KEY=sk-abc123\nNODE_ENV=production\nPORT=3000\nSECRET=my-secret-key");
  const pairs = env.split("\n").filter(l=>l.trim()&&!l.startsWith("#")).map(l=>{const[k,...v]=l.split("=");return{key:k?.trim()||"",value:v.join("=").trim()};}).filter(p=>p.key);

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <div className="max-w-3xl mx-auto px-4 py-16">
        <h1 className="text-4xl font-extrabold mb-2 text-center">.env Viewer</h1>
        <p className="text-gray-400 text-center mb-8">Paste your .env file to view as a formatted table. Nothing is sent anywhere.</p>
        <textarea value={env} onChange={e=>setEnv(e.target.value)} placeholder="KEY=value" className="w-full bg-gray-900 border border-gray-700 rounded-xl px-4 py-3 text-green-400 font-mono text-sm h-32 resize-none mb-6" />
        {pairs.length>0 && (
          <div className="bg-gray-900 rounded-xl overflow-hidden">
            <table className="w-full text-sm">
              <thead><tr className="border-b border-gray-700"><th className="text-left py-2 px-4 text-purple-400">Key</th><th className="text-left py-2 px-4 text-gray-400">Value</th></tr></thead>
              <tbody>{pairs.map((p,i)=>(
                <tr key={i} className="border-b border-gray-800 hover:bg-gray-800 cursor-pointer" onClick={()=>navigator.clipboard.writeText(`${p.key}=${p.value}`)}>
                  <td className="py-2 px-4 font-mono text-purple-400">{p.key}</td>
                  <td className="py-2 px-4 font-mono text-gray-300">{p.value.length>40?p.value.slice(0,37)+"...":p.value}</td>
                </tr>
              ))}</tbody>
            </table>
          </div>
        )}
        <div className="mt-2 text-xs text-gray-500 text-center">{pairs.length} variables · Click any row to copy · All client-side</div>
        <div className="mt-8 text-center text-gray-500 text-sm">
          <a href="/json" className="text-purple-400 hover:underline">JSON</a>{" | "}
          <a href="/base64" className="text-purple-400 hover:underline">Base64</a>{" | "}
          <a href="/gitignore" className="text-purple-400 hover:underline">.gitignore</a>{" | "}
          <a href="/" className="text-purple-400 hover:underline">All Tools</a>
        </div>
      </div>
    </div>
  );
}
