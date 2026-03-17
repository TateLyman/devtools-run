/* ------------------------------------------------------------------ */
/*  Top Solana token database for programmatic SEO pages               */
/* ------------------------------------------------------------------ */

export interface TokenInfo {
  slug: string;
  name: string;
  symbol: string;
  category: "memecoin" | "defi" | "infrastructure" | "ai" | "gaming" | "l1" | "nft";
  description: string;
  /** Known contract address (for linking to scanner) */
  mint?: string;
}

export const TOKEN_LIST: TokenInfo[] = [
  // --- Memecoins ---
  { slug: "bonk", name: "Bonk", symbol: "BONK", category: "memecoin", description: "The first Solana dog coin and community memecoin airdropped to Solana NFT holders and DeFi users.", mint: "DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263" },
  { slug: "wif", name: "dogwifhat", symbol: "WIF", category: "memecoin", description: "A viral Solana memecoin featuring a Shiba Inu wearing a pink knitted hat.", mint: "EKpQGSJtjMFqKZ9KQanSqYXRcF8fBopzLHYxdM65zcjm" },
  { slug: "popcat", name: "Popcat", symbol: "POPCAT", category: "memecoin", description: "A Solana memecoin based on the viral Popcat internet meme of a cat opening its mouth.", mint: "7GCihgDB8fe6KNjn2MYtkzZcRjQy3t9GHdC8uHYmW2hr" },
  { slug: "mew", name: "cat in a dogs world", symbol: "MEW", category: "memecoin", description: "A cat-themed Solana memecoin positioned as the feline answer to dog coins.", mint: "MEW1gQWJ3nEXg2qgERiKu7FAFj79PHvQVREQUzScPP5" },
  { slug: "myro", name: "Myro", symbol: "MYRO", category: "memecoin", description: "A Solana memecoin named after Raj Gokal's dog, launched on Solana.", },
  { slug: "wen", name: "Wen", symbol: "WEN", category: "memecoin", description: "A Solana memecoin born from the Jupiter airdrop era, representing the crypto question 'wen moon?'.", },
  { slug: "slerf", name: "Slerf", symbol: "SLERF", category: "memecoin", description: "A Solana memecoin that went viral after the developer accidentally burned the LP tokens and presale funds.", },
  { slug: "bome", name: "BOOK OF MEME", symbol: "BOME", category: "memecoin", description: "A Solana memecoin aiming to create a decentralized library of memes stored permanently on-chain.", },
  { slug: "ponke", name: "Ponke", symbol: "PONKE", category: "memecoin", description: "A monkey-themed Solana memecoin that gained traction in the Solana memecoin season.", },
  { slug: "solama", name: "Solama", symbol: "SOLAMA", category: "memecoin", description: "A llama-themed memecoin on the Solana blockchain.", },
  { slug: "nub", name: "NUB", symbol: "NUB", category: "memecoin", description: "A Solana memecoin from the community, part of the Solana memecoin ecosystem.", },
  { slug: "gecko", name: "Gecko", symbol: "GECKO", category: "memecoin", description: "A gecko-themed memecoin on Solana inspired by CoinGecko.", },
  { slug: "pepe-sol", name: "Pepe (Solana)", symbol: "PEPE", category: "memecoin", description: "A Solana-based version of the Pepe memecoin, bringing the iconic frog meme to the Solana ecosystem.", },
  { slug: "fartcoin", name: "Fartcoin", symbol: "FARTCOIN", category: "memecoin", description: "A viral Solana memecoin with crude humor branding that achieved significant market cap.", },
  { slug: "trump", name: "Official Trump", symbol: "TRUMP", category: "memecoin", description: "A politically-themed Solana memecoin associated with Donald Trump branding.", },
  { slug: "chad", name: "Chad", symbol: "CHAD", category: "memecoin", description: "A memecoin based on the internet Chad meme archetype, launched on Solana.", },
  { slug: "gigachad", name: "GigaChad", symbol: "GIGA", category: "memecoin", description: "A memecoin themed after the GigaChad internet meme, deployed on Solana.", },
  { slug: "wojak", name: "Wojak", symbol: "WOJAK", category: "memecoin", description: "A memecoin based on the iconic Wojak/Feels Guy meme from crypto culture.", },

  // --- AI tokens ---
  { slug: "ai16z", name: "ai16z", symbol: "AI16Z", category: "ai", description: "An AI-powered investment DAO on Solana, inspired by the a16z venture capital model but run by AI agents.", },
  { slug: "goat", name: "Goatseus Maximus", symbol: "GOAT", category: "ai", description: "One of the first AI agent tokens on Solana, promoted by the Truth Terminal AI.", },
  { slug: "grass", name: "Grass", symbol: "GRASS", category: "ai", description: "A decentralized data layer for AI, allowing users to earn by contributing unused bandwidth for web scraping.", },

  // --- DeFi ---
  { slug: "jup", name: "Jupiter", symbol: "JUP", category: "defi", description: "The leading DEX aggregator on Solana, routing trades across all major liquidity sources for best prices.", mint: "JUPyiwrYJFskUPiHa7hkeR8VUtAeFoSYbKedZNsDvCN" },
  { slug: "raydium", name: "Raydium", symbol: "RAY", category: "defi", description: "One of the largest AMMs on Solana, providing liquidity and yield farming with Serum orderbook integration.", mint: "4k3Dyjzvzp8eMZWUXbBCjEvwSkkk59S5iCNLY3QrkX6R" },
  { slug: "orca", name: "Orca", symbol: "ORCA", category: "defi", description: "A user-friendly DEX on Solana known for its concentrated liquidity pools (Whirlpools).", mint: "orcaEKTdK7LKz57vaAYr9QeNsVEPfiu6QeMU1kektZE" },
  { slug: "marinade", name: "Marinade Finance", symbol: "MNDE", category: "defi", description: "The leading liquid staking protocol on Solana, letting users stake SOL while maintaining liquidity via mSOL.", },
  { slug: "drift", name: "Drift Protocol", symbol: "DRIFT", category: "defi", description: "A decentralized perpetual futures exchange on Solana with up to 20x leverage and cross-margin.", },
  { slug: "kamino", name: "Kamino Finance", symbol: "KMNO", category: "defi", description: "A DeFi protocol on Solana offering automated liquidity vaults, lending, and leveraged yield strategies.", },
  { slug: "marginfi", name: "marginfi", symbol: "MFI", category: "defi", description: "A decentralized lending and borrowing protocol on Solana with risk-tiered pools.", },
  { slug: "sanctum", name: "Sanctum", symbol: "CLOUD", category: "defi", description: "A liquid staking infrastructure protocol on Solana enabling unified LST liquidity.", },

  // --- Infrastructure ---
  { slug: "render", name: "Render Network", symbol: "RENDER", category: "infrastructure", description: "A decentralized GPU rendering network that migrated to Solana for faster and cheaper transactions.", mint: "rndrizKT3MK1iimdxRdWabcF7Zg7AR5T4nud4EkHBof" },
  { slug: "pyth", name: "Pyth Network", symbol: "PYTH", category: "infrastructure", description: "A first-party oracle network on Solana delivering high-fidelity financial data from institutional sources.", },
  { slug: "jto", name: "Jito", symbol: "JTO", category: "infrastructure", description: "Jito's governance token for the Solana MEV and liquid staking protocol (JitoSOL).", mint: "jtojtomepa8beP8AuQc6eXt5FriJwfFMwQx2v2f9mCL" },
  { slug: "helium", name: "Helium", symbol: "HNT", category: "infrastructure", description: "A decentralized wireless network that migrated to Solana, powering IoT and 5G coverage.", mint: "hntyVP6YFm1Hg25TN9WGLqM12b8TQmcknKrdu1oxWux" },
  { slug: "tensor", name: "Tensor", symbol: "TNSR", category: "infrastructure", description: "The leading NFT marketplace and trading platform on Solana with pro trading tools.", },
  { slug: "parcl", name: "Parcl", symbol: "PRCL", category: "infrastructure", description: "A real estate price index trading protocol on Solana allowing speculation on property markets.", },

  // --- Cross-chain memecoins (popular search terms) ---
  { slug: "pengu", name: "Pudgy Penguins", symbol: "PENGU", category: "nft", description: "The token for the Pudgy Penguins NFT community, one of the most recognized NFT brands.", },
  { slug: "pudgy", name: "Pudgy Penguins", symbol: "PENGU", category: "nft", description: "Pudgy Penguins community token - a blue-chip NFT project expanding into physical toys and gaming.", },
  { slug: "brett", name: "Brett", symbol: "BRETT", category: "memecoin", description: "A memecoin based on Matt Furie's Boy's Club character Brett, popular on Base chain.", },
  { slug: "toshi", name: "Toshi", symbol: "TOSHI", category: "memecoin", description: "A cat-themed memecoin named after Toshi, a reference to Bitcoin creator Satoshi Nakamoto.", },
  { slug: "degen", name: "Degen", symbol: "DEGEN", category: "memecoin", description: "A memecoin born from the Farcaster social network ecosystem, tipping culture token.", },
  { slug: "higher", name: "Higher", symbol: "HIGHER", category: "memecoin", description: "A memecoin from the Farcaster ecosystem representing the 'higher' movement and mindset.", },
  { slug: "based", name: "Based", symbol: "BASED", category: "memecoin", description: "A memecoin representing Base chain culture and the 'based' internet ethos.", },
  { slug: "mog", name: "Mog Coin", symbol: "MOG", category: "memecoin", description: "A memecoin based on the 'mogging' internet slang, featuring sunglasses branding.", },
  { slug: "turbo", name: "Turbo", symbol: "TURBO", category: "memecoin", description: "A memecoin created entirely by ChatGPT, including its name, tokenomics, and branding.", },
  { slug: "floki", name: "Floki", symbol: "FLOKI", category: "memecoin", description: "Named after Elon Musk's Shiba Inu dog, Floki is a major memecoin with DeFi and metaverse ambitions.", },
  { slug: "shib", name: "Shiba Inu", symbol: "SHIB", category: "memecoin", description: "The self-proclaimed 'Dogecoin killer', a major Ethereum-based memecoin with a massive community.", },
  { slug: "doge", name: "Dogecoin", symbol: "DOGE", category: "memecoin", description: "The original memecoin and the first cryptocurrency to reach mainstream adoption through meme culture.", },
  { slug: "pepe", name: "Pepe", symbol: "PEPE", category: "memecoin", description: "The largest frog-themed memecoin based on the iconic Pepe the Frog internet meme.", },
];

/** Lookup a token by slug */
export function getTokenBySlug(slug: string): TokenInfo | undefined {
  return TOKEN_LIST.find((t) => t.slug === slug);
}

/** All slugs for sitemap and static generation */
export function getAllSlugs(): string[] {
  return TOKEN_LIST.map((t) => t.slug);
}
