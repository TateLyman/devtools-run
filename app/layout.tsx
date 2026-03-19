import type { Metadata } from "next";
import Link from "next/link";
import TipButton from "./components/TipButton";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "DevTools.run - Free Online Developer & Crypto Tools",
    template: "%s | DevTools.run",
  },
  description:
    "Free online developer tools: JSON formatter, Base64 encoder, hash generator, JWT decoder, regex tester, color converter, Unix timestamp converter, SOL/USD calculator, and Solana Scanner Telegram bot. Fast, private, no signup required.",
  keywords: [
    "developer tools",
    "JSON formatter",
    "base64 encoder",
    "hash generator",
    "JWT decoder",
    "regex tester",
    "color converter",
    "unix timestamp",
    "SOL USD calculator",
    "Solana Telegram bot",
    "Solana scanner bot",
  ],
  metadataBase: new URL("https://devtools.run"),
  openGraph: {
    title: "DevTools.run - Free Online Developer & Crypto Tools",
    description:
      "Free, fast, private developer tools that run entirely in your browser. Plus a Solana Scanner bot on Telegram.",
    type: "website",
    locale: "en_US",
    siteName: "DevTools.run",
  },
  twitter: {
    card: "summary_large_image",
    title: "DevTools.run - Free Online Developer & Crypto Tools",
    description:
      "Free, fast, private developer tools that run entirely in your browser. Plus a Solana Scanner bot on Telegram.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const adsenseId = process.env.NEXT_PUBLIC_ADSENSE_ID;

  return (
    <html lang="en">
      <head>
        {/* Google AdSense auto-ads — only loads when NEXT_PUBLIC_ADSENSE_ID is set */}
        {adsenseId && (
          <script
            async
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${adsenseId}`}
            crossOrigin="anonymous"
          />
        )}
      </head>
      <body className="min-h-screen flex flex-col">
        <header className="border-b border-[var(--border)] sticky top-0 z-50 bg-[var(--bg-primary)]/95 backdrop-blur-sm">
          <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
            <Link
              href="/"
              className="text-xl font-bold tracking-tight text-white hover:opacity-80 transition-opacity"
            >
              DevTools<span className="text-[var(--accent)]">.run</span>
            </Link>
            <nav className="hidden sm:flex items-center gap-4 text-sm text-[var(--text-secondary)]">
              <Link href="/json" className="hover:text-white transition-colors">
                JSON
              </Link>
              <Link
                href="/base64"
                className="hover:text-white transition-colors"
              >
                Base64
              </Link>
              <Link href="/hash" className="hover:text-white transition-colors">
                Hash
              </Link>
              <Link href="/jwt" className="hover:text-white transition-colors">
                JWT
              </Link>
              <Link
                href="/timestamp"
                className="hover:text-white transition-colors"
              >
                Timestamp
              </Link>
              <Link
                href="/sol-calc"
                className="hover:text-white transition-colors"
              >
                SOL/USD
              </Link>
              <Link
                href="/regex"
                className="hover:text-white transition-colors"
              >
                Regex
              </Link>
              <Link
                href="/color"
                className="hover:text-white transition-colors"
              >
                Color
              </Link>
              <Link
                href="/hire"
                className="text-emerald-400 hover:text-emerald-300 transition-colors font-medium"
              >
                Hire Me
              </Link>
            </nav>
          </div>
        </header>

        <main className="flex-1 max-w-5xl mx-auto px-4 py-8 w-full">
          {children}
        </main>

        <footer className="border-t border-[var(--border)] mt-auto">
          <div className="max-w-5xl mx-auto px-4 py-6 flex flex-col sm:flex-row items-center justify-center gap-3 text-sm text-[var(--text-secondary)]">
            <span>Built by a developer, for developers</span>
            <span className="hidden sm:inline">·</span>
            <div className="flex items-center gap-3">
              <TipButton compact />
              <code className="text-xs text-[var(--accent)] select-all">NaTTUfDDQ8U1RBqb9q5rz6vJ22cWrrT5UAsXuxnb2Wr</code>
              <span className="text-[var(--text-secondary)]">(SOL)</span>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
