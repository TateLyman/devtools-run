"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";

/**
 * Ad placement component with three tiers:
 * 1. Carbon Ads (developer-focused, primary)
 * 2. Direct sponsorship fallback (links to /advertise)
 * 3. Google AdSense auto-ads handled separately in layout <head>
 *
 * Usage: <AdSlot className="mt-8" />
 * Keep to 1 per page to stay developer-friendly.
 */

interface AdSlotProps {
  className?: string;
}

export default function AdSlot({ className = "" }: AdSlotProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [carbonLoaded, setCarbonLoaded] = useState(false);

  useEffect(() => {
    if (!containerRef.current) return;

    // Try to load Carbon Ads
    const script = document.createElement("script");
    script.src =
      "//cdn.carbonads.com/carbon.js?serve=PLACEHOLDER&placement=devtools-sitedeltavercelapp";
    script.id = "_carbonads_js";
    script.async = true;

    script.onload = () => setCarbonLoaded(true);
    script.onerror = () => setCarbonLoaded(false);

    // Carbon Ads replaces itself inside the container
    containerRef.current.appendChild(script);

    return () => {
      // Cleanup on unmount
      const carbonEl = document.getElementById("carbonads");
      if (carbonEl) carbonEl.remove();
      script.remove();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className={`ad-slot ${className}`}
      data-ad="carbon"
    >
      {/* Fallback: show sponsorship CTA when Carbon Ads isn't loaded */}
      {!carbonLoaded && (
        <Link
          href="/advertise"
          className="flex items-center gap-2 text-[var(--text-secondary)] hover:text-[var(--accent)] transition-colors text-xs"
        >
          <span>Your ad here</span>
          <span className="text-[var(--border)]">|</span>
          <span className="text-[var(--accent)]">Sponsor this site</span>
        </Link>
      )}
    </div>
  );
}
