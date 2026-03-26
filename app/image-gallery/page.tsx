"use client";
import { useState } from "react";
export default function ImageGallery() {
  const [seed, setSeed] = useState(1);
  const images = Array.from({ length: 12 }, (_, i) => `https://picsum.photos/seed/${seed + i}/400/300`);
  return (
    <div className="space-y-6">
      <section className="text-center"><h1 className="text-4xl font-bold mb-2">Random Image Gallery</h1><p className="text-[var(--text-secondary)]">Beautiful random photos for mockups and designs</p></section>
      <div className="flex justify-center"><button onClick={() => setSeed(s => s + 12)} className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-bold">Load New Images</button></div>
      <div className="grid gap-3 md:grid-cols-3 lg:grid-cols-4">
        {images.map((src, i) => (<a key={i} href={src} download className="block overflow-hidden rounded-xl border border-[var(--border)] hover:scale-105 transition-transform"><img src={src} alt={`Random ${i}`} className="w-full h-48 object-cover" loading="lazy" /></a>))}
      </div>
    </div>
  );
}
