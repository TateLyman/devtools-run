import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "CSP Generator - Content Security Policy Builder Online",
  description: "Generate Content Security Policy headers visually. Toggle directives and sources, copy as HTTP header or meta tag. Free online CSP generator.",
  keywords: ["CSP generator", "Content Security Policy", "CSP builder", "security headers", "CSP header generator", "XSS prevention"],
};
export default function Layout({ children }: { children: React.ReactNode }) { return children; }
