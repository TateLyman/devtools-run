import { Metadata } from "next";
import ConvertClient from "./client";

const CONVERSIONS: Record<string, { from: string; to: string; category: string }> = {
  "json-to-yaml": { from: "JSON", to: "YAML", category: "data" },
  "yaml-to-json": { from: "YAML", to: "JSON", category: "data" },
  "json-to-csv": { from: "JSON", to: "CSV", category: "data" },
  "csv-to-json": { from: "CSV", to: "JSON", category: "data" },
  "json-to-xml": { from: "JSON", to: "XML", category: "data" },
  "xml-to-json": { from: "XML", to: "JSON", category: "data" },
  "json-to-typescript": { from: "JSON", to: "TypeScript", category: "code" },
  "markdown-to-html": { from: "Markdown", to: "HTML", category: "markup" },
  "html-to-markdown": { from: "HTML", to: "Markdown", category: "markup" },
  "hex-to-rgb": { from: "HEX", to: "RGB", category: "color" },
  "rgb-to-hex": { from: "RGB", to: "HEX", category: "color" },
  "hex-to-hsl": { from: "HEX", to: "HSL", category: "color" },
  "celsius-to-fahrenheit": { from: "Celsius", to: "Fahrenheit", category: "temp" },
  "fahrenheit-to-celsius": { from: "Fahrenheit", to: "Celsius", category: "temp" },
  "px-to-rem": { from: "PX", to: "REM", category: "css" },
  "rem-to-px": { from: "REM", to: "PX", category: "css" },
  "px-to-em": { from: "PX", to: "EM", category: "css" },
  "base64-to-text": { from: "Base64", to: "Text", category: "encode" },
  "text-to-base64": { from: "Text", to: "Base64", category: "encode" },
  "url-encode": { from: "Text", to: "URL Encoded", category: "encode" },
  "url-decode": { from: "URL Encoded", to: "Text", category: "encode" },
  "binary-to-decimal": { from: "Binary", to: "Decimal", category: "number" },
  "decimal-to-binary": { from: "Decimal", to: "Binary", category: "number" },
  "hex-to-decimal": { from: "Hexadecimal", to: "Decimal", category: "number" },
  "decimal-to-hex": { from: "Decimal", to: "Hexadecimal", category: "number" },
  "octal-to-decimal": { from: "Octal", to: "Decimal", category: "number" },
  "unix-to-date": { from: "Unix Timestamp", to: "Date", category: "time" },
  "date-to-unix": { from: "Date", to: "Unix Timestamp", category: "time" },
  "km-to-miles": { from: "Kilometers", to: "Miles", category: "distance" },
  "miles-to-km": { from: "Miles", to: "Kilometers", category: "distance" },
  "kg-to-lbs": { from: "Kilograms", to: "Pounds", category: "weight" },
  "lbs-to-kg": { from: "Pounds", to: "Kilograms", category: "weight" },
  "usd-to-sol": { from: "USD", to: "SOL", category: "crypto" },
  "sol-to-usd": { from: "SOL", to: "USD", category: "crypto" },
  "eth-to-usd": { from: "ETH", to: "USD", category: "crypto" },
  "btc-to-usd": { from: "BTC", to: "USD", category: "crypto" },
  "inches-to-cm": { from: "Inches", to: "Centimeters", category: "distance" },
  "cm-to-inches": { from: "Centimeters", to: "Inches", category: "distance" },
  "bytes-to-kb": { from: "Bytes", to: "Kilobytes", category: "data-size" },
  "mb-to-gb": { from: "Megabytes", to: "Gigabytes", category: "data-size" },
};

export function generateStaticParams() {
  return Object.keys(CONVERSIONS).map(slug => ({ slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const conv = CONVERSIONS[params.slug];
  if (!conv) return { title: "Converter" };
  return {
    title: `${conv.from} to ${conv.to} Converter — Free Online Tool`,
    description: `Convert ${conv.from} to ${conv.to} instantly. Free online converter, no signup required. Part of 90+ developer tools.`,
  };
}

export default function ConvertPage({ params }: { params: { slug: string } }) {
  const conv = CONVERSIONS[params.slug] || { from: "?", to: "?", category: "?" };
  const allConversions = Object.entries(CONVERSIONS);
  return <ConvertClient from={conv.from} to={conv.to} slug={params.slug} allConversions={allConversions} />;
}
