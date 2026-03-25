export default function GoPage({ params }: { params: { id: string } }) {
  return (
    <div className="min-h-screen bg-gray-950 text-white flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-4">Redirecting...</h1>
        <p className="text-gray-400 mb-6">You will be redirected shortly.</p>
        <div className="bg-gray-900 rounded-xl p-6 mb-6 max-w-md mx-auto">
          <p className="text-xs text-gray-500 mb-2">While you wait, check out:</p>
          <a href="/sol-bot" className="block bg-purple-600 hover:bg-purple-700 py-2 px-4 rounded-lg text-sm font-bold mb-2">Free Solana Trading Bot</a>
          <a href="/templates" className="block bg-gray-700 hover:bg-gray-600 py-2 px-4 rounded-lg text-sm font-bold mb-2">Dev Templates</a>
          <a href="/" className="block bg-gray-700 hover:bg-gray-600 py-2 px-4 rounded-lg text-sm font-bold">670+ Free Dev Tools</a>
        </div>
        <a href="#" className="text-purple-400 text-sm hover:underline">Click here if not redirected</a>
      </div>
    </div>
  );
}
