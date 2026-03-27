"use client";
import { useState } from "react";
const STYLES: Record<string, string[]> = {
  "Lorem Ipsum": ["Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.","Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.","Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt."],
  "Hipster": ["Craft beer edison bulb pabst blue ribbon, man bun thundercats vexillologist narwhal tousled echo park humblebrag 90s food truck.","Tattooed sriracha actually, offal put a bird on it synth hella fanny pack tumblr deep v fixie artisan sustainable.","Bushwick raw denim hammock portland cold-pressed. Gluten-free cronut asymmetrical kombucha kinfolk chartreuse."],
  "Tech": ["We leverage cutting-edge blockchain technology with AI-driven microservices to deliver scalable, cloud-native solutions that disrupt traditional paradigms.","Our agile, data-driven approach combines machine learning pipelines with serverless architecture to optimize real-time user engagement metrics.","The platform utilizes distributed computing frameworks alongside zero-trust security models to ensure enterprise-grade reliability and performance at scale."],
  "Pirate": ["Arr, me hearties! Sail the seven seas of typography with this placeholder text. Shiver me timbers, this paragraph be filled with nautical nonsense.","Avast ye scallywags! The treasure of good design lies in testing with proper dummy content before the final copy walks the plank.","Yo ho ho and a bottle of rum! Every good website needs placeholder text that makes ye smile while building the layout."],
  "Corporate": ["Synergistically leverage existing core competencies to proactively drive innovation and maximize stakeholder value across all business verticals.","Our mission-critical deliverables are aligned with best-in-class methodologies to ensure seamless integration of cross-functional paradigms.","We holistically architect scalable frameworks that empower our teams to collaboratively drive results-oriented outcomes in a dynamic marketplace."],
};
export default function PlaceholderText() {
  const [style, setStyle] = useState("Lorem Ipsum");
  const [count, setCount] = useState(3);
  const text = Array.from({length: count}, (_, i) => STYLES[style][i % STYLES[style].length]).join("\n\n");
  return (
    <div className="space-y-6">
      <section className="text-center"><h1 className="text-4xl font-bold mb-2">Placeholder Text</h1><p className="text-[var(--text-secondary)]">Generate dummy text in different styles</p></section>
      <div className="flex flex-wrap gap-2 justify-center">
        {Object.keys(STYLES).map(s => (<button key={s} onClick={()=>setStyle(s)} className={`px-3 py-1 rounded text-sm ${style===s ? "bg-blue-600 text-white" : "bg-[var(--bg-secondary)] border border-[var(--border)]"}`}>{s}</button>))}
      </div>
      <div className="flex justify-center gap-3 items-center"><label className="text-sm text-[var(--text-secondary)]">Paragraphs:</label><input type="range" min={1} max={10} value={count} onChange={e=>setCount(Number(e.target.value))} className="w-40" /><span className="text-sm font-bold">{count}</span></div>
      <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-xl p-4">
        <div className="flex justify-between mb-2"><span className="text-xs text-[var(--text-secondary)]">{text.length} chars | {text.trim().split(/\s+/).length} words</span><button onClick={()=>navigator.clipboard.writeText(text)} className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-xs font-bold">Copy</button></div>
        <div className="text-sm text-[var(--text-secondary)] whitespace-pre-wrap max-h-96 overflow-y-auto">{text}</div>
      </div>
    </div>
  );
}
