import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "Data Size Converter - Bytes, KB, MB, GB, TB Converter Free",
  description: "Convert between bytes, KB, MB, GB, TB, PB instantly. Binary and decimal units. Free data size converter and calculator.",
  keywords: ["data size converter", "bytes to MB", "MB to GB", "GB to TB", "file size converter", "storage converter"],
};
export default function Layout({ children }: { children: React.ReactNode }) { return children; }
