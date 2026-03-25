"use client";
import { useState } from "react";

export default function PackageJsonGenerator() {
  const [config, setConfig] = useState({
    name: "my-project",
    version: "1.0.0",
    description: "",
    main: "index.js",
    author: "",
    license: "MIT",
    private: false,
    type: "module",
    scripts: {
      start: "node index.js",
      dev: "nodemon index.js",
      build: "tsc",
      test: "jest",
    } as Record<string, string>,
  });
  const [deps, setDeps] = useState("express\ncors\ndotenv");
  const [devDeps, setDevDeps] = useState("typescript\n@types/node\nnodemon\njest");
  const [copied, setCopied] = useState(false);

  const generate = (): string => {
    const pkg: any = {
      name: config.name,
      version: config.version,
      description: config.description || undefined,
      main: config.main,
      type: config.type,
      scripts: config.scripts,
      author: config.author || undefined,
      license: config.license,
      private: config.private || undefined,
    };

    const depsList = deps.split("\n").map((d) => d.trim()).filter(Boolean);
    const devDepsList = devDeps.split("\n").map((d) => d.trim()).filter(Boolean);

    if (depsList.length > 0) {
      pkg.dependencies = {};
      depsList.forEach((d) => { pkg.dependencies[d] = "latest"; });
    }

    if (devDepsList.length > 0) {
      pkg.devDependencies = {};
      devDepsList.forEach((d) => { pkg.devDependencies[d] = "latest"; });
    }

    // Remove undefined values
    Object.keys(pkg).forEach((k) => { if (pkg[k] === undefined) delete pkg[k]; });

    return JSON.stringify(pkg, null, 2);
  };

  const output = generate();

  const presets: Record<string, () => void> = {
    "Express API": () => {
      setConfig({ ...config, name: "my-api", main: "src/index.js", scripts: { start: "node src/index.js", dev: "nodemon src/index.js", test: "jest" } });
      setDeps("express\ncors\ndotenv\nhelmet\nmorgan");
      setDevDeps("nodemon\njest");
    },
    "Next.js": () => {
      setConfig({ ...config, name: "my-next-app", main: "", scripts: { dev: "next dev", build: "next build", start: "next start", lint: "next lint" } });
      setDeps("next\nreact\nreact-dom");
      setDevDeps("typescript\n@types/react\n@types/node\neslint");
    },
    "CLI Tool": () => {
      setConfig({ ...config, name: "my-cli", main: "bin/index.js", scripts: { build: "tsc", test: "jest" } });
      setDeps("commander\nchalk\nora");
      setDevDeps("typescript\n@types/node");
    },
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold mb-2">package.json Generator</h1>
        <p className="text-[var(--text-secondary)]">
          Generate package.json files with scripts, dependencies, and dev dependencies. Presets for Express, Next.js, CLI tools.
        </p>
      </div>

      <div className="flex gap-2 flex-wrap">
        {Object.entries(presets).map(([name, fn]) => (
          <button key={name} onClick={fn} className="px-3 py-1 rounded text-xs bg-[var(--bg-secondary)] text-[var(--text-secondary)] hover:text-white">{name}</button>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-3">
          <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-lg p-4 space-y-2">
            <div className="grid grid-cols-2 gap-2">
              <input value={config.name} onChange={(e) => setConfig({ ...config, name: e.target.value })} placeholder="name" className="bg-[var(--bg-primary)] border border-[var(--border)] rounded px-2 py-1.5 text-white text-sm font-mono" />
              <input value={config.version} onChange={(e) => setConfig({ ...config, version: e.target.value })} placeholder="version" className="bg-[var(--bg-primary)] border border-[var(--border)] rounded px-2 py-1.5 text-white text-sm font-mono" />
            </div>
            <input value={config.description} onChange={(e) => setConfig({ ...config, description: e.target.value })} placeholder="description" className="w-full bg-[var(--bg-primary)] border border-[var(--border)] rounded px-2 py-1.5 text-white text-sm" />
            <div className="grid grid-cols-3 gap-2">
              <input value={config.author} onChange={(e) => setConfig({ ...config, author: e.target.value })} placeholder="author" className="bg-[var(--bg-primary)] border border-[var(--border)] rounded px-2 py-1.5 text-white text-sm" />
              <select value={config.license} onChange={(e) => setConfig({ ...config, license: e.target.value })} className="bg-[var(--bg-primary)] border border-[var(--border)] rounded px-2 py-1.5 text-white text-sm">
                {["MIT", "ISC", "Apache-2.0", "GPL-3.0", "BSD-3-Clause", "UNLICENSED"].map((l) => <option key={l}>{l}</option>)}
              </select>
              <select value={config.type} onChange={(e) => setConfig({ ...config, type: e.target.value })} className="bg-[var(--bg-primary)] border border-[var(--border)] rounded px-2 py-1.5 text-white text-sm">
                <option value="module">ESM (module)</option>
                <option value="commonjs">CommonJS</option>
              </select>
            </div>
          </div>

          <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-lg p-4 space-y-2">
            <h3 className="text-xs font-bold text-gray-400">Dependencies (one per line)</h3>
            <textarea value={deps} onChange={(e) => setDeps(e.target.value)} className="w-full bg-[var(--bg-primary)] border border-[var(--border)] rounded px-2 py-1.5 text-white text-xs font-mono h-20 resize-none" />
          </div>

          <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-lg p-4 space-y-2">
            <h3 className="text-xs font-bold text-gray-400">Dev Dependencies</h3>
            <textarea value={devDeps} onChange={(e) => setDevDeps(e.target.value)} className="w-full bg-[var(--bg-primary)] border border-[var(--border)] rounded px-2 py-1.5 text-white text-xs font-mono h-20 resize-none" />
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="text-sm font-medium">package.json</label>
            <button onClick={() => { navigator.clipboard.writeText(output); setCopied(true); setTimeout(() => setCopied(false), 2000); }} className="text-xs text-purple-400">{copied ? "Copied!" : "Copy"}</button>
          </div>
          <pre className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded p-3 text-xs font-mono text-emerald-400 overflow-auto max-h-[500px] whitespace-pre-wrap">{output}</pre>
        </div>
      </div>
    </div>
  );
}
