"use client";
import { useState } from "react";

export default function WordCounterPage() {
  const [text, setText] = useState("");
  const words = text.trim() ? text.trim().split(/\s+/).length : 0;
  const chars = text.length;
  const charsNoSpace = text.replace(/\s/g, "").length;
  const sentences = text.trim() ? text.split(/[.!?]+/).filter(s => s.trim()).length : 0;
  const paragraphs = text.trim() ? text.split(/\n\n+/).filter(p => p.trim()).length : 0;
  const readTime = Math.max(1, Math.ceil(words / 200));

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <div className="max-w-3xl mx-auto px-4 py-16">
        <h1 className="text-4xl font-extrabold mb-2 text-center">Word Counter</h1>
        <p className="text-gray-400 text-center mb-8">Count words, characters, sentences, and reading time.</p>
        <div className="grid grid-cols-3 md:grid-cols-6 gap-3 mb-6">
          {[["Words",words],["Chars",chars],["No Spaces",charsNoSpace],["Sentences",sentences],["Paragraphs",paragraphs],["Read Time",readTime+"m"]].map(([l,v],i)=>(
            <div key={i} className="bg-gray-900 rounded-lg p-3 text-center">
              <div className="text-xl font-bold text-purple-400">{v}</div>
              <div className="text-xs text-gray-400">{l}</div>
            </div>
          ))}
        </div>
        <textarea value={text} onChange={e=>setText(e.target.value)} placeholder="Start typing or paste text here..."
          className="w-full bg-gray-900 border border-gray-700 rounded-xl px-6 py-4 text-white h-64 resize-none text-lg" />
        <div className="mt-8 text-center text-gray-500 text-sm">
          <a href="/text-count" className="text-purple-400 hover:underline">Text Tools</a>{" | "}
          <a href="/lorem" className="text-purple-400 hover:underline">Lorem Ipsum</a>{" | "}
          <a href="/markdown" className="text-purple-400 hover:underline">Markdown</a>{" | "}
          <a href="/diff" className="text-purple-400 hover:underline">Diff</a>{" | "}
          <a href="/json" className="text-purple-400 hover:underline">JSON</a>
        </div>
      </div>
    </div>
  );
}
