import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "Free Invoice Generator - Create Professional Invoices Online",
  description: "Create professional invoices for freelance work in seconds. Supports USD, EUR, GBP, SOL, BTC, ETH. Print or save as PDF. Free, no signup required.",
  keywords: ["invoice generator", "free invoice maker", "freelance invoice", "crypto invoice", "invoice template", "online invoice creator"],
};
export default function Layout({ children }: { children: React.ReactNode }) { return children; }
