"use client";

import { useState } from "react";

import AdSlot from "../components/AdSlot";

async function hashText(
  text: string,
  algorithm: string
): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(text);
  const hashBuffer = await crypto.subtle.digest(algorithm, data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

// Simple MD5 implementation (Web Crypto API doesn't support MD5)
function md5(string: string): string {
  function md5cycle(x: number[], k: number[]) {
    let a = x[0], b = x[1], c = x[2], d = x[3];
    a = ff(a, b, c, d, k[0], 7, -680876936);
    d = ff(d, a, b, c, k[1], 12, -389564586);
    c = ff(c, d, a, b, k[2], 17, 606105819);
    b = ff(b, c, d, a, k[3], 22, -1044525330);
    a = ff(a, b, c, d, k[4], 7, -176418897);
    d = ff(d, a, b, c, k[5], 12, 1200080426);
    c = ff(c, d, a, b, k[6], 17, -1473231341);
    b = ff(b, c, d, a, k[7], 22, -45705983);
    a = ff(a, b, c, d, k[8], 7, 1770035416);
    d = ff(d, a, b, c, k[9], 12, -1958414417);
    c = ff(c, d, a, b, k[10], 17, -42063);
    b = ff(b, c, d, a, k[11], 22, -1990404162);
    a = ff(a, b, c, d, k[12], 7, 1804603682);
    d = ff(d, a, b, c, k[13], 12, -40341101);
    c = ff(c, d, a, b, k[14], 17, -1502002290);
    b = ff(b, c, d, a, k[15], 22, 1236535329);
    a = gg(a, b, c, d, k[1], 5, -165796510);
    d = gg(d, a, b, c, k[6], 9, -1069501632);
    c = gg(c, d, a, b, k[11], 14, 643717713);
    b = gg(b, c, d, a, k[0], 20, -373897302);
    a = gg(a, b, c, d, k[5], 5, -701558691);
    d = gg(d, a, b, c, k[10], 9, 38016083);
    c = gg(c, d, a, b, k[15], 14, -660478335);
    b = gg(b, c, d, a, k[4], 20, -405537848);
    a = gg(a, b, c, d, k[9], 5, 568446438);
    d = gg(d, a, b, c, k[14], 9, -1019803690);
    c = gg(c, d, a, b, k[3], 14, -187363961);
    b = gg(b, c, d, a, k[8], 20, 1163531501);
    a = gg(a, b, c, d, k[13], 5, -1444681467);
    d = gg(d, a, b, c, k[2], 9, -51403784);
    c = gg(c, d, a, b, k[7], 14, 1735328473);
    b = gg(b, c, d, a, k[12], 20, -1926607734);
    a = hh(a, b, c, d, k[5], 4, -378558);
    d = hh(d, a, b, c, k[8], 11, -2022574463);
    c = hh(c, d, a, b, k[11], 16, 1839030562);
    b = hh(b, c, d, a, k[14], 23, -35309556);
    a = hh(a, b, c, d, k[1], 4, -1530992060);
    d = hh(d, a, b, c, k[4], 11, 1272893353);
    c = hh(c, d, a, b, k[7], 16, -155497632);
    b = hh(b, c, d, a, k[10], 23, -1094730640);
    a = hh(a, b, c, d, k[13], 4, 681279174);
    d = hh(d, a, b, c, k[0], 11, -358537222);
    c = hh(c, d, a, b, k[3], 16, -722521979);
    b = hh(b, c, d, a, k[6], 23, 76029189);
    a = hh(a, b, c, d, k[9], 4, -640364487);
    d = hh(d, a, b, c, k[12], 11, -421815835);
    c = hh(c, d, a, b, k[15], 16, 530742520);
    b = hh(b, c, d, a, k[2], 23, -995338651);
    a = ii(a, b, c, d, k[0], 6, -198630844);
    d = ii(d, a, b, c, k[7], 10, 1126891415);
    c = ii(c, d, a, b, k[14], 15, -1416354905);
    b = ii(b, c, d, a, k[5], 21, -57434055);
    a = ii(a, b, c, d, k[12], 6, 1700485571);
    d = ii(d, a, b, c, k[3], 10, -1894986606);
    c = ii(c, d, a, b, k[10], 15, -1051523);
    b = ii(b, c, d, a, k[1], 21, -2054922799);
    a = ii(a, b, c, d, k[8], 6, 1873313359);
    d = ii(d, a, b, c, k[15], 10, -30611744);
    c = ii(c, d, a, b, k[6], 15, -1560198380);
    b = ii(b, c, d, a, k[13], 21, 1309151649);
    a = ii(a, b, c, d, k[4], 6, -145523070);
    d = ii(d, a, b, c, k[11], 10, -1120210379);
    c = ii(c, d, a, b, k[2], 15, 718787259);
    b = ii(b, c, d, a, k[9], 21, -343485551);
    x[0] = add32(a, x[0]);
    x[1] = add32(b, x[1]);
    x[2] = add32(c, x[2]);
    x[3] = add32(d, x[3]);
  }

  function cmn(q: number, a: number, b: number, x: number, s: number, t: number) {
    a = add32(add32(a, q), add32(x, t));
    return add32((a << s) | (a >>> (32 - s)), b);
  }

  function ff(a: number, b: number, c: number, d: number, x: number, s: number, t: number) {
    return cmn((b & c) | (~b & d), a, b, x, s, t);
  }

  function gg(a: number, b: number, c: number, d: number, x: number, s: number, t: number) {
    return cmn((b & d) | (c & ~d), a, b, x, s, t);
  }

  function hh(a: number, b: number, c: number, d: number, x: number, s: number, t: number) {
    return cmn(b ^ c ^ d, a, b, x, s, t);
  }

  function ii(a: number, b: number, c: number, d: number, x: number, s: number, t: number) {
    return cmn(c ^ (b | ~d), a, b, x, s, t);
  }

  function add32(a: number, b: number) {
    return (a + b) & 0xffffffff;
  }

  function hex(x: number) {
    const hexChars = "0123456789abcdef";
    let s = "";
    for (let i = 0; i < 4; i++)
      s += hexChars.charAt((x >> (i * 8 + 4)) & 0x0f) + hexChars.charAt((x >> (i * 8)) & 0x0f);
    return s;
  }

  const n = string.length;
  const state = [1732584193, -271733879, -1732584194, 271733878];
  let i: number;
  const tail = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
  const blks: number[] = new Array(16);

  for (i = 64; i <= n; i += 64) {
    for (let j = 0; j < 64; j += 4) {
      blks[j >> 2] =
        string.charCodeAt(i - 64 + j) +
        (string.charCodeAt(i - 64 + j + 1) << 8) +
        (string.charCodeAt(i - 64 + j + 2) << 16) +
        (string.charCodeAt(i - 64 + j + 3) << 24);
    }
    md5cycle(state, blks);
  }

  for (let j = 0; j < 16; j++) tail[j] = 0;
  for (i = i - 64; i < n; i++) {
    tail[(i & 63) >> 2] |= string.charCodeAt(i) << ((i % 4) << 3);
  }
  tail[(i & 63) >> 2] |= 0x80 << ((i % 4) << 3);

  if ((i & 63) > 55) {
    md5cycle(state, tail);
    for (let j = 0; j < 16; j++) tail[j] = 0;
  }
  tail[14] = n * 8;
  md5cycle(state, tail);

  return hex(state[0]) + hex(state[1]) + hex(state[2]) + hex(state[3]);
}

export default function HashGeneratorPage() {
  const [input, setInput] = useState("");
  const [hashes, setHashes] = useState<Record<string, string>>({});

  async function generateHashes(text: string) {
    if (!text) {
      setHashes({});
      return;
    }
    const [sha1, sha256] = await Promise.all([
      hashText(text, "SHA-1"),
      hashText(text, "SHA-256"),
    ]);
    const md5Hash = md5(text);
    setHashes({ MD5: md5Hash, "SHA-1": sha1, "SHA-256": sha256 });
  }

  function handleChange(value: string) {
    setInput(value);
    generateHashes(value);
  }

  function copyHash(value: string) {
    navigator.clipboard.writeText(value);
  }

  return (
    <>
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-1">Hash Generator</h1>
        <p className="text-[var(--text-secondary)] text-sm">
          Generate MD5, SHA-1, and SHA-256 hashes from any text. Uses the Web
          Crypto API for SHA hashes.
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Input Text</label>
        <textarea
          rows={6}
          value={input}
          onChange={(e) => handleChange(e.target.value)}
          placeholder="Enter text to hash..."
          spellCheck={false}
        />
      </div>

      {Object.keys(hashes).length > 0 && (
        <div className="mt-6 space-y-3">
          {Object.entries(hashes).map(([algo, hash]) => (
            <div
              key={algo}
              className="rounded-lg border border-[var(--border)] bg-[var(--bg-secondary)] p-4"
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-medium text-[var(--accent)]">
                  {algo}
                </span>
                <button
                  onClick={() => copyHash(hash)}
                  className="text-xs text-[var(--text-secondary)] hover:text-white transition-colors"
                >
                  Copy
                </button>
              </div>
              <code className="text-sm break-all text-[var(--text-secondary)]">
                {hash}
              </code>
            </div>
          ))}
        </div>
      )}

      <AdSlot className="mt-8" />

      <section className="mt-10 text-sm text-[var(--text-secondary)] space-y-2">
        <h2 className="text-lg font-semibold text-white">
          About Hash Generation
        </h2>
        <p>
          A hash function maps data of arbitrary size to fixed-size values.
          This tool generates MD5, SHA-1, and SHA-256 hashes from your text
          input. SHA hashes use the browser&apos;s native Web Crypto API for
          maximum performance and security.
        </p>
      </section>
    </>
  );
}
