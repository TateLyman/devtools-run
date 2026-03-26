import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "Download Time Calculator - How Long to Download a File?",
  description: "Calculate download time for any file size and internet speed. Supports Mbps, Gbps, KB/s. Free download time calculator.",
  keywords: ["download time calculator", "download speed calculator", "how long to download", "file download time"],
};
export default function Layout({ children }: { children: React.ReactNode }) { return children; }
