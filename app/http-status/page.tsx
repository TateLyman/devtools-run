"use client";
import { useState } from "react";

const CODES: [number,string,string][] = [
  [200,"OK","Request succeeded"],[201,"Created","Resource created"],[204,"No Content","Success, no body"],
  [301,"Moved Permanently","Resource moved permanently"],[302,"Found","Temporary redirect"],[304,"Not Modified","Cached version is valid"],
  [400,"Bad Request","Invalid request syntax"],[401,"Unauthorized","Authentication required"],[403,"Forbidden","Access denied"],[404,"Not Found","Resource doesn't exist"],[405,"Method Not Allowed","HTTP method not supported"],[409,"Conflict","Request conflicts with current state"],[429,"Too Many Requests","Rate limit exceeded"],
  [500,"Internal Server Error","Server error"],[502,"Bad Gateway","Invalid response from upstream"],[503,"Service Unavailable","Server overloaded or maintenance"],[504,"Gateway Timeout","Upstream server timed out"],
];

export default function HttpStatusPage() {
  const [search, setSearch] = useState("");
  const filtered = CODES.filter(([code, name, desc]) => 
    String(code).includes(search) || name.toLowerCase().includes(search.toLowerCase()) || desc.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <div className="max-w-3xl mx-auto px-4 py-16">
        <h1 className="text-4xl font-extrabold mb-2 text-center">HTTP Status Codes</h1>
        <p className="text-gray-400 text-center mb-8">Quick reference for all common HTTP status codes.</p>
        <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search codes..."
          className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white mb-6" />
        <div className="space-y-2">
          {filtered.map(([code, name, desc]) => {
            const color = code < 300 ? "text-green-400" : code < 400 ? "text-blue-400" : code < 500 ? "text-yellow-400" : "text-red-400";
            return (
              <div key={code} className="bg-gray-900 rounded-lg px-5 py-3 flex items-center gap-4">
                <div className={`font-mono font-bold text-lg w-12 ${color}`}>{code}</div>
                <div>
                  <div className="font-bold text-sm">{name}</div>
                  <div className="text-xs text-gray-400">{desc}</div>
                </div>
              </div>
            );
          })}
        </div>
        <div className="mt-8 text-center text-gray-500 text-sm">
          <a href="/json" className="text-purple-400 hover:underline">JSON</a>{" | "}
          <a href="/regex" className="text-purple-400 hover:underline">Regex</a>{" | "}
          <a href="/base64" className="text-purple-400 hover:underline">Base64</a>{" | "}
          <a href="/ip" className="text-purple-400 hover:underline">My IP</a>{" | "}
          <a href="/useragent" className="text-purple-400 hover:underline">User Agent</a>
        </div>
      </div>
    </div>
  );
}
