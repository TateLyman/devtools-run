import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "Flexbox Generator - Visual CSS Flexbox Playground",
  description: "Build CSS Flexbox layouts visually. Adjust direction, justify-content, align-items, wrap, and gap with live preview. Copy generated CSS. Free online tool.",
  keywords: ["flexbox generator", "CSS flexbox", "flexbox playground", "flexbox builder", "flexbox tool", "CSS layout generator"],
};
export default function Layout({ children }: { children: React.ReactNode }) { return children; }
