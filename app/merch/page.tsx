"use client";

const PRODUCTS = [
  { name: "HODL T-Shirt", price: "$29", img: "👕", desc: "Classic crypto tee. 100% cotton." },
  { name: "Code & Coffee Mug", price: "$19", img: "☕", desc: "For developers who run on caffeine." },
  { name: "Ship It Hoodie", price: "$49", img: "🧥", desc: "Cozy hoodie for late-night deploys." },
  { name: "Bug Free Sticker Pack", price: "$9", img: "🏷️", desc: "5 developer stickers for your laptop." },
  { name: "Solana Dev Cap", price: "$24", img: "🧢", desc: "Embroidered SOL logo." },
  { name: "git commit Poster", price: "$19", img: "🖼️", desc: "Minimalist coding art print." },
];

export default function MerchPage() {
  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <div className="max-w-4xl mx-auto px-4 py-16">
        <h1 className="text-4xl font-extrabold mb-2 text-center">Dev Merch</h1>
        <p className="text-gray-400 text-center mb-8">Gear for developers and crypto enthusiasts. Coming soon.</p>
        <div className="grid md:grid-cols-3 gap-4 mb-8">
          {PRODUCTS.map((p, i) => (
            <div key={i} className="bg-gray-900 rounded-xl p-6 text-center">
              <div className="text-5xl mb-3">{p.img}</div>
              <h3 className="font-bold mb-1">{p.name}</h3>
              <p className="text-xs text-gray-400 mb-2">{p.desc}</p>
              <div className="text-green-400 font-bold">{p.price}</div>
              <button className="mt-3 bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded-lg text-sm font-bold w-full">Coming Soon</button>
            </div>
          ))}
        </div>
        <div className="bg-gray-900 rounded-xl p-6 text-center">
          <h2 className="font-bold mb-2">Get Notified When Store Opens</h2>
          <p className="text-gray-400 text-sm mb-4">Drop your Telegram handle to be first to shop.</p>
          <a href="https://t.me/solscanitbot" className="inline-block bg-purple-600 hover:bg-purple-700 py-2 px-6 rounded-lg font-bold">Follow @solscanitbot</a>
        </div>
        <div className="mt-8 text-center text-gray-500 text-sm">
          <a href="/store" className="text-purple-400 hover:underline">Digital Store</a>{" | "}
          <a href="/sol-bot" className="text-purple-400 hover:underline">Trading Bot</a>{" | "}
          <a href="/" className="text-purple-400 hover:underline">All Tools</a>
        </div>
      </div>
    </div>
  );
}
