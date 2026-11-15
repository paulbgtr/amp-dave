"use client";

import { motion, useReducedMotion } from "motion/react";
import { EASE, EASE_TRACE, POP } from "@/components/motion";
import { HERO, MARK } from "@/lib/artwork";

/*
 * The site's signature: a speech bubble with no words in it — just a signal.
 * Communication beyond words; the pink dot is the moment a need is understood.
 *
 * Timeline (seconds). The outline is drawn and lifts off its linen plate, the chart
 * furniture fades in, the signal is traced at a steady pace, and the pink dot lands at the
 * instant the trace passes its peak; the ring then radiates from the dot. PEAK_AT is the
 * fraction of the trace's duration at which the pen reaches the peak (its share of the
 * path's length, mapped through EASE_TRACE) — re-measure it if HERO.trace changes.
 */
const BUBBLE = { at: 0.1, for: 0.9 };
const TRACE = { at: 0.8, for: 1.3 };
const PEAK_AT = 0.561;
const HIT = TRACE.at + TRACE.for * PEAK_AT;
const FILL_AT = BUBBLE.at + BUBBLE.for * 0.6;

export function BeyondWords({ className = "" }: { className?: string }) {
  const reduce = useReducedMotion();
  const { peak } = HERO;
  return (
    <motion.svg
      viewBox={HERO.viewBox}
      className={`block h-auto w-full ${className}`}
      role="img"
      aria-label="A speech bubble with no words, only a signal line with one highlighted peak"
      initial="hidden"
      animate="show"
    >
      {/* linen plate: slides out from behind the bubble as it fills, giving it a little lift */}
      <motion.path
        d={HERO.bubble}
        fill="var(--panel)"
        initial={{ opacity: 0, x: 0, y: 0 }}
        animate={{ opacity: 1, x: HERO.plateOffset, y: HERO.plateOffset }}
        transition={{ duration: 0.7, ease: EASE, delay: FILL_AT, opacity: { duration: 0.3, ease: "linear", delay: FILL_AT } }}
      />
      <motion.path
        d={HERO.bubble}
        fill="var(--surface)"
        stroke="var(--ink)"
        strokeWidth={2}
        strokeLinejoin="round"
        initial={{ pathLength: 0, fillOpacity: 0 }}
        animate={{ pathLength: 1, fillOpacity: 1 }}
        transition={{
          pathLength: { duration: BUBBLE.for, ease: EASE_TRACE, delay: BUBBLE.at },
          fillOpacity: { duration: 0.5, ease: "linear", delay: FILL_AT },
        }}
      />
      {/* chart furniture: baseline and time ticks */}
      <motion.g
        fill="none"
        stroke="var(--ink)"
        strokeWidth={1}
        strokeLinecap="round"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, ease: "linear", delay: TRACE.at - 0.1 }}
      >
        <path d={HERO.baseline} strokeDasharray="1 7" strokeOpacity={0.45} />
        <path d={HERO.ticks} strokeOpacity={0.35} />
      </motion.g>
      <motion.path
        d={HERO.marker}
        fill="none"
        stroke="var(--signal)"
        strokeWidth={1}
        strokeLinecap="round"
        strokeDasharray="2 5"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.8 }}
        transition={{ duration: 0.4, ease: "linear", delay: HIT + 0.1 }}
      />
      <motion.path
        d={HERO.trace}
        fill="none"
        stroke="var(--ink)"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 1 }}
        transition={{
          pathLength: { duration: TRACE.for, ease: EASE_TRACE, delay: TRACE.at },
          opacity: { duration: 0.01, delay: TRACE.at },
        }}
      />
      {/* soft halo, then the dot itself */}
      <motion.circle
        cx={peak.x}
        cy={peak.y}
        r={15}
        fill="var(--signal)"
        fillOpacity={0.14}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.6, ease: EASE, delay: HIT + 0.05 }}
      />
      <motion.circle
        cx={peak.x}
        cy={peak.y}
        r={7}
        fill="var(--signal)"
        stroke="var(--surface)"
        strokeWidth={2}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ ...POP, delay: HIT }}
      />
      <motion.circle
        cx={peak.x}
        cy={peak.y}
        r={15}
        fill="none"
        stroke="var(--signal)"
        strokeWidth={1}
        // Starts at the dot's own edge and expands outward as it fades, like a ping.
        // Under reduced motion there is no loop at all.
        initial={{ opacity: 0, scale: 0.5 }}
        animate={reduce ? { opacity: 0 } : { opacity: [0, 0.7, 0], scale: [0.5, 2] }}
        transition={{
          duration: 1.8,
          ease: [0.16, 1, 0.3, 1],
          opacity: { duration: 1.8, times: [0, 0.06, 1], ease: "easeOut", repeat: Infinity, repeatDelay: 2.4, delay: HIT + 0.12 },
          repeat: Infinity,
          repeatDelay: 2.4,
          delay: HIT + 0.12,
        }}
      />
    </motion.svg>
  );
}

/** Logo mark: a small speech bubble holding a signal, with the pink dot on its peak. */
export function BeyondWordsMark({ size = 26 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox={MARK.viewBox} aria-hidden="true" className="shrink-0">
      <path d={MARK.bubble} fill="var(--surface)" stroke="var(--ink)" strokeWidth="1.4" strokeLinejoin="round" />
      <path d={MARK.trace} fill="none" stroke="var(--ink)" strokeWidth="1.3" strokeLinecap="round" />
      <circle cx={MARK.peak.x} cy={MARK.peak.y} r="2.1" fill="var(--signal)" />
    </svg>
  );
}
