"use client";
import { useState } from "react";

function mdToHtml(md: string): string {
  return md
    .replace(/^### (.*$)/gim, '<h3>$1</h3>')
    .replace(/^## (.*$)/gim, '<h2>$1</h2>')
    .replace(/^# (.*$)/gim, '<h1>$1</h1>')
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/`(.*?)`/g, '<code style="background:#333;padding:2px 6px;border-radius:4px">$1</code>')
    .replace(/^\- (.*$)/gim, '<li>$1</li>')
    .replace(/\n/g, '<br>');
}

export default function MdEditorPage() {
  const [md, setMd] = useState("# Hello World\n\nThis is a **markdown** editor with *live preview*.\n\n## Features\n- Real-time preview\n- Export to HTML\n- `Code` highlighting\n\n### Try it out\nType in the left panel and see the result on the right.");

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <div className="max-w-5xl mx-auto px-4 py-16">
        <h1 className="text-4xl font-extrabold mb-2 text-center">Markdown Editor</h1>
        <p className="text-gray-400 text-center mb-8">Write markdown on the left, see live preview on the right.</p>
        <div className="grid md:grid-cols-2 gap-4 mb-6">
          <textarea value={md} onChange={e => setMd(e.target.value)}
            className="w-full bg-gray-900 border border-gray-700 rounded-xl px-4 py-3 text-green-400 font-mono text-sm h-96 resize-none" />
          <div className="bg-gray-900 border border-gray-700 rounded-xl px-6 py-4 h-96 overflow-y-auto prose prose-invert prose-sm"
            dangerouslySetInnerHTML={{ __html: mdToHtml(md) }} />
        </div>
        <div className="flex gap-2 justify-center">
          <button onClick={() => navigator.clipboard.writeText(md)}
            className="bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded-lg text-sm font-bold">Copy Markdown</button>
          <button onClick={() => navigator.clipboard.writeText(mdToHtml(md))}
            className="bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-lg text-sm font-bold">Copy HTML</button>
        </div>
        <div className="mt-8 text-center text-gray-500 text-sm">
          <a href="/markdown" className="text-purple-400 hover:underline">Markdown Preview</a>{" | "}
          <a href="/word-counter" className="text-purple-400 hover:underline">Word Counter</a>{" | "}
          <a href="/diff" className="text-purple-400 hover:underline">Diff</a>{" | "}
          <a href="/json" className="text-purple-400 hover:underline">JSON</a>{" | "}
          <a href="/html-encode" className="text-purple-400 hover:underline">HTML Encode</a>
        </div>
      </div>
    </div>
  );
}
