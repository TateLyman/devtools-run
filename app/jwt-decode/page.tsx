"use client";
import { useState } from "react";

function decodeJwt(token: string): { header: unknown; payload: unknown; signature: string } | null {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;
    const decode = (s: string) => JSON.parse(atob(s.replace(/-/g, "+").replace(/_/g, "/")));
    return { header: decode(parts[0]), payload: decode(parts[1]), signature: parts[2] };
  } catch { return null; }
}

export default function JwtDecode() {
  const [token, setToken] = useState("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c");

  const decoded = decodeJwt(token);
  const payload = decoded?.payload as Record<string, unknown> | null;
  const exp = payload?.exp ? new Date((payload.exp as number) * 1000) : null;
  const iat = payload?.iat ? new Date((payload.iat as number) * 1000) : null;
  const expired = exp ? exp < new Date() : false;

  return (
    <div className="space-y-6">
      <section className="text-center"><h1 className="text-4xl font-bold mb-2">JWT Decoder</h1><p className="text-[var(--text-secondary)]">Decode JSON Web Tokens locally</p></section>
      <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-xl p-4">
        <textarea value={token} onChange={e => setToken(e.target.value)} rows={4} placeholder="Paste JWT token here..."
          className="w-full bg-[var(--bg-primary)] border border-[var(--border)] rounded-lg p-3 font-mono text-xs resize-none break-all" />
      </div>
      {token && !decoded && <div className="text-red-400 text-center">Invalid JWT token</div>}
      {decoded && (
        <div className="grid gap-4 md:grid-cols-2">
          <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-xl p-4">
            <h2 className="text-sm font-bold text-red-400 mb-2">Header</h2>
            <pre className="font-mono text-xs text-red-300 whitespace-pre-wrap">{JSON.stringify(decoded.header, null, 2)}</pre>
          </div>
          <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-xl p-4">
            <h2 className="text-sm font-bold text-purple-400 mb-2">Payload</h2>
            <pre className="font-mono text-xs text-purple-300 whitespace-pre-wrap">{JSON.stringify(decoded.payload, null, 2)}</pre>
            {exp && <div className={`mt-2 text-xs ${expired ? "text-red-400" : "text-emerald-400"}`}>{expired ? "EXPIRED" : "Valid"}: {exp.toLocaleString()}</div>}
            {iat && <div className="text-xs text-[var(--text-secondary)]">Issued: {iat.toLocaleString()}</div>}
          </div>
        </div>
      )}
      <div className="bg-blue-900/20 border border-blue-500/20 rounded-xl p-3 text-center text-sm text-blue-400">Decoded entirely in your browser. Nothing sent to any server.</div>
    </div>
  );
}
