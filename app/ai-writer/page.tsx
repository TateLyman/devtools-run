"use client";
import { useState } from "react";
import type { Metadata } from "next";

const templates: Record<string, { label: string; prompt: string }> = {
  email: { label: "Professional Email", prompt: "Write a professional email about:" },
  cover: { label: "Cover Letter", prompt: "Write a cover letter for:" },
  linkedin: { label: "LinkedIn Post", prompt: "Write a LinkedIn post about:" },
  tweet: { label: "Tweet Thread", prompt: "Write a tweet thread about:" },
  product: { label: "Product Description", prompt: "Write a product description for:" },
  blog: { label: "Blog Outline", prompt: "Write a blog post outline about:" },
  bio: { label: "Professional Bio", prompt: "Write a professional bio for:" },
  apology: { label: "Apology Email", prompt: "Write a sincere apology email about:" },
  pitch: { label: "Elevator Pitch", prompt: "Write a 30-second elevator pitch for:" },
  cold: { label: "Cold Outreach", prompt: "Write a cold outreach message for:" },
  review: { label: "Product Review", prompt: "Write a product review for:" },
  resignation: { label: "Resignation Letter", prompt: "Write a resignation letter for:" },
};

function generateContent(template: string, topic: string, tone: string): string {
  const t = templates[template];
  if (!t || !topic.trim()) return "";

  const toneGuide: Record<string, string> = {
    professional: "formal, polished, and business-appropriate",
    casual: "friendly, conversational, and approachable",
    persuasive: "compelling, action-oriented, and convincing",
    humorous: "witty, light-hearted, and entertaining",
  };

  const toneDesc = toneGuide[tone] || toneGuide.professional;

  const outputs: Record<string, (t: string) => string> = {
    email: (t) =>
      `Subject: ${t}\n\nDear [Recipient],\n\nI hope this message finds you well. I'm reaching out regarding ${t.toLowerCase()}.\n\n[Your key points about ${t.toLowerCase()} go here. Be specific, concise, and action-oriented.]\n\nI'd appreciate the opportunity to discuss this further at your convenience. Please let me know a time that works for you.\n\nBest regards,\n[Your Name]\n[Your Title]\n[Your Contact Info]`,
    cover: (t) =>
      `Dear Hiring Manager,\n\nI am writing to express my strong interest in the ${t} position. With my background in [relevant experience], I am confident I can make a meaningful contribution to your team.\n\nKey qualifications:\n• [Relevant skill/achievement #1]\n• [Relevant skill/achievement #2]\n• [Relevant skill/achievement #3]\n\nIn my previous role at [Company], I [specific achievement that relates to ${t.toLowerCase()}]. This experience has prepared me to [value you'd bring].\n\nI am excited about the opportunity to bring my skills to your organization and would welcome the chance to discuss how I can contribute to your team's success.\n\nSincerely,\n[Your Name]`,
    linkedin: (t) =>
      `🔥 ${t}\n\nHere's something most people don't talk about:\n\n[Your unique insight about ${t.toLowerCase()}]\n\n3 lessons I've learned:\n\n1️⃣ [First lesson]\n2️⃣ [Second lesson]\n3️⃣ [Third lesson]\n\nThe key takeaway? [Summarize your main point in one powerful sentence.]\n\n💡 What's your experience with ${t.toLowerCase()}? Drop your thoughts below.\n\n#${t.replace(/\s+/g, "")} #Leadership #Growth`,
    tweet: (t) =>
      `🧵 Thread: ${t}\n\n1/ Let's talk about ${t.toLowerCase()}. This is something that changed my perspective completely. Here's what I learned:\n\n2/ First, [key insight #1]. Most people miss this because [reason].\n\n3/ Second, [key insight #2]. The data shows [supporting evidence].\n\n4/ Third, [key insight #3]. This is the game-changer.\n\n5/ The bottom line: [summary of main argument]\n\n6/ If you found this useful:\n• Retweet the first tweet\n• Follow me for more\n• Drop a 🔥 below\n\n/end`,
    product: (t) =>
      `# ${t}\n\n**Transform the way you [key benefit].** ${t} is designed for [target audience] who want [desired outcome].\n\n## Key Features\n✅ [Feature 1] — [Benefit explanation]\n✅ [Feature 2] — [Benefit explanation]\n✅ [Feature 3] — [Benefit explanation]\n\n## Why Choose ${t}?\nUnlike [competitor/alternative], ${t} offers [unique value proposition]. Join [number]+ satisfied customers who've already made the switch.\n\n## What Customers Say\n⭐⭐⭐⭐⭐ "[Testimonial quote]" — [Customer Name]\n\n**[Call to Action] →** [Link/Button Text]\n\n💰 Starting at $[price] | 30-day money-back guarantee`,
    blog: (t) =>
      `# ${t}: The Complete Guide [${new Date().getFullYear()}]\n\n## Introduction\n- Hook: [Surprising statistic or question about ${t.toLowerCase()}]\n- Context: Why this matters now\n- Promise: What the reader will learn\n\n## Section 1: [Foundation/Background]\n- Key concept #1\n- Key concept #2\n- Supporting data/examples\n\n## Section 2: [The Core Strategy/Method]\n- Step-by-step breakdown\n- Real-world examples\n- Common mistakes to avoid\n\n## Section 3: [Advanced Tips]\n- Pro tip #1\n- Pro tip #2\n- Expert insights\n\n## Section 4: [Tools & Resources]\n- Recommended tools\n- Further reading\n- Templates/downloads\n\n## Conclusion\n- Recap key takeaways\n- Call to action\n- Next steps for the reader\n\n**SEO Notes:**\n- Target keyword: "${t.toLowerCase()}"\n- Word count target: 2,000-3,000\n- Include 3-5 internal links`,
    bio: (t) =>
      `${t} is a [role/title] with [X] years of experience in [industry/field]. Specializing in [key expertise areas], they have [notable achievement or credential].\n\nCurrently [current role/project], ${t} is passionate about [area of focus]. Their work has been featured in [publications/platforms], and they've helped [clients/companies] achieve [measurable results].\n\nWhen not [professional activity], ${t} enjoys [personal interests]. Connect with them on [platform] or visit [website].\n\n---\nShort version (50 words):\n${t} is a [role] specializing in [expertise]. With [X]+ years in [field], they help [target audience] achieve [outcome]. Featured in [publications]. [Call to action].`,
    apology: (t) =>
      `Subject: My Sincere Apologies — ${t}\n\nDear [Recipient],\n\nI want to sincerely apologize for ${t.toLowerCase()}. I understand this has caused [specific impact], and I take full responsibility.\n\nWhat happened:\n[Brief, honest explanation without making excuses]\n\nWhat I'm doing to fix it:\n• [Immediate action #1]\n• [Immediate action #2]\n• [Long-term prevention measure]\n\nI value our [relationship/partnership] and am committed to ensuring this doesn't happen again. I'd welcome the opportunity to discuss this further and address any concerns you may have.\n\nPlease know that [reaffirm commitment/value you place on the relationship].\n\nSincerely,\n[Your Name]`,
    pitch: (t) =>
      `[Opening hook — 1 sentence that grabs attention]\n\nWe're building ${t} — [one-line description of what it does].\n\n**The Problem:** [Target audience] struggles with [specific pain point]. Currently, they [workaround/status quo], which costs them [time/money/opportunity].\n\n**Our Solution:** ${t} [how it solves the problem] in [timeframe/effort]. Unlike [competitors], we [key differentiator].\n\n**Traction:** [Metrics — users, revenue, growth rate, partnerships]\n\n**The Ask:** We're looking for [what you need — funding, partnership, customers]. [Specific next step].\n\n[Closing — memorable line that sticks]`,
    cold: (t) =>
      `Subject: Quick question about ${t}\n\nHi [Name],\n\nI noticed [specific observation about their company/work — shows you did research].\n\nI'm reaching out because [reason this is relevant to them, not you].\n\n[Company/Product] helps [target companies] with ${t.toLowerCase()} by [specific method/approach]. Recently, we helped [similar company] achieve [measurable result].\n\nWould you be open to a 15-minute call this week to see if this could help [their company]?\n\nNo worries if the timing isn't right — happy to share some [free resource] either way.\n\nBest,\n[Your Name]\n[One-line credibility statement]`,
    review: (t) =>
      `## ${t} Review — Honest Take After [Timeframe] of Use\n\n⭐⭐⭐⭐☆ (4/5)\n\n**TL;DR:** ${t} excels at [main strength] but falls short on [main weakness]. Best for [ideal user], skip it if [not ideal for].\n\n### What I Liked\n✅ [Pro #1 — specific detail]\n✅ [Pro #2 — specific detail]\n✅ [Pro #3 — specific detail]\n\n### What Could Be Better\n❌ [Con #1 — specific detail]\n❌ [Con #2 — specific detail]\n\n### Who Is This For?\nPerfect for: [description of ideal user]\nNot for: [description of who should skip]\n\n### Verdict\n${t} is [overall assessment]. At [price point], it's [value judgment]. If you need [primary use case], this is [recommendation].\n\n**Rating: [X]/10**`,
    resignation: (t) =>
      `Dear [Manager's Name],\n\nI am writing to formally notify you of my resignation from my position as [Your Title] at [Company], effective [Date — typically 2 weeks from now].\n\nReason: ${t}\n\nI am grateful for the opportunities I've had during my time here, including [specific positive experience]. Working with [team/colleagues] has been [genuine compliment].\n\nTo ensure a smooth transition, I am prepared to:\n• Complete [current project/task]\n• Document my processes and responsibilities\n• Train my replacement during the notice period\n\nPlease let me know how I can make this transition as seamless as possible.\n\nThank you for your understanding and support.\n\nSincerely,\n[Your Name]\n[Date]`,
  };

  const generator = outputs[template];
  return generator ? generator(topic) : "";
}

