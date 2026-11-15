"use client";

import { motion, type Variants } from "motion/react";
import type { ReactNode } from "react";
import { EASE_TRACE, POP } from "@/components/motion";

/*
 * Technical line drawings of the lab's sensors, on dotted drafting paper.
 * Three line weights: 1.5 for the device and the person, 1 for detail, dashes for things
 * you cannot see (infrared light, reference levels). Solid parts get a paper fill so they
 * sit in front of the grid. One pink accent each: the thing the sensor found.
 * Strokes draw themselves in on scroll; fills follow the outline.
 */

// Structure: the device itself, drawn at an even pen speed; any fill follows the outline.
const stroke: Variants = {
  hidden: { pathLength: 0, opacity: 0, fillOpacity: 0 },
  show: {
    pathLength: 1,
    opacity: 1,
    fillOpacity: 1,
    transition: {
      pathLength: { duration: 0.8, ease: EASE_TRACE },
      opacity: { duration: 0.15, ease: "linear" },
      fillOpacity: { duration: 0.4, ease: "linear", delay: 0.35 },
    },
  },
};
// Signal: what the device records, traced more slowly so it reads as data arriving.
const trace: Variants = {
  hidden: { pathLength: 0, opacity: 0 },
  show: {
    pathLength: 1,
    opacity: 1,
    transition: { pathLength: { duration: 1.3, ease: EASE_TRACE }, opacity: { duration: 0.01 } },
  },
};
const fade: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 0.6, ease: "linear" } },
};
const pop: Variants = {
  hidden: { scale: 0, opacity: 0 },
  show: { scale: 1, opacity: 1, transition: POP },
};

const ink = { stroke: "var(--ink)", strokeWidth: 1.5, fill: "none", strokeLinecap: "round", strokeLinejoin: "round" } as const;
const thin = { ...ink, strokeWidth: 1 } as const;
/** Secondary detail: present, but not competing with the outline. */
const faint = { ...thin, strokeOpacity: 0.4 } as const;
const accent = { ...ink, stroke: "var(--signal)" } as const;
/** Solid parts of a device or a body. */
const solid = { ...ink, fill: "var(--surface)" } as const;
/** The part that does the sensing. */
const sensor = { ...ink, fill: "var(--panel)" } as const;

function Frame({ fig, label, children }: { fig: string; label: string; children: ReactNode }) {
  return (
    <figure className="flex h-full flex-col">
      <motion.svg
        viewBox="0 0 320 220"
        preserveAspectRatio="xMidYMid meet"
        className="block h-auto w-full flex-1 bg-[radial-gradient(var(--line)_1px,transparent_1.5px)] bg-size-[16px_16px] bg-center"
        role="img"
        aria-label={label}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "0px 0px -15% 0px" }}
        variants={{ hidden: {}, show: { transition: { staggerChildren: 0.06, delayChildren: 0.15 } } }}
      >
        {children}
      </motion.svg>
      <figcaption className="label-mono flex justify-between px-5 pt-1 pb-4 text-[12px]!">
        <span>Fig. {fig}</span>
        <span>{label.split(":")[0]}</span>
      </figcaption>
    </figure>
  );
}

