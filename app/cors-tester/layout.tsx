import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "CORS Tester - Check CORS Headers for Any URL Online",
  description: "Test if a URL has CORS headers enabled. Check Access-Control-Allow-Origin and preflight responses. Free online CORS checker.",
  keywords: ["CORS tester", "CORS checker", "test CORS", "Access-Control-Allow-Origin", "CORS headers", "cross-origin test"],
};
export default function Layout({ children }: { children: React.ReactNode }) { return children; }
