"use client";
import { useState } from "react";

const templates: Record<string, { label: string; template: string }> = {
  thread: { label: "Thread Hook", template: "I spent [time] studying [topic].\n\nHere are [number] lessons that changed everything:\n\n🧵👇" },
  hot_take: { label: "Hot Take", template: "Unpopular opinion: [controversial statement about your industry]\n\nHere's why 👇" },
  listicle: { label: "Listicle", template: "[Number] [things] every [role] should know:\n\n1.\n2.\n3.\n4.\n5.\n\nBookmark this. You'll need it." },
  story: { label: "Story", template: "6 months ago, I was [bad situation].\n\nToday, I [great outcome].\n\nHere's exactly what changed:" },
  tip: { label: "Quick Tip", template: "💡 [Tool/Framework] tip most people miss:\n\n[The tip in 1-2 sentences]\n\nThis saved me [time/money/effort]." },
  launch: { label: "Launch", template: "I just launched [product] 🚀\n\n[One-line description]\n\nFeatures:\n• [Feature 1]\n• [Feature 2]\n• [Feature 3]\n\n[Link]\n\nWould love your feedback!" },
  engagement: { label: "Engagement", template: "What's the one [tool/skill/habit] you wish you learned sooner?\n\nI'll start: [your answer]" },
  contrarian: { label: "Contrarian", template: "Stop [common advice everyone gives].\n\nInstead, try [your alternative approach].\n\nThe results will surprise you." },
};

export default function TweetGenerator() {
  const [selected, setSelected] = useState("thread");
  const [tweet, setTweet] = useState(templates.thread.template);
  const [copied, setCopied] = useState(false);

  const charCount = tweet.length;
  const isOver = charCount > 280;
  const threadCount = tweet.split("\n\n").filter(Boolean).length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold mb-2">Tweet & Thread Generator</h1>
        <p className="text-[var(--text-secondary)]">
          Generate viral tweet templates. Thread hooks, hot takes, listicles, launch posts, engagement bait. 8 proven formats.
        </p>
      </div>

      <div className="flex gap-2 flex-wrap">
        {Object.entries(templates).map(([k, v]) => (
          <button key={k} onClick={() => { setSelected(k); setTweet(v.template); }} className={`px-3 py-1.5 rounded text-xs ${selected === k ? "bg-purple-600 text-white" : "bg-[var(--bg-secondary)] text-[var(--text-secondary)] hover:text-white"}`}>{v.label}</button>
        ))}
      </div>

      <div className="max-w-lg mx-auto space-y-4">
        <textarea value={tweet} onChange={(e) => setTweet(e.target.value)} className="w-full bg-[var(--bg-secondary)] border border-[var(--border)] rounded-xl px-4 py-3 text-white h-48 resize-none text-sm" />

        <div className="flex items-center justify-between text-xs">
          <div className="flex gap-3 text-gray-400">
            <span className={isOver ? "text-red-400 font-bold" : ""}>{charCount}/280</span>
            {threadCount > 1 && <span>{threadCount} tweets in thread</span>}
          </div>
          <button onClick={() => { navigator.clipboard.writeText(tweet); setCopied(true); setTimeout(() => setCopied(false), 2000); }} className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-1.5 rounded font-bold text-xs">{copied ? "Copied!" : "Copy"}</button>
        </div>

        <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-xl p-4">
          <h3 className="font-bold text-sm mb-2">Preview</h3>
          <div className="bg-black rounded-lg p-4 border border-gray-800">
            <div className="flex gap-3">
              <div className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center text-white font-bold text-sm shrink-0">Y</div>
              <div className="flex-1">
                <div className="flex items-center gap-1">
                  <span className="font-bold text-white text-sm">You</span>
                  <span className="text-gray-500 text-xs">@you · now</span>
                </div>
                <p className="text-white text-sm mt-1 whitespace-pre-wrap">{tweet.split("\n\n")[0]}</p>
                {threadCount > 1 && <p className="text-blue-400 text-xs mt-2">Show this thread ({threadCount} tweets)</p>}
              </div>
            </div>
          </div>
        </div>

        <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-lg p-4 text-xs text-[var(--text-secondary)]">
          <h3 className="font-bold text-white mb-1">Tips for Viral Tweets</h3>
          <ul className="space-y-1">
            <li>• First line is everything — make it impossible to scroll past</li>
            <li>• Use numbers: "7 things" performs better than "some things"</li>
            <li>• End with a CTA: "Retweet if you agree" or "Bookmark this"</li>
            <li>• Post between 8-10am or 6-8pm in your target timezone</li>
            <li>• Engage with replies for 30 min after posting</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
