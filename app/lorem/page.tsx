"use client";

import { useState, useCallback } from "react";

import AdSlot from "../components/AdSlot";

const LOREM_WORDS = [
  "lorem", "ipsum", "dolor", "sit", "amet", "consectetur", "adipiscing", "elit",
  "sed", "do", "eiusmod", "tempor", "incididunt", "ut", "labore", "et", "dolore",
  "magna", "aliqua", "enim", "ad", "minim", "veniam", "quis", "nostrud",
  "exercitation", "ullamco", "laboris", "nisi", "aliquip", "ex", "ea", "commodo",
  "consequat", "duis", "aute", "irure", "in", "reprehenderit", "voluptate",
  "velit", "esse", "cillum", "fugiat", "nulla", "pariatur", "excepteur", "sint",
  "occaecat", "cupidatat", "non", "proident", "sunt", "culpa", "qui", "officia",
  "deserunt", "mollit", "anim", "id", "est", "laborum", "at", "vero", "eos",
  "accusamus", "iusto", "odio", "dignissimos", "ducimus", "blanditiis",
  "praesentium", "voluptatum", "deleniti", "atque", "corrupti", "quos",
  "dolores", "quas", "molestias", "recusandae", "itaque", "earum", "rerum",
  "hic", "tenetur", "sapiente", "delectus", "aut", "reiciendis", "voluptatibus",
  "maiores", "alias", "perferendis", "doloribus", "asperiores", "repellat",
  "temporibus", "quibusdam", "officiis", "debitis", "necessitatibus", "saepe",
  "eveniet", "voluptates", "repudiandae", "recusandae", "numquam", "eius",
  "modi", "tempora", "quaerat", "voluptatem", "quia", "consequuntur", "magni",
  "minima", "nostrum", "exercitationem", "ullam", "corporis", "suscipit",
  "laboriosam", "perspiciatis", "unde", "omnis", "iste", "natus", "error",
  "similique", "fugit", "harum", "quidem", "rerum", "facilis", "expedita",
  "distinctio", "nam", "libero", "tempore", "cum", "soluta", "nobis", "eligendi",
  "optio", "cumque", "nihil", "impedit", "quo", "minus", "placeat", "facere",
  "possimus", "assumenda", "repellendus",
];

const FIRST_SENTENCE =
  "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.";

type UnitType = "paragraphs" | "sentences" | "words";

function randomWord(): string {
  return LOREM_WORDS[Math.floor(Math.random() * LOREM_WORDS.length)];
}

function generateSentence(wordCount?: number): string {
  const count = wordCount ?? (8 + Math.floor(Math.random() * 12));
  const words: string[] = [];
  for (let i = 0; i < count; i++) {
    words.push(randomWord());
  }
  words[0] = words[0].charAt(0).toUpperCase() + words[0].slice(1);
  return words.join(" ") + ".";
}

function generateParagraph(): string {
  const sentenceCount = 4 + Math.floor(Math.random() * 4);
  const sentences: string[] = [];
  for (let i = 0; i < sentenceCount; i++) {
    sentences.push(generateSentence());
  }
  return sentences.join(" ");
}

export default function LoremIpsumPage() {
  const [count, setCount] = useState(3);
  const [unit, setUnit] = useState<UnitType>("paragraphs");
  const [startWithLorem, setStartWithLorem] = useState(true);
  const [output, setOutput] = useState("");

  const generate = useCallback(() => {
    let result = "";

    if (unit === "paragraphs") {
      const paragraphs: string[] = [];
      for (let i = 0; i < count; i++) {
        if (i === 0 && startWithLorem) {
          const extra = generateParagraph();
          paragraphs.push(FIRST_SENTENCE + " " + extra);
        } else {
          paragraphs.push(generateParagraph());
        }
      }
      result = paragraphs.join("\n\n");
    } else if (unit === "sentences") {
      const sentences: string[] = [];
      for (let i = 0; i < count; i++) {
        if (i === 0 && startWithLorem) {
          sentences.push(FIRST_SENTENCE);
        } else {
          sentences.push(generateSentence());
        }
      }
      result = sentences.join(" ");
    } else {
      const words: string[] = [];
      if (startWithLorem) {
        const loremWords = FIRST_SENTENCE.replace(".", "").split(" ");
        for (let i = 0; i < Math.min(count, loremWords.length); i++) {
          words.push(loremWords[i]);
        }
        for (let i = loremWords.length; i < count; i++) {
          words.push(randomWord());
        }
      } else {
        for (let i = 0; i < count; i++) {
          words.push(randomWord());
        }
      }
      result = words.join(" ") + ".";
    }

    setOutput(result);
  }, [count, unit, startWithLorem]);

  function copyOutput() {
    navigator.clipboard.writeText(output);
  }

  return (
    <>
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-1">Lorem Ipsum Generator</h1>
        <p className="text-[var(--text-secondary)] text-sm">
          Generate placeholder text for your designs and mockups. Runs entirely
          in your browser.
        </p>
      </div>

      <div className="space-y-4">
        <div className="flex flex-wrap items-end gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Count</label>
            <input
              type="number"
              min={1}
              max={100}
              value={count}
              onChange={(e) =>
                setCount(Math.max(1, Math.min(100, Number(e.target.value))))
              }
              className="w-24"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Unit</label>
            <select
              value={unit}
              onChange={(e) => setUnit(e.target.value as UnitType)}
              className="w-40"
            >
              <option value="paragraphs">Paragraphs</option>
              <option value="sentences">Sentences</option>
              <option value="words">Words</option>
            </select>
          </div>
          <label className="flex items-center gap-2 text-sm cursor-pointer pb-2">
            <input
              type="checkbox"
              checked={startWithLorem}
              onChange={(e) => setStartWithLorem(e.target.checked)}
              className="w-4 h-4 accent-[var(--accent)]"
            />
            Start with &ldquo;Lorem ipsum...&rdquo;
          </label>
          <button
            onClick={generate}
            className="px-4 py-2 rounded-lg bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white text-sm font-medium transition-colors"
          >
            Generate
          </button>
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-sm font-medium">Output</label>
            {output && (
              <button
                onClick={copyOutput}
                className="text-xs text-[var(--accent)] hover:underline"
              >
                Copy
              </button>
            )}
          </div>
          <pre className="min-h-[240px] whitespace-pre-wrap">{output}</pre>
        </div>
      </div>

      <AdSlot className="mt-8" />

      <section className="mt-10 text-sm text-[var(--text-secondary)] space-y-2">
        <h2 className="text-lg font-semibold text-white">
          About Lorem Ipsum
        </h2>
        <p>
          Lorem Ipsum is placeholder text commonly used in the printing and
          design industry. This generator creates random Latin-style text in
          paragraphs, sentences, or word counts for use in mockups and layouts.
        </p>
      </section>
    </>
  );
}
