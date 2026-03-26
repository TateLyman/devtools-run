"use client";
import { useState } from "react";

const EMOJIS: Record<string, string[]> = {
  "Smileys": ["😀","😃","😄","😁","😆","😅","🤣","😂","🙂","😊","😇","🥰","😍","🤩","😘","😗","😚","😙","🥲","😋","😛","😜","🤪","😝","🤑","🤗","🤭","🫢","🫣","🤫","🤔","🫡","🤐","🤨","😐","😑","😶","🫥","😏","😒","🙄","😬","🤥","😌","😔","😪","🤤","😴","😷","🤒","🤕","🤢","🤮","🥵","🥶","🥴","😵","🤯","🤠","🥳","🥸","😎","🤓","🧐","😕","🫤","😟","🙁","☹️","😮","😯","😲","😳","🥺","🥹","😦","😧","😨","😰","😥","😢","😭","😱","😖","😣","😞","😓","😩","😫","🥱","😤","😡","😠","🤬","😈","👿","💀","☠️","💩","🤡","👹","👺","👻","👽","👾","🤖"],
  "People": ["👋","🤚","🖐️","✋","🖖","🫱","🫲","🫳","🫴","👌","🤌","🤏","✌️","🤞","🫰","🤟","🤘","🤙","👈","👉","👆","🖕","👇","☝️","🫵","👍","👎","✊","👊","🤛","🤜","👏","🙌","🫶","👐","🤲","🤝","🙏","✍️","💅","🤳","💪","🦾","🦿","🦵","🦶","👂","🦻","👃","🧠","🫀","🫁","🦷","🦴","👀","👁️","👅","👄"],
  "Animals": ["🐶","🐱","🐭","🐹","🐰","🦊","🐻","🐼","🐨","🐯","🦁","🐮","🐷","🐸","🐵","🙈","🙉","🙊","🐒","🐔","🐧","🐦","🐤","🐣","🐥","🦆","🦅","🦉","🦇","🐺","🐗","🐴","🦄","🐝","🪱","🐛","🦋","🐌","🐞","🐜","🪰","🪲","🪳","🦟","🦗","🕷️","🦂","🐢","🐍","🦎","🦖","🦕","🐙","🦑","🦐","🦞","🦀","🐡","🐠","🐟","🐬","🐳","🐋","🦈","🐊","🐅","🐆","🦓","🦍","🦧","🐘","🦛","🦏","🐪","🐫","🦒","🦘","🦬","🐃","🐂","🐄","🐎","🐖","🐏","🐑","🦙","🐐","🦌","🐕","🐩","🦮","🐕‍🦺","🐈","🐈‍⬛","🪶","🐓","🦃","🦤","🦚","🦜","🦢","🦩","🕊️","🐇","🦝","🦨","🦡","🦫","🦦","🦥","🐁","🐀","🐿️","🦔"],
  "Food": ["🍏","🍎","🍐","🍊","🍋","🍌","🍉","🍇","🍓","🫐","🍈","🍒","🍑","🥭","🍍","🥥","🥝","🍅","🍆","🥑","🥦","🥬","🥒","🌶️","🫑","🌽","🥕","🫒","🧄","🧅","🥔","🍠","🫘","🥐","🍞","🥖","🥨","🧀","🥚","🍳","🧈","🥞","🧇","🥓","🥩","🍗","🍖","🦴","🌭","🍔","🍟","🍕","🫓","🥪","🥙","🧆","🌮","🌯","🫔","🥗","🥘","🫕","🥫","🍝","🍜","🍲","🍛","🍣","🍱","🥟","🦪","🍤","🍙","🍚","🍘","🍥","🥠","🥮","🍢","🍡","🍧","🍨","🍦","🥧","🧁","🍰","🎂","🍮","🍭","🍬","🍫","🍿","🍩","🍪","🌰","🥜","🍯","🥛","🍼","🫖","☕","🍵","🧃","🥤","🧋","🍶","🍺","🍻","🥂","🍷","🥃","🍸","🍹","🧉","🍾","🧊"],
  "Travel": ["🚗","🚕","🚙","🚌","🚎","🏎️","🚓","🚑","🚒","🚐","🛻","🚚","🚛","🚜","🛴","🚲","🛵","🏍️","🛺","✈️","🚀","🛸","🚁","🛶","⛵","🚤","🛥️","🛳️","⛴️","🚢","🏠","🏡","🏢","🏣","🏤","🏥","🏦","🏨","🏩","🏪","🏫","🏬","🗼","🗽","⛪","🕌","🛕","🕍","⛩️","🕋","⛲","⛺","🌁","🌃","🏙️","🌄","🌅","🌆","🌇","🌉","🎠","🛝","🎡","🎢","🏗️","🌋","🗻","🏔️","⛰️","🏕️","🏖️","🏜️","🏝️"],
  "Objects": ["⌚","📱","💻","⌨️","🖥️","🖨️","🖱️","🖲️","🕹️","🗜️","💽","💾","💿","📀","📼","📷","📸","📹","🎥","📽️","🎞️","📞","☎️","📟","📠","📺","📻","🎙️","🎚️","🎛️","🧭","⏱️","⏲️","⏰","🕰️","⌛","⏳","📡","🔋","🔌","💡","🔦","🕯️","🪔","🧯","🛢️","💸","💵","💴","💶","💷","🪙","💰","💳","🧲","⚗️","🧪","🧫","🧬","🔬","🔭","📡"],
  "Hearts": ["❤️","🧡","💛","💚","💙","💜","🖤","🤍","🤎","💔","❤️‍🔥","❤️‍🩹","❣️","💕","💞","💓","💗","💖","💘","💝","💟"],
  "Symbols": ["✅","❌","⭕","🔴","🟠","🟡","🟢","🔵","🟣","⚫","⚪","🟤","❗","❓","‼️","⁉️","💯","🔥","✨","⭐","🌟","💫","⚡","💥","🎵","🎶","🔔","🔕","📣","📢","💬","💭","🗯️","♠️","♣️","♥️","♦️","🃏","🎴","🀄","🔇","🔈","🔉","🔊","📤","📥","📦","📫","📬","📭","📮","🏷️","📝"],
};

