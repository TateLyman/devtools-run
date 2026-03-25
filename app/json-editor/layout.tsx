import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "JSON Editor - Edit JSON with Tree View Online Free",
  description: "Edit JSON with tree view, format, minify, sort keys, and validate. Live preview as you type. Free online JSON editor.",
  keywords: ["JSON editor", "JSON tree viewer", "edit JSON online", "JSON viewer", "JSON browser", "online JSON editor"],
};
export default function Layout({ children }: { children: React.ReactNode }) { return children; }
