import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "TypeScript Playground - Run TypeScript Code in Browser Free",
  description: "Write and run TypeScript code in your browser. Strips types and executes as JavaScript. Console output capture. Free online TypeScript playground.",
  keywords: ["TypeScript playground", "run TypeScript online", "TS playground", "TypeScript compiler online", "TypeScript editor", "run TS in browser"],
};
export default function Layout({ children }: { children: React.ReactNode }) { return children; }
