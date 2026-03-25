"use client";
import { useState } from "react";

interface Experience {
  title: string;
  company: string;
  dates: string;
  bullets: string[];
}

interface Education {
  degree: string;
  school: string;
  year: string;
}

export default function ResumeBuilder() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [location, setLocation] = useState("");
  const [summary, setSummary] = useState("");
  const [skills, setSkills] = useState("");
  const [experiences, setExperiences] = useState<Experience[]>([
    { title: "", company: "", dates: "", bullets: [""] },
  ]);
  const [education, setEducation] = useState<Education[]>([
    { degree: "", school: "", year: "" },
  ]);
  const [template, setTemplate] = useState<"modern" | "classic" | "minimal">("modern");

  const addExperience = () =>
    setExperiences([...experiences, { title: "", company: "", dates: "", bullets: [""] }]);
  const addEducation = () =>
    setEducation([...education, { degree: "", school: "", year: "" }]);
  const addBullet = (i: number) => {
    const copy = [...experiences];
    copy[i].bullets.push("");
    setExperiences(copy);
  };

  const updateExp = (i: number, field: keyof Experience, value: string) => {
    const copy = [...experiences];
    if (field === "bullets") return;
    (copy[i] as any)[field] = value;
    setExperiences(copy);
  };
  const updateBullet = (ei: number, bi: number, value: string) => {
    const copy = [...experiences];
    copy[ei].bullets[bi] = value;
    setExperiences(copy);
  };
  const updateEdu = (i: number, field: keyof Education, value: string) => {
    const copy = [...education];
    copy[i][field] = value;
    setEducation(copy);
  };

  const generateText = () => {
    let text = `${name}\n${[email, phone, location].filter(Boolean).join(" | ")}\n\n`;
    if (summary) text += `SUMMARY\n${summary}\n\n`;
    if (skills) text += `SKILLS\n${skills}\n\n`;
    if (experiences.some((e) => e.title)) {
      text += "EXPERIENCE\n";
      experiences.forEach((e) => {
        if (!e.title) return;
        text += `${e.title} — ${e.company} (${e.dates})\n`;
        e.bullets.filter(Boolean).forEach((b) => (text += `  • ${b}\n`));
        text += "\n";
      });
    }
    if (education.some((e) => e.degree)) {
      text += "EDUCATION\n";
      education.forEach((e) => {
        if (!e.degree) return;
        text += `${e.degree} — ${e.school} (${e.year})\n`;
      });
    }
    return text;
  };

  const handleCopy = () => navigator.clipboard.writeText(generateText());
  const handleDownload = () => {
    const blob = new Blob([generateText()], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${name || "resume"}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const templateStyles = {
    modern: "font-sans",
    classic: "font-serif",
    minimal: "font-mono text-sm",
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold mb-2">Resume Builder</h1>
        <p className="text-[var(--text-secondary)]">
          Build a professional resume in minutes. Fill in your details and export. Free, no signup, runs in your browser.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-4">
          <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-lg p-4 space-y-3">
            <h2 className="font-bold text-lg">Personal Info</h2>
            <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Full Name" className="w-full bg-[var(--bg-primary)] border border-[var(--border)] rounded px-3 py-2 text-white" />
            <div className="grid grid-cols-2 gap-2">
              <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" className="bg-[var(--bg-primary)] border border-[var(--border)] rounded px-3 py-2 text-white" />
              <input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Phone" className="bg-[var(--bg-primary)] border border-[var(--border)] rounded px-3 py-2 text-white" />
            </div>
            <input value={location} onChange={(e) => setLocation(e.target.value)} placeholder="Location (City, State)" className="w-full bg-[var(--bg-primary)] border border-[var(--border)] rounded px-3 py-2 text-white" />
          </div>

          <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-lg p-4 space-y-3">
            <h2 className="font-bold text-lg">Summary</h2>
            <textarea value={summary} onChange={(e) => setSummary(e.target.value)} placeholder="Brief professional summary (2-3 sentences)" className="w-full bg-[var(--bg-primary)] border border-[var(--border)] rounded px-3 py-2 text-white h-20 resize-none text-sm" />
          </div>

          <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-lg p-4 space-y-3">
            <h2 className="font-bold text-lg">Skills</h2>
            <input value={skills} onChange={(e) => setSkills(e.target.value)} placeholder="JavaScript, React, Node.js, Python, AWS..." className="w-full bg-[var(--bg-primary)] border border-[var(--border)] rounded px-3 py-2 text-white text-sm" />
          </div>

          <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-lg p-4 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-bold text-lg">Experience</h2>
              <button onClick={addExperience} className="text-xs bg-purple-600 hover:bg-purple-700 px-2 py-1 rounded text-white">+ Add</button>
            </div>
            {experiences.map((exp, i) => (
              <div key={i} className="space-y-2 border-b border-[var(--border)] pb-3 last:border-0">
                <div className="grid grid-cols-2 gap-2">
                  <input value={exp.title} onChange={(e) => updateExp(i, "title", e.target.value)} placeholder="Job Title" className="bg-[var(--bg-primary)] border border-[var(--border)] rounded px-3 py-2 text-white text-sm" />
                  <input value={exp.company} onChange={(e) => updateExp(i, "company", e.target.value)} placeholder="Company" className="bg-[var(--bg-primary)] border border-[var(--border)] rounded px-3 py-2 text-white text-sm" />
                </div>
                <input value={exp.dates} onChange={(e) => updateExp(i, "dates", e.target.value)} placeholder="Jan 2023 — Present" className="w-full bg-[var(--bg-primary)] border border-[var(--border)] rounded px-3 py-2 text-white text-sm" />
                {exp.bullets.map((b, bi) => (
                  <input key={bi} value={b} onChange={(e) => updateBullet(i, bi, e.target.value)} placeholder={`Achievement/responsibility #${bi + 1}`} className="w-full bg-[var(--bg-primary)] border border-[var(--border)] rounded px-3 py-1.5 text-white text-xs" />
                ))}
                <button onClick={() => addBullet(i)} className="text-xs text-purple-400 hover:text-purple-300">+ bullet point</button>
              </div>
            ))}
          </div>

          <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-lg p-4 space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="font-bold text-lg">Education</h2>
              <button onClick={addEducation} className="text-xs bg-purple-600 hover:bg-purple-700 px-2 py-1 rounded text-white">+ Add</button>
            </div>
            {education.map((edu, i) => (
              <div key={i} className="grid grid-cols-3 gap-2">
                <input value={edu.degree} onChange={(e) => updateEdu(i, "degree", e.target.value)} placeholder="Degree" className="bg-[var(--bg-primary)] border border-[var(--border)] rounded px-3 py-2 text-white text-sm" />
                <input value={edu.school} onChange={(e) => updateEdu(i, "school", e.target.value)} placeholder="School" className="bg-[var(--bg-primary)] border border-[var(--border)] rounded px-3 py-2 text-white text-sm" />
                <input value={edu.year} onChange={(e) => updateEdu(i, "year", e.target.value)} placeholder="Year" className="bg-[var(--bg-primary)] border border-[var(--border)] rounded px-3 py-2 text-white text-sm" />
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex gap-2">
            {(["modern", "classic", "minimal"] as const).map((t) => (
              <button key={t} onClick={() => setTemplate(t)} className={`px-3 py-1 rounded text-sm capitalize ${template === t ? "bg-purple-600 text-white" : "bg-[var(--bg-secondary)] text-[var(--text-secondary)]"}`}>{t}</button>
            ))}
            <div className="ml-auto flex gap-2">
              <button onClick={handleCopy} className="px-3 py-1 bg-gray-700 hover:bg-gray-600 rounded text-sm text-white">Copy</button>
              <button onClick={handleDownload} className="px-3 py-1 bg-purple-600 hover:bg-purple-700 rounded text-sm text-white">Download .txt</button>
            </div>
          </div>

          <div className={`bg-white text-black rounded-lg p-8 min-h-[600px] ${templateStyles[template]}`}>
            <h2 className="text-2xl font-bold text-center">{name || "Your Name"}</h2>
            <p className="text-center text-sm text-gray-600 mt-1">
              {[email, phone, location].filter(Boolean).join(" | ") || "email@example.com | (555) 123-4567 | City, State"}
            </p>

            {summary && (
              <div className="mt-4">
                <h3 className="text-sm font-bold uppercase tracking-wider border-b border-gray-300 pb-1">Summary</h3>
                <p className="text-sm mt-2 text-gray-700">{summary}</p>
              </div>
            )}

            {skills && (
              <div className="mt-4">
                <h3 className="text-sm font-bold uppercase tracking-wider border-b border-gray-300 pb-1">Skills</h3>
                <p className="text-sm mt-2 text-gray-700">{skills}</p>
              </div>
            )}

            {experiences.some((e) => e.title) && (
              <div className="mt-4">
                <h3 className="text-sm font-bold uppercase tracking-wider border-b border-gray-300 pb-1">Experience</h3>
                {experiences.filter((e) => e.title).map((exp, i) => (
                  <div key={i} className="mt-3">
                    <div className="flex justify-between items-baseline">
                      <span className="font-bold text-sm">{exp.title}</span>
                      <span className="text-xs text-gray-500">{exp.dates}</span>
                    </div>
                    <p className="text-sm text-gray-600 italic">{exp.company}</p>
                    <ul className="text-sm text-gray-700 mt-1 list-disc list-inside">
                      {exp.bullets.filter(Boolean).map((b, bi) => (
                        <li key={bi}>{b}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            )}

            {education.some((e) => e.degree) && (
              <div className="mt-4">
                <h3 className="text-sm font-bold uppercase tracking-wider border-b border-gray-300 pb-1">Education</h3>
                {education.filter((e) => e.degree).map((edu, i) => (
                  <div key={i} className="mt-2 flex justify-between">
                    <div>
                      <span className="font-bold text-sm">{edu.degree}</span>
                      <span className="text-sm text-gray-600"> — {edu.school}</span>
                    </div>
                    <span className="text-xs text-gray-500">{edu.year}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
