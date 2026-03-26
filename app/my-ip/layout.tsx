import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "What is My IP Address? - Free IP Checker with Location",
  description: "Find your public IP address instantly. See ISP, location, timezone, and connection details. Free IP address checker tool.",
  keywords: ["what is my ip", "my ip address", "IP checker", "find my ip", "public ip address", "ip location"],
};
export default function Layout({ children }: { children: React.ReactNode }) { return children; }
