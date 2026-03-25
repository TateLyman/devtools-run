import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "DNS Lookup - Check DNS Records for Any Domain Online",
  description: "Look up DNS records for any domain. A, AAAA, CNAME, MX, NS, TXT, SOA records using Cloudflare DNS-over-HTTPS. Free online DNS lookup tool.",
  keywords: ["DNS lookup", "check DNS records", "domain lookup", "MX record checker", "NS lookup", "DNS checker online"],
};
export default function Layout({ children }: { children: React.ReactNode }) { return children; }
