import { Metadata } from "next";

const SHEETS: Record<string, { title: string; sections: { heading: string; items: [string, string][] }[] }> = {
  javascript: { title: "JavaScript", sections: [
    { heading: "Variables", items: [["let x = 1","Block-scoped variable"],["const y = 2","Constant"],["var z = 3","Function-scoped (avoid)"]] },
    { heading: "Functions", items: [["function fn() {}","Declaration"],["const fn = () => {}","Arrow function"],["fn(...args)","Spread/rest"]] },
    { heading: "Arrays", items: [[".map(fn)","Transform each element"],[".filter(fn)","Keep matching"],[".reduce(fn, init)","Accumulate"],[".find(fn)","First match"],[".includes(x)","Contains?"],[".forEach(fn)","Loop"],["[...arr]","Spread/copy"]] },
    { heading: "Objects", items: [["{ ...obj }","Spread/copy"],["Object.keys(o)","Get keys"],["Object.values(o)","Get values"],["Object.entries(o)","Key-value pairs"],["{ a, b } = obj","Destructure"]] },
    { heading: "Async", items: [["async/await","Modern async"],["Promise.all([])","Parallel"],["fetch(url)","HTTP request"],["try/catch","Error handling"]] },
    { heading: "DOM", items: [["document.querySelector()","Select one"],["document.querySelectorAll()","Select all"],[".addEventListener()","Listen"],[".classList.add/remove/toggle()","Classes"],[".textContent","Get/set text"]] },
  ]},
  python: { title: "Python", sections: [
    { heading: "Basics", items: [["x = 1","Variable"],["print()","Output"],["input()","Input"],["type()","Check type"],["len()","Length"]] },
    { heading: "Data Types", items: [["list = [1,2,3]","List"],["dict = {'a':1}","Dictionary"],["set = {1,2,3}","Set"],["tuple = (1,2)","Tuple"],["str = 'hello'","String"]] },
    { heading: "Control Flow", items: [["if/elif/else","Conditional"],["for x in list:","For loop"],["while cond:","While loop"],["try/except","Error handling"],["with open() as f:","Context manager"]] },
    { heading: "Functions", items: [["def fn():","Define"],["lambda x: x+1","Anonymous"],["*args, **kwargs","Variable args"],["return value","Return"]] },
    { heading: "List Comprehensions", items: [["[x for x in list]","Transform"],["[x for x in list if x>0]","Filter"],["[f(x) for x in list]","Map"]] },
  ]},
  git: { title: "Git", sections: [
    { heading: "Setup", items: [["git init","Initialize repo"],["git clone url","Clone remote"],["git config user.name","Set name"],["git config user.email","Set email"]] },
    { heading: "Basic", items: [["git add .","Stage all"],["git commit -m 'msg'","Commit"],["git push","Push to remote"],["git pull","Pull from remote"],["git status","Check status"],["git log --oneline","View history"]] },
    { heading: "Branches", items: [["git branch name","Create branch"],["git checkout name","Switch branch"],["git checkout -b name","Create + switch"],["git merge name","Merge branch"],["git branch -d name","Delete branch"]] },
    { heading: "Undo", items: [["git reset HEAD~1","Undo last commit"],["git stash","Stash changes"],["git stash pop","Restore stash"],["git revert hash","Revert commit"],["git checkout -- file","Discard changes"]] },
  ]},
  react: { title: "React", sections: [
    { heading: "Components", items: [["function App() { return <div/> }","Function component"],["export default App","Export"],["<Component prop={val} />","Props"],["{ children }","Children prop"]] },
    { heading: "Hooks", items: [["useState(init)","State"],["useEffect(fn, [deps])","Side effects"],["useRef(init)","Mutable ref"],["useMemo(fn, [deps])","Memoize value"],["useCallback(fn, [deps])","Memoize function"],["useContext(ctx)","Context"]] },
    { heading: "JSX", items: [["{expression}","Dynamic value"],["{cond && <El/>}","Conditional render"],["{list.map(x => <El key={x}/>)}","List render"],["className='x'","CSS class"],["style={{color:'red'}}","Inline style"]] },
  ]},
  css: { title: "CSS", sections: [
    { heading: "Selectors", items: [[".class","Class"],["#id","ID"],["el","Element"],["el > child","Direct child"],["el + sibling","Adjacent"],["el:hover","Pseudo-class"],["el::before","Pseudo-element"]] },
    { heading: "Flexbox", items: [["display: flex","Enable"],["justify-content","Main axis"],["align-items","Cross axis"],["flex-direction","Row/column"],["flex-wrap","Wrapping"],["gap","Spacing"]] },
    { heading: "Grid", items: [["display: grid","Enable"],["grid-template-columns","Column sizes"],["grid-template-rows","Row sizes"],["grid-gap","Spacing"],["grid-column: span 2","Column span"]] },
    { heading: "Box Model", items: [["margin","Outside spacing"],["padding","Inside spacing"],["border","Border"],["box-sizing: border-box","Include padding in width"]] },
  ]},
  typescript: { title: "TypeScript", sections: [
    { heading: "Types", items: [["let x: string","String type"],["let n: number","Number type"],["let b: boolean","Boolean type"],["let a: string[]","Array type"],["let o: {k:string}","Object type"]] },
    { heading: "Advanced", items: [["interface Name {}","Interface"],["type Name = {}","Type alias"],["enum Dir {Up,Down}","Enum"],["T extends U","Constraint"],["keyof T","Key union"],["Partial<T>","All optional"],["Required<T>","All required"],["Record<K,V>","Key-value map"]] },
    { heading: "Generics", items: [["function fn<T>(x: T): T","Generic function"],["class Box<T>","Generic class"],["Array<T>","Generic type"]] },
  ]},
  sql: { title: "SQL", sections: [
    { heading: "Queries", items: [["SELECT * FROM t","Get all"],["SELECT a,b FROM t WHERE c=1","Filter"],["INSERT INTO t (a) VALUES (1)","Insert"],["UPDATE t SET a=1 WHERE b=2","Update"],["DELETE FROM t WHERE a=1","Delete"]] },
    { heading: "Joins", items: [["INNER JOIN","Both match"],["LEFT JOIN","All left + match"],["RIGHT JOIN","All right + match"],["FULL JOIN","All from both"]] },
    { heading: "Aggregate", items: [["COUNT(*)","Count rows"],["SUM(col)","Sum"],["AVG(col)","Average"],["GROUP BY col","Group"],["HAVING cond","Filter groups"],["ORDER BY col DESC","Sort"]] },
  ]},
  bash: { title: "Bash / Shell", sections: [
    { heading: "Basics", items: [["echo 'text'","Print"],["read var","Input"],["$var","Use variable"],["$(command)","Command substitution"]] },
    { heading: "Files", items: [["ls -la","List files"],["cd dir","Change dir"],["mkdir dir","Create dir"],["cp a b","Copy"],["mv a b","Move/rename"],["rm file","Delete"],["cat file","Read file"],["grep pattern file","Search"]] },
    { heading: "Control", items: [["if [ cond ]; then","If"],["for i in list; do","For loop"],["while [ cond ]; do","While"],["case $var in","Switch"],["fn() { }","Function"]] },
    { heading: "Pipes", items: [["cmd | cmd2","Pipe output"],["cmd > file","Write to file"],["cmd >> file","Append"],["cmd 2>&1","Redirect stderr"],["cmd &","Background"]] },
  ]},
};

