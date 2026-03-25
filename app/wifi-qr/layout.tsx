import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "WiFi QR Code Generator - Share WiFi Password Instantly",
  description: "Generate a QR code for your WiFi network. Guests scan to connect instantly. WPA/WPA2, WEP, open networks. Download as PNG. Free WiFi QR generator.",
  keywords: ["WiFi QR code", "WiFi QR generator", "share WiFi password", "WiFi QR code maker", "guest WiFi QR", "WiFi connection QR"],
};
export default function Layout({ children }: { children: React.ReactNode }) { return children; }
