"use client";
import { useState } from "react";

const SKILLS = ["JavaScript","TypeScript","Python","React","Next.js","Node.js","Vue","Angular","Svelte","Go","Rust","Java","C++","C#","PHP","Ruby","Swift","Kotlin","Dart","Flutter","Docker","Kubernetes","AWS","GCP","Azure","MongoDB","PostgreSQL","MySQL","Redis","GraphQL","REST","Git","Linux","Figma","Tailwind","Bootstrap"];

export default function GithubReadmeGen() {
  const [name, setName] = useState("Your Name");
  const [title, setTitle] = useState("Full-Stack Developer");
  const [about, setAbout] = useState("Passionate about building things that matter.");
  const [github, setGithub] = useState("username");
  const [twitter, setTwitter] = useState("");
  const [linkedin, setLinkedin] = useState("");
  const [website, setWebsite] = useState("");
  const [skills, setSkills] = useState<string[]>(["JavaScript","TypeScript","React","Node.js"]);
  const [showStats, setShowStats] = useState(true);
  const [showStreak, setShowStreak] = useState(true);

  const toggleSkill = (s: string) => setSkills(skills.includes(s) ? skills.filter(x => x !== s) : [...skills, s]);

  const md = `# Hi there, I'm ${name} 👋

## ${title}

${about}

${skills.length ? `### 🛠️ Skills\n${skills.map(s => `\`${s}\``).join(" ")}` : ""}

${showStats ? `### 📊 GitHub Stats\n![GitHub Stats](https://github-readme-stats.vercel.app/api?username=${github}&show_icons=true&theme=dark)` : ""}

${showStreak ? `### 🔥 Streak\n![GitHub Streak](https://github-readme-streak-stats.herokuapp.com/?user=${github}&theme=dark)` : ""}

### 📫 Connect
${twitter ? `- Twitter: [@${twitter}](https://twitter.com/${twitter})` : ""}
${linkedin ? `- LinkedIn: [${linkedin}](https://linkedin.com/in/${linkedin})` : ""}
${website ? `- Website: [${website}](https://${website})` : ""}
`.replace(/\n{3,}/g, "\n\n").trim();

  const copy = () => navigator.clipboard.writeText(md);

  return (
    <div className="space-y-6">
      <section className="text-center">
        <h1 className="text-4xl font-bold mb-2">GitHub Profile README Generator</h1>
        <p className="text-[var(--text-secondary)]">Create an awesome GitHub profile in minutes</p>
      </section>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-3">
          <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-xl p-4 space-y-3">
            <h2 className="font-bold">About You</h2>
            <input value={name} onChange={e => setName(e.target.value)} placeholder="Name" className="w-full bg-[var(--bg-primary)] border border-[var(--border)] rounded px-3 py-2 text-sm" />
            <input value={title} onChange={e => setTitle(e.target.value)} placeholder="Title" className="w-full bg-[var(--bg-primary)] border border-[var(--border)] rounded px-3 py-2 text-sm" />
            <textarea value={about} onChange={e => setAbout(e.target.value)} rows={2} placeholder="About" className="w-full bg-[var(--bg-primary)] border border-[var(--border)] rounded px-3 py-2 text-sm resize-none" />
            <input value={github} onChange={e => setGithub(e.target.value)} placeholder="GitHub username" className="w-full bg-[var(--bg-primary)] border border-[var(--border)] rounded px-3 py-2 text-sm" />
          </div>
          <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-xl p-4 space-y-3">
            <h2 className="font-bold">Social Links</h2>
            <input value={twitter} onChange={e => setTwitter(e.target.value)} placeholder="Twitter username" className="w-full bg-[var(--bg-primary)] border border-[var(--border)] rounded px-3 py-2 text-sm" />
            <input value={linkedin} onChange={e => setLinkedin(e.target.value)} placeholder="LinkedIn username" className="w-full bg-[var(--bg-primary)] border border-[var(--border)] rounded px-3 py-2 text-sm" />
            <input value={website} onChange={e => setWebsite(e.target.value)} placeholder="Website" className="w-full bg-[var(--bg-primary)] border border-[var(--border)] rounded px-3 py-2 text-sm" />
          </div>
          <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-xl p-4">
            <h2 className="font-bold mb-2">Skills</h2>
            <div className="flex flex-wrap gap-1">
              {SKILLS.map(s => (
                <button key={s} onClick={() => toggleSkill(s)}
                  className={`px-2 py-0.5 rounded text-xs ${skills.includes(s) ? "bg-blue-600 text-white" : "bg-[var(--bg-primary)] border border-[var(--border)]"}`}>{s}</button>
              ))}
            </div>
          </div>
          <div className="flex gap-4">
            <label className="text-sm"><input type="checkbox" checked={showStats} onChange={e => setShowStats(e.target.checked)} className="mr-1" />Stats Card</label>
            <label className="text-sm"><input type="checkbox" checked={showStreak} onChange={e => setShowStreak(e.target.checked)} className="mr-1" />Streak Card</label>
          </div>
        </div>

        <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-xl p-4">
          <div className="flex justify-between mb-2">
            <label className="text-sm font-bold">Markdown Output</label>
            <button onClick={copy} className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-xs font-bold">Copy</button>
          </div>
          <pre className="font-mono text-xs text-emerald-400 whitespace-pre-wrap max-h-[500px] overflow-y-auto">{md}</pre>
        </div>
      </div>
    </div>
  );
}
