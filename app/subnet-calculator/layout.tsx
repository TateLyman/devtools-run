import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "Subnet Calculator - Free IP Subnet & CIDR Calculator",
  description: "Calculate IP subnets, CIDR notation, network address, broadcast, host range, wildcard mask. Free subnet calculator for network engineers.",
  keywords: ["subnet calculator", "CIDR calculator", "IP subnet", "network calculator", "subnet mask", "IP address calculator"],
};
export default function Layout({ children }: { children: React.ReactNode }) { return children; }