export function generateStaticParams() {
  return Object.keys(SHEETS).map(slug => ({ slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const sheet = SHEETS[params.slug];
  if (!sheet) return { title: "Cheat Sheet" };
  return {
    title: `${sheet.title} Cheat Sheet — Quick Reference`,
    description: `${sheet.title} cheat sheet with syntax, commands, and examples. Free quick reference for developers.`,
  };
}

export default function CheatsheetPage({ params }: { params: { slug: string } }) {
  const sheet = SHEETS[params.slug];
  if (!sheet) return <div>Not found</div>;
  const allSheets = Object.entries(SHEETS);

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <div className="max-w-4xl mx-auto px-4 py-16">
        <h1 className="text-4xl font-extrabold mb-2 text-center">{sheet.title} Cheat Sheet</h1>
        <p className="text-gray-400 text-center mb-8">Quick reference for {sheet.title} syntax and commands.</p>
        <div className="flex flex-wrap gap-2 justify-center mb-8">
          {allSheets.map(([slug, s]) => (
            <a key={slug} href={`/cheatsheet/${slug}`}
              className={`px-3 py-1 rounded-lg text-sm font-bold ${slug === params.slug ? "bg-purple-600" : "bg-gray-800 hover:bg-gray-700"}`}>
              {s.title}
            </a>
          ))}
        </div>
        <div className="grid md:grid-cols-2 gap-6">
          {sheet.sections.map((s, i) => (
            <div key={i} className="bg-gray-900 rounded-xl p-5">
              <h2 className="font-bold text-purple-400 mb-3">{s.heading}</h2>
              <div className="space-y-1">
                {s.items.map(([code, desc], j) => (
                  <div key={j} className="flex gap-3 py-1 hover:bg-gray-800 rounded px-2 cursor-pointer"
                    onClick={() => navigator?.clipboard?.writeText(code)}>
                    <code className="text-green-400 font-mono text-xs flex-shrink-0" style={{minWidth:"45%"}}>{code}</code>
                    <span className="text-gray-400 text-xs">{desc}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
        <div className="mt-8 text-center text-gray-500 text-sm">
          <a href="/regex-cheatsheet" className="text-purple-400 hover:underline">Regex</a>{" | "}
          <a href="/http-status" className="text-purple-400 hover:underline">HTTP Codes</a>{" | "}
          <a href="/json" className="text-purple-400 hover:underline">JSON</a>{" | "}
          <a href="/curl-builder" className="text-purple-400 hover:underline">cURL</a>{" | "}
          <a href="/" className="text-purple-400 hover:underline">All Tools</a>
        </div>
      </div>
    </div>
  );
}
