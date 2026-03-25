"use client";
import { useState } from "react";

const hashtagDB: Record<string, string[]> = {
  tech: ["#tech", "#technology", "#coding", "#programming", "#developer", "#webdev", "#javascript", "#python", "#AI", "#machinelearning", "#startup", "#SaaS", "#devtools", "#opensource", "#github"],
  crypto: ["#crypto", "#bitcoin", "#ethereum", "#solana", "#defi", "#web3", "#blockchain", "#nft", "#trading", "#altcoins", "#hodl", "#bullish", "#memecoin", "#airdrop", "#degen"],
  marketing: ["#marketing", "#digitalmarketing", "#socialmedia", "#contentmarketing", "#SEO", "#branding", "#growth", "#marketingtips", "#entrepreneur", "#smallbusiness", "#B2B", "#leadgeneration", "#copywriting", "#ads", "#funnel"],
  design: ["#design", "#uidesign", "#uxdesign", "#webdesign", "#graphicdesign", "#figma", "#dribbble", "#creative", "#illustration", "#typography", "#branding", "#logo", "#designinspiration", "#minimal", "#aesthetic"],
  fitness: ["#fitness", "#gym", "#workout", "#health", "#motivation", "#fitnessmotivation", "#bodybuilding", "#training", "#healthylifestyle", "#exercise", "#fitfam", "#gains", "#nutrition", "#wellness", "#strength"],
  food: ["#food", "#foodie", "#cooking", "#recipe", "#homemade", "#foodphotography", "#delicious", "#yummy", "#instafood", "#healthyfood", "#vegan", "#baking", "#chef", "#mealprep", "#foodlover"],
  travel: ["#travel", "#wanderlust", "#adventure", "#explore", "#travelgram", "#vacation", "#roadtrip", "#nature", "#photography", "#beautiful", "#sunset", "#beach", "#mountains", "#backpacking", "#travelblogger"],
  photography: ["#photography", "#photo", "#photooftheday", "#photographer", "#naturephotography", "#streetphotography", "#portrait", "#landscape", "#canon", "#sony", "#lightroom", "#photoshoot", "#camera", "#art", "#visualart"],
};

export default function HashtagGenerator() {
  const [topic, setTopic] = useState("");
  const [category, setCategory] = useState("tech");
  const [count, setCount] = useState(15);
  const [copied, setCopied] = useState(false);

  const getHashtags = (): string[] => {
    const base = hashtagDB[category] || hashtagDB.tech;
    const topicTags = topic.trim().split(/\s+/).filter(Boolean).map((w) => `#${w.toLowerCase().replace(/[^a-z0-9]/g, "")}`);
    const combined = [...new Set([...topicTags, ...base])];
    return combined.slice(0, count);
  };

  const hashtags = getHashtags();
  const output = hashtags.join(" ");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold mb-2">Hashtag Generator</h1>
        <p className="text-[var(--text-secondary)]">
          Generate relevant hashtags for Instagram, Twitter, TikTok, LinkedIn. 8 categories, custom topics. Copy and paste.
        </p>
      </div>

      <div className="max-w-lg mx-auto space-y-4">
        <input value={topic} onChange={(e) => setTopic(e.target.value)} placeholder="Enter your topic (e.g. react nextjs webdev)..." className="w-full bg-[var(--bg-secondary)] border border-[var(--border)] rounded px-4 py-3 text-white" />

        <div className="flex gap-2 flex-wrap">
          {Object.keys(hashtagDB).map((cat) => (
            <button key={cat} onClick={() => setCategory(cat)} className={`px-3 py-1.5 rounded text-xs capitalize ${category === cat ? "bg-purple-600 text-white" : "bg-[var(--bg-secondary)] text-gray-400"}`}>{cat}</button>
          ))}
        </div>

        <div>
          <label className="block text-xs text-gray-400 mb-1">Count: {count}</label>
          <input type="range" min={5} max={30} value={count} onChange={(e) => setCount(Number(e.target.value))} className="w-full accent-purple-500" />
        </div>

        <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-lg p-4">
          <div className="flex flex-wrap gap-2">
            {hashtags.map((tag) => (
              <span key={tag} className="bg-purple-600/20 text-purple-300 px-2 py-1 rounded text-sm">{tag}</span>
            ))}
          </div>
        </div>

        <div className="flex gap-2">
          <button onClick={() => { navigator.clipboard.writeText(output); setCopied(true); setTimeout(() => setCopied(false), 2000); }} className="flex-1 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2.5 rounded font-bold">{copied ? "Copied!" : "Copy All Hashtags"}</button>
        </div>

        <p className="text-xs text-gray-500 text-center">{hashtags.length} hashtags · {output.length} characters</p>
      </div>
    </div>
  );
}
