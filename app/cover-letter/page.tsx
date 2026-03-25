"use client";
import { useState } from "react";

const templates: Record<string, { label: string; template: string }> = {
  standard: { label: "Standard", template: `Dear Hiring Manager,

I am writing to express my strong interest in the [Job Title] position at [Company Name]. With my background in [relevant field/skill], I am confident I can make a meaningful contribution to your team.

In my [current/previous] role at [Company], I [specific achievement with measurable result]. This experience has given me [relevant skills] that directly align with what you're looking for.

Key qualifications I bring:
• [Relevant skill/achievement #1]
• [Relevant skill/achievement #2]
• [Relevant skill/achievement #3]

I am particularly drawn to [Company Name] because [specific reason — culture, mission, product]. I believe my [skill/experience] would help [specific value you'd add].

I would welcome the opportunity to discuss how my experience aligns with your needs. Thank you for considering my application.

Best regards,
[Your Name]` },
  creative: { label: "Creative", template: `Hi [Hiring Manager's Name],

When I saw the [Job Title] opening at [Company Name], I didn't just see a job listing — I saw an opportunity to [what excites you about the role].

Here's why I'm the right fit:

[Bold statement about your unique value proposition]

At [Previous Company], I [impressive achievement with numbers]. But what I'm most proud of is [human/impact-focused achievement].

What makes me different from other candidates? [Your unique angle — specific skill combination, perspective, or approach that sets you apart].

I'd love to chat about how I can bring [specific value] to [Company Name]. Are you free for a 15-minute call this week?

[Your Name]
[Phone] | [Email] | [Portfolio/LinkedIn]` },
  career_change: { label: "Career Change", template: `Dear [Hiring Manager],

I know my resume might look unconventional for a [Target Role]. But my [X years] in [Previous Industry] gave me exactly the skills [Company Name] needs.

Here's how my experience translates:

[Previous skill] → [How it applies to new role]
[Previous achievement] → [Relevant parallel in new field]
[Previous responsibility] → [Direct application]

I've also invested in my transition by [courses completed, certifications, projects, self-study].

I bring a fresh perspective that career-long [industry] professionals simply can't offer. My [previous industry] background means I understand [unique insight].

I'd love to discuss how my non-traditional path could be your team's advantage.

[Your Name]` },
  internship: { label: "Internship", template: `Dear [Hiring Manager],

I am a [Year] student at [University] studying [Major], and I am excited to apply for the [Internship Title] at [Company Name].

Through my coursework in [relevant classes] and personal projects including [project name], I have developed strong skills in [relevant skills].

What I'd bring to your team:
• [Relevant class project or personal project]
• [Technical skill or tool proficiency]
• [Soft skill with example]

I am eager to learn and contribute. [Company Name]'s work in [specific area] aligns perfectly with my interests in [your interest].

I am available [dates/hours] and would welcome the opportunity to discuss this further.

Thank you for your consideration.

[Your Name]
[University] | [Major] | Expected Graduation [Year]` },
};

export default function CoverLetter() {
  const [selected, setSelected] = useState("standard");
  const [letter, setLetter] = useState(templates.standard.template);
  const [copied, setCopied] = useState(false);

  const wordCount = letter.trim().split(/\s+/).length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold mb-2">Cover Letter Generator</h1>
        <p className="text-[var(--text-secondary)]">
          Generate professional cover letters. 4 templates: standard, creative, career change, internship. Customize and copy. Free cover letter maker.
        </p>
      </div>

      <div className="flex gap-2 flex-wrap justify-center">
        {Object.entries(templates).map(([k, v]) => (
          <button key={k} onClick={() => { setSelected(k); setLetter(v.template); }} className={`px-3 py-1.5 rounded text-xs ${selected === k ? "bg-purple-600 text-white" : "bg-[var(--bg-secondary)] text-gray-400"}`}>{v.label}</button>
        ))}
      </div>

      <div className="max-w-2xl mx-auto space-y-3">
        <textarea value={letter} onChange={(e) => setLetter(e.target.value)} className="w-full bg-[var(--bg-secondary)] border border-[var(--border)] rounded-xl px-6 py-4 text-white h-[500px] resize-none text-sm leading-relaxed" />

        <div className="flex items-center justify-between">
          <span className="text-xs text-gray-400">{wordCount} words · {letter.length} characters</span>
          <div className="flex gap-2">
            <button onClick={() => { const blob = new Blob([letter], { type: "text/plain" }); const a = document.createElement("a"); a.download = "cover-letter.txt"; a.href = URL.createObjectURL(blob); a.click(); }} className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded text-sm">Download</button>
            <button onClick={() => { navigator.clipboard.writeText(letter); setCopied(true); setTimeout(() => setCopied(false), 2000); }} className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded font-bold text-sm">{copied ? "Copied!" : "Copy"}</button>
          </div>
        </div>

        <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-lg p-4 text-xs text-[var(--text-secondary)]">
          <h3 className="font-bold text-white mb-1">Tips</h3>
          <ul className="space-y-1">
            <li>• Replace all [brackets] with your actual information</li>
            <li>• Keep it under 400 words — hiring managers skim</li>
            <li>• Include at least one specific number/achievement</li>
            <li>• Research the company and mention something specific</li>
            <li>• Match keywords from the job description</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
