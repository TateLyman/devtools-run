import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "URL Encoder / Decoder - Encode & Decode URLs Online",
  description:
    "Free online URL encoder and decoder. Encode or decode URLs and URL components instantly. Supports encodeURI, encodeURIComponent, and decoding. No signup required.",
  keywords: [
    "URL encoder",
    "URL decoder",
    "encode URL online",
    "decode URL online",
    "URL encoding tool",
  ],
  alternates: {
    canonical: "https://devtools-site-delta.vercel.app/url",
  },
};

export default function UrlLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
