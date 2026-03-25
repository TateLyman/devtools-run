"use client";

export default function TelegramPage() {
  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <div className="max-w-3xl mx-auto px-4 py-16">
        <h1 className="text-4xl font-extrabold mb-2 text-center">Join Our Telegram</h1>
        <p className="text-gray-400 text-center mb-8">Trading signals, dev tips, new tool announcements.</p>
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <div className="bg-gray-900 rounded-xl p-6 text-center">
            <div className="text-4xl mb-3">&#x1F916;</div>
            <h3 className="font-bold text-lg mb-2">Trading Bot</h3>
            <p className="text-sm text-gray-400 mb-4">44 commands. Buy, sell, copy trade, DCA, snipe, scan tokens.</p>
            <a href="https://t.me/solscanitbot" target="_blank" className="block bg-purple-600 hover:bg-purple-700 py-2 rounded-lg font-bold text-sm">Open @solscanitbot</a>
          </div>
          <div className="bg-gray-900 rounded-xl p-6 text-center">
            <div className="text-4xl mb-3">&#x1F4E2;</div>
            <h3 className="font-bold text-lg mb-2">Announcements</h3>
            <p className="text-sm text-gray-400 mb-4">New tools, features, and dev tips. 2-3 posts per week.</p>
            <a href="https://t.me/solscanitbot" target="_blank" className="block bg-blue-600 hover:bg-blue-700 py-2 rounded-lg font-bold text-sm">Follow Updates</a>
          </div>
        </div>
        <div className="bg-gray-900 rounded-xl p-6 text-center">
          <h2 className="font-bold mb-2">Earn 50% Referral Fees</h2>
          <p className="text-sm text-gray-400 mb-4">Share your referral link. Earn 50% of your friends' trading fees for 14 days, then 30% forever.</p>
          <a href="https://t.me/solscanitbot?start=referral" className="inline-block bg-green-600 hover:bg-green-700 py-2 px-6 rounded-lg font-bold text-sm">Get Your Referral Link</a>
        </div>
      </div>
    </div>
  );
}