export default function EmojiSearch() {
  const [search, setSearch] = useState("");
  const [copied, setCopied] = useState("");
  const [cat, setCat] = useState("Smileys");

  const copy = (e: string) => { navigator.clipboard.writeText(e); setCopied(e); setTimeout(() => setCopied(""), 1000); };

  const allEmojis = Object.entries(EMOJIS).flatMap(([c, es]) => es.map(e => ({ emoji: e, category: c })));
  const filtered = search ? allEmojis.filter(e => e.category.toLowerCase().includes(search.toLowerCase())) : allEmojis.filter(e => e.category === cat);

  return (
    <div className="space-y-6">
      <section className="text-center">
        <h1 className="text-4xl font-bold mb-2">Emoji Search & Copy</h1>
        <p className="text-[var(--text-secondary)]">Click any emoji to copy it. {copied && <span className="text-emerald-400">Copied {copied}!</span>}</p>
      </section>

      <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-xl p-4">
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by category (Smileys, Animals, Food...)"
          className="w-full bg-[var(--bg-primary)] border border-[var(--border)] rounded-lg px-3 py-2" />
      </div>

      {!search && (
        <div className="flex flex-wrap gap-2 justify-center">
          {Object.keys(EMOJIS).map(c => (
            <button key={c} onClick={() => setCat(c)} className={`px-3 py-1 rounded-lg text-sm ${cat === c ? "bg-blue-600 text-white" : "bg-[var(--bg-secondary)] border border-[var(--border)]"}`}>{c}</button>
          ))}
        </div>
      )}

      <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-xl p-4">
        <div className="grid grid-cols-8 md:grid-cols-12 lg:grid-cols-16 gap-1">
          {filtered.map((e, i) => (
            <button key={i} onClick={() => copy(e.emoji)} className="text-2xl p-1 rounded hover:bg-[var(--bg-primary)] hover:scale-125 transition-transform cursor-pointer" title={`Copy ${e.emoji}`}>
              {e.emoji}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
