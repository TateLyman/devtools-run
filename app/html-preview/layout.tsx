import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "HTML Live Preview - Write HTML with Live Preview Online Free",
  description: "Write HTML and see a live preview side by side. Includes CSS and JavaScript execution. Free online HTML editor with instant preview.",
  keywords: ["HTML preview", "HTML editor", "live HTML", "HTML playground", "online HTML editor", "HTML CSS preview"],
};
export default function Layout({ children }: { children: React.ReactNode }) { return children; }
