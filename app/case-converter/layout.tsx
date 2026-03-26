import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "Case Converter - Uppercase, Lowercase, Title Case Free",
  description: "Convert text case instantly. UPPERCASE, lowercase, Title Case, camelCase, snake_case, kebab-case, CONSTANT_CASE. Free case converter.",
  keywords: ["case converter", "uppercase converter", "lowercase converter", "title case", "camelCase", "snake_case", "text case"],
};
export default function Layout({ children }: { children: React.ReactNode }) { return children; }
