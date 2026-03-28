"use client";
import { useState, useRef, useCallback, useEffect } from "react";

/* ── Minimal GIF Encoder (pure JS, no dependencies) ──────────────────────── */
/* Encodes RGBA frames into a binary GIF89a with global color table + LZW.  */

function encodeGIF(
  frames: { data: Uint8ClampedArray; width: number; height: number }[],
  delay: number // centiseconds per frame
): Uint8Array {
  if (frames.length === 0) return new Uint8Array(0);
  const W = frames[0].width;
  const H = frames[0].height;

  // Build global 256-color palette via median-cut-like quantisation
  // For speed, we sample and use a fixed 216-color web-safe palette + 40 grays
  const palette = buildPalette();
  const colorMap = new Map<number, number>();

  function buildPalette(): number[][] {
    const p: number[][] = [];
    // 6x6x6 color cube (216 colors)
    for (let r = 0; r < 6; r++)
      for (let g = 0; g < 6; g++)
        for (let b = 0; b < 6; b++)
          p.push([r * 51, g * 51, b * 51]);
    // 40 grays
    for (let i = 0; i < 40; i++) {
      const v = Math.round((i / 39) * 255);
      p.push([v, v, v]);
    }
    return p;
  }

  function nearest(r: number, g: number, b: number): number {
    const key = ((r & 0xf8) << 7) | ((g & 0xf8) << 2) | (b >> 3);
    const cached = colorMap.get(key);
    if (cached !== undefined) return cached;
    let best = 0, bestD = Infinity;
    for (let i = 0; i < 256; i++) {
      const dr = r - palette[i][0], dg = g - palette[i][1], db = b - palette[i][2];
      const d = dr * dr + dg * dg + db * db;
      if (d < bestD) { bestD = d; best = i; }
    }
    colorMap.set(key, best);
    return best;
  }

  // Quantize frame to palette indices
  function quantize(data: Uint8ClampedArray): Uint8Array {
    const n = W * H;
    const out = new Uint8Array(n);
    for (let i = 0; i < n; i++) {
      const off = i * 4;
      out[i] = nearest(data[off], data[off + 1], data[off + 2]);
    }
    return out;
  }

  // LZW encoder
  function lzwEncode(indices: Uint8Array, minCodeSize: number): Uint8Array {
    const clearCode = 1 << minCodeSize;
    const eoiCode = clearCode + 1;
    const out: number[] = [];
    let codeSize = minCodeSize + 1;
    let nextCode = eoiCode + 1;
    const table = new Map<string, number>();

    function initTable() {
      table.clear();
      for (let i = 0; i < clearCode; i++) table.set(String(i), i);
      codeSize = minCodeSize + 1;
      nextCode = eoiCode + 1;
    }

    let bitBuf = 0, bitPos = 0;
    function writeBits(code: number, size: number) {
      bitBuf |= code << bitPos;
      bitPos += size;
      while (bitPos >= 8) {
        out.push(bitBuf & 0xff);
        bitBuf >>= 8;
        bitPos -= 8;
      }
    }

    initTable();
    writeBits(clearCode, codeSize);

    let prev = String(indices[0]);
    for (let i = 1; i < indices.length; i++) {
      const cur = prev + "," + indices[i];
      if (table.has(cur)) {
        prev = cur;
      } else {
        writeBits(table.get(prev)!, codeSize);
        if (nextCode < 4096) {
          table.set(cur, nextCode++);
          if (nextCode > (1 << codeSize) && codeSize < 12) codeSize++;
        } else {
          writeBits(clearCode, codeSize);
          initTable();
        }
        prev = String(indices[i]);
      }
    }
    writeBits(table.get(prev)!, codeSize);
    writeBits(eoiCode, codeSize);
    if (bitPos > 0) out.push(bitBuf & 0xff);

    // Package into sub-blocks
    const subBlocked: number[] = [];
    subBlocked.push(minCodeSize);
    for (let i = 0; i < out.length; ) {
      const chunk = Math.min(255, out.length - i);
      subBlocked.push(chunk);
      for (let j = 0; j < chunk; j++) subBlocked.push(out[i + j]);
      i += chunk;
    }
    subBlocked.push(0); // block terminator
    return new Uint8Array(subBlocked);
  }

  // Assemble the GIF
  const parts: Uint8Array[] = [];

  function pushBytes(...bytes: number[]) {
    parts.push(new Uint8Array(bytes));
  }
  function pushStr(s: string) {
    const a = new Uint8Array(s.length);
    for (let i = 0; i < s.length; i++) a[i] = s.charCodeAt(i);
    parts.push(a);
  }

  // Header
  pushStr("GIF89a");

  // Logical Screen Descriptor
  pushBytes(
    W & 0xff, (W >> 8) & 0xff,
    H & 0xff, (H >> 8) & 0xff,
    0xf7, // GCT flag, 8-bit color, 256 entries
    0,    // bg color index
    0     // pixel aspect ratio
  );

  // Global Color Table (256 * 3 bytes)
  const gct = new Uint8Array(256 * 3);
  for (let i = 0; i < 256; i++) {
    const c = palette[i] || [0, 0, 0];
    gct[i * 3] = c[0]; gct[i * 3 + 1] = c[1]; gct[i * 3 + 2] = c[2];
  }
  parts.push(gct);

  // Netscape Application Extension (for looping)
  pushBytes(0x21, 0xff, 0x0b);
  pushStr("NETSCAPE2.0");
  pushBytes(0x03, 0x01, 0x00, 0x00, 0x00); // loop forever

  // Frames
  for (const frame of frames) {
    const indices = quantize(frame.data);

    // Graphic Control Extension
    pushBytes(
      0x21, 0xf9, 0x04,
      0x00, // no transparency, no disposal
      delay & 0xff, (delay >> 8) & 0xff,
      0x00, // transparent color index
      0x00  // terminator
    );

    // Image Descriptor
    pushBytes(
      0x2c,
      0x00, 0x00, 0x00, 0x00, // left, top
      W & 0xff, (W >> 8) & 0xff,
      H & 0xff, (H >> 8) & 0xff,
      0x00 // no local color table
    );

    // Image Data (LZW)
    parts.push(lzwEncode(indices, 8));
  }

  // Trailer
  pushBytes(0x3b);

  // Combine
  let total = 0;
  for (const p of parts) total += p.length;
  const gif = new Uint8Array(total);
  let offset = 0;
  for (const p of parts) { gif.set(p, offset); offset += p.length; }
  return gif;
}

