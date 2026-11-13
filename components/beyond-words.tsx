"use client";

import { motion } from "motion/react";
import { EASE } from "@/components/motion";

/*
 * The site's signature: a speech bubble with no words in it — just a signal.
 * Communication beyond words; the pink dot is the moment a need is understood.
 */

const BUBBLE =
  "M94 100 H306 A24 24 0 0 1 330 124 V246 A24 24 0 0 1 306 270 H170 L118 318 L128 270 H94 A24 24 0 0 1 70 246 V124 A24 24 0 0 1 94 100 Z";

const WAVE =
  "M106 186 C116 186 120 177 128 177 S140 195 148 195 S160 181 168 181 S180 191 188 191 S204 186 212 186 C224 186 228 146 240 146 S256 204 266 204 S284 186 294 186";

const PEAK = { x: 240, y: 146 };

export function BeyondWords({ className = "" }: { className?: string }) {
  return (
    <motion.svg
      viewBox="40 70 320 270"
      className={`block h-auto w-full ${className}`}
      role="img"
      aria-label="A speech bubble with no words, only a signal line with one highlighted peak"
      initial="hidden"
      animate="show"
    >
      <motion.path
        d={BUBBLE}
        fill="var(--surface)"
        stroke="var(--ink)"
        strokeWidth={1.75}
        strokeLinejoin="round"
        initial={{ pathLength: 0, fillOpacity: 0 }}
        animate={{ pathLength: 1, fillOpacity: 1 }}
        transition={{ pathLength: { duration: 1.2, ease: EASE, delay: 0.2 }, fillOpacity: { duration: 0.6, delay: 1 } }}
      />
      <motion.path
        d={WAVE}
        fill="none"
        stroke="var(--ink)"
        strokeWidth={1.75}
        strokeLinecap="round"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 1 }}
        transition={{ pathLength: { duration: 1.4, ease: EASE, delay: 1.1 }, opacity: { duration: 0.01, delay: 1.1 } }}
      />
      <motion.circle
        cx={PEAK.x}
        cy={PEAK.y}
        r={7}
        fill="var(--signal)"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 420, damping: 20, delay: 2.1 }}
      />
      <motion.circle
        cx={PEAK.x}
        cy={PEAK.y}
        r={14}
        fill="none"
        stroke="var(--signal)"
        strokeWidth={1}
        initial={{ opacity: 0, scale: 0.6 }}
        animate={{ opacity: [0, 0.6, 0], scale: [0.6, 1.3, 1.6] }}
        transition={{ duration: 2.6, ease: "easeOut", repeat: Infinity, repeatDelay: 1.4, delay: 2.5 }}
      />
    </motion.svg>
  );
}

/** Logo mark: a small speech bubble holding a signal, ending in the pink dot. */
export function BeyondWordsMark({ size = 26 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true" className="shrink-0">
      <path
        d="M5.5 3.5 H18.5 A3 3 0 0 1 21.5 6.5 V14 A3 3 0 0 1 18.5 17 H11 L6.5 21 L7.5 17 H5.5 A3 3 0 0 1 2.5 14 V6.5 A3 3 0 0 1 5.5 3.5 Z"
        fill="var(--canvas)"
        stroke="var(--ink)"
        strokeWidth="1.4"
        strokeLinejoin="round"
      />
      <path d="M6 10.5 Q7.5 8 9 10.5 T12 10.5" fill="none" stroke="var(--ink)" strokeWidth="1.3" strokeLinecap="round" />
      <circle cx="16" cy="10.25" r="2.1" fill="var(--signal)" />
    </svg>
  );
}
