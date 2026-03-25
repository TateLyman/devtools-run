"use client";
import { useState } from "react";

interface Issue { index: number; word: string; suggestion: string; type: "spelling" | "grammar" | "style" }

function checkGrammar(text: string): Issue[] {
  const issues: Issue[] = [];
  const words = text.split(/\s+/);

  // Common misspellings
  const misspellings: Record<string, string> = {
    "teh": "the", "recieve": "receive", "beleive": "believe", "occured": "occurred",
    "seperate": "separate", "definately": "definitely", "accomodate": "accommodate",
    "occurence": "occurrence", "neccessary": "necessary", "embarass": "embarrass",
    "goverment": "government", "enviroment": "environment", "independant": "independent",
    "untill": "until", "begining": "beginning", "writting": "writing",
    "acheive": "achieve", "arguement": "argument", "calender": "calendar",
    "collegue": "colleague", "commitee": "committee", "concious": "conscious",
    "dissapear": "disappear", "existance": "existence", "foriegn": "foreign",
    "grammer": "grammar", "harrass": "harass", "immediatly": "immediately",
    "knowlege": "knowledge", "libary": "library", "mispell": "misspell",
    "noticable": "noticeable", "occassion": "occasion", "persistant": "persistent",
    "posession": "possession", "privelege": "privilege", "pronounciation": "pronunciation",
    "recomend": "recommend", "refered": "referred", "relevent": "relevant",
    "rythm": "rhythm", "shedule": "schedule", "suprise": "surprise",
    "tommorow": "tomorrow", "truely": "truly", "wierd": "weird",
    "youre": "you're", "dont": "don't", "cant": "can't", "wont": "won't",
    "didnt": "didn't", "doesnt": "doesn't", "hasnt": "hasn't",
    "alot": "a lot", "their's": "theirs", "it's" : "its (possessive)",
  };

  // Style improvements
  const styleIssues: Record<string, string> = {
    "very": "Consider removing or using a stronger word",
    "really": "Consider removing or using a stronger word",
    "basically": "Often unnecessary — try removing it",
    "actually": "Often unnecessary — try removing it",
    "literally": "Check if you mean this literally",
    "stuff": "Consider a more specific word",
    "things": "Consider being more specific",
    "got": 'Consider "received", "obtained", or "became"',
  };

  words.forEach((word, i) => {
    const clean = word.toLowerCase().replace(/[^a-z']/g, "");
    if (misspellings[clean]) {
      issues.push({ index: i, word, suggestion: misspellings[clean], type: "spelling" });
    }
    if (styleIssues[clean]) {
      issues.push({ index: i, word, suggestion: styleIssues[clean], type: "style" });
    }
  });

  // Check for double words
  for (let i = 1; i < words.length; i++) {
    if (words[i].toLowerCase() === words[i - 1].toLowerCase() && words[i].length > 2) {
      issues.push({ index: i, word: words[i], suggestion: "Remove duplicate word", type: "grammar" });
    }
  }

  // Check sentence start capitalization
  const sentences = text.split(/[.!?]\s+/);
  sentences.forEach((s) => {
    const first = s.trim().charAt(0);
    if (first && first === first.toLowerCase() && /[a-z]/.test(first)) {
      issues.push({ index: 0, word: s.trim().split(/\s+/)[0], suggestion: "Capitalize first word of sentence", type: "grammar" });
    }
  });

  return issues;
}

export default function GrammarChecker() {
  const [text, setText] = useState("");
  const [issues, setIssues] = useState<Issue[]>([]);
  const [checked, setChecked] = useState(false);

  const check = () => {
    setIssues(checkGrammar(text));
    setChecked(true);
  };

  const wordCount = text.trim() ? text.trim().split(/\s+/).length : 0;
  const spellingCount = issues.filter((i) => i.type === "spelling").length;
  const grammarCount = issues.filter((i) => i.type === "grammar").length;
  const styleCount = issues.filter((i) => i.type === "style").length;

  const typeColor = (t: string) => t === "spelling" ? "text-red-400 bg-red-500/10" : t === "grammar" ? "text-yellow-400 bg-yellow-500/10" : "text-blue-400 bg-blue-500/10";

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold mb-2">Grammar Checker</h1>
        <p className="text-[var(--text-secondary)]">
          Check your text for spelling mistakes, grammar errors, and style improvements. Free online grammar checker.
        </p>
      </div>

      <div className="max-w-2xl mx-auto space-y-4">
        <textarea value={text} onChange={(e) => { setText(e.target.value); setChecked(false); }} placeholder="Paste your text here to check grammar and spelling..." className="w-full bg-[var(--bg-secondary)] border border-[var(--border)] rounded-xl px-4 py-3 text-white h-48 resize-none text-sm" />

        <div className="flex items-center justify-between">
          <span className="text-xs text-gray-400">{wordCount} words</span>
          <button onClick={check} disabled={!text.trim()} className="bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white px-6 py-2.5 rounded font-bold">Check Grammar</button>
        </div>

        {checked && (
          <>
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3 text-center">
                <p className="text-2xl font-bold text-red-400">{spellingCount}</p>
                <p className="text-xs text-gray-400">Spelling</p>
              </div>
              <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-3 text-center">
                <p className="text-2xl font-bold text-yellow-400">{grammarCount}</p>
                <p className="text-xs text-gray-400">Grammar</p>
              </div>
              <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-3 text-center">
                <p className="text-2xl font-bold text-blue-400">{styleCount}</p>
                <p className="text-xs text-gray-400">Style</p>
              </div>
            </div>

            {issues.length === 0 ? (
              <div className="text-center text-emerald-400 font-bold py-4">No issues found! Your text looks great.</div>
            ) : (
              <div className="space-y-2">
                {issues.map((issue, i) => (
                  <div key={i} className={`rounded-lg p-3 ${typeColor(issue.type)}`}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-bold capitalize">{issue.type}</span>
                      <span className="text-xs font-mono">"{issue.word}"</span>
                    </div>
                    <p className="text-sm">{issue.suggestion}</p>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
