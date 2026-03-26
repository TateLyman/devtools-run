"use client";
import { useState } from "react";

const LOREM = "Lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua Ut enim ad minim veniam quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur Excepteur sint occaecat cupidatat non proident sunt in culpa qui officia deserunt mollit anim id est laborum Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium totam rem aperiam eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt".split(" ");

function generateWords(count: number): string {
  const words: string[] = [];
  for (let i = 0; i < count; i++) words.push(LOREM[i % LOREM.length]);
  return words.join(" ");
}

function generateSentences(count: number): string {
  const sentences: string[] = [];
  for (let i = 0; i < count; i++) {
    const len = 8 + Math.floor(Math.random() * 12);
    const start = (i * 7) % LOREM.length;
    const words = Array.from({ length: len }, (_, j) => LOREM[(start + j) % LOREM.length]);
    words[0] = words[0].charAt(0).toUpperCase() + words[0].slice(1);
    sentences.push(words.join(" ") + ".");
  }
  return sentences.join(" ");
}

function generateParagraphs(count: number): string {
  return Array.from({ length: count }, (_, i) => generateSentences(4 + Math.floor(Math.random() * 4))).join("\n\n");
}

export default function LoremGenerator() {
  const [type, setType] = useState<"paragraphs"|"sentences"|"words">("paragraphs");
  const [count, setCount] = useState(3);
  const [text, setText] = useState(() => generateParagraphs(3));
  const [startWithLorem, setStartWithLorem] = useState(true);

  const generate = () => {
    let result = type === "paragraphs" ? generateParagraphs(count) : type === "sentences" ? generateSentences(count) : generateWords(count);
    if (startWithLorem && !result.startsWith("Lorem")) result = "Lorem ipsum dolor sit amet. " + result;
    setText(result);
  };

  const copy = () => navigator.clipboard.writeText(text);
  const words = text.trim().split(/\s+/).length;

  return (
    <div className="space-y-6">
      <section className="text-center">
        <h1 className="text-4xl font-bold mb-2">Lorem Ipsum Generator</h1>
        <p className="text-[var(--text-secondary)]">Generate placeholder text for your designs</p>
      </section>

      <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-xl p-6">
        <div className="flex flex-wrap gap-4 items-end">
          <div>
            <label className="text-sm text-[var(--text-secondary)] block mb-1">Type</label>
            <select value={type} onChange={e => setType(e.target.value as typeof type)} className="bg-[var(--bg-primary)] border border-[var(--border)] rounded-lg px-3 py-2">
              <option value="paragraphs">Paragraphs</option>
              <option value="sentences">Sentences</option>
              <option value="words">Words</option>
            </select>
          </div>
          <div>
            <label className="text-sm text-[var(--text-secondary)] block mb-1">Count</label>
            <input type="number" value={count} onChange={e => setCount(Math.max(1, Number(e.target.value)))} min={1} max={100}
              className="w-20 bg-[var(--bg-primary)] border border-[var(--border)] rounded-lg px-3 py-2" />
          </div>
          <label className="text-sm"><input type="checkbox" checked={startWithLorem} onChange={e => setStartWithLorem(e.target.checked)} className="mr-1" />Start with "Lorem ipsum"</label>
          <button onClick={generate} className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-bold">Generate</button>
        </div>
      </div>

      <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-xl p-4">
        <div className="flex justify-between mb-2">
          <span className="text-xs text-[var(--text-secondary)]">{words} words</span>
          <button onClick={copy} className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-xs font-bold">Copy</button>
        </div>
        <div className="text-sm text-[var(--text-secondary)] whitespace-pre-wrap max-h-96 overflow-y-auto">{text}</div>
      </div>
    </div>
  );
}
