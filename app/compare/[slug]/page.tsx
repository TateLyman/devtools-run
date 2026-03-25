import { Metadata } from "next";

const COMPARISONS: Record<string, { a: string; b: string; category: string; rows: [string, string, string][] }> = {
  "react-vs-vue": { a: "React", b: "Vue", category: "Frontend", rows: [
    ["Learning Curve", "Moderate — JSX + hooks", "Easy — template syntax"],
    ["Performance", "Virtual DOM, fast", "Virtual DOM, slightly faster"],
    ["Ecosystem", "Massive (Next.js, Redux)", "Growing (Nuxt, Pinia)"],
    ["State Management", "useState, Redux, Zustand", "Reactive refs, Pinia"],
    ["Backed By", "Meta (Facebook)", "Community + sponsors"],
    ["TypeScript", "Excellent support", "Built-in support"],
    ["Bundle Size", "~42KB", "~33KB"],
    ["Job Market", "Very high demand", "High demand, growing"],
  ]},
  "python-vs-javascript": { a: "Python", b: "JavaScript", category: "Language", rows: [
    ["Use Case", "Backend, AI/ML, scripting", "Frontend + backend (full-stack)"],
    ["Speed", "Slower (interpreted)", "Faster (V8 JIT compiled)"],
    ["Typing", "Dynamic, optional hints", "Dynamic, TypeScript for types"],
    ["Package Manager", "pip", "npm/yarn/pnpm"],
    ["Web Framework", "Django, Flask, FastAPI", "Express, Next.js, Hono"],
    ["Learning Curve", "Very easy", "Easy (quirks in types/async)"],
    ["Concurrency", "GIL limits threading", "Event loop, non-blocking"],
    ["Job Market", "AI/ML dominant", "Web dominant"],
  ]},
  "nextjs-vs-remix": { a: "Next.js", b: "Remix", category: "Framework", rows: [
    ["Rendering", "SSR, SSG, ISR, client", "SSR, streaming"],
    ["Data Loading", "getServerSideProps, RSC", "Loaders + actions"],
    ["Routing", "File-based", "File-based (nested)"],
    ["Hosting", "Vercel optimized", "Any Node.js host"],
    ["Bundle Size", "Larger", "Smaller"],
    ["Community", "Very large", "Growing"],
  ]},
  "typescript-vs-javascript": { a: "TypeScript", b: "JavaScript", category: "Language", rows: [
    ["Type Safety", "Static types, compile-time checks", "No types (runtime errors)"],
    ["Learning Curve", "Moderate (types to learn)", "Easy"],
    ["Tooling", "Better autocomplete, refactoring", "Standard"],
    ["Build Step", "Required (tsc)", "None"],
    ["Adoption", "Growing fast", "Universal"],
    ["Performance", "Same (compiles to JS)", "Same"],
  ]},
  "postgres-vs-mysql": { a: "PostgreSQL", b: "MySQL", category: "Database", rows: [
    ["Standards", "Very SQL compliant", "Mostly compliant"],
    ["JSON Support", "Excellent (JSONB)", "Basic (JSON type)"],
    ["Performance", "Better for complex queries", "Better for simple reads"],
    ["Extensions", "Rich (PostGIS, pg_vector)", "Limited"],
    ["Replication", "Built-in logical", "Built-in"],
    ["License", "PostgreSQL (permissive)", "GPL (dual license)"],
  ]},
  "docker-vs-kubernetes": { a: "Docker", b: "Kubernetes", category: "DevOps", rows: [
    ["Purpose", "Container runtime", "Container orchestration"],
    ["Scale", "Single host", "Multi-host clusters"],
    ["Complexity", "Simple", "Complex"],
    ["Use Case", "Dev, small deployments", "Production, large scale"],
    ["Learning Curve", "Easy", "Steep"],
    ["Networking", "Bridge/host", "Built-in service mesh"],
  ]},
  "tailwind-vs-bootstrap": { a: "Tailwind CSS", b: "Bootstrap", category: "CSS", rows: [
    ["Approach", "Utility-first", "Component-based"],
    ["Customization", "Highly customizable", "Theme variables"],
    ["Bundle Size", "Purged = tiny", "Larger (~150KB)"],
    ["Learning Curve", "Moderate (class names)", "Easy (pre-built components)"],
    ["Design Freedom", "Full control", "Bootstrap look unless customized"],
    ["JavaScript", "None required", "Includes JS components"],
  ]},
  "rest-vs-graphql": { a: "REST", b: "GraphQL", category: "API", rows: [
    ["Data Fetching", "Multiple endpoints", "Single endpoint, query what you need"],
    ["Over-fetching", "Common", "Eliminated"],
    ["Caching", "HTTP caching built-in", "Requires custom solution"],
    ["Learning Curve", "Simple", "Moderate (schema, resolvers)"],
    ["Tooling", "Universal", "Playground, codegen"],
    ["File Upload", "Native", "Needs multipart spec"],
  ]},
};

