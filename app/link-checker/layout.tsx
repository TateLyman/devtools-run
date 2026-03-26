import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "Link Extractor - Extract All URLs from Text Free",
  description: "Extract all URLs from any text. Paste text, get a list of all links. Deduplicate and count. Free link extractor tool.",
  keywords: ["link extractor", "extract URLs", "find links", "URL finder", "link parser", "get all links"],
};
export default function Layout({ children }: { children: React.ReactNode }) { return children; }
