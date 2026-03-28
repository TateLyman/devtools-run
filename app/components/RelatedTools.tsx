import Link from "next/link";

interface Tool {
  href: string;
  name: string;
}

const toolGroups: Record<string, Tool[]> = {
  pdf: [
    { href: "/pdf-merge", name: "Merge PDF" },
    { href: "/pdf-split", name: "Split PDF" },
    { href: "/compress-pdf", name: "Compress PDF" },
    { href: "/pdf-to-image", name: "PDF to Image" },
    { href: "/image-to-pdf", name: "Image to PDF" },
    { href: "/word-to-pdf", name: "Word to PDF" },
  ],
  image: [
    { href: "/image-compress", name: "Compress Image" },
    { href: "/image-resize", name: "Resize Image" },
    { href: "/image-converter", name: "Convert Format" },
    { href: "/background-remover", name: "Remove Background" },
    { href: "/image-cropper", name: "Crop Image" },
    { href: "/photo-editor", name: "Photo Editor" },
    { href: "/color-picker", name: "Color Picker" },
  ],
  video: [
    { href: "/video-to-gif", name: "Video to GIF" },
    { href: "/meme-generator", name: "Meme Generator" },
    { href: "/text-to-image", name: "Quote Maker" },
    { href: "/screenshot-to-code", name: "Screenshot to Code" },
  ],
  dev: [
    { href: "/json", name: "JSON Formatter" },
    { href: "/regex", name: "Regex Tester" },
    { href: "/base64", name: "Base64 Encoder" },
    { href: "/jwt", name: "JWT Decoder" },
    { href: "/hash", name: "Hash Generator" },
    { href: "/sql", name: "SQL Formatter" },
    { href: "/git-command", name: "Git Command Builder" },
  ],
  calc: [
    { href: "/bmi-calculator", name: "BMI Calculator" },
    { href: "/mortgage-calculator", name: "Mortgage Calculator" },
    { href: "/percentage-calculator", name: "Percentage Calc" },
    { href: "/tip-calculator", name: "Tip Calculator" },
    { href: "/loan-calculator", name: "Loan Calculator" },
    { href: "/calorie-calculator", name: "Calorie Calculator" },
  ],
  generate: [
    { href: "/qr-code-generator", name: "QR Code" },
    { href: "/barcode-generator", name: "Barcode" },
    { href: "/favicon-generator", name: "Favicon" },
    { href: "/password", name: "Password" },
    { href: "/uuid", name: "UUID" },
    { href: "/lorem", name: "Lorem Ipsum" },
  ],
};

interface RelatedToolsProps {
  group: keyof typeof toolGroups;
  current?: string;
}

export default function RelatedTools({ group, current }: RelatedToolsProps) {
  const tools = toolGroups[group]?.filter((t) => t.href !== current) || [];
  if (tools.length === 0) return null;

  return (
    <div className="mt-8 pt-6 border-t border-[var(--border)]">
      <h3 className="text-sm font-semibold text-[var(--text-secondary)] mb-3 uppercase tracking-wider">
        Related Tools
      </h3>
      <div className="flex flex-wrap gap-2">
        {tools.map((tool) => (
          <Link
            key={tool.href}
            href={tool.href}
            className="text-xs px-3 py-1.5 rounded-full border border-[var(--border)] bg-[var(--bg-secondary)] text-[var(--text-secondary)] hover:border-[var(--accent)] hover:text-white transition-colors"
          >
            {tool.name}
          </Link>
        ))}
      </div>
    </div>
  );
}
