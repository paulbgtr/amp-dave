/*
 * Geometry of the site's signature artwork, shared by the animated hero, the header mark,
 * the home-screen icon and the social image so they cannot drift apart.
 * (app/icon.svg is a static file and repeats the MARK paths by hand.)
 */

/** Hero illustration, drawn in the viewBox below. */
export const HERO = {
  viewBox: "40 70 320 270",
  /** Speech bubble with a soft, curved tail. */
  bubble:
    "M98 100 H302 A28 28 0 0 1 330 128 V242 A28 28 0 0 1 302 270 H178 Q153 294 122 309 Q137 291 138 270 H98 A28 28 0 0 1 70 242 V128 A28 28 0 0 1 98 100 Z",
  /** How far the linen "shadow" plate sits behind the bubble. */
  plateOffset: 10,
  /** Resting level of the signal. */
  baseline: "M100 196 H300",
  /** Time ticks along the bottom, like chart paper. */
  ticks: Array.from({ length: 11 }, (_, i) => `M${100 + i * 20} ${i % 5 === 0 ? 228 : 231} V236`).join(" "),
  /** The signal: quiet ripples, one clear peak, a dip, then calm again. */
  trace:
    "M100 196 C108 196 110 188 118 188 S128 204 136 204 S146 190 154 190 S164 200 172 200 S184 196 194 196 C210 196 216 196 222 190 C230 182 230 140 240 140 C250 140 250 214 260 214 C268 214 270 196 282 196 H300",
  peak: { x: 240, y: 140 },
  /** Drop line from the peak down to the tick row. */
  marker: "M240 154 V226",
} as const;

/** Logo mark in a 24 × 24 box: the same bubble, signal and peak, reduced to essentials. */
export const MARK = {
  viewBox: "0 0 24 24",
  bubble:
    "M6 3.5 H18 A3.5 3.5 0 0 1 21.5 7 V13.5 A3.5 3.5 0 0 1 18 17 H11.6 Q9.6 19.8 6.2 21 Q8 19.2 8.2 17 H6 A3.5 3.5 0 0 1 2.5 13.5 V7 A3.5 3.5 0 0 1 6 3.5 Z",
  trace: "M5.8 11.8 H10.2 C11.9 11.8 12.3 7.6 14 7.6 C15.7 7.6 15.9 11.8 17.2 11.8 H18.2",
  peak: { x: 14, y: 7.6 },
} as const;