function pretty(s: string) { return s.replace(/-/g, " ").replace(/\b\w/g, c => c.toUpperCase()); }

export function generateStaticParams() {
  return Object.keys(COMPARISONS).map(slug => ({ slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const c = COMPARISONS[params.slug];
  if (!c) return { title: "Comparison" };
  return {
    title: `${c.a} vs ${c.b} — Side-by-Side Comparison`,
    description: `Compare ${c.a} and ${c.b} side by side. Key differences, pros, cons, and when to use each.`,
  };
}

export default function ComparePage({ params }: { params: { slug: string } }) {
  const c = COMPARISONS[params.slug];
  if (!c) return <div>Not found</div>;
  const all = Object.entries(COMPARISONS);

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <div className="max-w-4xl mx-auto px-4 py-16">
        <h1 className="text-3xl font-extrabold mb-2 text-center">{c.a} vs {c.b}</h1>
        <p className="text-gray-400 text-center mb-8">Side-by-side comparison for developers.</p>
        <div className="overflow-x-auto mb-8">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-700">
                <th className="text-left py-3 px-4 text-gray-400">Feature</th>
                <th className="text-left py-3 px-4 text-purple-400">{c.a}</th>
                <th className="text-left py-3 px-4 text-blue-400">{c.b}</th>
              </tr>
            </thead>
            <tbody>
              {c.rows.map(([feature, a, b], i) => (
                <tr key={i} className="border-b border-gray-800">
                  <td className="py-3 px-4 font-bold text-gray-300">{feature}</td>
                  <td className="py-3 px-4 text-gray-400">{a}</td>
                  <td className="py-3 px-4 text-gray-400">{b}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="bg-gray-900 rounded-xl p-4 mb-8">
          <div className="text-xs text-gray-400 mb-2">More comparisons</div>
          <div className="flex flex-wrap gap-2">
            {all.map(([slug, comp]) => (
              <a key={slug} href={`/compare/${slug}`}
                className={`text-xs px-3 py-1 rounded-lg ${slug === params.slug ? "bg-purple-600" : "bg-gray-800 hover:bg-gray-700"}`}>
                {comp.a} vs {comp.b}
              </a>
            ))}
          </div>
        </div>
        <div className="text-center text-gray-500 text-sm">
          <a href="/cheatsheet/javascript" className="text-purple-400 hover:underline">JS Cheatsheet</a>{" | "}
          <a href="/cheatsheet/python" className="text-purple-400 hover:underline">Python</a>{" | "}
          <a href="/json" className="text-purple-400 hover:underline">JSON</a>{" | "}
          <a href="/regex" className="text-purple-400 hover:underline">Regex</a>{" | "}
          <a href="/" className="text-purple-400 hover:underline">All Tools</a>
        </div>
      </div>
    </div>
  );
}
