import { Metadata } from "next";

const SNIPPETS: Record<string, { lang: string; items: { title: string; code: string }[] }> = {
  "javascript-snippets": { lang: "JavaScript", items: [
    { title: "Debounce function", code: "function debounce(fn, ms) {\n  let timer;\n  return (...args) => {\n    clearTimeout(timer);\n    timer = setTimeout(() => fn(...args), ms);\n  };\n}" },
    { title: "Deep clone object", code: "const clone = structuredClone(obj);\n// or\nconst clone = JSON.parse(JSON.stringify(obj));" },
    { title: "Flatten array", code: "const flat = arr.flat(Infinity);\n// or\nconst flat = arr.reduce((a, b) => a.concat(b), []);" },
    { title: "Get unique values", code: "const unique = [...new Set(arr)];" },
    { title: "Sleep/delay", code: "const sleep = ms => new Promise(r => setTimeout(r, ms));\nawait sleep(1000);" },
    { title: "Random integer", code: "const rand = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;" },
    { title: "Chunk array", code: "const chunk = (arr, size) => Array.from({length: Math.ceil(arr.length/size)}, (_, i) => arr.slice(i*size, i*size+size));" },
    { title: "Capitalize string", code: "const cap = s => s.charAt(0).toUpperCase() + s.slice(1);" },
    { title: "Get query params", code: "const params = Object.fromEntries(new URLSearchParams(window.location.search));" },
    { title: "Format number", code: "const fmt = n => new Intl.NumberFormat().format(n);\nfmt(1234567); // '1,234,567'" },
  ]},
  "python-snippets": { lang: "Python", items: [
    { title: "Read JSON file", code: "import json\nwith open('data.json') as f:\n    data = json.load(f)" },
    { title: "List comprehension with filter", code: "evens = [x for x in range(100) if x % 2 == 0]" },
    { title: "Merge dictionaries", code: "merged = {**dict1, **dict2}\n# or Python 3.9+\nmerged = dict1 | dict2" },
    { title: "Flatten list", code: "flat = [item for sub in nested for item in sub]" },
    { title: "Timer decorator", code: "import time\ndef timer(fn):\n    def wrapper(*args):\n        start = time.time()\n        result = fn(*args)\n        print(f'{fn.__name__}: {time.time()-start:.2f}s')\n        return result\n    return wrapper" },
    { title: "Retry with backoff", code: "import time\ndef retry(fn, attempts=3):\n    for i in range(attempts):\n        try: return fn()\n        except: time.sleep(2**i)\n    raise Exception('Failed')" },
    { title: "Counter from list", code: "from collections import Counter\ncounts = Counter(['a','b','a','c','a'])\n# Counter({'a': 3, 'b': 1, 'c': 1})" },
    { title: "Download file", code: "import requests\nr = requests.get(url)\nwith open('file.zip', 'wb') as f:\n    f.write(r.content)" },
  ]},
  "css-snippets": { lang: "CSS", items: [
    { title: "Center anything", code: ".center {\n  display: flex;\n  justify-content: center;\n  align-items: center;\n}" },
    { title: "Smooth scroll", code: "html { scroll-behavior: smooth; }" },
    { title: "Truncate text", code: ".truncate {\n  overflow: hidden;\n  text-overflow: ellipsis;\n  white-space: nowrap;\n}" },
    { title: "Glass effect", code: ".glass {\n  background: rgba(255,255,255,0.1);\n  backdrop-filter: blur(10px);\n  border: 1px solid rgba(255,255,255,0.2);\n}" },
    { title: "Custom scrollbar", code: "::-webkit-scrollbar { width: 8px; }\n::-webkit-scrollbar-track { background: #1a1a2e; }\n::-webkit-scrollbar-thumb { background: #6c5ce7; border-radius: 4px; }" },
    { title: "Responsive grid", code: ".grid {\n  display: grid;\n  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));\n  gap: 16px;\n}" },
    { title: "Dark mode toggle", code: "@media (prefers-color-scheme: dark) {\n  :root { --bg: #0f0f0f; --text: #e0e0e0; }\n}" },
  ]},
  "react-snippets": { lang: "React", items: [
    { title: "Custom hook: useLocalStorage", code: "function useLocalStorage(key, init) {\n  const [val, setVal] = useState(() => {\n    const stored = localStorage.getItem(key);\n    return stored ? JSON.parse(stored) : init;\n  });\n  useEffect(() => localStorage.setItem(key, JSON.stringify(val)), [key, val]);\n  return [val, setVal];\n}" },
    { title: "Debounced input", code: "function useDebounce(value, delay) {\n  const [debounced, setDebounced] = useState(value);\n  useEffect(() => {\n    const timer = setTimeout(() => setDebounced(value), delay);\n    return () => clearTimeout(timer);\n  }, [value, delay]);\n  return debounced;\n}" },
    { title: "Click outside hook", code: "function useClickOutside(ref, handler) {\n  useEffect(() => {\n    const listener = e => {\n      if (!ref.current?.contains(e.target)) handler();\n    };\n    document.addEventListener('mousedown', listener);\n    return () => document.removeEventListener('mousedown', listener);\n  }, [ref, handler]);\n}" },
    { title: "Fetch with loading state", code: "function useFetch(url) {\n  const [data, setData] = useState(null);\n  const [loading, setLoading] = useState(true);\n  useEffect(() => {\n    fetch(url).then(r => r.json()).then(d => { setData(d); setLoading(false); });\n  }, [url]);\n  return { data, loading };\n}" },
    { title: "Conditional className", code: "<div className={`base ${active ? 'active' : ''} ${size === 'lg' ? 'large' : ''}`} />\n// or with clsx\n<div className={clsx('base', active && 'active', size === 'lg' && 'large')} />" },
  ]},
  "bash-snippets": { lang: "Bash", items: [
    { title: "Check if file exists", code: "if [ -f \"file.txt\" ]; then\n  echo \"exists\"\nfi" },
    { title: "Loop through files", code: "for f in *.txt; do\n  echo \"Processing $f\"\ndone" },
    { title: "Find and replace in files", code: "sed -i 's/old/new/g' file.txt\n# or across multiple files\nfind . -name '*.js' -exec sed -i 's/old/new/g' {} +" },
    { title: "Watch file changes", code: "while inotifywait -e modify file.txt; do\n  echo \"File changed\"\ndone\n# or on Mac\nfswatch file.txt | while read; do echo 'changed'; done" },
    { title: "Kill process on port", code: "lsof -ti:3000 | xargs kill -9" },
    { title: "Disk usage", code: "du -sh * | sort -rh | head -10" },
  ]},
};

