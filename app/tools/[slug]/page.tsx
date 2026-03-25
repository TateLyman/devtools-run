import { Metadata } from "next";
import { redirect } from "next/navigation";

const TOOLS: Record<string, { title: string; desc: string; redirect: string }> = {
  "json-formatter": { title: "JSON Formatter Online Free", desc: "Format and beautify JSON data online. Free, no signup required.", redirect: "/json" },
  "json-validator": { title: "JSON Validator Online Free", desc: "Validate JSON data and find errors instantly. Free online tool.", redirect: "/json-validator" },
  "base64-encoder": { title: "Base64 Encoder/Decoder Online Free", desc: "Encode and decode Base64 strings online. Free, instant results.", redirect: "/base64" },
  "regex-tester": { title: "Regex Tester Online Free", desc: "Test regular expressions in real-time with matches highlighted. Free.", redirect: "/regex" },
  "hash-generator": { title: "Hash Generator Online Free (MD5, SHA256)", desc: "Generate MD5, SHA-1, SHA-256 hashes online. Free hash calculator.", redirect: "/hash" },
  "jwt-decoder": { title: "JWT Decoder Online Free", desc: "Decode JWT tokens and inspect header, payload, and signature. Free.", redirect: "/jwt" },
  "url-encoder": { title: "URL Encoder/Decoder Online Free", desc: "Encode and decode URLs online. Free URL encoding tool.", redirect: "/url" },
  "password-generator": { title: "Password Generator Online Free", desc: "Generate strong random passwords. Customize length and character types.", redirect: "/password" },
  "uuid-generator": { title: "UUID Generator Online Free", desc: "Generate UUID v4 strings instantly. Free, no signup.", redirect: "/uuid" },
  "qr-code-generator": { title: "QR Code Generator Online Free", desc: "Create QR codes from any text or URL. Free, download as PNG.", redirect: "/qr" },
  "color-picker": { title: "Color Picker Online Free", desc: "Pick colors and get HEX, RGB, HSL values. Free online tool.", redirect: "/color" },
  "css-gradient-generator": { title: "CSS Gradient Generator Online Free", desc: "Create CSS linear gradients visually. Copy the code. Free.", redirect: "/gradient" },
  "css-minifier": { title: "CSS Minifier Online Free", desc: "Minify CSS code online. Reduce file size instantly. Free.", redirect: "/css-minify" },
  "markdown-editor": { title: "Markdown Editor Online Free", desc: "Write Markdown with live preview. Export to HTML. Free.", redirect: "/md-editor" },
  "diff-checker": { title: "Diff Checker Online Free", desc: "Compare two texts and see differences highlighted. Free.", redirect: "/diff" },
  "cron-generator": { title: "Cron Expression Generator Online Free", desc: "Build and validate cron expressions visually. Free.", redirect: "/cron" },
  "lorem-ipsum": { title: "Lorem Ipsum Generator Online Free", desc: "Generate placeholder text for your designs. Free.", redirect: "/lorem" },
  "word-counter": { title: "Word Counter Online Free", desc: "Count words, characters, sentences, and reading time. Free.", redirect: "/word-counter" },
  "box-shadow-generator": { title: "CSS Box Shadow Generator Online Free", desc: "Design box shadows visually and copy CSS. Free.", redirect: "/box-shadow" },
  "favicon-generator": { title: "Favicon Generator Online Free", desc: "Create letter-based favicons. Download as PNG. Free.", redirect: "/favicon" },
  "meta-tag-generator": { title: "Meta Tag Generator Online Free (Open Graph)", desc: "Generate Open Graph and Twitter Card meta tags. Free.", redirect: "/meta-tags" },
  "sql-formatter": { title: "SQL Formatter Online Free", desc: "Format and beautify SQL queries online. Free.", redirect: "/sql" },
  "epoch-converter": { title: "Unix Epoch Converter Online Free", desc: "Convert between Unix timestamps and dates. Free.", redirect: "/epoch" },
  "chmod-calculator": { title: "Chmod Calculator Online Free", desc: "Calculate Linux file permissions. Free chmod tool.", redirect: "/chmod" },
  "contrast-checker": { title: "Color Contrast Checker Online Free (WCAG)", desc: "Check WCAG accessibility contrast ratio. Free.", redirect: "/contrast" },
  "ip-lookup": { title: "What Is My IP Address — Free IP Lookup", desc: "See your public IP address and location info instantly.", redirect: "/ip" },
  "screen-size": { title: "What Is My Screen Size — Free Browser Tool", desc: "Check viewport width, height, DPR, and Tailwind breakpoint.", redirect: "/screen-size" },
  "meme-generator": { title: "Meme Generator Online Free", desc: "Create memes with top/bottom text. Download as PNG. Free.", redirect: "/meme" },
  "invoice-generator": { title: "Invoice Generator Online Free", desc: "Create professional invoices with optional SOL payment. Free.", redirect: "/invoice" },
  "uptime-checker": { title: "Website Uptime Checker Online Free", desc: "Check if any website is up or down right now. Free.", redirect: "/uptime" },
};

export function generateStaticParams() {
  return Object.keys(TOOLS).map(slug => ({ slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const tool = TOOLS[params.slug];
  if (!tool) return { title: "Free Online Tool" };
  return {
    title: tool.title,
    description: tool.desc,
    openGraph: { title: tool.title, description: tool.desc },
  };
}

export default function ToolPage({ params }: { params: { slug: string } }) {
  const tool = TOOLS[params.slug];
  if (tool) redirect(tool.redirect);
  return <div>Tool not found</div>;
}
