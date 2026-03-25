"use client";
import { useState } from "react";

export default function CaseConverterPage() {
  const [text, setText] = useState("Hello World Example Text");
  const cases = [
    { name: "UPPERCASE", fn: (s:string) => s.toUpperCase() },
    { name: "lowercase", fn: (s:string) => s.toLowerCase() },
    { name: "Title Case", fn: (s:string) => s.replace(/\b\w/g, c => c.toUpperCase()) },
    { name: "camelCase", fn: (s:string) => s.toLowerCase().replace(/[^a-z0-9]+(.)/g, (_, c) => c.toUpperCase()) },
    { name: "PascalCase", fn: (s:string) => s.replace(/\b\w/g, c => c.toUpperCase()).replace(/\s+/g, "") },
    { name: "snake_case", fn: (s:string) => s.toLowerCase().replace(/\s+/g, "_") },
    { name: "kebab-case", fn: (s:string) => s.toLowerCase().replace(/\s+/g, "-") },
    { name: "CONSTANT_CASE", fn: (s:string) => s.toUpperCase().replace(/\s+/g, "_") },
    { name: "dot.case", fn: (s:string) => s.toLowerCase().replace(/\s+/g, ".") },
    { name: "Sentence case", fn: (s:string) => s.charAt(0).toUpperCase() + s.slice(1).toLowerCase() },
  ];

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <div className="max-w-3xl mx-auto px-4 py-16">
        <h1 className="text-4xl font-extrabold mb-2 text-center">Text Case Converter</h1>
        <p className="text-gray-400 text-center mb-8">Convert text between different cases. Click any to copy.</p>
        <input type="text" value={text} onChange={e=>setText(e.target.value)} placeholder="Type text here..."
          className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white text-lg mb-6" />
        <div className="space-y-2">
          {cases.map((c,i) => {
            const result = c.fn(text);
            return (
              <div key={i} className="flex items-center justify-between bg-gray-900 rounded-lg px-4 py-3 cursor-pointer hover:bg-gray-800" onClick={()=>navigator.clipboard.writeText(result)}>
                <div>
                  <span className="text-xs text-gray-400 mr-3">{c.name}</span>
                  <span className="font-mono text-sm">{result}</span>
                </div>
                <span className="text-xs text-purple-400">Copy</span>
              </div>
            );
          })}
        </div>
        <div className="mt-8 text-center text-gray-500 text-sm">
          <a href="/word-counter" className="text-purple-400 hover:underline">Word Counter</a>{" | "}
          <a href="/text-diff" className="text-purple-400 hover:underline">Text Diff</a>{" | "}
          <a href="/lorem" className="text-purple-400 hover:underline">Lorem Ipsum</a>{" | "}
          <a href="/" className="text-purple-400 hover:underline">All Tools</a>
        </div>
      </div>
    </div>
  );
}
