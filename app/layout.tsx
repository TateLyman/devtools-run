import type { Metadata } from "next";
import Link from "next/link";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import TipButton from "./components/TipButton";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "DevTools.run - Free Online Tools: PDF, Image, QR, JSON & More",
    template: "%s | DevTools.run",
  },
  description:
    "500+ free online tools: merge PDFs, compress images, generate QR codes, format JSON, remove backgrounds, convert files, calculators, and more. Fast, private, runs in your browser. No signup needed.",
  keywords: [
    "free online tools",
    "merge pdf",
    "compress image",
    "image compressor",
    "qr code generator",
    "pdf merger",
    "background remover",
    "image converter",
    "JSON formatter",
    "developer tools",
    "online calculator",
    "file converter",
    "video to gif",
  ],
  metadataBase: new URL("https://devtools.run"),
  openGraph: {
    title: "DevTools.run - 500+ Free Online Tools",
    description:
      "Merge PDFs, compress images, generate QR codes, format JSON, and 500+ more free tools. Runs in your browser — no upload, no signup.",
    type: "website",
    locale: "en_US",
    siteName: "DevTools.run",
  },
  twitter: {
    card: "summary_large_image",
    title: "DevTools.run - 500+ Free Online Tools",
    description:
      "Merge PDFs, compress images, generate QR codes, format JSON, and 500+ more free tools. Runs in your browser.",
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
        {/* Google Analytics 4 — set NEXT_PUBLIC_GA_ID in Vercel env */}
        {process.env.NEXT_PUBLIC_GA_ID && (
          <>
            <script async src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID}`} />
            <script dangerouslySetInnerHTML={{ __html: `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}gtag('js',new Date());gtag('config','${process.env.NEXT_PUBLIC_GA_ID}');` }} />
          </>
        )}
        {/* Google AdSense auto-ads */}
        {adsenseId && (
          <script
            async
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${adsenseId}`}
            crossOrigin="anonymous"
          />
        )}
        {/* Adsterra Popunder — pays per impression on every page */}
        <script async src="https://pl28973843.profitablecpmratenetwork.com/d0/82/a4/d082a4ee69896d426d16d2e5f1ffe149.js" />
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
              <Link href="/image-compress" className="hover:text-white transition-colors">Image</Link>
              <Link href="/pdf-merge" className="hover:text-white transition-colors">PDF</Link>
              <Link href="/json" className="hover:text-white transition-colors">JSON</Link>
              <Link href="/qr-code-generator" className="hover:text-white transition-colors">QR</Link>
              <Link href="/base64" className="hover:text-white transition-colors">Base64</Link>
              <Link href="/hash" className="hover:text-white transition-colors">Hash</Link>
              <Link href="/regex" className="hover:text-white transition-colors">Regex</Link>
              <Link href="/color" className="hover:text-white transition-colors">Color</Link>
              <Link href="/hire" className="text-emerald-400 hover:text-emerald-300 transition-colors font-medium">Hire Me</Link>
            </nav>
          </div>
        </header>

        <main className="flex-1 max-w-5xl mx-auto px-4 py-8 w-full">
          {children}
        </main>

        {/* Floating CTA bar — shows on every page */}
        <div className="fixed bottom-0 left-0 right-0 bg-[#1a1a2e]/95 backdrop-blur border-t border-purple-500/20 py-2 px-4 z-50">
          <div className="max-w-5xl mx-auto flex items-center justify-between gap-3 text-xs">
            <span className="text-gray-400 hidden sm:inline">500+ free tools</span>
            <div className="flex items-center gap-2 mx-auto sm:mx-0">
              <a href="/pdf-merge" className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded font-bold">Merge PDF</a>
              <a href="/image-compress" className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded font-bold">Compress Image</a>
              <a href="/qr-code-generator" className="bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1 rounded font-bold">QR Code</a>
              <a href="/store" className="bg-gray-700 hover:bg-gray-600 text-white px-3 py-1 rounded font-bold hidden sm:inline-block">Store</a>
            </div>
          </div>
        </div>

        <footer className="border-t border-[var(--border)] mt-auto pb-12">
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
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
