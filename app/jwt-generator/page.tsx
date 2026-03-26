"use client";
import { useState } from "react";

function base64url(str: string): string {
  return btoa(str).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

async function hmacSign(message: string, secret: string): Promise<string> {
  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey("raw", enc.encode(secret), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  const sig = await crypto.subtle.sign("HMAC", key, enc.encode(message));
  return btoa(String.fromCharCode(...new Uint8Array(sig))).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

export default function JwtGenerator() {
  const [sub, setSub] = useState("1234567890");
  const [name, setName] = useState("John Doe");
  const [iss, setIss] = useState("devtools");
  const [expHours, setExpHours] = useState("24");
  const [custom, setCustom] = useState('{"role": "admin"}');
  const [secret, setSecret] = useState("your-256-bit-secret");
  const [jwt, setJwt] = useState("");

  const generate = async () => {
    const header = { alg: "HS256", typ: "JWT" };
    const now = Math.floor(Date.now() / 1000);
    let customClaims = {};
    try { customClaims = JSON.parse(custom); } catch {}
    
    const payload = {
      sub, name, iss,
      iat: now,
      exp: now + parseInt(expHours) * 3600,
      ...customClaims,
    };

    const headerB64 = base64url(JSON.stringify(header));
    const payloadB64 = base64url(JSON.stringify(payload));
    const signature = await hmacSign(`${headerB64}.${payloadB64}`, secret);
    setJwt(`${headerB64}.${payloadB64}.${signature}`);
  };

  const copy = () => navigator.clipboard.writeText(jwt);

  return (
    <div className="space-y-6">
      <section className="text-center">
        <h1 className="text-4xl font-bold mb-2">JWT Generator</h1>
        <p className="text-[var(--text-secondary)]">Create JSON Web Tokens with custom claims</p>
      </section>

      <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-xl p-6 space-y-3">
        <div className="grid gap-3 md:grid-cols-2">
          <div>
            <label className="text-xs text-[var(--text-secondary)]">Subject (sub)</label>
            <input value={sub} onChange={e => setSub(e.target.value)} className="w-full bg-[var(--bg-primary)] border border-[var(--border)] rounded px-3 py-2 text-sm font-mono" />
          </div>
          <div>
            <label className="text-xs text-[var(--text-secondary)]">Name</label>
            <input value={name} onChange={e => setName(e.target.value)} className="w-full bg-[var(--bg-primary)] border border-[var(--border)] rounded px-3 py-2 text-sm font-mono" />
          </div>
          <div>
            <label className="text-xs text-[var(--text-secondary)]">Issuer (iss)</label>
            <input value={iss} onChange={e => setIss(e.target.value)} className="w-full bg-[var(--bg-primary)] border border-[var(--border)] rounded px-3 py-2 text-sm font-mono" />
          </div>
          <div>
            <label className="text-xs text-[var(--text-secondary)]">Expires in (hours)</label>
            <input value={expHours} onChange={e => setExpHours(e.target.value)} type="number" className="w-full bg-[var(--bg-primary)] border border-[var(--border)] rounded px-3 py-2 text-sm font-mono" />
          </div>
        </div>
        <div>
          <label className="text-xs text-[var(--text-secondary)]">Custom Claims (JSON)</label>
          <input value={custom} onChange={e => setCustom(e.target.value)} className="w-full bg-[var(--bg-primary)] border border-[var(--border)] rounded px-3 py-2 text-sm font-mono" />
        </div>
        <div>
          <label className="text-xs text-[var(--text-secondary)]">Secret Key</label>
          <input value={secret} onChange={e => setSecret(e.target.value)} className="w-full bg-[var(--bg-primary)] border border-[var(--border)] rounded px-3 py-2 text-sm font-mono" />
        </div>
      </div>

      <div className="flex justify-center">
        <button onClick={generate} className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-bold">Generate JWT</button>
      </div>

      {jwt && (
        <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-xl p-4">
          <div className="flex justify-between mb-2">
            <label className="text-sm font-bold">Generated Token</label>
            <button onClick={copy} className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-xs font-bold">Copy</button>
          </div>
          <div className="font-mono text-xs break-all">
            <span className="text-red-400">{jwt.split(".")[0]}</span>.<span className="text-purple-400">{jwt.split(".")[1]}</span>.<span className="text-blue-400">{jwt.split(".")[2]}</span>
          </div>
        </div>
      )}

      <div className="bg-blue-900/20 border border-blue-500/20 rounded-xl p-4 text-center text-sm text-blue-400">
        Tokens are generated in your browser using Web Crypto API. Nothing is sent to any server.
      </div>
    </div>
  );
}
