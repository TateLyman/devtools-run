"use client";
import { useState } from "react";

export default function AsciiPage() {
  const [text, setText] = useState("HELLO");
  const chars = "█▓▒░ ";

  function toAscii(t: string): string {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    if (!ctx) return "";
    canvas.width = t.length * 10;
    canvas.height = 16;
    ctx.font = "bold 14px monospace";
    ctx.fillStyle = "white";
    ctx.fillText(t.toUpperCase(), 0, 13);
    const data = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
    let result = "";
    for (let y = 0; y < canvas.height; y += 2) {
      for (let x = 0; x < canvas.width; x++) {
        const i = (y * canvas.width + x) * 4;
        const brightness = (data[i] + data[i+1] + data[i+2]) / 3;
        result += brightness > 128 ? "█" : brightness > 64 ? "▓" : brightness > 32 ? "░" : " ";
      }
      result += "\n";
    }
    return result;
  }

  const [output, setOutput] = useState("");

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <div className="max-w-3xl mx-auto px-4 py-16">
        <h1 className="text-4xl font-extrabold mb-2 text-center">ASCII Art Generator</h1>
        <p className="text-gray-400 text-center mb-8">Turn text into ASCII art. Copy and paste anywhere.</p>
        <div className="flex gap-2 mb-6">
          <input type="text" value={text} onChange={e => setText(e.target.value)} maxLength={20}
            className="flex-1 bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white text-xl font-bold" />
          <button onClick={() => setOutput(toAscii(text))} className="bg-purple-600 hover:bg-purple-700 px-6 py-3 rounded-lg font-bold">Generate</button>
        </div>
        {output && <pre className="bg-gray-900 rounded-xl p-6 text-green-400 font-mono text-xs overflow-x-auto whitespace-pre mb-4">{output}</pre>}
        <div className="text-center text-gray-500 text-sm mt-8">
          <a href="/meme" className="text-purple-400 hover:underline">Meme Generator</a>{" | "}
          <a href="/emoji" className="text-purple-400 hover:underline">Emoji Picker</a>{" | "}
          <a href="/qr" className="text-purple-400 hover:underline">QR Code</a>{" | "}
          <a href="/" className="text-purple-400 hover:underline">All Tools</a>
        </div>
      </div>
    </div>
  );
}
