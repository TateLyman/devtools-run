"use client";
import { useState } from "react";

export default function WordToPdf() {
  const [text, setText] = useState("");
  const [title, setTitle] = useState("My Document");
  const [fontSize, setFontSize] = useState(12);

  const generatePDF = () => {
    // Create a printable HTML document and use browser's print-to-PDF
    const printWindow = window.open("", "_blank");
    if (!printWindow) return;

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>${title}</title>
        <style>
          body { font-family: 'Times New Roman', serif; font-size: ${fontSize}pt; line-height: 1.6; max-width: 8.5in; margin: 1in auto; padding: 0; color: #000; }
          h1 { font-size: ${fontSize * 2}pt; margin-bottom: 0.5em; }
          p { margin-bottom: 1em; white-space: pre-wrap; }
          @media print { body { margin: 0; } }
        </style>
      </head>
      <body>
        ${title ? `<h1>${title}</h1>` : ""}
        ${text.split("\n\n").map((p) => `<p>${p.replace(/\n/g, "<br>")}</p>`).join("")}
      </body>
      </html>
    `);
    printWindow.document.close();
    setTimeout(() => printWindow.print(), 500);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold mb-2">Text to PDF Converter</h1>
        <p className="text-[var(--text-secondary)]">
          Convert text to PDF. Paste or type your content, set title and font size, save as PDF using your browser's print dialog. Free text to PDF.
        </p>
      </div>

      <div className="max-w-2xl mx-auto space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Document Title" className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded px-3 py-2 text-white text-sm" />
          <div className="flex items-center gap-2">
            <label className="text-xs text-gray-400">Font:</label>
            <select value={fontSize} onChange={(e) => setFontSize(Number(e.target.value))} className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded px-2 py-2 text-white text-sm">
              {[10, 11, 12, 14, 16, 18, 20, 24].map((s) => <option key={s} value={s}>{s}pt</option>)}
            </select>
          </div>
        </div>

        <textarea value={text} onChange={(e) => setText(e.target.value)} placeholder="Paste or type your text here..." className="w-full bg-[var(--bg-secondary)] border border-[var(--border)] rounded-xl px-4 py-3 text-white h-[400px] resize-none text-sm" />

        <div className="flex items-center justify-between">
          <span className="text-xs text-gray-400">{text.trim() ? text.trim().split(/\s+/).length : 0} words</span>
          <button onClick={generatePDF} disabled={!text.trim()} className="bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white px-6 py-2.5 rounded font-bold flex items-center gap-2">
            Save as PDF
          </button>
        </div>

        <p className="text-xs text-gray-500 text-center">Uses your browser's built-in Print → Save as PDF. No data uploaded anywhere.</p>
      </div>
    </div>
  );
}
