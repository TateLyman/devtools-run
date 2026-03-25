"use client";
import { useState, useRef } from "react";

export default function YouTubeThumbnail() {
  const [image, setImage] = useState<string | null>(null);
  const [title, setTitle] = useState("How I Made $10,000 in One Month with AI Tools");
  const [channel, setChannel] = useState("DevTools.run");
  const [views, setViews] = useState("1.2M views");
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => setImage(e.target?.result as string);
    reader.readAsDataURL(file);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold mb-2">YouTube Thumbnail Previewer</h1>
        <p className="text-[var(--text-secondary)]">
          Preview how your YouTube thumbnail will look in search results, homepage, and sidebar. Upload your image and customize title.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-3">
          <div className="bg-[var(--bg-secondary)] border-2 border-dashed border-[var(--border)] rounded-lg p-6 text-center cursor-pointer hover:border-purple-500/50" onClick={() => fileRef.current?.click()} onDrop={(e) => { e.preventDefault(); e.dataTransfer.files[0] && handleFile(e.dataTransfer.files[0]); }} onDragOver={(e) => e.preventDefault()}>
            {image ? <img src={image} alt="Thumbnail" className="max-h-32 mx-auto rounded" /> : <p className="text-gray-400">Drop thumbnail or click to upload</p>}
            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])} />
          </div>
          <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Video title" className="w-full bg-[var(--bg-secondary)] border border-[var(--border)] rounded px-3 py-2 text-white text-sm" />
          <input value={channel} onChange={(e) => setChannel(e.target.value)} placeholder="Channel name" className="w-full bg-[var(--bg-secondary)] border border-[var(--border)] rounded px-3 py-2 text-white text-sm" />
          <input value={views} onChange={(e) => setViews(e.target.value)} placeholder="View count" className="w-full bg-[var(--bg-secondary)] border border-[var(--border)] rounded px-3 py-2 text-white text-sm" />
        </div>

        <div className="lg:col-span-2 space-y-6">
          {/* Homepage/Search Preview */}
          <div>
            <h3 className="text-sm font-bold text-gray-400 mb-2">Homepage / Search Results</h3>
            <div className="bg-black rounded-lg p-4 max-w-md">
              <div className="bg-gray-800 rounded-lg overflow-hidden aspect-video flex items-center justify-center">
                {image ? <img src={image} alt="" className="w-full h-full object-cover" /> : <span className="text-gray-600 text-sm">Upload thumbnail</span>}
              </div>
              <div className="mt-2 flex gap-2">
                <div className="w-9 h-9 bg-purple-600 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0">{channel.charAt(0)}</div>
                <div>
                  <p className="text-white text-sm font-medium line-clamp-2 leading-snug">{title}</p>
                  <p className="text-gray-400 text-xs mt-0.5">{channel}</p>
                  <p className="text-gray-400 text-xs">{views} · 2 hours ago</p>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar Preview */}
          <div>
            <h3 className="text-sm font-bold text-gray-400 mb-2">Sidebar / Up Next</h3>
            <div className="bg-black rounded-lg p-4 max-w-md">
              <div className="flex gap-2">
                <div className="w-40 shrink-0 bg-gray-800 rounded overflow-hidden aspect-video flex items-center justify-center">
                  {image ? <img src={image} alt="" className="w-full h-full object-cover" /> : <span className="text-gray-600 text-[10px]">Thumb</span>}
                </div>
                <div>
                  <p className="text-white text-xs font-medium line-clamp-2 leading-snug">{title}</p>
                  <p className="text-gray-400 text-[10px] mt-1">{channel}</p>
                  <p className="text-gray-400 text-[10px]">{views}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Mobile Preview */}
          <div>
            <h3 className="text-sm font-bold text-gray-400 mb-2">Mobile Feed</h3>
            <div className="bg-black rounded-lg p-4 max-w-sm">
              <div className="bg-gray-800 rounded-lg overflow-hidden aspect-video flex items-center justify-center">
                {image ? <img src={image} alt="" className="w-full h-full object-cover" /> : <span className="text-gray-600 text-sm">Upload thumbnail</span>}
              </div>
              <div className="mt-2 flex gap-2">
                <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center text-white text-[10px] font-bold shrink-0">{channel.charAt(0)}</div>
                <div className="flex-1">
                  <p className="text-white text-xs font-medium line-clamp-2">{title}</p>
                  <p className="text-gray-400 text-[10px]">{channel} · {views} · 2h ago</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-lg p-4 text-xs text-[var(--text-secondary)]">
        <h3 className="font-bold text-white mb-1">Thumbnail Tips</h3>
        <ul className="space-y-1">
          <li>• Optimal size: 1280×720 pixels (16:9 ratio)</li>
          <li>• Use bold, readable text (max 5-6 words)</li>
          <li>• High contrast colors — avoid YouTube red</li>
          <li>• Show faces with expressive emotions</li>
          <li>• Test readability at small sizes (mobile sidebar)</li>
        </ul>
      </div>
    </div>
  );
}
