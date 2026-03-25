"use client";

const SECTIONS = [
  {title:"Characters",items:[[".",	"Any character except newline"],["\\.","Literal dot"],["\\d","Digit [0-9]"],["\\D","Not a digit"],["\\w","Word char [a-zA-Z0-9_]"],["\\W","Not a word char"],["\\s","Whitespace"],["\\S","Not whitespace"],["\\b","Word boundary"],["\\B","Not a word boundary"]]},
  {title:"Quantifiers",items:[["*","0 or more"],["+","1 or more"],["?","0 or 1"],["{3}","Exactly 3"],["{3,}","3 or more"],["{3,5}","3 to 5"],["*?","Lazy 0+"],["+?","Lazy 1+"]]},
  {title:"Groups & Lookaround",items:[["(abc)","Capture group"],["(?:abc)","Non-capturing group"],["(?=abc)","Positive lookahead"],["(?!abc)","Negative lookahead"],["(?<=abc)","Positive lookbehind"],["(?<!abc)","Negative lookbehind"]]},
  {title:"Anchors",items:[["^","Start of string"],["$","End of string"],["\\A","Start of string (multiline)"],["\\Z","End of string (multiline)"]]},
  {title:"Character Classes",items:[["[abc]","a, b, or c"],["[^abc]","Not a, b, or c"],["[a-z]","a to z"],["[A-Z]","A to Z"],["[0-9]","0 to 9"],["[a-zA-Z]","Any letter"]]},
  {title:"Flags",items:[["g","Global"],["i","Case insensitive"],["m","Multiline"],["s","Dotall (. matches \\n)"],["u","Unicode"],["y","Sticky"]]},
  {title:"Common Patterns",items:[["^\\S+@\\S+\\.\\S+$","Email (basic)"],["^https?://","URL"],["^\\d{3}-\\d{3}-\\d{4}$","US Phone"],["^\\d{5}(-\\d{4})?$","US Zip"],["^#?([a-fA-F0-9]{6}|[a-fA-F0-9]{3})$","Hex Color"]]},
];

export default function RegexCheatsheetPage() {
  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <div className="max-w-4xl mx-auto px-4 py-16">
        <h1 className="text-4xl font-extrabold mb-2 text-center">Regex Cheat Sheet</h1>
        <p className="text-gray-400 text-center mb-8">Quick reference for regular expressions. Click any pattern to copy.</p>
        <div className="grid md:grid-cols-2 gap-6">
          {SECTIONS.map((s, i) => (
            <div key={i} className="bg-gray-900 rounded-xl p-5">
              <h2 className="font-bold text-purple-400 mb-3">{s.title}</h2>
              <div className="space-y-1">
                {s.items.map(([pattern, desc], j) => (
                  <div key={j} className="flex items-center gap-3 py-1 hover:bg-gray-800 rounded px-2 cursor-pointer"
                    onClick={() => navigator.clipboard.writeText(pattern)}>
                    <code className="text-green-400 font-mono text-sm w-32 flex-shrink-0">{pattern}</code>
                    <span className="text-gray-400 text-xs">{desc}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
        <div className="mt-8 text-center">
          <a href="/regex" className="inline-block bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-6 rounded-lg text-sm">Open Regex Tester</a>
        </div>
        <div className="mt-8 text-center text-gray-500 text-sm">
          <a href="/regex" className="text-purple-400 hover:underline">Regex Tester</a>{" | "}
          <a href="/json" className="text-purple-400 hover:underline">JSON</a>{" | "}
          <a href="/base64" className="text-purple-400 hover:underline">Base64</a>{" | "}
          <a href="/hash" className="text-purple-400 hover:underline">Hash</a>{" | "}
          <a href="/diff" className="text-purple-400 hover:underline">Diff</a>
        </div>
      </div>
    </div>
  );
}
