import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "Nginx Config Generator - Create Server Configuration Online",
  description: "Generate Nginx server configuration with SSL, reverse proxy, gzip, caching, security headers. Free online Nginx config generator.",
  keywords: ["Nginx config generator", "Nginx configuration", "Nginx SSL", "Nginx reverse proxy", "server config", "Nginx setup"],
};
export default function Layout({ children }: { children: React.ReactNode }) { return children; }
