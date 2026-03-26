import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "Reading Time Calculator - How Long to Read Any Text Free",
  description: "Calculate reading time for any text. Words per minute, speaking time, page count. Perfect for blog posts, articles, speeches. Free reading time calculator.",
  keywords: ["reading time calculator", "how long to read", "words per minute", "speaking time calculator", "reading speed"],
};
export default function Layout({ children }: { children: React.ReactNode }) { return children; }