export default function AIWriter() {
  const [template, setTemplate] = useState("email");
  const [topic, setTopic] = useState("");
  const [tone, setTone] = useState("professional");
  const [output, setOutput] = useState("");
  const [copied, setCopied] = useState(false);

  const handleGenerate = () => {
    const result = generateContent(template, topic, tone);
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
        <h1 className="text-2xl font-bold mb-2">AI Writing Assistant</h1>
        <p className="text-[var(--text-secondary)]">
          Generate professional emails, cover letters, LinkedIn posts, tweets, and more. Free templates with customizable tone.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Template</label>
            <select
              value={template}
              onChange={(e) => setTemplate(e.target.value)}
              className="w-full bg-[var(--bg-secondary)] border border-[var(--border)] rounded px-3 py-2 text-white"
            >
              {Object.entries(templates).map(([k, v]) => (
                <option key={k} value={k}>
                  {v.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              {templates[template]?.prompt || "Topic"}
            </label>
            <textarea
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="Enter your topic, subject, or details..."
              className="w-full bg-[var(--bg-secondary)] border border-[var(--border)] rounded px-3 py-2 text-white h-32 resize-none font-mono text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Tone</label>
            <div className="flex gap-2 flex-wrap">
              {["professional", "casual", "persuasive", "humorous"].map((t) => (
                <button
                  key={t}
                  onClick={() => setTone(t)}
                  className={`px-3 py-1 rounded text-sm capitalize ${
                    tone === t
                      ? "bg-purple-600 text-white"
                      : "bg-[var(--bg-secondary)] text-[var(--text-secondary)] hover:text-white"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={handleGenerate}
            disabled={!topic.trim()}
            className="w-full bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white px-4 py-2 rounded font-bold"
          >
            Generate Content
          </button>
        </div>

        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="text-sm font-medium">Output</label>
            {output && (
              <button
                onClick={handleCopy}
                className="text-xs text-purple-400 hover:text-purple-300"
              >
                {copied ? "Copied!" : "Copy"}
              </button>
            )}
          </div>
          <textarea
            value={output}
            onChange={(e) => setOutput(e.target.value)}
            placeholder="Your generated content will appear here..."
            className="w-full bg-[var(--bg-secondary)] border border-[var(--border)] rounded px-3 py-2 text-white h-[400px] resize-none font-mono text-sm"
            readOnly={false}
          />
        </div>
      </div>

      <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-lg p-4 text-sm text-[var(--text-secondary)]">
        <h3 className="font-bold text-white mb-2">How to use</h3>
        <ol className="list-decimal list-inside space-y-1">
          <li>Choose a content template (email, cover letter, LinkedIn post, etc.)</li>
          <li>Enter your topic or subject matter</li>
          <li>Select the desired tone</li>
          <li>Click Generate to create a professional template</li>
          <li>Edit the output to add your personal details and customize</li>
        </ol>
        <p className="mt-2">All content is generated locally in your browser. No data sent to any server.</p>
      </div>
    </div>
  );
}
