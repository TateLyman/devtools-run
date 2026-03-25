"use client";
import { useState } from "react";

const TEMPLATES: Record<string, (name: string, desc: string) => string> = {
  "npm-package": (name, desc) => `# ${name}\n\n${desc}\n\n## Installation\n\n\`\`\`bash\nnpm install ${name.toLowerCase().replace(/\s/g,"-")}\n\`\`\`\n\n## Usage\n\n\`\`\`javascript\nimport { something } from '${name.toLowerCase().replace(/\s/g,"-")}';\n\`\`\`\n\n## API\n\n### \`functionName(options)\`\n\nDescription of the function.\n\n| Param | Type | Default | Description |\n|-------|------|---------|-------------|\n| option1 | string | - | Description |\n\n## License\n\nMIT`,
  "web-app": (name, desc) => `# ${name}\n\n${desc}\n\n## Getting Started\n\n\`\`\`bash\ngit clone https://github.com/username/${name.toLowerCase().replace(/\s/g,"-")}\ncd ${name.toLowerCase().replace(/\s/g,"-")}\nnpm install\nnpm run dev\n\`\`\`\n\n## Tech Stack\n\n- Next.js\n- Tailwind CSS\n- TypeScript\n\n## Features\n\n- Feature 1\n- Feature 2\n\n## Deployment\n\n\`\`\`bash\nvercel\n\`\`\`\n\n## License\n\nMIT`,
  "api": (name, desc) => `# ${name} API\n\n${desc}\n\n## Base URL\n\n\`\`\`\nhttps://api.example.com/v1\n\`\`\`\n\n## Authentication\n\nAll requests require an API key in the header:\n\n\`\`\`\nAuthorization: Bearer YOUR_API_KEY\n\`\`\`\n\n## Endpoints\n\n### GET /items\n\nReturns a list of items.\n\n**Response:**\n\`\`\`json\n{\n  "items": [...],\n  "total": 100\n}\n\`\`\`\n\n## Rate Limits\n\n- Free: 100 req/min\n- Pro: 1000 req/min\n\n## License\n\nMIT`,
  "cli-tool": (name, desc) => `# ${name}\n\n${desc}\n\n## Install\n\n\`\`\`bash\nnpm install -g ${name.toLowerCase().replace(/\s/g,"-")}\n\`\`\`\n\n## Usage\n\n\`\`\`bash\n${name.toLowerCase().replace(/\s/g,"-")} --help\n${name.toLowerCase().replace(/\s/g,"-")} init\n${name.toLowerCase().replace(/\s/g,"-")} build --output dist\n\`\`\`\n\n## Options\n\n| Flag | Description |\n|------|-------------|\n| --help | Show help |\n| --version | Show version |\n\n## License\n\nMIT`,
};

export default function ReadmePage() {
  const [name, setName] = useState("My Project");
  const [desc, setDesc] = useState("A brief description of the project.");
  const [template, setTemplate] = useState("web-app");
  const output = TEMPLATES[template](name, desc);

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <div className="max-w-4xl mx-auto px-4 py-16">
        <h1 className="text-4xl font-extrabold mb-2 text-center">README Generator</h1>
        <p className="text-gray-400 text-center mb-8">Generate a README.md for your project type.</p>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <div><label className="text-xs text-gray-400">Project Name</label><input type="text" value={name} onChange={e=>setName(e.target.value)} className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white" /></div>
            <div><label className="text-xs text-gray-400">Description</label><input type="text" value={desc} onChange={e=>setDesc(e.target.value)} className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white" /></div>
            <div><label className="text-xs text-gray-400">Template</label>
              <div className="flex flex-wrap gap-2 mt-1">
                {Object.keys(TEMPLATES).map(t=><button key={t} onClick={()=>setTemplate(t)} className={`px-3 py-1 rounded text-xs font-bold ${template===t?"bg-purple-600":"bg-gray-800 hover:bg-gray-700"}`}>{t}</button>)}
              </div>
            </div>
            <button onClick={()=>navigator.clipboard.writeText(output)} className="w-full bg-purple-600 hover:bg-purple-700 py-2 rounded-lg font-bold">Copy Markdown</button>
          </div>
          <pre className="bg-gray-900 rounded-xl p-4 text-xs text-green-400 font-mono overflow-y-auto whitespace-pre-wrap max-h-96">{output}</pre>
        </div>
        <div className="mt-8 text-center text-gray-500 text-sm">
          <a href="/github-readme" className="text-purple-400 hover:underline">GitHub Profile README</a>{" | "}
          <a href="/md-editor" className="text-purple-400 hover:underline">Markdown Editor</a>{" | "}
          <a href="/gitignore" className="text-purple-400 hover:underline">.gitignore</a>{" | "}
          <a href="/" className="text-purple-400 hover:underline">All Tools</a>
        </div>
      </div>
    </div>
  );
}