/** Eye tracker: infrared light from the bar under the screen finds the eye; the gaze lands as a scan path. */
export function EyeTrackerDrawing() {
  return (
    <Frame fig="01" label="Gaze: an infrared tracker under a screen follows where the eye looks">
      {/* screen: bezel, glass, a hint of content */}
      <motion.rect variants={stroke} x="168" y="26" width="136" height="90" rx="6" {...solid} />
      <motion.rect variants={stroke} x="175" y="33" width="122" height="76" rx="2" {...thin} fill="var(--surface)" />
      <motion.path variants={fade} d="M185 45 H221 M185 53 H207 M185 97 H229" {...faint} strokeWidth={2} strokeOpacity={0.18} />
      {/* stand */}
      <motion.path variants={stroke} d="M236 130 V152 M208 152 H264" {...ink} />
      {/* tracker bar with its two infrared emitters */}
      <motion.rect variants={stroke} x="204" y="120" width="64" height="10" rx="5" {...sensor} />
      <motion.circle variants={pop} cx="216" cy="125" r="1.75" fill="var(--ink)" />
      <motion.circle variants={pop} cx="256" cy="125" r="1.75" fill="var(--ink)" />
      {/* eye: lid crease, almond, iris, pupil, catch-light */}
      <motion.path variants={stroke} d="M30 84 Q62 60 94 84" {...faint} />
      <motion.path variants={stroke} d="M24 100 Q62 68 100 100 Q62 132 24 100 Z" {...ink} fill="var(--surface)" />
      <motion.circle variants={stroke} cx="66" cy="100" r="13" {...sensor} />
      <motion.circle variants={pop} cx="66" cy="100" r="5.5" fill="var(--ink)" />
      <motion.circle variants={pop} cx="69" cy="97" r="1.6" fill="var(--surface)" />
      {/* infrared light (invisible, so dashed): a cone from the bar onto the eye */}
      <motion.path variants={fade} d="M210 124 L98 88 M210 124 L100 112" {...thin} strokeDasharray="1 5" strokeOpacity={0.55} />
      {/* line of sight */}
      <motion.path variants={trace} d="M80 97 L242 64" {...thin} />
      {/* scan path: fixations grow with how long the eye rested there */}
      <motion.path variants={trace} d="M192 56 L216 90 L250 62" {...thin} />
      <motion.circle variants={pop} cx="192" cy="56" r="3.5" {...thin} fill="var(--surface)" />
      <motion.circle variants={pop} cx="216" cy="90" r="5.5" {...thin} fill="var(--surface)" />
      <motion.circle variants={pop} cx="250" cy="62" r="10" fill="var(--signal)" fillOpacity={0.14} />
      <motion.circle variants={stroke} cx="250" cy="62" r="10" {...accent} strokeWidth={1.25} />
      <motion.circle variants={pop} cx="250" cy="62" r="3.5" fill="var(--signal)" />
    </Frame>
  );
}

/** EEG: a cap of electrodes on the head; several channels are recorded, one is picked out. */
export function EegDrawing() {
  // On the head's outline, left to right; the last one feeds the highlighted channel.
  const rim: [number, number][] = [
    [47.4, 77.5],
    [67.5, 57.4],
    [95, 50],
    [122.5, 57.4],
  ];
  const inner: [number, number][] = [
    [76, 78],
    [95, 71],
    [114, 78],
  ];
  return (
    <Frame fig="02" label="Brain activity: sensors on the head pick up a brain-wave signal">
      {/* shoulders, neck */}
      <motion.path variants={stroke} d="M30 222 Q34 192 76 186 V160 M114 160 V186 Q156 192 160 222" {...ink} />
      {/* ears, head */}
      <motion.path variants={stroke} d="M42 98 C31 95 30 120 43 117 M148 98 C159 95 160 120 147 117" {...ink} />
      <motion.circle variants={stroke} cx="95" cy="105" r="55" {...ink} fill="var(--surface)" />
      {/* cap: everything above the brow line, with a centre seam */}
      <motion.path variants={stroke} d="M41.3 93 A55 55 0 0 1 148.7 93 Q95 76 41.3 93 Z" {...solid} />
      <motion.path variants={stroke} d="M95 50 V84.5" {...faint} strokeDasharray="1 4" />
      {/* chin strap */}
      <motion.path variants={stroke} d="M44 112 Q52 150 95 160 Q138 150 146 112" {...faint} />
      {inner.map(([cx, cy]) => (
        <motion.circle key={`${cx}-${cy}`} variants={pop} cx={cx} cy={cy} r={3.5} {...thin} fill="var(--surface)" />
      ))}
      {rim.map(([cx, cy]) => (
        <motion.circle key={`${cx}-${cy}`} variants={pop} cx={cx} cy={cy} r={5} {...ink} fill="var(--surface)" />
      ))}
      {/* the recorded channel: electrode, lead, and its trace among the others */}
      <motion.circle variants={pop} cx="142.6" cy="77.5" r="9.5" fill="var(--signal)" fillOpacity={0.14} />
      <motion.circle variants={pop} cx="142.6" cy="77.5" r="5.5" fill="var(--signal)" />
      <motion.path variants={trace} d="M148 80 C168 84 162 110 182 110" {...accent} strokeWidth={1.25} />
      <motion.path variants={stroke} d="M182 66 V154" {...faint} />
      <motion.path variants={fade} d="M179 82 H185 M179 138 H185" {...faint} />
      <motion.circle variants={pop} cx="182" cy="110" r="2.5" fill="var(--signal)" />
      <motion.path
        variants={trace}
        d="M188 82 q5 -6 10 0 t10 0 q5 -9 10 0 t10 0 q5 -5 10 0 t10 0 q5 -8 10 0 t10 0 q5 -4 10 0 t10 0 q5 -7 10 0"
        {...faint}
      />
      <motion.path
        variants={trace}
        d="M188 110 q5.5 -10 11 0 t11 0 q5.5 -22 11 0 t11 0 q5.5 -6 11 0 t11 0 q5.5 -28 11 0 t11 0 q5.5 -12 11 0 t11 0"
        {...ink}
      />
      <motion.path
        variants={trace}
        d="M188 138 q6 -5 12 0 t12 0 q6 -8 12 0 t12 0 q6 -4 12 0 t12 0 q6 -9 12 0 t12 0 q5 -5 10 0"
        {...faint}
      />
    </Frame>
  );
}

