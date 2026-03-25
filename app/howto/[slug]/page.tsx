import { Metadata } from "next";

const HOWTOS: Record<string, { q: string; answer: string; code: string; tags: string[] }> = {
  "center-a-div": { q: "How to Center a Div in CSS", answer: "Use flexbox on the parent container.", code: ".parent {\n  display: flex;\n  justify-content: center;\n  align-items: center;\n  height: 100vh;\n}", tags: ["css"] },
  "parse-json-javascript": { q: "How to Parse JSON in JavaScript", answer: "Use JSON.parse() for strings, or fetch().json() for API responses.", code: "// From string\nconst data = JSON.parse('{\"name\":\"Sol\"}');\n\n// From API\nconst res = await fetch('/api');\nconst data = await res.json();", tags: ["javascript"] },
  "reverse-a-string": { q: "How to Reverse a String", answer: "Split into array, reverse, join back.", code: "// JavaScript\nconst reversed = str.split('').reverse().join('');\n\n// Python\nreversed_str = s[::-1]", tags: ["javascript","python"] },
  "remove-duplicates-array": { q: "How to Remove Duplicates from Array", answer: "Use Set for unique values.", code: "// JavaScript\nconst unique = [...new Set(arr)];\n\n// Python\nunique = list(set(arr))", tags: ["javascript","python"] },
  "read-file-nodejs": { q: "How to Read a File in Node.js", answer: "Use fs.readFileSync for sync, fs.promises.readFile for async.", code: "import fs from 'fs';\n\n// Sync\nconst data = fs.readFileSync('file.txt', 'utf8');\n\n// Async\nconst data = await fs.promises.readFile('file.txt', 'utf8');", tags: ["nodejs"] },
  "make-api-call": { q: "How to Make an API Call", answer: "Use fetch() in JavaScript or requests in Python.", code: "// JavaScript\nconst res = await fetch('https://api.example.com/data');\nconst data = await res.json();\n\n// Python\nimport requests\nres = requests.get('https://api.example.com/data')\ndata = res.json()", tags: ["javascript","python"] },
  "sort-array": { q: "How to Sort an Array", answer: "Use .sort() with a compare function for numbers.", code: "// JavaScript\nnums.sort((a, b) => a - b); // ascending\nstrs.sort(); // alphabetical\n\n// Python\nnums.sort()  # in-place\nsorted_nums = sorted(nums)  # new list", tags: ["javascript","python"] },
  "convert-string-to-number": { q: "How to Convert String to Number", answer: "Use parseInt/parseFloat or Number() in JS, int()/float() in Python.", code: "// JavaScript\nNumber('42')     // 42\nparseInt('42px') // 42\nparseFloat('3.14') // 3.14\n\n// Python\nint('42')    # 42\nfloat('3.14') # 3.14", tags: ["javascript","python"] },
  "check-if-array-contains": { q: "How to Check if Array Contains a Value", answer: "Use .includes() in JS, 'in' in Python.", code: "// JavaScript\n[1, 2, 3].includes(2) // true\n\n// Python\n2 in [1, 2, 3]  # True", tags: ["javascript","python"] },
  "format-date": { q: "How to Format a Date", answer: "Use toLocaleDateString() or Intl.DateTimeFormat in JS.", code: "// JavaScript\nnew Date().toLocaleDateString('en-US')\n// '3/24/2026'\n\nnew Date().toISOString()\n// '2026-03-24T...'\n\n// Python\nfrom datetime import datetime\ndatetime.now().strftime('%Y-%m-%d')", tags: ["javascript","python"] },
  "merge-objects": { q: "How to Merge Objects in JavaScript", answer: "Use spread operator or Object.assign().", code: "const merged = { ...obj1, ...obj2 };\n// or\nconst merged = Object.assign({}, obj1, obj2);", tags: ["javascript"] },
  "create-react-app": { q: "How to Create a React App", answer: "Use Vite or Next.js (Create React App is deprecated).", code: "# Vite (recommended)\nnpm create vite@latest my-app -- --template react-ts\n\n# Next.js\nnpx create-next-app@latest my-app", tags: ["react"] },
  "connect-to-database": { q: "How to Connect to a Database in Node.js", answer: "Use a client library for your database.", code: "// PostgreSQL\nimport pg from 'pg';\nconst pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });\nconst { rows } = await pool.query('SELECT * FROM users');\n\n// MongoDB\nimport { MongoClient } from 'mongodb';\nconst client = new MongoClient(process.env.MONGO_URL);", tags: ["nodejs"] },
  "deploy-to-vercel": { q: "How to Deploy to Vercel", answer: "Push to GitHub and connect to Vercel, or use the CLI.", code: "# CLI deploy\nnpm i -g vercel\nvercel\n\n# Or connect GitHub repo at vercel.com\n# Auto-deploys on every push to main", tags: ["devops"] },
  "use-environment-variables": { q: "How to Use Environment Variables", answer: "Use .env files with dotenv or framework built-in support.", code: "# .env file\nDATABASE_URL=postgres://...\nAPI_KEY=abc123\n\n// Node.js\nprocess.env.DATABASE_URL\n\n// Next.js (client)\nprocess.env.NEXT_PUBLIC_API_KEY", tags: ["nodejs"] },
  "handle-cors": { q: "How to Fix CORS Errors", answer: "Set Access-Control-Allow-Origin header on your server.", code: "// Express\napp.use((req, res, next) => {\n  res.header('Access-Control-Allow-Origin', '*');\n  res.header('Access-Control-Allow-Headers', 'Content-Type');\n  next();\n});\n\n// Or use cors package\nimport cors from 'cors';\napp.use(cors());", tags: ["nodejs"] },
  "generate-random-number": { q: "How to Generate a Random Number", answer: "Use Math.random() in JS, random module in Python.", code: "// JavaScript (1-100)\nMath.floor(Math.random() * 100) + 1\n\n// Python\nimport random\nrandom.randint(1, 100)", tags: ["javascript","python"] },
  "copy-to-clipboard": { q: "How to Copy Text to Clipboard", answer: "Use the Clipboard API.", code: "// Modern browsers\nawait navigator.clipboard.writeText('Hello!');\n\n// React\nfunction CopyButton({ text }) {\n  return <button onClick={() => navigator.clipboard.writeText(text)}>Copy</button>;\n}", tags: ["javascript","react"] },
};

