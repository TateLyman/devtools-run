import Link from "next/link";

const pdfTools = [
  { href: "/pdf-merge", name: "Merge PDF", desc: "Combine multiple PDF files into one document. Drag to reorder pages.", icon: "M" },
  { href: "/pdf-split", name: "Split PDF", desc: "Extract specific pages or split a PDF into separate files.", icon: "S" },
  { href: "/word-to-pdf", name: "Word to PDF", desc: "Convert Word documents (.doc, .docx) to PDF format.", icon: "W" },
  { href: "/image-to-base64", name: "PDF to Base64", desc: "Convert PDF files to Base64 encoded strings.", icon: "B" },
];

export default function PdfToolsPage() {
  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-3">Free PDF Tools</h1>
        <p className="text-[var(--text-secondary)] text-lg max-w-2xl mx-auto">
          Merge, split, and convert PDF files — completely free. All tools run in your browser, so your files never leave your device.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {pdfTools.map((tool) => (
          <Link
            key={tool.href}
            href={tool.href}
            className="group block rounded-xl border border-[var(--border)] bg-[var(--bg-secondary)] p-6 hover:border-red-500/50 transition-colors"
          >
            <div className="flex items-start gap-4">
              <div className="shrink-0 w-12 h-12 rounded-lg bg-red-500/10 border border-red-500/20 flex items-center justify-center text-lg font-bold text-red-400">
                {tool.icon}
              </div>
              <div>
                <h2 className="text-lg font-semibold text-white group-hover:text-red-400 transition-colors mb-1">
                  {tool.name}
                </h2>
                <p className="text-sm text-[var(--text-secondary)]">{tool.desc}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>

      <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-xl p-6">
        <h2 className="text-xl font-bold mb-3">Why Use Our PDF Tools?</h2>
        <div className="grid sm:grid-cols-3 gap-4 text-sm">
          <div>
            <h3 className="font-semibold text-white mb-1">100% Private</h3>
            <p className="text-[var(--text-secondary)]">Your files are processed entirely in your browser. Nothing is uploaded to any server.</p>
          </div>
          <div>
            <h3 className="font-semibold text-white mb-1">Completely Free</h3>
            <p className="text-[var(--text-secondary)]">No signup, no watermarks, no file size limits. Use as many times as you want.</p>
          </div>
          <div>
            <h3 className="font-semibold text-white mb-1">Works Offline</h3>
            <p className="text-[var(--text-secondary)]">Once loaded, tools work without an internet connection. Your data stays on your device.</p>
          </div>
        </div>
      </div>

      <div className="text-center text-sm text-[var(--text-secondary)]">
        <p>Looking for more tools? Check out our <Link href="/image-tools" className="text-[var(--accent)] hover:underline">Image Tools</Link> or browse all <Link href="/" className="text-[var(--accent)] hover:underline">500+ free tools</Link>.</p>
      </div>
    </div>
  );
}
