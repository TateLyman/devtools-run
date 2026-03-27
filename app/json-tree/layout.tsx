import type { Metadata } from "next";
export const metadata: Metadata = { title: "JSON Tree Viewer - Visualize JSON as Collapsible Tree Free", description: "View JSON as a collapsible tree. Expand/collapse nodes. Syntax highlighting. Click to copy paths. Free JSON tree viewer.", keywords: ["json tree viewer", "json visualizer", "json tree", "collapsible json", "json explorer"] };
export default function Layout({ children }: { children: React.ReactNode }) { return children; }
