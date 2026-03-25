"use client";
import { useState } from "react";

const templates: Record<string, { name: string; yaml: string }> = {
  node: {
    name: "Node.js CI",
    yaml: `name: Node.js CI

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  build:
    runs-on: ubuntu-latest
    strategy:
      matrix:
        node-version: [18.x, 20.x]
    steps:
      - uses: actions/checkout@v4
      - name: Use Node.js \${{ matrix.node-version }}
        uses: actions/setup-node@v4
        with:
          node-version: \${{ matrix.node-version }}
          cache: npm
      - run: npm ci
      - run: npm run build --if-present
      - run: npm test`,
  },
  deploy: {
    name: "Deploy to Vercel",
    yaml: `name: Deploy to Vercel

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Install Vercel CLI
        run: npm install -g vercel
      - name: Deploy to Vercel
        run: vercel --prod --token \${{ secrets.VERCEL_TOKEN }}
        env:
          VERCEL_ORG_ID: \${{ secrets.VERCEL_ORG_ID }}
          VERCEL_PROJECT_ID: \${{ secrets.VERCEL_PROJECT_ID }}`,
  },
  docker: {
    name: "Docker Build & Push",
    yaml: `name: Docker Build & Push

on:
  push:
    branches: [main]
    tags: ['v*']

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Login to Docker Hub
        uses: docker/login-action@v3
        with:
          username: \${{ secrets.DOCKERHUB_USERNAME }}
          password: \${{ secrets.DOCKERHUB_TOKEN }}
      - name: Build and push
        uses: docker/build-push-action@v5
        with:
          push: true
          tags: user/app:latest`,
  },
  lint: {
    name: "Lint & Format",
    yaml: `name: Lint & Format

on: [push, pull_request]

jobs:
  lint:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: npm
      - run: npm ci
      - run: npx eslint .
      - run: npx prettier --check .`,
  },
  python: {
    name: "Python CI",
    yaml: `name: Python CI

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    strategy:
      matrix:
        python-version: ['3.10', '3.11', '3.12']
    steps:
      - uses: actions/checkout@v4
      - name: Set up Python \${{ matrix.python-version }}
        uses: actions/setup-python@v5
        with:
          python-version: \${{ matrix.python-version }}
      - run: pip install -r requirements.txt
      - run: pytest`,
  },
  release: {
    name: "Auto Release",
    yaml: `name: Release

on:
  push:
    tags: ['v*']

jobs:
  release:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Create Release
        uses: actions/create-release@v1
        env:
          GITHUB_TOKEN: \${{ secrets.GITHUB_TOKEN }}
        with:
          tag_name: \${{ github.ref_name }}
          release_name: Release \${{ github.ref_name }}
          draft: false
          prerelease: false`,
  },
};

export default function GitHubActions() {
  const [selected, setSelected] = useState("node");
  const [yaml, setYaml] = useState(templates.node.yaml);
  const [copied, setCopied] = useState(false);

  const selectTemplate = (key: string) => {
    setSelected(key);
    setYaml(templates[key].yaml);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold mb-2">GitHub Actions Generator</h1>
        <p className="text-[var(--text-secondary)]">
          Generate GitHub Actions workflow files. Templates for Node.js, Python, Docker, Vercel deploy, linting, and releases.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-2">
          {Object.entries(templates).map(([k, v]) => (
            <button key={k} onClick={() => selectTemplate(k)} className={`w-full text-left px-3 py-2 rounded text-sm ${selected === k ? "bg-purple-600 text-white" : "bg-[var(--bg-secondary)] text-[var(--text-secondary)] hover:text-white"}`}>{v.name}</button>
          ))}
        </div>

        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-1">
            <label className="text-sm font-medium">.github/workflows/{selected}.yml</label>
            <button onClick={() => { navigator.clipboard.writeText(yaml); setCopied(true); setTimeout(() => setCopied(false), 2000); }} className="text-xs text-purple-400">{copied ? "Copied!" : "Copy"}</button>
          </div>
          <textarea value={yaml} onChange={(e) => setYaml(e.target.value)} className="w-full bg-[var(--bg-secondary)] border border-[var(--border)] rounded px-3 py-2 text-emerald-400 h-[500px] resize-none font-mono text-sm" spellCheck={false} />
        </div>
      </div>
    </div>
  );
}
