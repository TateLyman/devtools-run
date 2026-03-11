"use client";

export default function SolBotPage() {
  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">
            Solana Trading Bot for Telegram
          </h1>
          <p className="text-xl text-gray-400 mb-6">
            Free. Fast. MEV-Protected. 40+ commands. 4,100+ lines of pure
            Node.js.
          </p>
          <a
            href="https://t.me/solscanitbot"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg text-lg transition-colors"
          >
            Open @solscanitbot on Telegram
          </a>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-12">
          <Feature
            title="Buy & Sell Any Token"
            desc="Swap any Solana token via Jupiter aggregator. Paste a contract address for instant buy buttons. Pump.fun tokens trade directly against the bonding curve for maximum speed."
          />
          <Feature
            title="Token Sniping"
            desc="Auto-buy new tokens the moment they launch. DexScreener detection every 60s. Pump.fun direct bonding curve execution. Jito MEV protection on every trade."
          />
          <Feature
            title="Copy Trading"
            desc="Mirror any wallet's trades automatically. Snapshot-diff monitoring every 60 seconds detects buys and sells, then replicates them in your wallet."
          />
          <Feature
            title="DCA Automation"
            desc="Dollar-cost average into any token on a schedule. Intervals: 1h, 4h, 12h, 1d, 7d. Set it and forget it."
          />
          <Feature
            title="Limit Orders & Stop-Loss"
            desc="Set buy/sell orders at target prices. Automated stop-loss and take-profit. Auto take-profit: set a target %, bot sells when hit."
          />
          <Feature
            title="Portfolio Dashboard"
            desc="View all holdings with USD values, per-position PnL, and quick sell buttons. Total portfolio value at a glance."
          />
          <Feature
            title="Whale Alerts"
            desc="Monitor known whale wallets and custom addresses. Get notified when big wallets make moves."
          />
          <Feature
            title="3-Tier Referral System"
            desc="Earn 30% of trading fees from direct referrals, 10% from tier 2, 5% from tier 3. Points leaderboard with seasons."
          />
          <Feature
            title="Premium Tier"
            desc="0.1 SOL/month for 0.5% trading fees (half price), unlimited snipes, and faster alerts. Pays for itself after 10 SOL traded."
          />
          <Feature
            title="Promote Your Token"
            desc="Token devs can promote their token at the top of /trending for 0.5 SOL/24h. Includes automatic buy buttons for all users."
          />
          <Feature
            title="Volume Bot"
            desc="Generate real on-chain trading volume for your token. Each bump cycle does a buy + sell through Jupiter. 0.05 SOL per cycle."
          />
          <Feature
            title="Daily Hot Tokens"
            desc="Automated daily digest of top-performing tokens sent to all active traders. Includes promoted tokens with buy buttons."
          />
        </div>

        <div className="bg-gray-900 rounded-xl p-8 mb-12">
          <h2 className="text-2xl font-bold mb-4">How It Works</h2>
          <div className="space-y-4 text-gray-300">
            <Step n={1} text="Open @solscanitbot on Telegram and tap Start" />
            <Step n={2} text="Deposit SOL to your bot-managed wallet" />
            <Step
              n={3}
              text="Paste any token address to see info + buy buttons"
            />
            <Step n={4} text="Trade with 1-tap buying and selling" />
          </div>
        </div>

        <div className="bg-gray-900 rounded-xl p-8 mb-12">
          <h2 className="text-2xl font-bold mb-4">Pricing</h2>
          <p className="text-gray-300 mb-2">
            <strong>Free to use.</strong> No subscription required. No minimum deposit.
          </p>
          <p className="text-gray-300 mb-2">
            1% fee on trades (0.9% with referral, 0.5% with Premium).
          </p>
          <p className="text-gray-300 mb-2">
            <strong>Premium:</strong> 0.1 SOL/month for half-price fees + unlimited snipes.
          </p>
          <p className="text-gray-300">
            Jito MEV protection + Jupiter dynamic priority fees on every trade.
          </p>
        </div>

        <div className="bg-gray-900 rounded-xl p-8 mb-12">
          <h2 className="text-2xl font-bold mb-4">Full Command List</h2>
          <div className="grid md:grid-cols-2 gap-2 text-sm text-gray-300 font-mono">
            <Cmd cmd="/buy" desc="Buy tokens with SOL" />
            <Cmd cmd="/sell" desc="Sell tokens for SOL" />
            <Cmd cmd="/portfolio" desc="Portfolio dashboard" />
            <Cmd cmd="/copy" desc="Copy trade a wallet" />
            <Cmd cmd="/dca" desc="Dollar-cost averaging" />
            <Cmd cmd="/snipe" desc="Auto-snipe new tokens" />
            <Cmd cmd="/limit" desc="Limit buy/sell order" />
            <Cmd cmd="/sl" desc="Stop-loss" />
            <Cmd cmd="/tp" desc="Take-profit" />
            <Cmd cmd="/scan" desc="Token safety scanner" />
            <Cmd cmd="/trending" desc="Hot tokens" />
            <Cmd cmd="/whale" desc="Whale alerts" />
            <Cmd cmd="/compete" desc="Weekly competition" />
            <Cmd cmd="/premium" desc="0.5% fees + unlimited snipes" />
            <Cmd cmd="/promote" desc="Promote your token" />
            <Cmd cmd="/bump" desc="Volume bot" />
            <Cmd cmd="/tip" desc="Tip the dev" />
            <Cmd cmd="/settings" desc="Slippage & auto-TP" />
            <Cmd cmd="/referral" desc="Earn 30% on referrals" />
            <Cmd cmd="/price" desc="Token price lookup" />
            <Cmd cmd="/pnl" desc="Profit/loss view" />
            <Cmd cmd="/balance" desc="SOL balance" />
          </div>
        </div>

        <div className="text-center">
          <a
            href="https://t.me/solscanitbot"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg text-lg transition-colors"
          >
            Start Trading on Telegram
          </a>
          <p className="text-gray-500 mt-4 text-sm">
            SOL tips: NaTTUfDDQ8U1RBqb9q5rz6vJ22cWrrT5UAsXuxnb2Wr
          </p>
        </div>
      </div>
    </div>
  );
}

function Feature({ title, desc }: { title: string; desc: string }) {
  return (
    <div className="bg-gray-900 rounded-xl p-6">
      <h3 className="text-lg font-bold mb-2">{title}</h3>
      <p className="text-gray-400 text-sm">{desc}</p>
    </div>
  );
}

function Step({ n, text }: { n: number; text: string }) {
  return (
    <div className="flex items-start gap-3">
      <span className="bg-blue-600 text-white w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 font-bold">
        {n}
      </span>
      <p>{text}</p>
    </div>
  );
}

function Cmd({ cmd, desc }: { cmd: string; desc: string }) {
  return (
    <div>
      <span className="text-blue-400">{cmd}</span>{" "}
      <span className="text-gray-500">— {desc}</span>
    </div>
  );
}
