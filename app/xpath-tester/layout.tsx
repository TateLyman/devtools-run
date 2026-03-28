import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "XPath Tester - Test XPath Expressions Online Free",
  description: "Test and evaluate XPath expressions against XML/HTML documents in real-time. Highlights matching nodes, shows result count, and supports XPath 1.0. Free online XPath tester.",
  keywords: ["XPath tester", "XPath evaluator", "test XPath online", "XPath query", "XML XPath", "XPath expression tester", "XPath selector", "XPath validator"],
};
export default function Layout({ children }: { children: React.ReactNode }) { return children; }
