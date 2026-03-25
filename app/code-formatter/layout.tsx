import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "Code Formatter & Beautifier - Format JS, CSS, HTML, SQL Online",
  description: "Format and beautify code online. Supports JavaScript, TypeScript, JSON, CSS, HTML, and SQL. Minify or pretty-print with customizable indentation. Free tool.",
  keywords: ["code formatter", "code beautifier", "JavaScript formatter", "CSS formatter", "HTML formatter", "SQL formatter", "JSON beautifier", "pretty print code"],
};
export default function Layout({ children }: { children: React.ReactNode }) { return children; }
