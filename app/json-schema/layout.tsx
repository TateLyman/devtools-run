import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "JSON Schema Generator - Generate Schema from JSON Data",
  description: "Generate JSON Schema from JSON data. Detects types, arrays, nested objects. Free online JSON Schema generator.",
  keywords: ["JSON Schema generator", "generate JSON Schema", "JSON to schema", "JSON Schema from data", "schema generator"],
};
export default function Layout({ children }: { children: React.ReactNode }) { return children; }
