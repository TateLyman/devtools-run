"use client";
import { useState } from "react";
export default function JWTInspector() {
  const [token, setToken] = useState("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c");
  const parts = token.split(".");
  let header = {}, payload: any = {}, valid = false;
  try { header = JSON.parse(atob(parts[0].replace(/-/g,"+").replace(/_/g,"/"))); payload = JSON.parse(atob(parts[1].replace(/-/g,"+").replace(/_/g,"/"))); valid = parts.length === 3; } catch {}
  const exp = payload.exp ? new Date(payload.exp * 1000) : null;
  const iat = payload.iat ? new Date(payload.iat * 1000) : null;
  const expired = exp ? exp < new Date() : false;
  return (
    <div className="space-y-6">
      <section className="text-center"><h1 className="text-4xl font-bold mb-2">JWT Inspector</h1><p className="text-[var(--text-secondary)]">Decode and inspect JSON Web Tokens</p></section>
      <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-xl p-4"><textarea value={token} onChange={e=>setToken(e.target.value)} rows={3} className="w-full bg-[var(--bg-primary)] border border-[var(--border)] rounded-lg p-3 font-mono text-xs resize-none break-all" placeholder="Paste JWT..." /></div>
      {valid && <div className="grid gap-4 md:grid-cols-3">
        <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4"><h2 className="text-sm font-bold text-red-400 mb-2">Header</h2><pre className="font-mono text-xs text-red-300 whitespace-pre-wrap">{JSON.stringify(header, null, 2)}</pre></div>
        <div className="bg-purple-500/10 border border-purple-500/30 rounded-xl p-4"><h2 className="text-sm font-bold text-purple-400 mb-2">Payload</h2><pre className="font-mono text-xs text-purple-300 whitespace-pre-wrap">{JSON.stringify(payload, null, 2)}</pre>{exp && <div className={`mt-2 text-xs ${expired?"text-red-400":"text-emerald-400"}`}>{expired?"EXPIRED":"Valid"}: {exp.toLocaleString()}</div>}{iat && <div className="text-xs text-[var(--text-secondary)]">Issued: {iat.toLocaleString()}</div>}</div>
        <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-4"><h2 className="text-sm font-bold text-blue-400 mb-2">Signature</h2><code className="font-mono text-xs text-blue-300 break-all">{parts[2]}</code></div>
      </div>}
      <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-xl p-4 text-center text-sm"><p>Need to generate test JWTs? <a href="/jwt-generator" className="text-blue-400">JWT Generator</a></p><p className="text-[var(--text-secondary)] text-xs mt-1">Try our full Solana toolkit: <a href="https://t.me/solscanitbot" className="text-blue-400">@solscanitbot</a></p></div>
    </div>
  );
}
