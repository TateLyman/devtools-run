import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "Barcode Generator - Free Online Barcode Maker (Code128, EAN, UPC)",
  description: "Generate barcodes free online. Code 128, EAN-13, UPC-A. Download as PNG. Free barcode generator for products, inventory, labels.",
  keywords: ["barcode generator", "barcode maker", "code 128 generator", "EAN barcode", "UPC barcode", "free barcode"],
};
export default function Layout({ children }: { children: React.ReactNode }) { return children; }
