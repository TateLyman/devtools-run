import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "Text Case Converter - UPPER, lower, Title, camelCase & More",
  description: "Convert text between 12 cases: UPPERCASE, lowercase, Title Case, camelCase, PascalCase, snake_case, kebab-case, and more. One-click copy. Free text case converter.",
  keywords: ["text case converter", "uppercase converter", "lowercase converter", "title case", "camelCase converter", "snake_case converter"],
};
export default function Layout({ children }: { children: React.ReactNode }) { return children; }
