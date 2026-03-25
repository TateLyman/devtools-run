"use client";
import { useState } from "react";

function decodeJWT(token: string): { header: any; payload: any; signature: string } | null {
  try {
    const parts = token.trim().split(".");
    if (parts.length !== 3) return null;

    const decodeBase64 = (str: string) => {
      const padded = str.replace(/-/g, "+").replace(/_/g, "/");
      return JSON.parse(atob(padded));
    };

    return {
      header: decodeBase64(parts[0]),
      payload: decodeBase64(parts[1]),
      signature: parts[2],
    };
  } catch {
    return null;
  }
}

function isExpired(payload: any): boolean {
  if (!payload.exp) return false;
  return Date.now() / 1000 > payload.exp;
}

function formatTimestamp(ts: number): string {
  return new Date(ts * 1000).toLocaleString();
}

const sampleJWT = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyLCJleHAiOjE5MTYyMzkwMjIsInJvbGUiOiJhZG1pbiJ9.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c";

export default function JWTDecoder() {
  const [token, setToken] = useState("");
  const [copied, setCopied] = useState(false);

  const decoded = token.trim() ? decodeJWT(token) : null;
  const expired = decoded?.payload ? isExpired(decoded.payload) : false;

  const handleCopy = () => {
    if (!decoded) return;
    navigator.clipboard.writeText(JSON.stringify(decoded.payload, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold mb-2">JWT Decoder</h1>
        <p className="text-[var(--text-secondary)]">
          Decode and inspect JSON Web Tokens. See header, payload, expiration, and claims. Free JWT decoder online.
        </p>
      </div>

      <div>
        <div className="flex items-center justify-between mb-1">
          <label className="text-sm font-medium">Paste JWT Token</label>
          <button onClick={() => setToken(sampleJWT)} className="text-xs text-purple-400 hover:text-purple-300">Load Example</button>
        </div>
        <textarea
          value={token}
          onChange={(e) => setToken(e.target.value)}
          placeholder="eyJhbGciOiJIUzI1NiIs..."
          className="w-full bg-[var(--bg-secondary)] border border-[var(--border)] rounded px-3 py-2 text-white h-24 resize-none font-mono text-xs break-all"
        />
      </div>

      {decoded ? (
        <div className="space-y-4">
          {expired && (
            <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3 text-red-400 text-sm font-bold">
              This token is EXPIRED (expired {formatTimestamp(decoded.payload.exp)})
            </div>
          )}

          <div className="grid gap-4 md:grid-cols-2">
            <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-lg p-4">
              <h3 className="text-sm font-bold text-red-400 mb-2">HEADER</h3>
              <pre className="text-sm font-mono text-white overflow-auto">{JSON.stringify(decoded.header, null, 2)}</pre>
            </div>

            <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-bold text-purple-400">PAYLOAD</h3>
                <button onClick={handleCopy} className="text-xs text-[var(--text-secondary)] hover:text-white">{copied ? "Copied!" : "Copy"}</button>
              </div>
              <pre className="text-sm font-mono text-white overflow-auto">{JSON.stringify(decoded.payload, null, 2)}</pre>
            </div>
          </div>

          <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-lg p-4">
            <h3 className="text-sm font-bold text-blue-400 mb-2">CLAIMS</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-sm">
              {decoded.payload.iss && <div><span className="text-gray-400">Issuer:</span> <span className="text-white">{decoded.payload.iss}</span></div>}
              {decoded.payload.sub && <div><span className="text-gray-400">Subject:</span> <span className="text-white">{decoded.payload.sub}</span></div>}
              {decoded.payload.aud && <div><span className="text-gray-400">Audience:</span> <span className="text-white">{decoded.payload.aud}</span></div>}
              {decoded.payload.iat && <div><span className="text-gray-400">Issued:</span> <span className="text-white">{formatTimestamp(decoded.payload.iat)}</span></div>}
              {decoded.payload.exp && <div><span className="text-gray-400">Expires:</span> <span className={expired ? "text-red-400" : "text-emerald-400"}>{formatTimestamp(decoded.payload.exp)}</span></div>}
              {decoded.payload.nbf && <div><span className="text-gray-400">Not Before:</span> <span className="text-white">{formatTimestamp(decoded.payload.nbf)}</span></div>}
              {decoded.payload.name && <div><span className="text-gray-400">Name:</span> <span className="text-white">{decoded.payload.name}</span></div>}
              {decoded.payload.email && <div><span className="text-gray-400">Email:</span> <span className="text-white">{decoded.payload.email}</span></div>}
              {decoded.payload.role && <div><span className="text-gray-400">Role:</span> <span className="text-white">{decoded.payload.role}</span></div>}
            </div>
          </div>

          <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-lg p-4">
            <h3 className="text-sm font-bold text-emerald-400 mb-2">SIGNATURE</h3>
            <code className="text-xs font-mono text-gray-400 break-all">{decoded.signature}</code>
            <p className="text-xs text-gray-500 mt-2">Algorithm: {decoded.header.alg} | Signature verification requires the secret key.</p>
          </div>
        </div>
      ) : token.trim() ? (
        <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3 text-red-400 text-sm">
          Invalid JWT format. A JWT should have 3 parts separated by dots.
        </div>
      ) : null}
    </div>
  );
}
