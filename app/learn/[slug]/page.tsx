import { Metadata } from "next";

const TUTORIALS: Record<string, { title: string; intro: string; sections: { h: string; content: string; code?: string }[] }> = {
  "javascript-basics": { title: "JavaScript Basics", intro: "Learn JavaScript fundamentals in 5 minutes.", sections: [
    { h: "Variables", content: "Use let for mutable values, const for constants.", code: "const name = 'World';\nlet count = 0;\ncount++;" },
    { h: "Functions", content: "Functions are reusable blocks of code.", code: "function greet(name) {\n  return `Hello, ${name}!`;\n}\n\nconst greet2 = (name) => `Hello, ${name}!`;" },
    { h: "Arrays", content: "Arrays store ordered collections.", code: "const nums = [1, 2, 3];\nnums.map(n => n * 2);  // [2, 4, 6]\nnums.filter(n => n > 1); // [2, 3]" },
    { h: "Objects", content: "Objects store key-value pairs.", code: "const user = { name: 'Sol', age: 25 };\nconst { name, age } = user; // destructure" },
    { h: "Async/Await", content: "Handle asynchronous operations cleanly.", code: "async function fetchData() {\n  const res = await fetch('/api/data');\n  const data = await res.json();\n  return data;\n}" },
  ]},
  "python-basics": { title: "Python Basics", intro: "Learn Python fundamentals in 5 minutes.", sections: [
    { h: "Variables", content: "Python uses dynamic typing.", code: "name = 'World'\ncount = 0\ncount += 1" },
    { h: "Functions", content: "Define functions with def.", code: "def greet(name):\n    return f'Hello, {name}!'\n\n# Lambda\ngreet2 = lambda name: f'Hello, {name}!'" },
    { h: "Lists", content: "Lists are mutable ordered collections.", code: "nums = [1, 2, 3]\ndoubled = [n * 2 for n in nums]  # [2, 4, 6]\nfiltered = [n for n in nums if n > 1]  # [2, 3]" },
    { h: "Dictionaries", content: "Key-value storage.", code: "user = {'name': 'Sol', 'age': 25}\nname = user['name']\nuser.get('email', 'none')" },
  ]},
  "git-basics": { title: "Git Basics", intro: "Learn the essential Git commands.", sections: [
    { h: "Setup", content: "Initialize a repo or clone one.", code: "git init\ngit clone https://github.com/user/repo.git" },
    { h: "Daily Workflow", content: "Stage, commit, push.", code: "git add .\ngit commit -m 'feat: add feature'\ngit push origin main" },
    { h: "Branches", content: "Work on features in isolation.", code: "git checkout -b feature/new-thing\n# make changes\ngit add . && git commit -m 'add thing'\ngit checkout main\ngit merge feature/new-thing" },
  ]},
  "react-basics": { title: "React Basics", intro: "Build your first React component.", sections: [
    { h: "Components", content: "React apps are built from components.", code: "function App() {\n  return <h1>Hello World</h1>;\n}\n\nexport default App;" },
    { h: "State", content: "useState manages component state.", code: "import { useState } from 'react';\n\nfunction Counter() {\n  const [count, setCount] = useState(0);\n  return <button onClick={() => setCount(count + 1)}>{count}</button>;\n}" },
    { h: "Effects", content: "useEffect runs side effects.", code: "import { useEffect, useState } from 'react';\n\nfunction App() {\n  const [data, setData] = useState(null);\n  useEffect(() => {\n    fetch('/api').then(r => r.json()).then(setData);\n  }, []);\n}" },
  ]},
  "css-flexbox": { title: "CSS Flexbox", intro: "Master flexbox layout in 5 minutes.", sections: [
    { h: "Container", content: "Set display:flex on the parent.", code: ".container {\n  display: flex;\n  justify-content: center;\n  align-items: center;\n  gap: 16px;\n}" },
    { h: "Direction", content: "Control the main axis.", code: ".row { flex-direction: row; }\n.col { flex-direction: column; }" },
    { h: "Grow/Shrink", content: "Control how items fill space.", code: ".item { flex: 1; } /* grow to fill */\n.fixed { flex: 0 0 200px; } /* fixed width */" },
  ]},
  "typescript-basics": { title: "TypeScript Basics", intro: "Add types to JavaScript.", sections: [
    { h: "Basic Types", content: "Annotate variables with types.", code: "let name: string = 'Sol';\nlet age: number = 25;\nlet active: boolean = true;\nlet tags: string[] = ['dev', 'crypto'];" },
    { h: "Interfaces", content: "Define object shapes.", code: "interface User {\n  name: string;\n  age: number;\n  email?: string; // optional\n}" },
    { h: "Generics", content: "Write reusable typed functions.", code: "function first<T>(arr: T[]): T | undefined {\n  return arr[0];\n}\nfirst([1,2,3]); // number\nfirst(['a','b']); // string" },
  ]},
};

export function generateStaticParams() { return Object.keys(TUTORIALS).map(slug => ({ slug })); }

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const t = TUTORIALS[params.slug];
  if (!t) return { title: "Tutorial" };
  return { title: `${t.title} Tutorial — Learn in 5 Minutes`, description: `${t.title} tutorial with code examples. Learn the fundamentals quickly.` };
}

export default function LearnPage({ params }: { params: { slug: string } }) {
  const t = TUTORIALS[params.slug];
  if (!t) return <div>Not found</div>;
  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <div className="max-w-3xl mx-auto px-4 py-16">
        <h1 className="text-4xl font-extrabold mb-2 text-center">{t.title}</h1>
        <p className="text-gray-400 text-center mb-8">{t.intro}</p>
        <div className="flex flex-wrap gap-2 justify-center mb-8">
          {Object.entries(TUTORIALS).map(([slug, tut]) => (
            <a key={slug} href={`/learn/${slug}`} className={`text-xs px-3 py-1 rounded-lg ${slug === params.slug ? "bg-purple-600" : "bg-gray-800 hover:bg-gray-700"}`}>{tut.title}</a>
          ))}
        </div>
        {t.sections.map((s, i) => (
          <div key={i} className="mb-8">
            <h2 className="text-xl font-bold mb-2 text-purple-400">{s.h}</h2>
            <p className="text-gray-300 mb-3">{s.content}</p>
            {s.code && <pre className="bg-gray-900 rounded-xl p-4 text-sm text-green-400 font-mono overflow-x-auto whitespace-pre">{s.code}</pre>}
          </div>
        ))}
        <div className="text-center text-gray-500 text-sm mt-12">
          <a href={`/cheatsheet/${params.slug.split('-')[0]}`} className="text-purple-400 hover:underline">Cheat Sheet</a>{" | "}
          <a href="/json" className="text-purple-400 hover:underline">JSON</a>{" | "}
          <a href="/regex" className="text-purple-400 hover:underline">Regex</a>{" | "}
          <a href="/" className="text-purple-400 hover:underline">All Tools</a>
        </div>
      </div>
    </div>
  );
}
