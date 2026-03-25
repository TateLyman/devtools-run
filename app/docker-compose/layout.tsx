import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "Docker Compose Generator - Create docker-compose.yml Online",
  description: "Generate docker-compose.yml files visually. Presets for Node+Mongo, Node+Postgres, WordPress, Nginx. Add services, ports, volumes, env vars. Free Docker Compose generator.",
  keywords: ["Docker Compose generator", "docker-compose.yml maker", "Docker config", "Docker setup", "container config", "Docker compose builder"],
};
export default function Layout({ children }: { children: React.ReactNode }) { return children; }
