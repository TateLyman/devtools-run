"use client";
import { useState } from "react";
export default function Page() {
  const [output, setOutput] = useState("");
  return (
    <div className="space-y-6">
      <section className="text-center"><h1 className="text-4xl font-bold mb-2">Crontab Editor</h1><p className="text-[var(--text-secondary)]">Visual crontab schedule editor</p></section>
      <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-xl p-8 text-center">
        <p className="text-lg font-bold">Coming Soon</p>
        <p className="text-sm text-[var(--text-secondary)] mt-2">This tool is being built. Check back soon!</p>
        <p className="text-xs text-[var(--text-secondary)] mt-4">Meanwhile, try our <a href="/" className="text-blue-400">443+ other free tools</a></p>
      </div>
    </div>
  );
}
