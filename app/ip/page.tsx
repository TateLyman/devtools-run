"use client";
import { useState, useEffect } from "react";

export default function IPPage() {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    fetch("https://ipapi.co/json/")
      .then(r => r.json())
      .then(d => setData(d))
      .catch(() => {});
  }, []);

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <div className="max-w-3xl mx-auto px-4 py-16">
        <h1 className="text-4xl font-extrabold mb-2 text-center">What Is My IP Address</h1>
        <p className="text-gray-400 text-center mb-8">Your public IP address and location info.</p>
        {data ? (
          <div className="bg-gray-900 rounded-xl p-8 mb-8">
            <div className="text-center mb-6">
              <div className="text-sm text-gray-400">Your IP Address</div>
              <div className="text-4xl font-extrabold font-mono text-purple-400">{data.ip}</div>
            </div>
            <div className="grid grid-cols-2 gap-3 text-sm">
              {[
                ["City", data.city], ["Region", data.region], ["Country", data.country_name],
                ["ISP", data.org], ["Timezone", data.timezone], ["Postal", data.postal],
                ["Latitude", data.latitude], ["Longitude", data.longitude],
              ].map(([k,v], i) => (
                <div key={i} className="bg-gray-800 rounded-lg p-3">
                  <div className="text-gray-500 text-xs">{k}</div>
                  <div className="font-bold">{v || "—"}</div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center text-gray-400 py-12">Loading...</div>
        )}
        <div className="text-center text-gray-500 text-sm">
          <a href="/json" className="text-purple-400 hover:underline">JSON</a>{" | "}
          <a href="/hash" className="text-purple-400 hover:underline">Hash</a>{" | "}
          <a href="/base64" className="text-purple-400 hover:underline">Base64</a>{" | "}
          <a href="/password" className="text-purple-400 hover:underline">Password Gen</a>{" | "}
          <a href="/gradient" className="text-purple-400 hover:underline">Gradients</a>
        </div>
      </div>
    </div>
  );
}
