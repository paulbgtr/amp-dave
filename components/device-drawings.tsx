"use client";

import { motion, type Variants } from "motion/react";
import type { ReactNode } from "react";
import { EASE } from "@/components/motion";

/*
 * Technical line drawings of the lab's sensors.
 * Espresso hairlines, one orange accent each; strokes draw themselves in on scroll.
 */

const stroke: Variants = {
  hidden: { pathLength: 0, opacity: 0 },
  show: { pathLength: 1, opacity: 1, transition: { duration: 1.1, ease: EASE } },
};
const fade: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 0.8, ease: EASE } },
};
const pop: Variants = {
  hidden: { scale: 0, opacity: 0 },
  show: { scale: 1, opacity: 1, transition: { type: "spring", stiffness: 420, damping: 20 } },
};

const ink = { stroke: "var(--ink)", strokeWidth: 1.5, fill: "none", strokeLinecap: "round", strokeLinejoin: "round" } as const;
const accent = { ...ink, stroke: "var(--signal)" } as const;

function Frame({ fig, label, children }: { fig: string; label: string; children: ReactNode }) {
  return (
    <figure className="flex h-full flex-col">
      <motion.svg
        viewBox="0 0 320 220"
        preserveAspectRatio="xMidYMid meet"
        className="block h-auto w-full flex-1"
        role="img"
        aria-label={label}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "0px 0px -15% 0px" }}
        variants={{ hidden: {}, show: { transition: { staggerChildren: 0.09, delayChildren: 0.1 } } }}
      >
        {children}
      </motion.svg>
      <figcaption className="flex justify-between border-t border-line px-4 py-2.5 font-mono text-[12px] uppercase tracking-[0.1em] text-ink-muted">
        <span>Fig. {fig}</span>
        <span>{label.split(":")[0]}</span>
      </figcaption>
    </figure>
  );
}

/** Eye tracker: IR beams from the bar under the screen find the eye; the gaze lands as a scan path. */
export function EyeTrackerDrawing() {
  return (
    <Frame fig="01" label="Gaze: an infrared tracker under a screen follows where the eye looks">
      {/* screen, tracker bar, stand */}
      <motion.rect variants={stroke} x="170" y="30" width="130" height="82" rx="4" {...ink} />
      <motion.rect variants={stroke} x="205" y="117" width="60" height="7" rx="3.5" {...ink} />
      <motion.path variants={stroke} d="M235 124 V150 M208 150 H262" {...ink} />
      {/* eye */}
      <motion.path variants={stroke} d="M28 98 Q62 70 96 98 Q62 126 28 98 Z" {...ink} />
      <motion.circle variants={stroke} cx="64" cy="98" r="11" {...ink} />
      <motion.circle variants={pop} cx="64" cy="98" r="4.5" fill="var(--ink)" />
      {/* infrared beams (dashed, so they fade rather than draw) */}
      <motion.path variants={fade} d="M210 120 L80 100 M260 120 L80 100" {...ink} strokeWidth={1} strokeDasharray="3 5" opacity={0.6} />
      {/* line of sight + scan path on screen */}
      <motion.path variants={stroke} d="M76 95 L246 64" {...ink} strokeWidth={1} />
      <motion.path variants={stroke} d="M190 52 L214 88 L246 64" {...ink} strokeWidth={1} />
      <motion.circle variants={pop} cx="190" cy="52" r="2.5" fill="var(--ink)" />
      <motion.circle variants={pop} cx="214" cy="88" r="2.5" fill="var(--ink)" />
      <motion.circle variants={stroke} cx="246" cy="64" r="9" {...accent} />
      <motion.circle variants={pop} cx="246" cy="64" r="3.5" fill="var(--signal)" />
    </Frame>
  );
}

/** EEG: a cap of electrodes on the head; one channel's brain-wave signal runs out to the right. */
export function EegDrawing() {
  const electrodes: [number, number, number][] = [
    [95, 50, 5],
    [67.5, 57.4, 5],
    [122.5, 57.4, 5],
    [47.4, 77.5, 5],
  ];
  return (
    <Frame fig="02" label="Brain activity: sensors on the head pick up a brain-wave signal">
      {/* head, neck, shoulders */}
      <motion.circle variants={stroke} cx="95" cy="105" r="55" {...ink} />
      <motion.path variants={stroke} d="M76 158 V186 M114 158 V186" {...ink} />
      <motion.path variants={stroke} d="M30 222 Q34 192 76 186 M114 186 Q156 192 160 222" {...ink} />
      {electrodes.map(([cx, cy, r]) => (
        <motion.circle key={`${cx}-${cy}`} variants={stroke} cx={cx} cy={cy} r={r} {...ink} fill="var(--surface)" />
      ))}
      {/* the recorded channel */}
      <motion.circle variants={pop} cx="142.6" cy="77.5" r="5.5" fill="var(--signal)" />
      <motion.path variants={stroke} d="M148 80 C166 84 164 108 182 108" {...accent} strokeWidth={1.25} />
      <motion.path
        variants={stroke}
        d="M182 108 q6 -10 12 0 t12 0 q6 -22 12 0 t12 0 q6 -6 12 0 t12 0 q6 -28 12 0 t12 0 q6 -12 12 0"
        {...ink}
      />
    </Frame>
  );
}

/** Skin response: two finger electrodes; arousal shows up as a slow rise and a peak. */
export function SkinResponseDrawing() {
  return (
    <Frame fig="03" label="Skin response: sensors on two fingers show moments of arousal">
      {/* fingers (run off the bottom edge) */}
      <motion.rect variants={stroke} x="44" y="52" width="34" height="200" rx="17" {...ink} />
      <motion.rect variants={stroke} x="88" y="38" width="34" height="214" rx="17" {...ink} />
      {/* nails and knuckle creases, so they read as fingers */}
      <motion.rect variants={stroke} x="52" y="60" width="18" height="22" rx="8" {...ink} strokeWidth={1} />
      <motion.rect variants={stroke} x="96" y="46" width="18" height="22" rx="8" {...ink} strokeWidth={1} />
      <motion.path variants={stroke} d="M52 142 Q61 146 70 142 M52 148 Q61 152 70 148" {...ink} strokeWidth={1} />
      <motion.path variants={stroke} d="M96 134 Q105 138 114 134 M96 140 Q105 144 114 140" {...ink} strokeWidth={1} />
      {/* electrode bands */}
      <motion.rect variants={stroke} x="40" y="92" width="42" height="16" rx="3" {...ink} fill="var(--surface)" />
      <motion.rect variants={stroke} x="84" y="80" width="42" height="16" rx="3" {...ink} fill="var(--surface)" />
      {/* leads */}
      <motion.path variants={stroke} d="M82 100 C140 100 140 132 184 132" {...ink} strokeWidth={1} />
      <motion.path variants={stroke} d="M126 88 C156 88 150 124 184 124" {...ink} strokeWidth={1} />
      {/* signal: axis, slow rise, peak */}
      <motion.path variants={stroke} d="M184 72 V170 H304" {...ink} strokeWidth={1} />
      <motion.path variants={stroke} d="M184 152 C206 152 222 150 236 146 C246 143 250 98 262 98 C276 98 282 138 304 142" {...ink} />
      <motion.path variants={fade} d="M262 104 V170" {...accent} strokeWidth={1} strokeDasharray="2 4" />
      <motion.circle variants={pop} cx="262" cy="98" r="4.5" fill="var(--signal)" />
    </Frame>
  );
}
