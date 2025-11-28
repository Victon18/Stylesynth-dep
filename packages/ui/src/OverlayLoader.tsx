// packages/ui/src/OverlayLoader.tsx
"use client";

import React from "react";
import { createPortal } from "react-dom";
import { useOverlayLoader } from "@repo/store/overlay-loader";

/**
 * OverlayLoader
 * - MED backdrop blur (backdrop-blur-md)
 * - blocking overlay with rgba(0,0,0,0.45)
 * - glass center card with subtle motion
 * - NO percent text (animation-only)
 *
 * Usage:
 * - Mount once in app/layout.tsx
 * - Controlled by zustand store @repo/store/overlay-loader
 */

export default function OverlayLoader(){
  const open = useOverlayLoader((s) => s.open);

  // Don't render anything if closed
  if (!open) return null;

  // Create portal into body so overlay sits above app shell
  if (typeof document === "undefined") return null;

  return createPortal(
    <div
      aria-hidden={!open}
      role="status"
      className="fixed inset-0 z-[9999] flex items-center justify-center"
    >
      {/* blocking backdrop with blur */}
      <div
        className="absolute inset-0"
        style={{
          background: "rgba(0,0,0,0.45)",
          backdropFilter: "blur(8px)", // matches MED -> backdrop-blur-md
          WebkitBackdropFilter: "blur(8px)",
        }}
      />

      {/* center glass card */}
      <div
        className="relative z-10 flex items-center justify-center w-full max-w-[520px] p-8 rounded-2xl"
        style={{
          //  subtle glass card using your design tokens
          background:
            "linear-gradient(180deg, rgba(255,255,255,0.06), rgba(255,255,255,0.03))",
          boxShadow: "0 20px 60px rgba(0,0,0,0.35)",
          border: "1px solid rgba(255,255,255,0.06)",
          backdropFilter: "saturate(1.05) blur(4px)",
          WebkitBackdropFilter: "saturate(1.05) blur(4px)",
        }}
      >
        {/* center animated element (three pulsing gradient dots) */}
        <div className="flex items-center gap-4">
          <Dot delay="0ms" />
          <Dot delay="150ms" />
          <Dot delay="300ms" />
        </div>
      </div>
    </div>,
    document.body
  );
}

/** small pulsing dot element */
function Dot({ delay }: { delay?: string }) {
  return (
    <span
      aria-hidden
      style={{
        background: "linear-gradient(90deg, var(--pink-500), var(--purple-400))",
        animationDelay: delay,
      }}
      className="w-4 h-4 rounded-full inline-block animate-pulse"
    />
  );
}

