"use client";
import { useState } from "react";

export default function PrivacyPage() {
  const [input, setInput] = useState("");
  const [hashed, setHashed] = useState("");

  async function hashText() {
    const encoder = new TextEncoder();
    const data = encoder.encode(input);
    const hash = await crypto.subtle.digest("SHA-256", data);
    setHashed(Array.from(new Uint8Array(hash)).map(b => b.toString(16).padStart(2, "0")).join(""));
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <div className="max-w-3xl mx-auto px-4 py-16">
        <h1 className="text-4xl font-extrabold mb-2 text-center">Privacy & Security Tools</h1>
        <p className="text-gray-400 text-center mb-8">All processing happens in your browser. Nothing is sent to any server.</p>
        <div className="space-y-6">
          <div className="bg-gray-900 rounded-xl p-6">
            <h2 className="font-bold mb-3">SHA-256 Hash (Client-Side)</h2>
            <input type="text" value={input} onChange={e => setInput(e.target.value)} placeholder="Type text to hash..."
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white mb-3" />
            <button onClick={hashText} className="bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-lg text-sm font-bold mb-3">Hash</button>
            {hashed && <div className="font-mono text-xs text-green-400 break-all bg-gray-800 p-3 rounded-lg">{hashed}</div>}
          </div>
          <div className="bg-gray-900 rounded-xl p-6">
            <h2 className="font-bold mb-3">Related Tools</h2>
            <div className="grid grid-cols-2 gap-3">
              <a href="/password" className="bg-gray-800 rounded-lg p-3 hover:bg-gray-700"><div className="font-bold text-sm">Password Generator</div><div className="text-xs text-gray-400">Secure random passwords</div></a>
              <a href="/hash" className="bg-gray-800 rounded-lg p-3 hover:bg-gray-700"><div className="font-bold text-sm">Hash Generator</div><div className="text-xs text-gray-400">MD5, SHA-1, SHA-256</div></a>
              <a href="/base64" className="bg-gray-800 rounded-lg p-3 hover:bg-gray-700"><div className="font-bold text-sm">Base64 Encoder</div><div className="text-xs text-gray-400">Encode/decode data</div></a>
              <a href="/jwt" className="bg-gray-800 rounded-lg p-3 hover:bg-gray-700"><div className="font-bold text-sm">JWT Decoder</div><div className="text-xs text-gray-400">Inspect token claims</div></a>
              <a href="/ip" className="bg-gray-800 rounded-lg p-3 hover:bg-gray-700"><div className="font-bold text-sm">IP Lookup</div><div className="text-xs text-gray-400">Check your public IP</div></a>
              <a href="/useragent" className="bg-gray-800 rounded-lg p-3 hover:bg-gray-700"><div className="font-bold text-sm">User Agent</div><div className="text-xs text-gray-400">Browser fingerprint info</div></a>
            </div>
          </div>
        </div>
        <div className="mt-8 text-center text-gray-500 text-sm">
          <a href="/tools-for/devops-engineers" className="text-purple-400 hover:underline">DevOps Tools</a>{" | "}
          <a href="/regex" className="text-purple-400 hover:underline">Regex</a>{" | "}
          <a href="/" className="text-purple-400 hover:underline">All Tools</a>
        </div>
      </div>
    </div>
  );
}
