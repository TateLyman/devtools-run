"use client";
import { useState } from "react";

export default function ReadmeGenerator() {
  const [projectName, setProjectName] = useState("");
  const [description, setDescription] = useState("");
  const [features, setFeatures] = useState("");
  const [installCmd, setInstallCmd] = useState("npm install");
  const [runCmd, setRunCmd] = useState("npm start");
  const [language, setLanguage] = useState("javascript");
  const [license, setLicense] = useState("MIT");
  const [author, setAuthor] = useState("");
  const [badges, setBadges] = useState({ build: true, license: true, version: true });
  const [sections, setSections] = useState({
    features: true, install: true, usage: true, api: false, contributing: true, license: true,
  });
  const [copied, setCopied] = useState(false);

  const generateReadme = (): string => {
    const lines: string[] = [];

    // Badges
    const badgeLines: string[] = [];
    if (badges.build) badgeLines.push(`![Build Status](https://img.shields.io/github/actions/workflow/status/${author}/${projectName}/ci.yml?branch=main)`);
    if (badges.license) badgeLines.push(`![License](https://img.shields.io/badge/license-${license}-blue.svg)`);
    if (badges.version) badgeLines.push(`![Version](https://img.shields.io/npm/v/${projectName.toLowerCase().replace(/\s+/g, "-")})`);
    if (badgeLines.length) lines.push(badgeLines.join(" ") + "\n");

    // Title
    lines.push(`# ${projectName || "Project Name"}\n`);
    lines.push(`${description || "A brief description of your project."}\n`);

    // Table of contents
    const toc: string[] = [];
    if (sections.features) toc.push("- [Features](#features)");
    if (sections.install) toc.push("- [Installation](#installation)");
    if (sections.usage) toc.push("- [Usage](#usage)");
    if (sections.api) toc.push("- [API Reference](#api-reference)");
    if (sections.contributing) toc.push("- [Contributing](#contributing)");
    if (sections.license) toc.push("- [License](#license)");
    if (toc.length) {
      lines.push("## Table of Contents\n");
      lines.push(toc.join("\n") + "\n");
    }

    // Features
    if (sections.features) {
      lines.push("## Features\n");
      const featureList = features.split("\n").filter(Boolean);
      if (featureList.length) {
        featureList.forEach((f) => lines.push(`- ${f.replace(/^[-•*]\s*/, "")}`));
      } else {
        lines.push("- Feature 1\n- Feature 2\n- Feature 3");
      }
      lines.push("");
    }

    // Installation
    if (sections.install) {
      lines.push("## Installation\n");
      lines.push("```bash");
      lines.push(`git clone https://github.com/${author || "username"}/${(projectName || "project").toLowerCase().replace(/\s+/g, "-")}.git`);
      lines.push(`cd ${(projectName || "project").toLowerCase().replace(/\s+/g, "-")}`);
      lines.push(installCmd);
      lines.push("```\n");
    }

    // Usage
    if (sections.usage) {
      lines.push("## Usage\n");
      lines.push("```bash");
      lines.push(runCmd);
      lines.push("```\n");

      const langExamples: Record<string, string> = {
        javascript: '```javascript\nconst app = require("./index");\napp.start();\n```',
        typescript: '```typescript\nimport { App } from "./index";\nconst app = new App();\napp.start();\n```',
        python: '```python\nfrom app import main\nmain()\n```',
        go: '```go\npackage main\nimport "fmt"\nfunc main() {\n    fmt.Println("Hello")\n}\n```',
        rust: '```rust\nfn main() {\n    println!("Hello");\n}\n```',
      };
      lines.push(langExamples[language] || langExamples.javascript);
      lines.push("");
    }

    // API
    if (sections.api) {
      lines.push("## API Reference\n");
      lines.push("### `GET /api/resource`\n");
      lines.push("Returns a list of resources.\n");
      lines.push("| Parameter | Type | Description |");
      lines.push("| --- | --- | --- |");
      lines.push("| `limit` | `number` | Max results to return |");
      lines.push("| `offset` | `number` | Pagination offset |\n");
    }

    // Contributing
    if (sections.contributing) {
      lines.push("## Contributing\n");
      lines.push("Contributions are welcome! Please follow these steps:\n");
      lines.push("1. Fork the repository");
      lines.push("2. Create your feature branch (`git checkout -b feature/amazing-feature`)");
      lines.push("3. Commit your changes (`git commit -m 'Add amazing feature'`)");
      lines.push("4. Push to the branch (`git push origin feature/amazing-feature`)");
      lines.push("5. Open a Pull Request\n");
    }

    // License
    if (sections.license) {
      lines.push("## License\n");
      lines.push(`This project is licensed under the ${license} License — see the [LICENSE](LICENSE) file for details.\n`);
    }

    // Footer
    lines.push("---\n");
    lines.push(`Made with love by [${author || "Your Name"}](https://github.com/${author || "username"})`);

    return lines.join("\n");
  };

  const output = generateReadme();

  const handleCopy = () => {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([output], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "README.md";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold mb-2">README Generator</h1>
        <p className="text-[var(--text-secondary)]">
          Generate a professional README.md for your GitHub project in seconds. Fill in details, toggle sections, copy or download.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-4">
          <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-lg p-4 space-y-3">
            <h2 className="font-bold">Project Details</h2>
            <input value={projectName} onChange={(e) => setProjectName(e.target.value)} placeholder="Project Name" className="w-full bg-[var(--bg-primary)] border border-[var(--border)] rounded px-3 py-2 text-white" />
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Short description of your project" className="w-full bg-[var(--bg-primary)] border border-[var(--border)] rounded px-3 py-2 text-white h-16 resize-none text-sm" />
            <input value={author} onChange={(e) => setAuthor(e.target.value)} placeholder="GitHub username" className="w-full bg-[var(--bg-primary)] border border-[var(--border)] rounded px-3 py-2 text-white text-sm" />
            <div className="grid grid-cols-2 gap-2">
              <select value={language} onChange={(e) => setLanguage(e.target.value)} className="bg-[var(--bg-primary)] border border-[var(--border)] rounded px-3 py-2 text-white text-sm">
                <option value="javascript">JavaScript</option>
                <option value="typescript">TypeScript</option>
                <option value="python">Python</option>
                <option value="go">Go</option>
                <option value="rust">Rust</option>
              </select>
              <select value={license} onChange={(e) => setLicense(e.target.value)} className="bg-[var(--bg-primary)] border border-[var(--border)] rounded px-3 py-2 text-white text-sm">
                <option value="MIT">MIT</option>
                <option value="Apache-2.0">Apache 2.0</option>
                <option value="GPL-3.0">GPL 3.0</option>
                <option value="BSD-3">BSD 3-Clause</option>
                <option value="ISC">ISC</option>
              </select>
            </div>
          </div>

          <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-lg p-4 space-y-3">
            <h2 className="font-bold">Commands</h2>
            <input value={installCmd} onChange={(e) => setInstallCmd(e.target.value)} placeholder="Install command" className="w-full bg-[var(--bg-primary)] border border-[var(--border)] rounded px-3 py-2 text-white text-sm font-mono" />
            <input value={runCmd} onChange={(e) => setRunCmd(e.target.value)} placeholder="Run command" className="w-full bg-[var(--bg-primary)] border border-[var(--border)] rounded px-3 py-2 text-white text-sm font-mono" />
          </div>

          <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-lg p-4 space-y-3">
            <h2 className="font-bold">Features</h2>
            <textarea value={features} onChange={(e) => setFeatures(e.target.value)} placeholder="One feature per line" className="w-full bg-[var(--bg-primary)] border border-[var(--border)] rounded px-3 py-2 text-white h-24 resize-none text-sm" />
          </div>

          <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-lg p-4 space-y-2">
            <h2 className="font-bold">Sections</h2>
            <div className="grid grid-cols-3 gap-2">
              {Object.entries(sections).map(([key, val]) => (
                <label key={key} className="flex items-center gap-2 text-sm cursor-pointer">
                  <input type="checkbox" checked={val} onChange={() => setSections({ ...sections, [key]: !val })} className="accent-purple-500" />
                  <span className="capitalize">{key}</span>
                </label>
              ))}
            </div>
            <h2 className="font-bold mt-3">Badges</h2>
            <div className="flex gap-4">
              {Object.entries(badges).map(([key, val]) => (
                <label key={key} className="flex items-center gap-2 text-sm cursor-pointer">
                  <input type="checkbox" checked={val} onChange={() => setBadges({ ...badges, [key]: !val })} className="accent-purple-500" />
                  <span className="capitalize">{key}</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h2 className="font-bold">Preview</h2>
            <div className="flex gap-2">
              <button onClick={handleCopy} className="px-3 py-1 bg-gray-700 hover:bg-gray-600 rounded text-sm text-white">{copied ? "Copied!" : "Copy"}</button>
              <button onClick={handleDownload} className="px-3 py-1 bg-purple-600 hover:bg-purple-700 rounded text-sm text-white">Download</button>
            </div>
          </div>
          <pre className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-lg p-4 text-sm text-white overflow-auto max-h-[700px] whitespace-pre-wrap font-mono">{output}</pre>
        </div>
      </div>
    </div>
  );
}
