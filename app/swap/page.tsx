import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Crypto Swap - Exchange Cryptocurrency Instantly",
  description: "Swap cryptocurrency instantly. 900+ coins supported. No registration, no KYC. Best rates from multiple exchanges. Free crypto swap tool.",
  keywords: ["crypto swap", "exchange cryptocurrency", "swap coins", "crypto exchange", "token swap", "no KYC exchange"],
};

export default function SwapPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold mb-2">Crypto Swap</h1>
        <p className="text-[var(--text-secondary)]">
          Exchange cryptocurrency instantly. 900+ coins, best rates, no registration required. Powered by ChangeNOW.
        </p>
      </div>

      <div className="max-w-lg mx-auto">
        <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-xl p-6">
          <iframe
            id="changenow-widget"
            src="https://changenow.io/embeds/exchange-widget/v2/widget.html?FAQ=false&amount=1&from=btc&horizontal=false&isFiat=false&lang=en&link_id=&locales=false&logo=false&primaryColor=7c3aed&to=sol&toTheMoon=false"
            style={{ height: "356px", maxWidth: "100%", width: "100%", border: "none", borderRadius: "12px" }}
            title="ChangeNOW Exchange Widget"
          />
        </div>
        <p className="text-xs text-center text-gray-500 mt-2">Powered by ChangeNOW. Non-custodial exchange.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-lg p-4 text-center">
          <div className="text-2xl mb-2">🔄</div>
          <h3 className="font-bold text-sm">900+ Coins</h3>
          <p className="text-xs text-[var(--text-secondary)]">BTC, ETH, SOL, and hundreds more</p>
        </div>
        <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-lg p-4 text-center">
          <div className="text-2xl mb-2">⚡</div>
          <h3 className="font-bold text-sm">Instant Swaps</h3>
          <p className="text-xs text-[var(--text-secondary)]">Most swaps complete in 2-20 minutes</p>
        </div>
        <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-lg p-4 text-center">
          <div className="text-2xl mb-2">🔒</div>
          <h3 className="font-bold text-sm">No KYC</h3>
          <p className="text-xs text-[var(--text-secondary)]">No registration or verification needed</p>
        </div>
      </div>

      <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-lg p-4 text-sm text-[var(--text-secondary)]">
        <h3 className="font-bold text-white mb-2">How It Works</h3>
        <ol className="list-decimal list-inside space-y-1">
          <li>Choose the currencies you want to exchange</li>
          <li>Enter the amount and your receiving wallet address</li>
          <li>Send your crypto to the provided deposit address</li>
          <li>Receive your exchanged coins in your wallet</li>
        </ol>
      </div>

      <div className="text-center">
        <p className="text-sm text-[var(--text-secondary)]">
          Looking for price calculations? Check our <a href="/price/sol-to-usd" className="text-purple-400 hover:text-purple-300">900+ crypto price converters</a>.
        </p>
      </div>
    </div>
  );
}
