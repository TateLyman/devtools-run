"use client";
import { useState } from "react";

export default function JsonValidatorPage() {
  const [input, setInput] = useState("");
  const [result, setResult] = useState<{valid:boolean,error?:string,parsed?:any}|null>(null);

  function validate() {
    try {
      const parsed = JSON.parse(input);
      const keys = typeof parsed === "object" && parsed !== null ? Object.keys(parsed).length : 0;
      const isArray = Array.isArray(parsed);
      setResult({ valid: true, parsed: { type: isArray ? "Array" : typeof parsed, keys: isArray ? parsed.length + " items" : keys + " keys", size: new Blob([input]).size + " bytes" }});
    } catch (e: any) {
      const match = e.message.match(/position (\d+)/);
      setResult({ valid: false, error: e.message });
    }
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <div className="max-w-3xl mx-auto px-4 py-16">
        <h1 className="text-4xl font-extrabold mb-2 text-center">JSON Validator</h1>
        <p className="text-gray-400 text-center mb-8">Paste JSON to check if it's valid. Shows errors with position.</p>
        <textarea value={input} onChange={e => setInput(e.target.value)} placeholder='{"paste": "json here"}'
          className="w-full bg-gray-900 border border-gray-700 rounded-xl px-4 py-3 text-green-400 font-mono text-sm h-48 resize-none mb-4" />
        <button onClick={validate} className="w-full bg-purple-600 hover:bg-purple-700 py-3 rounded-xl font-bold mb-4">Validate</button>
        {result && (
          <div className={`rounded-xl p-6 ${result.valid ? "bg-green-900/30 border border-green-700" : "bg-red-900/30 border border-red-700"}`}>
            <div className="font-bold text-lg mb-2">{result.valid ? "Valid JSON" : "Invalid JSON"}</div>
            {result.valid && result.parsed && (
              <div className="text-sm text-gray-300 space-y-1">
                <div>Type: {result.parsed.type}</div>
                <div>{result.parsed.keys}</div>
                <div>Size: {result.parsed.size}</div>
              </div>
            )}
            {result.error && <div className="text-sm text-red-300 font-mono">{result.error}</div>}
          </div>
        )}
        <div className="mt-8 text-center text-gray-500 text-sm">
          <a href="/json" className="text-purple-400 hover:underline">JSON Formatter</a>{" | "}
          <a href="/json-to-ts" className="text-purple-400 hover:underline">JSON to TS</a>{" | "}
          <a href="/yaml-json" className="text-purple-400 hover:underline">YAML/JSON</a>{" | "}
          <a href="/base64" className="text-purple-400 hover:underline">Base64</a>{" | "}
          <a href="/curl-builder" className="text-purple-400 hover:underline">cURL Builder</a>
        </div>
      </div>
    </div>
  );
}
