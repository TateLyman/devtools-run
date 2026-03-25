"use client";
import { useState } from "react";

export default function JWTCreatePage() {
  const [header, setHeader] = useState('{\n  "alg": "HS256",\n  "typ": "JWT"\n}');
  const [payload, setPayload] = useState('{\n  "sub": "1234567890",\n  "name": "Sol Scanner",\n  "iat": 1711234567\n}');
  const [secret, setSecret] = useState("your-256-bit-secret");

  function b64url(str: string): string {
    return btoa(str).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
  }

  let token = "";
  try {
    const h = b64url(header.trim());
    const p = b64url(payload.trim());
    // Note: real HMAC needs crypto, this is a visual demo
    const sig = b64url(`signature-placeholder-${secret.slice(0,8)}`);
    token = `${h}.${p}.${sig}`;
  } catch { token = "Invalid JSON in header or payload"; }

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <div className="max-w-3xl mx-auto px-4 py-16">
        <h1 className="text-4xl font-extrabold mb-2 text-center">JWT Creator</h1>
        <p className="text-gray-400 text-center mb-8">Build a JSON Web Token visually. Edit header, payload, and secret.</p>
        <div className="grid md:grid-cols-2 gap-4 mb-6">
          <div><label className="text-xs text-gray-400">Header</label><textarea value={header} onChange={e=>setHeader(e.target.value)} className="w-full bg-gray-900 border border-gray-700 rounded-xl px-4 py-3 text-red-400 font-mono text-sm h-28 resize-none" /></div>
          <div><label className="text-xs text-gray-400">Payload</label><textarea value={payload} onChange={e=>setPayload(e.target.value)} className="w-full bg-gray-900 border border-gray-700 rounded-xl px-4 py-3 text-purple-400 font-mono text-sm h-28 resize-none" /></div>
        </div>
        <div className="mb-6"><label className="text-xs text-gray-400">Secret</label><input type="text" value={secret} onChange={e=>setSecret(e.target.value)} className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-blue-400 font-mono text-sm" /></div>
        <div className="bg-gray-900 rounded-xl p-4 mb-4">
          <div className="flex justify-between mb-2"><span className="text-xs text-gray-400">Generated JWT</span><button onClick={()=>navigator.clipboard.writeText(token)} className="text-xs text-purple-400 hover:underline">Copy</button></div>
          <div className="font-mono text-xs break-all"><span className="text-red-400">{token.split(".")[0]}</span>.<span className="text-purple-400">{token.split(".")[1]}</span>.<span className="text-blue-400">{token.split(".")[2]}</span></div>
        </div>
        <p className="text-xs text-gray-500 text-center mb-6">Note: Signature is a placeholder. For real HMAC signing, use a server-side library.</p>
        <div className="text-center text-gray-500 text-sm">
          <a href="/jwt" className="text-purple-400 hover:underline">JWT Decoder</a>{" | "}
          <a href="/base64" className="text-purple-400 hover:underline">Base64</a>{" | "}
          <a href="/hash" className="text-purple-400 hover:underline">Hash Gen</a>{" | "}
          <a href="/" className="text-purple-400 hover:underline">All Tools</a>
        </div>
      </div>
    </div>
  );
}