export function generateStaticParams() { return Object.keys(HOWTOS).map(slug => ({ slug })); }

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const h = HOWTOS[params.slug];
  if (!h) return { title: "How To" };
  return { title: h.q, description: `${h.q} — Quick answer with code examples. Copy-paste ready.` };
}

export default function HowToPage({ params }: { params: { slug: string } }) {
  const h = HOWTOS[params.slug];
  if (!h) return <div>Not found</div>;
  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <div className="max-w-3xl mx-auto px-4 py-16">
        <h1 className="text-3xl font-extrabold mb-4">{h.q}</h1>
        <p className="text-lg text-gray-300 mb-6">{h.answer}</p>
        <pre className="bg-gray-900 rounded-xl p-6 text-sm text-green-400 font-mono overflow-x-auto whitespace-pre mb-8">{h.code}</pre>
        <button onClick={() => {}} className="bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-lg text-sm font-bold mb-8">Copy Code</button>
        <div className="bg-gray-900 rounded-xl p-4 mb-8">
          <div className="text-xs text-gray-400 mb-2">More how-tos</div>
          <div className="flex flex-wrap gap-1">
            {Object.entries(HOWTOS).slice(0, 12).map(([slug, item]) => (
              <a key={slug} href={`/howto/${slug}`} className={`text-xs px-2 py-1 rounded ${slug === params.slug ? "bg-purple-600" : "bg-gray-800 hover:bg-gray-700"}`}>
                {item.q.replace("How to ", "")}
              </a>
            ))}
          </div>
        </div>
        <div className="text-center text-gray-500 text-sm">
          <a href="/cheatsheet/javascript" className="text-purple-400 hover:underline">JS Cheatsheet</a>{" | "}
          <a href="/json" className="text-purple-400 hover:underline">JSON</a>{" | "}
          <a href="/regex" className="text-purple-400 hover:underline">Regex</a>{" | "}
          <a href="/" className="text-purple-400 hover:underline">All Tools</a>
        </div>
      </div>
    </div>
  );
}
