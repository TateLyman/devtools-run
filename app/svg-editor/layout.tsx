import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "SVG Editor - Edit & Preview SVG Code Online Free",
  description: "Edit SVG code with live preview. Shape templates, export as SVG or PNG. Free online SVG editor and viewer.",
  keywords: ["SVG editor", "SVG viewer", "edit SVG online", "SVG preview", "SVG code editor", "SVG to PNG"],
};
export default function Layout({ children }: { children: React.ReactNode }) { return children; }
