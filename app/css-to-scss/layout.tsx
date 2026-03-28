import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "CSS to SCSS Converter - Convert CSS to SCSS/Sass Online Free",
  description: "Convert plain CSS to nested SCSS/Sass syntax automatically. Nests selectors, extracts variables for repeated values, and preserves media queries. Free online CSS to SCSS converter.",
  keywords: ["CSS to SCSS", "CSS to Sass", "SCSS converter", "convert CSS SCSS online", "CSS nesting", "Sass converter", "CSS preprocessor"],
};
export default function Layout({ children }: { children: React.ReactNode }) { return children; }