/** Skin response: two finger electrodes; arousal shows up as a slow rise and a peak. */
export function SkinResponseDrawing() {
  const CURVE = "M184 152 C206 152 222 150 236 146 C246 143 250 98 262 98 C276 98 282 138 304 142";
  return (
    <Frame fig="03" label="Skin response: sensors on two fingers show moments of arousal">
      {/* leads: drawn first so the near one passes behind the second finger */}
      <motion.path variants={stroke} d="M78 101 C136 101 140 132 184 132" {...thin} />
      <motion.path variants={stroke} d="M122 89 C156 89 150 124 184 124" {...thin} />
      {/* fingers (run off the bottom edge) */}
      <motion.rect variants={stroke} x="44" y="52" width="34" height="200" rx="17" {...ink} fill="var(--surface)" />
      <motion.rect variants={stroke} x="88" y="38" width="34" height="214" rx="17" {...ink} fill="var(--surface)" />
      {/* nails and knuckle creases, so they read as fingers */}
      <motion.rect variants={stroke} x="52" y="59" width="18" height="22" rx="8" {...faint} />
      <motion.rect variants={stroke} x="96" y="45" width="18" height="22" rx="8" {...faint} />
      <motion.path variants={stroke} d="M52 142 Q61 146 70 142 M52 148 Q61 152 70 148" {...faint} />
      <motion.path variants={stroke} d="M96 134 Q105 138 114 134 M96 140 Q105 144 114 140" {...faint} />
      <motion.path variants={stroke} d="M52 196 Q61 200 70 196 M96 190 Q105 194 114 190" {...faint} />
      {/* electrode bands, each with its contact stud */}
      <motion.rect variants={stroke} x="40" y="92" width="42" height="18" rx="4" {...sensor} />
      <motion.rect variants={stroke} x="84" y="80" width="42" height="18" rx="4" {...sensor} />
      <motion.circle variants={pop} cx="76" cy="101" r="2" fill="var(--ink)" />
      <motion.circle variants={pop} cx="120" cy="89" r="2" fill="var(--ink)" />
      {/* chart: axes, time ticks, resting level */}
      <motion.path variants={stroke} d="M184 72 V170 H306" {...thin} />
      <motion.path variants={fade} d="M204 170 V174 M224 170 V174 M244 170 V174 M264 170 V174 M284 170 V174 M304 170 V174 M180 98 H184" {...faint} />
      <motion.path variants={fade} d="M188 152 H304" {...faint} strokeDasharray="1 5" />
      {/* signal: slow rise, peak, recovery — the response is the area above rest */}
      <motion.path variants={fade} d={`${CURVE} V152 H184 Z`} fill="var(--signal)" fillOpacity={0.1} />
      <motion.path variants={trace} d={CURVE} {...ink} />
      <motion.path variants={fade} d="M262 108 V170" {...accent} strokeWidth={1} strokeDasharray="2 4" />
      <motion.circle variants={pop} cx="262" cy="98" r="9" fill="var(--signal)" fillOpacity={0.14} />
      <motion.circle variants={pop} cx="262" cy="98" r="4.5" fill="var(--signal)" />
    </Frame>
  );
}
