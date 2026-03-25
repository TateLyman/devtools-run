import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "WHOIS Lookup - Domain Registration Info & Expiry Check",
  description: "Look up domain WHOIS data. See registrar, creation date, expiry, nameservers, status. Uses RDAP protocol. Free online WHOIS lookup tool.",
  keywords: ["WHOIS lookup", "domain WHOIS", "domain registration", "domain expiry", "WHOIS checker", "domain info lookup"],
};
export default function Layout({ children }: { children: React.ReactNode }) { return children; }
