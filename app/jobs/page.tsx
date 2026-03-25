"use client";

const JOBS = [
  { title: "Solana Smart Contract Developer", company: "DeFi Protocol", type: "Contract", pay: "$5K-15K", tags: ["Rust", "Anchor", "Solana"], url: "https://t.me/solscanitbot" },
  { title: "Telegram Bot Developer", company: "Trading Team", type: "Freelance", pay: "$2K-5K", tags: ["Node.js", "Telegram API", "Web3"], url: "https://t.me/solscanitbot" },
  { title: "Full-Stack Developer", company: "Web3 Startup", type: "Full-time", pay: "$80K-120K", tags: ["React", "Node.js", "Solana"], url: "https://t.me/solscanitbot" },
];

export default function JobsPage() {
  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <div className="max-w-3xl mx-auto px-4 py-16">
        <h1 className="text-4xl font-extrabold mb-2 text-center">Crypto Dev Jobs</h1>
        <p className="text-gray-400 text-center mb-8">Find blockchain and Web3 development work. New listings weekly.</p>
        <div className="space-y-4 mb-8">
          {JOBS.map((j, i) => (
            <a key={i} href={j.url} className="block bg-gray-900 rounded-xl p-5 hover:bg-gray-800 transition-colors">
              <div className="flex justify-between mb-2">
                <h3 className="font-bold">{j.title}</h3>
                <span className="text-green-400 font-bold text-sm">{j.pay}</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-400 mb-2">
                <span>{j.company}</span>
                <span className="bg-gray-800 px-2 py-0.5 rounded text-xs">{j.type}</span>
              </div>
              <div className="flex gap-1">
                {j.tags.map((t, k) => <span key={k} className="text-xs bg-purple-600/20 text-purple-300 px-2 py-0.5 rounded">{t}</span>)}
              </div>
            </a>
          ))}
        </div>
        <div className="bg-gray-900 rounded-xl p-6 text-center mb-8">
          <h2 className="font-bold mb-2">Post a Job</h2>
          <p className="text-gray-400 text-sm mb-4">Reach Solana developers. 0.5 SOL per listing for 30 days.</p>
          <a href="https://t.me/solscanitbot" className="inline-block bg-purple-600 hover:bg-purple-700 py-2 px-6 rounded-lg font-bold">Post a Job (0.5 SOL)</a>
        </div>
        <div className="bg-gray-900 rounded-xl p-6 text-center">
          <h2 className="font-bold mb-2">Looking for Work?</h2>
          <p className="text-gray-400 text-sm mb-4">List your skills and portfolio. Free for developers.</p>
          <a href="/bio" className="inline-block bg-gray-700 hover:bg-gray-600 py-2 px-6 rounded-lg font-bold">Create Your Profile</a>
        </div>
        <div className="mt-8 text-center text-gray-500 text-sm">
          <a href="/resources" className="text-purple-400 hover:underline">Resources</a>{" | "}
          <a href="/store" className="text-purple-400 hover:underline">Digital Store</a>{" | "}
          <a href="/sol-bot" className="text-purple-400 hover:underline">Trading Bot</a>{" | "}
          <a href="/" className="text-purple-400 hover:underline">All Tools</a>
        </div>
      </div>
    </div>
  );
}
