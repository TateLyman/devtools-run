import { Metadata } from "next";

const INTERVIEWS: Record<string, { title: string; qs: { q: string; a: string }[] }> = {
  javascript: { title: "JavaScript Interview Questions", qs: [
    { q: "What is closure?", a: "A closure is a function that has access to variables from its outer scope even after the outer function has returned." },
    { q: "let vs const vs var?", a: "var is function-scoped and hoisted. let is block-scoped. const is block-scoped and cannot be reassigned." },
    { q: "What is the event loop?", a: "The event loop checks the call stack and task queue. When the stack is empty, it pushes the next task from the queue." },
    { q: "== vs ===?", a: "== does type coercion. === compares value and type without coercion. Always use ===." },
    { q: "What are Promises?", a: "A Promise represents a future value. Can be pending, fulfilled, or rejected. Use async/await or .then()/.catch()." },
    { q: "What is hoisting?", a: "Declarations are moved to the top of scope. var is hoisted as undefined. let/const have temporal dead zone." },
    { q: "null vs undefined?", a: "undefined = declared but not assigned. null = intentional absence of value." },
    { q: "What is prototypal inheritance?", a: "Objects inherit from other objects via the prototype chain. __proto__ points to the prototype." },
  ]},
  react: { title: "React Interview Questions", qs: [
    { q: "What is the virtual DOM?", a: "A lightweight DOM copy. React diffs virtual DOMs and only updates what changed in the real DOM." },
    { q: "What are hooks?", a: "Functions for state and lifecycle in function components. useState, useEffect, useRef, useMemo, useCallback." },
    { q: "State vs props?", a: "Props are passed down and read-only. State is internal and mutable via setState/useState." },
    { q: "What is useEffect?", a: "Runs side effects after render. Empty deps = once. No deps = every render." },
    { q: "What is the key prop?", a: "Helps React track list items. Use unique stable IDs, never array index for dynamic lists." },
  ]},
  python: { title: "Python Interview Questions", qs: [
    { q: "What is the GIL?", a: "Global Interpreter Lock prevents parallel thread execution. Use multiprocessing for CPU-bound tasks." },
    { q: "What are decorators?", a: "Functions that modify other functions. @decorator syntax. Takes function in, returns modified function." },
    { q: "List vs tuple?", a: "Lists are mutable. Tuples are immutable and slightly faster." },
    { q: "*args and **kwargs?", a: "*args = positional args as tuple. **kwargs = keyword args as dictionary." },
    { q: "What is a generator?", a: "Uses yield instead of return. Produces values lazily, saving memory." },
  ]},
  sql: { title: "SQL Interview Questions", qs: [
    { q: "WHERE vs HAVING?", a: "WHERE filters before GROUP BY. HAVING filters after GROUP BY." },
    { q: "What are JOINs?", a: "INNER = matching rows. LEFT = all left + matches. RIGHT = all right + matches. FULL = everything." },
    { q: "What is an index?", a: "Data structure that speeds up lookups. Faster reads, slower writes." },
    { q: "What is ACID?", a: "Atomicity, Consistency, Isolation, Durability. Guarantees for database transactions." },
  ]},
};

export function generateStaticParams() { return Object.keys(INTERVIEWS).map(slug => ({ slug })); }
export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const i = INTERVIEWS[params.slug];
  if (!i) return { title: "Interview Questions" };
  return { title: `${i.title} — Top ${i.qs.length} Questions & Answers`, description: `${i.title} with answers. Ace your interview.` };
}
export default function InterviewPage({ params }: { params: { slug: string } }) {
  const data = INTERVIEWS[params.slug];
  if (!data) return <div>Not found</div>;
  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <div className="max-w-3xl mx-auto px-4 py-16">
        <h1 className="text-3xl font-extrabold mb-2 text-center">{data.title}</h1>
        <p className="text-gray-400 text-center mb-8">Top {data.qs.length} questions with answers.</p>
        <div className="flex flex-wrap gap-2 justify-center mb-8">
          {Object.entries(INTERVIEWS).map(([slug, i]) => (
            <a key={slug} href={`/interview/${slug}`} className={`text-xs px-3 py-1 rounded-lg ${slug === params.slug ? "bg-purple-600" : "bg-gray-800 hover:bg-gray-700"}`}>{i.title.replace(" Interview Questions", "")}</a>
          ))}
        </div>
        <div className="space-y-4">
          {data.qs.map((item, i) => (
            <div key={i} className="bg-gray-900 rounded-xl p-5">
              <div className="flex items-start gap-3 mb-2">
                <span className="bg-purple-600 text-white w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">{i+1}</span>
                <h2 className="font-bold">{item.q}</h2>
              </div>
              <p className="text-gray-300 text-sm ml-10">{item.a}</p>
            </div>
          ))}
        </div>
        <div className="mt-12 text-center text-gray-500 text-sm">
          <a href={`/cheatsheet/${params.slug}`} className="text-purple-400 hover:underline">Cheat Sheet</a>{" | "}
          <a href="/json" className="text-purple-400 hover:underline">JSON</a>{" | "}
          <a href="/" className="text-purple-400 hover:underline">All Tools</a>
        </div>
      </div>
    </div>
  );
}
