import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "Free Link Shortener - Custom Short URLs with QR Codes",
  description: "Shorten URLs with custom aliases and generate QR codes. Free, no signup, no tracking. Create branded short links instantly in your browser.",
  keywords: ["link shortener", "URL shortener", "short URL", "custom short link", "QR code generator", "free URL shortener"],
};
export default function Layout({ children }: { children: React.ReactNode }) { return children; }
