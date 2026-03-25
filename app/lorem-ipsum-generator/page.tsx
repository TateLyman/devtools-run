"use client";
import { useState } from "react";

const WORDS = "lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua enim ad minim veniam quis nostrud exercitation ullamco laboris nisi aliquip ex ea commodo consequat duis aute irure in reprehenderit voluptate velit esse cillum fugiat nulla pariatur excepteur sint occaecat cupidatat non proident sunt culpa qui officia deserunt mollit anim id est laborum".split(" ");

function generateWords(count: number): string {
  const result: string[] = [];
  for (let i = 0; i < count; i++) {
    result.push(WORDS[Math.floor(Math.random() * WORDS.length)]);
  }
  result[0] = result[0].charAt(0).toUpperCase() + result[0].slice(1);
  return result.join(" ");
}

function generateSentence(): string {
  const len = 8 + Math.floor(Math.random() * 12);
  return generateWords(len) + ".";
}

function generateParagraph(): string {
  const sentences = 3 + Math.floor(Math.random() * 5);
  return Array.from({ length: sentences }, generateSentence).join(" ");
}

type Mode = "paragraphs" | "sentences" | "words";

export default function LoremIpsumGenerator() {
  const [mode, setMode] = useState<Mode>("paragraphs");
  const [count, setCount] = useState(3);
  const [startWithLorem, setStartWithLorem] = useState(true);
  const [output, setOutput] = useState("");
  const [copied, setCopied] = useState(false);

  const generate = () => {
    let result = "";
    switch (mode) {
      case "paragraphs":
        result = Array.from({ length: count }, generateParagraph).join("\n\n");
        break;
      case "sentences":
        result = Array.from({ length: count }, generateSentence).join(" ");
        break;
      case "words":
        result = generateWords(count) + ".";
        break;
    }
    if (startWithLorem && result.length > 0) {
      result = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. " + result.slice(result.indexOf(" ", 30) + 1);
    }
    setOutput(result);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold mb-2">Lorem Ipsum Generator</h1>
        <p className="text-[var(--text-secondary)]">
          Generate placeholder text for your designs. Choose paragraphs, sentences, or words. Free lorem ipsum generator online.
        </p>
      </div>

      <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-lg p-4 flex flex-wrap gap-4 items-center">
        <div className="flex gap-1">
          {(["paragraphs", "sentences", "words"] as Mode[]).map((m) => (
            <button key={m} onClick={() => setMode(m)} className={`px-3 py-1.5 rounded text-sm capitalize ${mode === m ? "bg-purple-600 text-white" : "bg-[var(--bg-primary)] text-[var(--text-secondary)]"}`}>{m}</button>
          ))}
        </div>
        <input type="number" min={1} max={100} value={count} onChange={(e) => setCount(Math.max(1, Number(e.target.value)))} className="w-20 bg-[var(--bg-primary)] border border-[var(--border)] rounded px-3 py-1.5 text-white text-sm text-center" />
        <label className="flex items-center gap-2 text-sm cursor-pointer">
          <input type="checkbox" checked={startWithLorem} onChange={(e) => setStartWithLorem(e.target.checked)} className="accent-purple-500" />
          Start with "Lorem ipsum..."
        </label>
        <button onClick={generate} className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded font-bold text-sm ml-auto">Generate</button>
      </div>

      {output && (
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-[var(--text-secondary)]">{output.split(/\s+/).length} words · {output.length} chars</span>
            <button onClick={handleCopy} className="text-xs text-purple-400 hover:text-purple-300">{copied ? "Copied!" : "Copy"}</button>
          </div>
          <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-lg p-4 text-sm text-white whitespace-pre-wrap max-h-[500px] overflow-auto">
            {output}
          </div>
        </div>
      )}
    </div>
  );
}
