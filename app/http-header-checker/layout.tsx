import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "HTTP Header Checker - View Response Headers & Security Headers",
  description: "Check HTTP response headers for any URL. Analyze security headers, caching, content type. Free online HTTP header checker and analyzer.",
  keywords: ["HTTP header checker", "response headers", "security headers", "HTTP analyzer", "header viewer", "CSP checker"],
};
export default function Layout({ children }: { children: React.ReactNode }) { return children; }
