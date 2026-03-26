import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "Regex Builder - Build Regular Expressions Visually Free",
  description: "Build regex patterns visually. Add character classes, quantifiers, groups. Test against sample text. Free visual regex builder tool.",
  keywords: ["regex builder", "regex generator", "build regex", "visual regex", "regex constructor", "regular expression builder"],
};
export default function Layout({ children }: { children: React.ReactNode }) { return children; }
