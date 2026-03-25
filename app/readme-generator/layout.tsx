import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "README Generator - Create Professional GitHub README Files",
  description: "Generate a professional README.md for your GitHub project in seconds. Badges, table of contents, installation, usage, API docs, and more. Free online tool.",
  keywords: ["README generator", "GitHub README", "README template", "markdown generator", "project documentation", "README.md maker"],
};
export default function Layout({ children }: { children: React.ReactNode }) { return children; }
