import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "XML Formatter & Minifier - Format XML Online Free",
  description: "Format and beautify XML or minify it. Customizable indentation. Free online XML formatter and minifier tool.",
  keywords: ["XML formatter", "format XML", "XML beautifier", "XML minifier", "pretty print XML", "XML validator"],
};
export default function Layout({ children }: { children: React.ReactNode }) { return children; }
