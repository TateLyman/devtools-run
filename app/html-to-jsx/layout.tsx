import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "HTML to JSX Converter - Convert HTML to React JSX Online",
  description: "Convert HTML to valid JSX/React code instantly. Handles className, style objects, self-closing tags, event handlers, and boolean attributes. Free online tool.",
  keywords: ["HTML to JSX", "HTML to React", "JSX converter", "React converter", "className converter", "HTML JSX transformer"],
};
export default function Layout({ children }: { children: React.ReactNode }) { return children; }