export function generateStaticParams() { return Object.keys(SNIPPETS).map(slug => ({ slug })); }
export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const s = SNIPPETS[params.slug];
  if (!s) return { title: "Snippets" };
  return { title: `${s.lang} Code Snippets — Copy-Paste Ready`, description: `${s.items.length} useful ${s.lang} code snippets you can copy and paste into your projects.` };
}
export default function SnippetsPage({ params }: { params: { slug: string } }) {
  const s = SNIPPETS[params.slug];
  if (!s) return <div>Not found</div>;
  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <div className="max-w-3xl mx-auto px-4 py-16">
        <h1 className="text-3xl font-extrabold mb-2 text-center">{s.lang} Snippets</h1>
        <p className="text-gray-400 text-center mb-8">{s.items.length} copy-paste ready code snippets.</p>
        <div className="flex flex-wrap gap-2 justify-center mb-8">
          {Object.entries(SNIPPETS).map(([slug, sn]) => (
            <a key={slug} href={`/snippets/${slug}`} className={`text-xs px-3 py-1 rounded-lg ${slug === params.slug ? "bg-purple-600" : "bg-gray-800 hover:bg-gray-700"}`}>{sn.lang}</a>
          ))}
        </div>
        <div className="space-y-6">
          {s.items.map((item, i) => (
            <div key={i} className="bg-gray-900 rounded-xl p-5">
              <div className="flex justify-between mb-2">
                <h2 className="font-bold">{item.title}</h2>
                <button onClick={() => {}} className="text-xs text-purple-400 hover:underline">Copy</button>
              </div>
              <pre className="bg-gray-800 rounded-lg p-4 text-xs text-green-400 font-mono overflow-x-auto whitespace-pre">{item.code}</pre>
            </div>
          ))}
        </div>
        <div className="mt-12 text-center text-gray-500 text-sm">
          <a href={`/cheatsheet/${s.lang.toLowerCase()}`} className="text-purple-400 hover:underline">Cheat Sheet</a>{" | "}
          <a href="/json" className="text-purple-400 hover:underline">JSON</a>{" | "}
          <a href="/" className="text-purple-400 hover:underline">All Tools</a>
        </div>
      </div>
    </div>
  );
}
