import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "Binary Converter - Binary, Hex, Octal, Decimal Converter Free",
  description: "Convert between binary, hexadecimal, octal and decimal numbers instantly. Supports any base. Free number base converter for programmers.",
  keywords: ["binary converter", "hex converter", "binary to decimal", "decimal to binary", "hex to binary", "octal converter"],
};
export default function Layout({ children }: { children: React.ReactNode }) { return children; }
