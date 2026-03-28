import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "Free Meme Generator — Create Memes Online",
  description: "Create memes with multiple text blocks, custom fonts, colors, stroke, and shadow. Upload images, drag text, download as PNG. Free online meme maker. No watermarks.",
  keywords: ["meme generator", "meme maker", "create meme online", "custom meme", "meme creator", "free meme generator", "meme template"],
};
export default function Layout({ children }: { children: React.ReactNode }) { return children; }
