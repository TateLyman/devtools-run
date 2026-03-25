"use client";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <div className="max-w-3xl mx-auto px-4 py-16">
        <h1 className="text-4xl font-extrabold mb-2 text-center">About DevTools</h1>
        <p className="text-gray-400 text-center mb-8">Built by a developer, for developers.</p>
        <div className="bg-gray-900 rounded-xl p-8 mb-8">
          <h2 className="text-xl font-bold mb-4">The Story</h2>
          <div className="text-gray-300 space-y-3 text-sm leading-relaxed">
            <p>I started building developer tools because I was tired of googling the same things every day. JSON formatting, Base64 encoding, regex testing — small tasks that interrupt your flow.</p>
            <p>So I built one tool. Then another. Then I automated the deployment. Then I added Solana tools because that is what I work with. Then a trading bot. Then a Mini App. Then programmatic SEO pages.</p>
            <p>Now there are 800+ pages on this site. 140+ hand-built tools. 570+ programmatic converter pages. A Telegram trading bot with 44 commands. A content engine that publishes articles daily. And ads on every page generating passive revenue.</p>
            <p>Everything is built with Next.js, deployed on Vercel (free tier), and costs $0/month to run.</p>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-4 mb-8 text-center">
          <div className="bg-gray-900 rounded-xl p-4"><div className="text-3xl font-bold text-purple-400">800+</div><div className="text-xs text-gray-400">Pages</div></div>
          <div className="bg-gray-900 rounded-xl p-4"><div className="text-3xl font-bold text-green-400">$0</div><div className="text-xs text-gray-400">Hosting cost</div></div>
          <div className="bg-gray-900 rounded-xl p-4"><div className="text-3xl font-bold text-blue-400">1</div><div className="text-xs text-gray-400">Developer</div></div>
        </div>
        <div className="bg-gray-900 rounded-xl p-6 text-center">
          <h2 className="font-bold mb-3">Connect</h2>
          <div className="flex gap-3 justify-center">
            <a href="https://github.com/TateLyman" target="_blank" className="bg-gray-800 hover:bg-gray-700 px-4 py-2 rounded-lg text-sm font-bold">GitHub</a>
            <a href="https://x.com/solscanitbot" target="_blank" className="bg-gray-800 hover:bg-gray-700 px-4 py-2 rounded-lg text-sm font-bold">X / Twitter</a>
            <a href="https://t.me/solscanitbot" target="_blank" className="bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-lg text-sm font-bold">Telegram</a>
            <a href="https://dev.to/tatelyman" target="_blank" className="bg-gray-800 hover:bg-gray-700 px-4 py-2 rounded-lg text-sm font-bold">Dev.to</a>
          </div>
        </div>
      </div>
    </div>
  );
}
