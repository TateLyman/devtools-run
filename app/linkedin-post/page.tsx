"use client";
import { useState } from "react";

const templates: Record<string, { label: string; template: string }> = {
  story: { label: "Personal Story", template: "I got rejected from [company] 3 years ago.\n\nBest thing that ever happened to me.\n\nHere's why:\n\n[3-5 bullet points about what you learned]\n\nThe lesson? [One powerful takeaway]\n\nAgree? ♻️ Repost to share with your network" },
  lessons: { label: "Lessons Learned", template: "After [X years] in [industry], here are [N] things I wish I knew on day 1:\n\n1. [Lesson]\n2. [Lesson]\n3. [Lesson]\n4. [Lesson]\n5. [Lesson]\n\nWhich one resonates most? 👇" },
  hot_take: { label: "Hot Take", template: "[Common industry practice] is broken.\n\nHere's what nobody talks about:\n\n[Your contrarian take in 3-4 sentences]\n\nThe companies winning in 2026 are doing [your alternative] instead.\n\nThoughts?" },
  hiring: { label: "Hiring Post", template: "We're hiring!\n\n🔍 Role: [Title]\n📍 Location: [Remote/City]\n💰 Salary: [Range]\n\nWhat you'll do:\n• [Responsibility 1]\n• [Responsibility 2]\n• [Responsibility 3]\n\nWhat we look for:\n• [Quality 1]\n• [Quality 2]\n\nDM me or apply here: [link]\n\n♻️ Even if this isn't for you, someone in your network might need this" },
  achievement: { label: "Achievement", template: "Proud moment 🎉\n\n[What you achieved]\n\nThe numbers:\n📊 [Metric 1]\n📈 [Metric 2]\n🎯 [Metric 3]\n\nBut here's what really mattered:\n[The human/personal side of the achievement]\n\nGrateful for [people/opportunities that helped].\n\nWhat's your recent win? Share below 👇" },
  framework: { label: "Framework", template: "The [Name] Framework for [Outcome]:\n\nStep 1: [Action]\n→ [Why it works]\n\nStep 2: [Action]\n→ [Why it works]\n\nStep 3: [Action]\n→ [Why it works]\n\nI've used this with [N] clients and it works every time.\n\n💾 Save this for later." },
};

export default function LinkedInPost() {
  const [selected, setSelected] = useState("story");
  const [post, setPost] = useState(templates.story.template);
  const [copied, setCopied] = useState(false);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold mb-2">LinkedIn Post Generator</h1>
        <p className="text-[var(--text-secondary)]">
          Generate engaging LinkedIn posts. 6 proven templates: stories, lessons, hot takes, hiring, achievements, frameworks.
        </p>
      </div>

      <div className="flex gap-2 flex-wrap">
        {Object.entries(templates).map(([k, v]) => (
          <button key={k} onClick={() => { setSelected(k); setPost(v.template); }} className={`px-3 py-1.5 rounded text-xs ${selected === k ? "bg-purple-600 text-white" : "bg-[var(--bg-secondary)] text-[var(--text-secondary)] hover:text-white"}`}>{v.label}</button>
        ))}
      </div>

      <div className="max-w-lg mx-auto space-y-4">
        <textarea value={post} onChange={(e) => setPost(e.target.value)} className="w-full bg-[var(--bg-secondary)] border border-[var(--border)] rounded-xl px-4 py-3 text-white h-64 resize-none text-sm" />

        <div className="flex items-center justify-between text-xs">
          <span className={`${post.length > 3000 ? "text-red-400" : "text-gray-400"}`}>{post.length}/3,000</span>
          <button onClick={() => { navigator.clipboard.writeText(post); setCopied(true); setTimeout(() => setCopied(false), 2000); }} className="bg-[#0077B5] hover:bg-[#006699] text-white px-4 py-1.5 rounded font-bold text-xs">{copied ? "Copied!" : "Copy Post"}</button>
        </div>

        <div className="bg-white rounded-lg p-4 text-black">
          <div className="flex gap-2 mb-2">
            <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">Y</div>
            <div>
              <p className="font-bold text-sm">Your Name</p>
              <p className="text-xs text-gray-500">Your Title | Company</p>
              <p className="text-xs text-gray-400">Just now · 🌐</p>
            </div>
          </div>
          <p className="text-sm whitespace-pre-wrap leading-relaxed">{post.slice(0, 500)}{post.length > 500 ? "...see more" : ""}</p>
        </div>
      </div>
    </div>
  );
}
