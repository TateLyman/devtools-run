export default function AirdropsPage() {
  return (
    <>
      {/* Hero Section */}
      <div className="mb-8">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white mb-3 leading-tight">
          Solana Airdrops 2026 — Upcoming & Past Airdrop Tracker
        </h1>
        <p className="text-[var(--text-secondary)] text-base max-w-2xl">
          Complete list of confirmed, rumored, and past Solana ecosystem airdrops. Track your eligibility, learn how to qualify, and never miss a free airdrop again.
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
        {[
          { label: "Total Tracked", value: "16" },
          { label: "Live / Upcoming", value: "5" },
          { label: "Completed", value: "11" },
          { label: "Total Value Distributed", value: "$2B+" },
        ].map((s) => (
          <div
            key={s.label}
            className="rounded-lg bg-[var(--bg-secondary)] border border-[var(--border)] p-4 text-center"
          >
            <div className="text-xl font-bold text-white">{s.value}</div>
            <div className="text-xs text-[var(--text-secondary)]">{s.label}</div>
          </div>
        ))}
      </div>

      {/* CTA Banner - Top */}
      <div className="mb-8 rounded-xl overflow-hidden">
        <div className="bg-gradient-to-r from-green-900/50 to-blue-900/50 p-5 sm:p-6 border border-green-700/30 rounded-xl">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="flex-1">
              <h3 className="text-lg font-bold text-white mb-1">
                Track Your Airdrop Eligibility
              </h3>
              <p className="text-gray-300 text-sm">
                Scan your wallet with <strong>@solscanitbot</strong> on Telegram to see your holdings, DeFi positions, and protocol interactions. Use the bot to swap on Jupiter, DCA, and interact with protocols -- all activity that qualifies you for future airdrops.
              </p>
            </div>
            <a
              href="https://t.me/solscanitbot"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 px-6 rounded-lg text-sm transition-colors shadow-lg shadow-blue-900/30 shrink-0"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
              </svg>
              Open @solscanitbot
            </a>
          </div>
        </div>
      </div>

      {/* Upcoming / Live Airdrops */}
      <section className="mb-10">
        <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
          <span className="inline-block w-3 h-3 rounded-full bg-green-500 animate-pulse" />
          Upcoming & Live Solana Airdrops
        </h2>
        <div className="space-y-4">
          <AirdropCard
            name="Navi Protocol"
            ticker="NAVI"
            status="upcoming"
            estimatedValue="TBD"
            description="Solana-native navigation and portfolio aggregation protocol. Points program is live for users interacting with the platform."
            howToQualify={[
              "Connect wallet and use the Navi aggregator for swaps",
              "Maintain active portfolio positions tracked through Navi",
              "Participate in community campaigns and referral program",
            ]}
            link="https://navi.so"
            season="Expected 2026"
          />
          <AirdropCard
            name="Zeta Markets"
            ticker="ZEX"
            status="live"
            estimatedValue="$30-100 per active user"
            description="Decentralized perpetuals exchange on Solana. Season 2 of their Z-Score points program is currently active for traders."
            howToQualify={[
              "Trade perpetual futures on Zeta Markets",
              "Earn Z-Score points based on trading volume and frequency",
              "Provide liquidity or stake in Zeta vaults",
              "Refer new traders for bonus points",
            ]}
            link="https://www.zeta.markets"
            season="Season 2 Active"
          />
          <AirdropCard
            name="Marginfi"
            ticker="MRGN"
            status="upcoming"
            estimatedValue="$50-500 per active user"
            description="Solana's leading lending and borrowing protocol. Points program has been running for over a year. Token launch repeatedly hinted at but not yet confirmed."
            howToQualify={[
              "Lend assets (SOL, USDC, mSOL, etc.) on marginfi",
              "Borrow against your collateral to earn extra points",
              "Use marginfi's LST (Liquid Staking Token) products",
              "Keep positions active -- longer duration earns more points",
            ]}
            link="https://www.marginfi.com"
            season="Points Accumulating"
          />
          <AirdropCard
            name="Phantom"
            ticker="PHANTOM"
            status="upcoming"
            estimatedValue="TBD -- could be massive"
            description="The most popular Solana wallet with 10M+ users. No confirmed airdrop, but with massive VC funding and no token, speculation is high."
            howToQualify={[
              "Use Phantom wallet as your primary Solana wallet",
              "Swap tokens using Phantom's built-in swap feature",
              "Stake SOL through Phantom",
              "Use Phantom on multiple chains (Solana, Ethereum, Polygon)",
              "Early and active usage history likely matters",
            ]}
            link="https://phantom.app"
            season="Speculative"
          />
          <AirdropCard
            name="Backpack Exchange"
            ticker="TBD"
            status="upcoming"
            estimatedValue="TBD"
            description="Crypto exchange built by the Mad Lads team (Coral/xNFT). Already launched xNFT token for NFT holders. Exchange users may receive a separate allocation."
            howToQualify={[
              "Create a Backpack Exchange account and complete KYC",
              "Trade on Backpack Exchange regularly",
              "Hold Mad Lads NFTs or use Backpack wallet",
              "Participate in Backpack launchpad events",
            ]}
            link="https://backpack.exchange"
            season="Speculative"
          />
        </div>
      </section>

      {/* Completed Airdrops */}
      <section className="mb-10">
        <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
          <span className="inline-block w-3 h-3 rounded-full bg-gray-500" />
          Completed Solana Airdrops
        </h2>
        <p className="text-sm text-[var(--text-secondary)] mb-4">
          These Solana airdrops have already been distributed. Study the qualifying criteria to understand what protocols typically reward.
        </p>
        <div className="space-y-4">
          <AirdropCard
            name="Jupiter"
            ticker="JUP"
            status="ended"
            estimatedValue="$500-5,000+ per eligible wallet"
            description="The largest Solana airdrop in history. Jupiter is Solana's leading DEX aggregator. Four rounds of airdrops were distributed to users, with the initial 'Jupuary' drop rewarding swap users."
            howToQualify={[
              "Used Jupiter swap aggregator before snapshot",
              "Higher volume and more transactions earned more JUP",
              "Subsequent rounds rewarded stakers and active governance participants",
            ]}
            link="https://jup.ag"
            season="Rounds 1-4 Completed"
          />
          <AirdropCard
            name="Tensor"
            ticker="TNSR"
            status="ended"
            estimatedValue="$200-3,000+ per eligible user"
            description="Leading Solana NFT marketplace. Airdropped TNSR tokens to active traders, listers, and Tensorians NFT holders."
            howToQualify={[
              "Traded NFTs on Tensor marketplace",
              "Listed NFTs and provided marketplace liquidity",
              "Held Tensorians NFTs for boosted allocation",
              "Earned Tensor points through trading activity",
            ]}
            link="https://tensor.trade"
            season="Completed April 2024"
          />
          <AirdropCard
            name="Kamino Finance"
            ticker="KMNO"
            status="ended"
            estimatedValue="$100-2,000+ per eligible user"
            description="DeFi protocol offering lending, liquidity, and multiply products. Distributed KMNO tokens to active users across multiple seasons."
            howToQualify={[
              "Provided liquidity in Kamino vaults",
              "Used Kamino Lend for lending and borrowing",
              "Used Kamino Multiply for leveraged yield positions",
              "Earned Kamino Points through platform activity",
            ]}
            link="https://app.kamino.finance"
            season="Season 1 & 2 Completed"
          />
          <AirdropCard
            name="Parcl"
            ticker="PRCL"
            status="ended"
            estimatedValue="$50-500 per eligible user"
            description="Real estate trading protocol on Solana allowing users to trade city-level real estate indices. Airdropped PRCL to LP providers and active traders."
            howToQualify={[
              "Provided liquidity to Parcl pools",
              "Traded real estate indices on the platform",
              "Accumulated Parcl Points pre-launch",
            ]}
            link="https://parcl.co"
            season="Completed April 2024"
          />
          <AirdropCard
            name="Drift Protocol"
            ticker="DRIFT"
            status="ended"
            estimatedValue="$100-1,500+ per eligible user"
            description="Solana's leading perpetual futures DEX. Airdropped DRIFT tokens to active traders, liquidity providers, and protocol participants."
            howToQualify={[
              "Traded perpetual futures on Drift",
              "Provided liquidity to Drift vaults",
              "Participated in insurance fund staking",
              "Used Drift's spot trading and lending features",
            ]}
            link="https://www.drift.trade"
            season="Completed May 2024"
          />
          <AirdropCard
            name="Sanctum"
            ticker="CLOUD"
            status="ended"
            estimatedValue="$50-1,000+ per eligible user"
            description="Liquid staking infrastructure layer for Solana. Allows instant unstaking and LST (Liquid Staking Token) creation. Distributed CLOUD to users of their LST products."
            howToQualify={[
              "Held or used Sanctum LSTs (INF, etc.)",
              "Provided liquidity for LST pairs",
              "Used the Sanctum Router for LST swaps",
              "Earned Sanctum EXP (experience points)",
            ]}
            link="https://www.sanctum.so"
            season="Completed July 2024"
          />
          <AirdropCard
            name="Jito"
            ticker="JTO"
            status="ended"
            estimatedValue="$1,000-10,000+ per eligible user"
            description="MEV protocol and liquid staking on Solana. One of the most valuable Solana airdrops. Rewarded JitoSOL stakers and MEV searchers."
            howToQualify={[
              "Staked SOL for JitoSOL (liquid staking)",
              "Participated in Jito MEV auctions as a searcher",
              "Held JitoSOL in DeFi protocols",
            ]}
            link="https://www.jito.network"
            season="Completed December 2023"
          />
          <AirdropCard
            name="Pyth Network"
            ticker="PYTH"
            status="ended"
            estimatedValue="$200-2,000+ per eligible user"
            description="Decentralized oracle network. Airdropped PYTH tokens to DeFi users who consumed Pyth price data across multiple chains."
            howToQualify={[
              "Used DeFi protocols that integrate Pyth oracles",
              "Participated in Pyth's publisher or data consumer networks",
              "Claimed via cross-chain eligibility",
            ]}
            link="https://pyth.network"
            season="Completed November 2023"
          />
          <AirdropCard
            name="Marinade Finance"
            ticker="MNDE"
            status="ended"
            estimatedValue="$50-500 per eligible user"
            description="Solana liquid staking protocol. Distributed MNDE tokens to mSOL holders and liquidity providers over multiple seasons."
            howToQualify={[
              "Staked SOL for mSOL through Marinade",
              "Provided mSOL liquidity on DEXs",
              "Participated in Marinade governance",
            ]}
            link="https://marinade.finance"
            season="Multiple Seasons Completed"
          />
          <AirdropCard
            name="Raydium"
            ticker="RAY"
            status="ended"
            estimatedValue="Ongoing rewards"
            description="Leading Solana AMM and DEX. Distributed RAY tokens as liquidity mining rewards and AcceleRaytor launchpad participation."
            howToQualify={[
              "Provided liquidity in Raydium pools",
              "Staked RAY tokens",
              "Participated in AcceleRaytor IDOs",
            ]}
            link="https://raydium.io"
            season="Completed"
          />
          <AirdropCard
            name="Wormhole"
            ticker="W"
            status="ended"
            estimatedValue="$200-2,500+ per eligible user"
            description="Cross-chain bridge protocol. Airdropped W tokens to users who bridged assets through Wormhole, including many Solana users."
            howToQualify={[
              "Bridged assets through Wormhole (to or from Solana)",
              "Volume and frequency of bridge transactions mattered",
              "Multi-chain activity boosted allocation",
            ]}
            link="https://wormhole.com"
            season="Completed April 2024"
          />
        </div>
      </section>

      {/* How to Qualify Guide */}
      <section className="mb-10">
        <div className="rounded-xl border border-[var(--border)] bg-[var(--bg-secondary)] p-6 sm:p-8">
          <h2 className="text-2xl font-bold text-white mb-6">
            How to Qualify for Solana Airdrops in 2026
          </h2>
          <p className="text-[var(--text-secondary)] text-sm mb-6">
            Most Solana airdrops reward genuine protocol users, not airdrop farmers. Here is a strategy guide to maximize your chances of qualifying for the next big Solana airdrop while actually using DeFi productively.
          </p>

          <div className="space-y-6">
            <GuideSection
              number="1"
              title="Use DeFi Protocols Actively"
              description="The number-one qualifying factor for almost every Solana airdrop is genuine protocol usage. Swap tokens, provide liquidity, lend and borrow, trade perpetuals. The more protocols you use regularly, the more airdrops you will be eligible for."
              tips={[
                "Swap on Jupiter at least weekly -- they've done 4 rounds of JUP airdrops to users",
                "Lend assets on marginfi, Kamino, or Solend",
                "Trade perps on Drift Protocol or Zeta Markets",
                "Provide concentrated liquidity on Orca or Raydium",
              ]}
            />
            <GuideSection
              number="2"
              title="Stake SOL with Liquid Staking Protocols"
              description="Liquid staking is one of the safest ways to earn yield and qualify for airdrops simultaneously. You earn staking rewards while keeping your SOL liquid and usable in DeFi."
              tips={[
                "Stake SOL for JitoSOL, mSOL, bSOL, or INF (Sanctum)",
                "Use your LSTs in DeFi (lending, LP) for double airdrop exposure",
                "Try multiple LST providers -- each may airdrop separately",
                "Sanctum lets you swap between LSTs easily",
              ]}
            />
            <GuideSection
              number="3"
              title="Participate in Governance"
              description="Protocols increasingly reward governance participants. Voting on proposals, staking governance tokens, and joining DAOs signals that you're a committed community member, not a drive-by farmer."
              tips={[
                "Vote on Jupiter DAO proposals using staked JUP",
                "Participate in Marinade, Drift, or Jito governance",
                "Join protocol Discord servers and engage in discussions",
                "Realms.today is the hub for Solana governance",
              ]}
            />
            <GuideSection
              number="4"
              title="Bridge Assets to Solana"
              description="Cross-chain activity is often rewarded. Protocols like Wormhole and deBridge have airdropped tokens to bridge users. Bringing liquidity from other chains to Solana benefits the entire ecosystem."
              tips={[
                "Bridge assets using Wormhole, deBridge, or Allbridge",
                "Use LayerZero or Axelar for cross-chain messaging",
                "Bridge in both directions and across multiple chains",
                "Even small amounts count -- it's about activity, not size",
              ]}
            />
            <GuideSection
              number="5"
              title="Trade NFTs on Solana Marketplaces"
              description="NFT marketplace tokens like TNSR (Tensor) were airdropped to active traders. If new marketplaces launch, early users typically get rewarded."
              tips={[
                "Trade, list, and bid on Tensor and Magic Eden",
                "Try new marketplaces early -- first-mover advantage matters",
                "Volume and consistency matter more than single large trades",
                "Hold blue-chip Solana NFTs -- some grant protocol access",
              ]}
            />
            <GuideSection
              number="6"
              title="Use Multiple Wallets Wisely (But Don't Sybil)"
              description="Protocols actively detect and disqualify Sybil attackers (people creating hundreds of fake wallets). Use a reasonable number of wallets and ensure each has genuine, organic activity."
              tips={[
                "1-3 active wallets is reasonable and safe",
                "Each wallet should have unique transaction patterns",
                "Don't fund wallets from the same source in obvious patterns",
                "Quality of activity matters far more than number of wallets",
              ]}
            />
          </div>
        </div>
      </section>

      {/* CTA - Use the bot to interact with protocols */}
      <div className="mb-8 rounded-xl overflow-hidden">
        <div className="bg-gradient-to-r from-blue-900/60 to-purple-900/60 p-6 sm:p-8 border border-blue-700/40 rounded-xl">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-green-500/20 text-green-400 border border-green-500/30">
                  QUALIFY FOR AIRDROPS
                </span>
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-white mb-2">
                Trade on Protocols to Earn Airdrops -- Use @solscanitbot
              </h3>
              <p className="text-gray-300 text-sm mb-1">
                Every swap, DCA, and limit order you execute through @solscanitbot routes through Jupiter -- the protocol most likely to reward active users with future airdrops.
              </p>
              <ul className="text-gray-400 text-sm space-y-1 mb-4 list-none">
                <li className="flex items-center gap-2">
                  <span className="text-green-400 text-xs">&#9679;</span>
                  <span><strong className="text-gray-200">Jupiter Swaps</strong> -- Instant token swaps that count toward airdrop eligibility</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-green-400 text-xs">&#9679;</span>
                  <span><strong className="text-gray-200">DCA Orders</strong> -- Set recurring buys that generate consistent protocol activity</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-green-400 text-xs">&#9679;</span>
                  <span><strong className="text-gray-200">Limit Orders</strong> -- On-chain limit orders through Jupiter that build your history</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-green-400 text-xs">&#9679;</span>
                  <span><strong className="text-gray-200">Wallet Scanner</strong> -- Check your holdings and DeFi positions to track eligibility</span>
                </li>
              </ul>
            </div>
            <div className="shrink-0">
              <a
                href="https://t.me/solscanitbot"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 px-8 rounded-lg text-sm transition-colors shadow-lg shadow-blue-900/30"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
                </svg>
                Start Trading on Telegram
              </a>
              <p className="text-xs text-gray-500 mt-2 text-center">
                Free -- MEV protected
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Airdrop Tips / Common Mistakes */}
      <section className="mb-8 rounded-xl border border-[var(--border)] bg-[var(--bg-secondary)] p-6">
        <h3 className="text-lg font-bold text-white mb-2">Common Airdrop Farming Mistakes to Avoid</h3>
        <p className="text-gray-400 text-sm mb-4">
          Avoid these mistakes that can get you disqualified or reduce your allocation in Solana airdrops.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {[
            { title: "Sybil Attacks", desc: "Running hundreds of wallets with identical patterns gets you flagged and banned. Jupiter, Starknet, and LayerZero all removed Sybil wallets." },
            { title: "Low-Value Transactions", desc: "Spamming $0.01 swaps looks like botting. Use realistic trade sizes and genuine interaction patterns." },
            { title: "One-Time Usage", desc: "Using a protocol once and never returning signals farming, not genuine usage. Consistency over time matters." },
            { title: "Ignoring Governance", desc: "Many protocols weight governance participation heavily. Jupiter's later rounds rewarded active DAO voters." },
            { title: "Missing Snapshots", desc: "Have active positions and recent activity at all times. Snapshots can happen without warning." },
            { title: "Not Claiming in Time", desc: "Most airdrops have claim deadlines. Check eligibility immediately when announced and claim fast." },
          ].map((m) => (
            <div key={m.title} className="rounded-lg bg-[var(--bg-tertiary)] border border-[var(--border)] p-4">
              <div className="text-sm font-semibold text-white mb-1">{m.title}</div>
              <div className="text-xs text-[var(--text-secondary)]">{m.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* SEO Content / FAQ */}
      <section className="mt-6 text-sm text-[var(--text-secondary)] space-y-4">
        <h2 className="text-xl font-bold text-white">
          Solana Airdrop FAQ -- Everything You Need to Know
        </h2>

        <h3 className="text-base font-semibold text-white pt-2">
          What is a Solana Airdrop?
        </h3>
        <p>
          A Solana airdrop is a free distribution of tokens by a Solana ecosystem protocol to its users. Protocols airdrop tokens to reward early adopters, bootstrap governance participation, and decentralize their token supply. Major Solana airdrops like Jupiter (JUP), Jito (JTO), and Pyth (PYTH) distributed hundreds of millions of dollars in value to users who simply used the protocols before the token launch.
        </p>

        <h3 className="text-base font-semibold text-white pt-2">
          How Do I Check if I'm Eligible for a Solana Airdrop?
        </h3>
        <p>
          Most protocols announce eligibility criteria when they launch their token. Check your eligibility by visiting the official airdrop claim page with your wallet connected. You can also scan your wallet with <a href="https://t.me/solscanitbot" target="_blank" rel="noopener noreferrer" className="text-[var(--accent)] hover:text-[var(--accent-hover)] underline">@solscanitbot on Telegram</a> to see your holdings, transaction history, and DeFi positions that may qualify you for upcoming airdrops.
        </p>

        <h3 className="text-base font-semibold text-white pt-2">
          Are Solana Airdrops Free?
        </h3>
        <p>
          Yes, legitimate airdrops are always free. You never need to send tokens or pay fees to receive an airdrop. The only "cost" is the gas fees from using the protocol beforehand. Be cautious of any airdrop that asks you to send SOL or connect your wallet to an unfamiliar site -- these are almost always scams. Always verify airdrop claims through official protocol channels.
        </p>

        <h3 className="text-base font-semibold text-white pt-2">
          How Much Are Solana Airdrops Worth?
        </h3>
        <p>
          Airdrop values vary massively. The Jito (JTO) airdrop was worth $1,000-$10,000+ per eligible user. Jupiter (JUP) distributed $500-$5,000+ per wallet across multiple rounds. Smaller airdrops like Parcl and Drift were typically $50-$500. The key factor is how early and how active you were in the protocol. Power users and early adopters consistently receive the largest allocations.
        </p>

        <h3 className="text-base font-semibold text-white pt-2">
          What Protocols Should I Use to Qualify for Future Airdrops?
        </h3>
        <p>
          Focus on protocols that have raised VC funding but haven't launched a token yet. As of 2026, the top candidates include marginfi (lending), Phantom (wallet), and any new Solana DeFi protocols with points programs. Also continue using tokenized protocols like Jupiter, Drift, and Kamino -- they may do additional airdrop rounds for active users.
        </p>

        <h3 className="text-base font-semibold text-white pt-2">
          Best Strategy for Maximizing Solana Airdrop Rewards
        </h3>
        <ul className="list-disc list-inside space-y-1">
          <li>Use protocols regularly, not just once -- consistency is rewarded</li>
          <li>Provide liquidity and stake tokens when possible</li>
          <li>Participate in governance votes using platforms like Realms</li>
          <li>Bridge assets from other chains to Solana</li>
          <li>Use liquid staking (JitoSOL, mSOL, bSOL) and deploy LSTs in DeFi</li>
          <li>Trade on <a href="https://t.me/solscanitbot" target="_blank" rel="noopener noreferrer" className="text-[var(--accent)] hover:text-[var(--accent-hover)] underline">@solscanitbot</a> for Jupiter swaps, DCA, and limit orders that build on-chain history</li>
          <li>Don't Sybil -- protocols are getting better at detection and will ban you</li>
        </ul>
      </section>

      {/* JSON-LD Structured Data for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebPage",
            "name": "Solana Airdrops 2026 — Upcoming & Past Airdrop Tracker",
            "description": "Complete list of upcoming and past Solana airdrops. Track Jupiter, Tensor, Kamino, Drift, Sanctum, Parcl and more. Learn how to qualify.",
            "url": "https://devtools-site-delta.vercel.app/airdrops",
            "publisher": {
              "@type": "Organization",
              "name": "DevTools.run"
            },
            "dateModified": "2026-03-15",
          }),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": [
              {
                "@type": "Question",
                "name": "What is a Solana airdrop?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "A Solana airdrop is a free distribution of tokens by a Solana ecosystem protocol to its users. Protocols airdrop tokens to reward early adopters, bootstrap governance participation, and decentralize token supply. Major airdrops like Jupiter, Jito, and Pyth distributed hundreds of millions in value."
                }
              },
              {
                "@type": "Question",
                "name": "How do I check if I'm eligible for a Solana airdrop?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Check eligibility by visiting the official airdrop claim page with your wallet connected when a protocol announces its token. You can also use @solscanitbot on Telegram to scan your wallet and see DeFi positions that may qualify you."
                }
              },
              {
                "@type": "Question",
                "name": "Are Solana airdrops free?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Yes, legitimate airdrops are always free. You never need to send tokens or pay fees to claim. The only cost is the gas fees from using the protocol beforehand. Be cautious of any airdrop asking you to send SOL -- these are scams."
                }
              },
              {
                "@type": "Question",
                "name": "How much are Solana airdrops worth?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Values vary widely. Jito was worth $1,000-$10,000+ per user, Jupiter $500-$5,000+ per wallet, and smaller drops like Parcl and Drift were $50-$500. Early and active users consistently receive the largest allocations."
                }
              },
              {
                "@type": "Question",
                "name": "What protocols should I use to qualify for future Solana airdrops?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Focus on protocols with VC funding but no token yet: marginfi, Phantom, and new DeFi protocols with points programs. Also continue using Jupiter, Drift, and Kamino for potential additional airdrop rounds."
                }
              }
            ]
          }),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "ItemList",
            "name": "Upcoming Solana Airdrops 2026",
            "itemListElement": [
              { "@type": "ListItem", "position": 1, "name": "Marginfi (MRGN)", "description": "Solana lending protocol with active points program" },
              { "@type": "ListItem", "position": 2, "name": "Phantom (PHANTOM)", "description": "Most popular Solana wallet, speculative token launch" },
              { "@type": "ListItem", "position": 3, "name": "Zeta Markets (ZEX)", "description": "Perpetual futures DEX with Z-Score season 2 active" },
              { "@type": "ListItem", "position": 4, "name": "Backpack Exchange", "description": "Exchange by Mad Lads team, potential user airdrop" },
              { "@type": "ListItem", "position": 5, "name": "Navi Protocol (NAVI)", "description": "Portfolio aggregation with points program" },
            ]
          }),
        }}
      />
    </>
  );
}

/* ------------------------------------------------------------------ */
/*  Airdrop Card Component                                             */
/* ------------------------------------------------------------------ */

function AirdropCard({
  name,
  ticker,
  status,
  estimatedValue,
  description,
  howToQualify,
  link,
  season,
}: {
  name: string;
  ticker: string;
  status: "upcoming" | "live" | "ended";
  estimatedValue: string;
  description: string;
  howToQualify: string[];
  link: string;
  season: string;
}) {
  const statusConfig = {
    upcoming: {
      label: "Upcoming",
      bg: "bg-yellow-500/15",
      text: "text-yellow-400",
      border: "border-yellow-500/30",
    },
    live: {
      label: "Live",
      bg: "bg-green-500/15",
      text: "text-green-400",
      border: "border-green-500/30",
    },
    ended: {
      label: "Ended",
      bg: "bg-gray-500/15",
      text: "text-gray-400",
      border: "border-gray-500/30",
    },
  };

  const s = statusConfig[status];

  return (
    <div className={`rounded-xl border bg-[var(--bg-secondary)] p-5 sm:p-6 ${s.border}`}>
      <div className="flex flex-col sm:flex-row sm:items-start gap-3 mb-3">
        <div className="flex-1">
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <h3 className="text-lg font-bold text-white">{name}</h3>
            <span className="text-sm font-mono text-[var(--text-secondary)] bg-[var(--bg-tertiary)] px-2 py-0.5 rounded">
              {ticker}
            </span>
            <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${s.bg} ${s.text} border ${s.border}`}>
              {s.label}
            </span>
          </div>
          <p className="text-sm text-[var(--text-secondary)]">{description}</p>
        </div>
        <div className="shrink-0 text-right">
          <div className="text-xs text-[var(--text-secondary)]">Est. Value</div>
          <div className="text-sm font-semibold text-white">{estimatedValue}</div>
          <div className="text-xs text-[var(--text-secondary)] mt-1">{season}</div>
        </div>
      </div>

      <div className="mb-3">
        <div className="text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wide mb-2">
          How to Qualify
        </div>
        <ul className="space-y-1">
          {howToQualify.map((step, i) => (
            <li key={i} className="flex items-start gap-2 text-sm text-[var(--text-secondary)]">
              <span className="text-[var(--accent)] mt-0.5 shrink-0">&#8594;</span>
              <span>{step}</span>
            </li>
          ))}
        </ul>
      </div>

      <a
        href={link}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-1 text-sm text-[var(--accent)] hover:text-[var(--accent-hover)] transition-colors font-medium"
      >
        Visit {name} <span aria-hidden="true">&rarr;</span>
      </a>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Guide Section Component                                            */
/* ------------------------------------------------------------------ */

function GuideSection({
  number,
  title,
  description,
  tips,
}: {
  number: string;
  title: string;
  description: string;
  tips: string[];
}) {
  return (
    <div>
      <div className="flex items-start gap-3 mb-2">
        <span className="shrink-0 w-8 h-8 rounded-full bg-[var(--accent)]/20 border border-[var(--accent)]/40 flex items-center justify-center text-sm font-bold text-[var(--accent)]">
          {number}
        </span>
        <div>
          <h3 className="text-base font-semibold text-white">{title}</h3>
          <p className="text-sm text-[var(--text-secondary)] mt-1">{description}</p>
        </div>
      </div>
      <ul className="ml-11 space-y-1 mt-2">
        {tips.map((tip, i) => (
          <li key={i} className="flex items-start gap-2 text-sm text-[var(--text-secondary)]">
            <span className="text-green-400 text-xs mt-1 shrink-0">&#9679;</span>
            <span>{tip}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
