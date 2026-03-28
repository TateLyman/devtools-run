import Link from "next/link";

const imageTools = [
  { href: "/image-compress", name: "Image Compressor", desc: "Compress PNG, JPEG, and WebP images up to 90% smaller without visible quality loss.", icon: "C", color: "blue" },
  { href: "/image-resize", name: "Image Resizer", desc: "Resize images to any dimensions. Maintain aspect ratio or set custom sizes.", icon: "R", color: "blue" },
  { href: "/image-converter", name: "Format Converter", desc: "Convert between PNG, JPEG, WebP, and BMP with quality control.", icon: "F", color: "blue" },
  { href: "/background-remover", name: "Background Remover", desc: "Remove image backgrounds with magic wand and manual eraser tools.", icon: "B", color: "purple" },
  { href: "/image-cropper", name: "Image Cropper", desc: "Crop images to any size or aspect ratio. Free-form or preset ratios.", icon: "X", color: "blue" },
  { href: "/image-to-base64", name: "Image to Base64", desc: "Convert any image to a Base64 encoded data URI string.", icon: "64", color: "gray" },
  { href: "/image-colors", name: "Color Extractor", desc: "Extract dominant colors and create palettes from any image.", icon: "P", color: "emerald" },
  { href: "/og-image-generator", name: "OG Image Generator", desc: "Create Open Graph social media preview images for your website.", icon: "OG", color: "orange" },
  { href: "/placeholder-image", name: "Placeholder Image", desc: "Generate placeholder images of any size with custom text and colors.", icon: "PH", color: "gray" },
  { href: "/video-to-gif", name: "Video to GIF", desc: "Convert video clips to animated GIFs. Set start/end time and frame rate.", icon: "GF", color: "pink" },
];

const colorMap: Record<string, string> = {
  blue: "bg-blue-500/10 border-blue-500/20 text-blue-400",
  purple: "bg-purple-500/10 border-purple-500/20 text-purple-400",
  emerald: "bg-emerald-500/10 border-emerald-500/20 text-emerald-400",
  orange: "bg-orange-500/10 border-orange-500/20 text-orange-400",
  pink: "bg-pink-500/10 border-pink-500/20 text-pink-400",
  gray: "bg-gray-500/10 border-gray-500/20 text-gray-400",
};

export default function ImageToolsPage() {
  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-3">Free Image Tools</h1>
        <p className="text-[var(--text-secondary)] text-lg max-w-2xl mx-auto">
          Compress, resize, convert, crop, and edit images — all for free, all in your browser. Your photos never leave your device.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {imageTools.map((tool) => (
          <Link
            key={tool.href}
            href={tool.href}
            className="group block rounded-xl border border-[var(--border)] bg-[var(--bg-secondary)] p-6 hover:border-blue-500/50 transition-colors"
          >
            <div className="flex items-start gap-4">
              <div className={`shrink-0 w-12 h-12 rounded-lg border flex items-center justify-center text-lg font-bold ${colorMap[tool.color]}`}>
                {tool.icon}
              </div>
              <div>
                <h2 className="text-lg font-semibold text-white group-hover:text-blue-400 transition-colors mb-1">
                  {tool.name}
                </h2>
                <p className="text-sm text-[var(--text-secondary)]">{tool.desc}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>

      <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-xl p-6">
        <h2 className="text-xl font-bold mb-3">Privacy-First Image Processing</h2>
        <div className="grid sm:grid-cols-3 gap-4 text-sm">
          <div>
            <h3 className="font-semibold text-white mb-1">Browser-Based</h3>
            <p className="text-[var(--text-secondary)]">All image processing uses the Canvas API in your browser. Zero server uploads.</p>
          </div>
          <div>
            <h3 className="font-semibold text-white mb-1">No File Limits</h3>
            <p className="text-[var(--text-secondary)]">No maximum file size or daily usage limits. Process as many images as you need.</p>
          </div>
          <div>
            <h3 className="font-semibold text-white mb-1">All Formats</h3>
            <p className="text-[var(--text-secondary)]">Supports PNG, JPEG, WebP, BMP, GIF, SVG, and more. Convert between any formats.</p>
          </div>
        </div>
      </div>

      <div className="text-center text-sm text-[var(--text-secondary)]">
        <p>Need PDF tools? Check out our <Link href="/pdf-tools" className="text-[var(--accent)] hover:underline">PDF Tools</Link> or browse all <Link href="/" className="text-[var(--accent)] hover:underline">500+ free tools</Link>.</p>
      </div>
    </div>
  );
}
