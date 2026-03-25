"use client";
import { useState } from "react";

const EMOJIS = [
  ["Smileys","😀😃😄😁😆😅🤣😂🙂🙃😉😊😇🥰😍🤩😘😗☺😚😙🥲😋😛😜🤪😝🤑🤗🤭🤫🤔🫣🤐🤨😐😑😶😶‍🌫️😏😒🙄😬😮‍💨🤥🫨😌😔😪🤤😴😷🤒🤕🤢🤮🤧🥵🥶🥴😵😵‍💫🤯🤠🥳🥸😎🤓🧐😕🫤😟🙁☹😮😯😲😳🥺🥹😦😧😨😰😥😢😭😱😖😣😞😓😩😫🥱😤😡😠🤬"],
  ["Hands","👋🤚🖐✋🖖🫱🫲🫳🫴👌🤌🤏✌🤞🫰🤟🤘🤙👈👉👆🖕👇☝🫵👍👎✊👊🤛🤜👏🙌🫶👐🤝🤲🙏✍💅🤳💪🦾"],
  ["Hearts","❤️🧡💛💚💙💜🖤🤍🤎💔❣️💕💞💓💗💖💘💝💟"],
  ["Objects","⌚📱💻⌨🖥🖨🖱🖲🕹🗜💽💾💿📀📼📷📸📹🎥📽🎞📞☎📟📠📺📻🎙🎚🎛🧭⏱⏲⏰🕰⌛⏳📡🔋🪫🔌💡🔦🕯🪔🧯🛢💸💵💴💶💷🪙💰💳💎⚖🪜🧰🪛🔧🔩⚙🪤🧲🔫💣🪓🔪🗡⚔🛡🚬⚗🔬🔭📡💉🩸💊🩹🩼🩺🩻"],
  ["Nature","🌵🎄🌲🌳🌴🪵🌱🌿☘🍀🎍🎋🍃🍂🍁🪺🪹🍄🐚🪸🪨🌾💐🌷🌹🥀🌺🌸🌼🌻🌞🌝🌛🌜🌚🌕🌖🌗🌘🌑🌒🌓🌔🌙🌎🌍🌏🪐💫⭐🌟✨⚡☄💥🔥🌪🌈☀️🌤⛅🌥☁️🌦🌧⛈🌩🌨❄☃⛄🌬💨💧💦🫧☔☂🌊🌫"],
  ["Tech","💻🖥🖨⌨🖱💾💿📀🔌🔋📡🛰📶📱☎📞📟📠🔬🔭🧮🤖👾🕹🎮"],
  ["Money","💰💵💴💶💷💸💳🪙🏦🏧💹📈📉💱"],
  ["Flags","🏳🏴🏴‍☠️🏁🚩🏳️‍🌈🏳️‍⚧️🇺🇸🇬🇧🇨🇦🇦🇺🇩🇪🇫🇷🇯🇵🇰🇷🇧🇷🇮🇳🇷🇺🇨🇳"],
];

export default function EmojiPage() {
  const [search, setSearch] = useState("");
  const [copied, setCopied] = useState("");

  function copy(e: string) {
    navigator.clipboard.writeText(e);
    setCopied(e);
    setTimeout(() => setCopied(""), 1000);
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <div className="max-w-3xl mx-auto px-4 py-16">
        <h1 className="text-4xl font-extrabold mb-2 text-center">Emoji Picker</h1>
        <p className="text-gray-400 text-center mb-8">Click any emoji to copy it. {copied && <span className="text-green-400">Copied {copied}!</span>}</p>
        <div className="space-y-6">
          {EMOJIS.map(([cat, emojis], i) => (
            <div key={i}>
              <div className="text-sm text-gray-400 mb-2">{cat}</div>
              <div className="flex flex-wrap gap-1">
                {[...(emojis as string)].filter(c => c.trim() && !/[\uFE0F\u200D]/.test(c)).map((e, j) => (
                  <button key={j} onClick={() => copy(e)}
                    className="w-10 h-10 flex items-center justify-center text-2xl hover:bg-gray-800 rounded-lg cursor-pointer transition-colors">
                    {e}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
        <div className="mt-12 text-center text-gray-500 text-sm">
          <a href="/text-count" className="text-purple-400 hover:underline">Text Tools</a>{" | "}
          <a href="/word-counter" className="text-purple-400 hover:underline">Word Counter</a>{" | "}
          <a href="/lorem" className="text-purple-400 hover:underline">Lorem Ipsum</a>{" | "}
          <a href="/json" className="text-purple-400 hover:underline">JSON</a>{" | "}
          <a href="/password" className="text-purple-400 hover:underline">Password</a>
        </div>
      </div>
    </div>
  );
}