/* ── Main Component ──────────────────────────────────────────────────────── */

export default function VideoToGifPage() {
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [videoName, setVideoName] = useState("");
  const [duration, setDuration] = useState(0);
  const [startTime, setStartTime] = useState(0);
  const [endTime, setEndTime] = useState(0);
  const [fps, setFps] = useState(10);
  const [outputWidth, setOutputWidth] = useState(480);
  const [naturalWidth, setNaturalWidth] = useState(0);
  const [naturalHeight, setNaturalHeight] = useState(0);
  const [converting, setConverting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [progressText, setProgressText] = useState("");
  const [gifUrl, setGifUrl] = useState<string | null>(null);
  const [gifSize, setGifSize] = useState(0);
  const [frameCount, setFrameCount] = useState(0);

  const videoRef = useRef<HTMLVideoElement>(null);
  const previewVideoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const outputHeight = naturalWidth > 0
    ? Math.round((outputWidth / naturalWidth) * naturalHeight)
    : 0;

  const estimatedFrames = Math.max(1, Math.ceil((endTime - startTime) * fps));

  const handleFile = useCallback((file: File) => {
    if (gifUrl) URL.revokeObjectURL(gifUrl);
    setGifUrl(null);
    setGifSize(0);
    setFrameCount(0);
    const url = URL.createObjectURL(file);
    setVideoUrl(url);
    setVideoName(file.name.replace(/\.[^.]+$/, ""));
  }, [gifUrl]);

  const onVideoLoaded = useCallback(() => {
    const v = previewVideoRef.current;
    if (!v) return;
    const dur = v.duration;
    setDuration(dur);
    setEndTime(Math.min(dur, 5));
    setStartTime(0);
    setNaturalWidth(v.videoWidth);
    setNaturalHeight(v.videoHeight);
    if (v.videoWidth > 0) {
      setOutputWidth(Math.min(480, v.videoWidth));
    }
  }, []);

  const convertToGif = useCallback(async () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas || !videoUrl) return;

    setConverting(true);
    setProgress(0);
    setProgressText("Preparing...");
    if (gifUrl) URL.revokeObjectURL(gifUrl);
    setGifUrl(null);

    const w = outputWidth;
    const h = outputHeight;
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext("2d", { willReadFrequently: true })!;

    const interval = 1 / fps;
    const totalFrames = Math.max(1, Math.ceil((endTime - startTime) * fps));
    const frames: { data: Uint8ClampedArray; width: number; height: number }[] = [];

    // Extract frames by seeking through the video
    video.muted = true;
    video.currentTime = startTime;

    const extractFrame = (time: number): Promise<{ data: Uint8ClampedArray; width: number; height: number }> => {
      return new Promise((resolve) => {
        video.currentTime = time;
        const onSeeked = () => {
          video.removeEventListener("seeked", onSeeked);
          ctx.drawImage(video, 0, 0, w, h);
          const imageData = ctx.getImageData(0, 0, w, h);
          resolve({ data: imageData.data, width: w, height: h });
        };
        video.addEventListener("seeked", onSeeked);
      });
    };

    try {
      // Phase 1: Extract frames
      for (let i = 0; i < totalFrames; i++) {
        const time = Math.min(startTime + i * interval, endTime);
        const frame = await extractFrame(time);
        frames.push(frame);
        const pct = Math.round(((i + 1) / totalFrames) * 60);
        setProgress(pct);
        setProgressText(`Extracting frame ${i + 1}/${totalFrames}...`);
      }

      // Phase 2: Encode GIF
      setProgressText("Encoding GIF...");
      setProgress(65);

      // Run encoding in a timeout to let the UI update
      await new Promise<void>((resolve) => {
        setTimeout(() => {
          const delayCentiseconds = Math.round(100 / fps);
          const gifData = encodeGIF(frames, delayCentiseconds);

          setProgress(95);
          setProgressText("Finalizing...");

          const blob = new Blob([gifData.buffer as ArrayBuffer], { type: "image/gif" });
          const url = URL.createObjectURL(blob);
          setGifUrl(url);
          setGifSize(blob.size);
          setFrameCount(frames.length);
          setProgress(100);
          setProgressText("Done!");
          resolve();
        }, 50);
      });
    } catch (err) {
      console.error("Conversion error:", err);
      setProgressText("Error during conversion. Try shorter clip or lower resolution.");
    } finally {
      setConverting(false);
    }
  }, [videoUrl, startTime, endTime, fps, outputWidth, outputHeight, gifUrl]);

  // Cleanup URLs on unmount
  useEffect(() => {
    return () => {
      if (videoUrl) URL.revokeObjectURL(videoUrl);
      if (gifUrl) URL.revokeObjectURL(gifUrl);
    };
  }, []);

  const formatTime = (t: number) => {
    const m = Math.floor(t / 60);
    const s = (t % 60).toFixed(1);
    return `${m}:${s.padStart(4, "0")}`;
  };

  return (
    <div className="space-y-6">
      {/* Hidden elements for processing */}
      <video ref={videoRef} src={videoUrl || undefined} className="hidden" preload="auto" muted playsInline crossOrigin="anonymous" />
      <canvas ref={canvasRef} className="hidden" />

      {/* Header */}
      <section className="text-center">
        <h1 className="text-4xl font-bold mb-2">Video to GIF Converter</h1>
        <p className="text-[var(--text-secondary)]">
          Convert MP4, WebM, and MOV videos to animated GIFs. Runs entirely in your browser — nothing is uploaded.
        </p>
      </section>

      {/* Upload Area */}
      <div
        className="bg-[var(--bg-secondary)] border-2 border-dashed border-[var(--border)] rounded-xl p-8 text-center cursor-pointer hover:border-purple-500/50 transition-colors"
        onClick={() => fileRef.current?.click()}
        onDrop={(e) => { e.preventDefault(); e.dataTransfer.files[0] && handleFile(e.dataTransfer.files[0]); }}
        onDragOver={(e) => e.preventDefault()}
      >
        {videoUrl ? (
          <video
            ref={previewVideoRef}
            src={videoUrl}
            controls
            onLoadedMetadata={onVideoLoaded}
            className="max-h-64 mx-auto rounded-lg"
            playsInline
          />
        ) : (
          <div>
            <svg className="w-12 h-12 mx-auto mb-3 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
            <p className="text-gray-400 font-medium">Drop a video file here or click to upload</p>
            <p className="text-gray-500 text-xs mt-1">Supports MP4, WebM, MOV</p>
          </div>
        )}
        <input
          ref={fileRef}
          type="file"
          accept="video/mp4,video/webm,video/quicktime,video/*"
          className="hidden"
          onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
        />
      </div>

      {/* Controls */}
      {videoUrl && duration > 0 && (
        <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-xl p-6 space-y-5">
          <h2 className="text-lg font-bold text-center">Conversion Settings</h2>

          {/* Video info */}
          <div className="flex gap-4 justify-center text-xs text-gray-400">
            <span>Duration: {formatTime(duration)}</span>
            <span>Resolution: {naturalWidth}x{naturalHeight}</span>
          </div>

          {/* Start / End Time */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-gray-400 mb-1">
                Start Time: <span className="text-white font-mono">{formatTime(startTime)}</span>
              </label>
              <input
                type="range"
                min={0}
                max={duration}
                step={0.1}
                value={startTime}
                onChange={(e) => {
                  const v = parseFloat(e.target.value);
                  setStartTime(v);
                  if (v >= endTime) setEndTime(Math.min(duration, v + 0.5));
                }}
                className="w-full accent-purple-500"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-400 mb-1">
                End Time: <span className="text-white font-mono">{formatTime(endTime)}</span>
              </label>
              <input
                type="range"
                min={0}
                max={duration}
                step={0.1}
                value={endTime}
                onChange={(e) => {
                  const v = parseFloat(e.target.value);
                  setEndTime(v);
                  if (v <= startTime) setStartTime(Math.max(0, v - 0.5));
                }}
                className="w-full accent-purple-500"
              />
            </div>
          </div>

          <div className="text-center text-xs text-gray-400">
            Clip duration: <span className="text-white font-mono">{(endTime - startTime).toFixed(1)}s</span>
            {" "} (~{estimatedFrames} frames)
          </div>

          {/* Frame Rate */}
          <div>
            <label className="block text-xs text-gray-400 mb-1">
              Frame Rate: <span className="text-white font-mono">{fps} FPS</span>
            </label>
            <input
              type="range"
              min={2}
              max={24}
              step={1}
              value={fps}
              onChange={(e) => setFps(parseInt(e.target.value))}
              className="w-full accent-purple-500"
            />
            <div className="flex justify-between text-[10px] text-gray-500 mt-0.5">
              <span>2 FPS (small file)</span>
              <span>24 FPS (smooth)</span>
            </div>
          </div>

          {/* Output Width */}
          <div>
            <label className="block text-xs text-gray-400 mb-1">
              Output Width: <span className="text-white font-mono">{outputWidth}px</span>
              <span className="text-gray-500 ml-2">({outputWidth}x{outputHeight})</span>
            </label>
            <input
              type="range"
              min={80}
              max={Math.min(1280, naturalWidth || 1280)}
              step={10}
              value={outputWidth}
              onChange={(e) => setOutputWidth(parseInt(e.target.value))}
              className="w-full accent-purple-500"
            />
            <div className="flex justify-between text-[10px] text-gray-500 mt-0.5">
              <span>80px (tiny)</span>
              <span>{Math.min(1280, naturalWidth || 1280)}px (large)</span>
            </div>
          </div>

          {/* Quick presets */}
          <div className="flex gap-2 flex-wrap justify-center">
            {[
              { label: "Small (240p)", w: 240, f: 8 },
              { label: "Medium (480p)", w: 480, f: 10 },
              { label: "Large (720p)", w: 720, f: 12 },
            ].map((p) => (
              <button
                key={p.label}
                onClick={() => { setOutputWidth(Math.min(p.w, naturalWidth || p.w)); setFps(p.f); }}
                className="bg-[var(--bg-primary)] border border-[var(--border)] px-3 py-1.5 rounded text-xs hover:border-purple-500/50 transition-colors"
              >
                {p.label}
              </button>
            ))}
          </div>

          {/* Warning for large GIFs */}
          {estimatedFrames > 100 && (
            <div className="bg-yellow-900/30 border border-yellow-600/30 rounded-lg p-3 text-xs text-yellow-400 text-center">
              {estimatedFrames} frames will produce a large GIF. Consider reducing clip length, FPS, or width for faster conversion.
            </div>
          )}

          {/* Convert Button */}
          <button
            onClick={convertToGif}
            disabled={converting}
            className="w-full bg-purple-600 hover:bg-purple-700 disabled:bg-purple-800 disabled:cursor-not-allowed text-white px-6 py-3 rounded-lg font-bold text-lg transition-colors"
          >
            {converting ? "Converting..." : `Convert to GIF (${estimatedFrames} frames)`}
          </button>

          {/* Progress Bar */}
          {converting && (
            <div>
              <div className="w-full bg-gray-800 rounded-full h-3 overflow-hidden">
                <div
                  className="bg-purple-500 h-3 rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <p className="text-xs text-gray-400 text-center mt-1">{progressText}</p>
            </div>
          )}
        </div>
      )}

      {/* Result */}
      {gifUrl && (
        <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-xl p-6 space-y-4">
          <h2 className="text-lg font-bold text-center text-green-400">GIF Ready!</h2>

          <div className="flex gap-4 justify-center text-xs text-gray-400">
            <span>Size: {(gifSize / 1024).toFixed(0)} KB{gifSize > 1048576 && ` (${(gifSize / 1048576).toFixed(1)} MB)`}</span>
            <span>Frames: {frameCount}</span>
            <span>{outputWidth}x{outputHeight}px</span>
          </div>

          <div className="flex justify-center">
            <img
              src={gifUrl}
              alt="Converted GIF"
              className="max-h-80 rounded-lg border border-[var(--border)]"
            />
          </div>

          <div className="flex gap-3 justify-center">
            <a
              href={gifUrl}
              download={`${videoName || "video"}.gif`}
              className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2.5 rounded-lg font-bold text-sm transition-colors"
            >
              Download GIF ({(gifSize / 1024).toFixed(0)} KB)
            </a>
            <button
              onClick={() => {
                if (gifUrl) URL.revokeObjectURL(gifUrl);
                setGifUrl(null);
                setGifSize(0);
                setFrameCount(0);
                setProgress(0);
                setProgressText("");
              }}
              className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2.5 rounded-lg font-bold text-sm transition-colors"
            >
              Re-convert
            </button>
          </div>
        </div>
      )}

      {/* Tips */}
      <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-xl p-6">
        <h2 className="text-lg font-bold mb-3">Tips for Better GIFs</h2>
        <ul className="text-sm text-gray-400 space-y-1.5 list-disc list-inside">
          <li>Keep clips short (2-5 seconds) for reasonable file sizes</li>
          <li>Lower FPS (8-10) works well for most GIFs and keeps files small</li>
          <li>Smaller output width = much smaller file size (GIF size scales with area)</li>
          <li>GIF uses a 256-color palette, so some color banding is normal</li>
          <li>For the best quality, use short clips with simple motion</li>
          <li>Everything runs in your browser — your video never leaves your device</li>
        </ul>
      </div>

      {/* Related tools */}
      <div className="text-center text-gray-500 text-sm">
        <a href="/image-compress" className="text-purple-400 hover:underline">Image Compress</a>{" | "}
        <a href="/image-resize" className="text-purple-400 hover:underline">Image Resize</a>{" | "}
        <a href="/image-cropper" className="text-purple-400 hover:underline">Image Crop</a>{" | "}
        <a href="/qr" className="text-purple-400 hover:underline">QR Code</a>{" | "}
        <a href="/" className="text-purple-400 hover:underline">All Tools</a>
      </div>
    </div>
  );
}
