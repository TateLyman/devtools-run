"use client";

export default function SubmitToolPage() {
  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <div className="max-w-3xl mx-auto px-4 py-16">
        <h1 className="text-4xl font-extrabold mb-2 text-center">Submit Your Tool</h1>
        <p className="text-gray-400 text-center mb-8">Get your developer tool in front of our growing audience.</p>
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
            <h3 className="font-bold text-lg mb-2">Free Listing</h3>
            <div className="text-3xl font-extrabold mb-3">$0</div>
            <ul className="text-sm text-gray-300 space-y-1 mb-4">
              <li>Listed in Resources page</li>
              <li>Basic description</li>
              <li>Link to your site</li>
            </ul>
            <a href="https://t.me/solscanitbot" className="block text-center bg-gray-700 hover:bg-gray-600 py-2 rounded-lg font-bold text-sm">Submit Free</a>
          </div>
          <div className="bg-gray-900 rounded-xl p-6 border border-purple-500 ring-2 ring-purple-500/20">
            <div className="text-xs font-bold text-purple-400 uppercase mb-1">Featured</div>
            <h3 className="font-bold text-lg mb-2">Sponsored Listing</h3>
            <div className="text-3xl font-extrabold mb-3">0.5 SOL<span className="text-sm text-gray-400">/mo</span></div>
            <ul className="text-sm text-gray-300 space-y-1 mb-4">
              <li>Featured in Deals page with HOT badge</li>
              <li>Listed in Startup Toolkit</li>
              <li>Mentioned in daily Dev.to articles</li>
              <li>700+ page site, growing traffic</li>
            </ul>
            <a href="/sol-pay/checkout?to=NaTTUfDDQ8U1RBqb9q5rz6vJ22cWrrT5UAsXuxnb2Wr&amount=0.5&label=Sponsored+Listing" className="block text-center bg-purple-600 hover:bg-purple-700 py-2 rounded-lg font-bold text-sm">Sponsor (0.5 SOL/mo)</a>
          </div>
        </div>
        <div className="bg-gray-900 rounded-xl p-6 text-center">
          <h2 className="font-bold mb-2">Why List With Us</h2>
          <div className="grid grid-cols-3 gap-4 text-center mt-4">
            <div><div className="text-2xl font-bold text-purple-400">740+</div><div className="text-xs text-gray-400">Pages</div></div>
            <div><div className="text-2xl font-bold text-green-400">35+</div><div className="text-xs text-gray-400">Articles/mo</div></div>
            <div><div className="text-2xl font-bold text-blue-400">Growing</div><div className="text-xs text-gray-400">Daily traffic</div></div>
          </div>
        </div>
      </div>
    </div>
  );
}
