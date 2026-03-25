import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "IP Address Lookup - Find IP Location, ISP & Timezone",
  description: "Look up any IP address geolocation. See city, country, ISP, timezone, ASN, coordinates. Find your own IP. Free IP lookup tool.",
  keywords: ["IP lookup", "IP address lookup", "what is my IP", "IP geolocation", "IP location finder", "IP address checker"],
};
export default function Layout({ children }: { children: React.ReactNode }) { return children; }
