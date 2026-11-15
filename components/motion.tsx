"use client";

import { MotionConfig, motion, type Variants } from "motion/react";
import { useEffect, useRef, useState, type ReactNode } from "react";

/*
 * Motion tokens. Three curves, each with one job:
 *  - EASE        entrances: fast start, long soft landing. Nothing bouncy.
 *  - EASE_TRACE  lines being drawn or traced: near-constant speed, like a chart recorder.
 *  - EASE_EXIT   things leaving: accelerate away, and do it quicker than they arrived.
 */
export const EASE = [0.22, 1, 0.36, 1] as const;
export const EASE_TRACE = [0.45, 0, 0.55, 1] as const;
export const EASE_EXIT = [0.4, 0, 1, 1] as const;

/** A small, well-damped spring (≈5% overshoot) for dots that "land". */
export const POP = { type: "spring", stiffness: 420, damping: 28 } as const;

// Reveal once, a little before the element is fully on screen.
const VIEWPORT = { once: true, margin: "0px 0px -10% 0px" } as const;

/** Honors the OS "reduce motion" setting: transforms are dropped, fades remain. */
export function MotionProvider({ children }: { children: ReactNode }) {
  return (
    <MotionConfig reducedMotion="user" transition={{ duration: 0.6, ease: EASE }}>
      {children}
    </MotionConfig>
  );
}

/*
 * Travel and duration scale with the size of the thing moving: a mono label barely
 * shifts, a display headline covers more ground and takes longer to settle.
 */
const SIZES = {
  sm: { y: 8, duration: 0.5 },
  md: { y: 16, duration: 0.6 },
  lg: { y: 28, duration: 0.8 },
} as const;
export type MotionSize = keyof typeof SIZES;

type FadeUpCustom = { size?: MotionSize; delay?: number };

const fadeUp: Variants = {
  hidden: ({ size = "md" }: FadeUpCustom = {}) => ({ opacity: 0, y: SIZES[size].y }),
  show: ({ size = "md", delay = 0 }: FadeUpCustom = {}) => {
    const { duration } = SIZES[size];
    return {
      opacity: 1,
      y: 0,
      // Opacity resolves early so the element is readable while it is still settling.
      transition: {
        y: { duration, ease: EASE, delay },
        opacity: { duration: duration * 0.7, ease: "linear", delay },
      },
    };
  },
};

/** Fades content up once when it scrolls into view. */
export function Reveal({
  children,
  className,
  delay = 0,
  loadDelay = 0,
  size = "md",
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  /**
   * Extra delay applied only when the element is already on screen at page load, to
   * queue it behind the intro. Scrolled to later, it responds immediately.
   */
  loadDelay?: number;
  size?: MotionSize;
}) {
  const mountedAt = useRef(0);
  const [wait, setWait] = useState<number | null>(null);

  useEffect(() => {
    mountedAt.current = performance.now();
  }, []);

  return (
    <motion.div
      className={className}
      initial="hidden"
      animate={wait === null ? "hidden" : "show"}
      viewport={VIEWPORT}
      onViewportEnter={() => {
        const duringIntro = performance.now() - mountedAt.current < 400;
        setWait((w) => w ?? delay + (duringIntro ? loadDelay : 0));
      }}
      variants={fadeUp}
      custom={{ size, delay: wait ?? 0 }}
    >
      {children}
    </motion.div>
  );
}

/** Container that reveals its <StaggerItem> children one after another. */
export function Stagger({
  children,
  className,
  as = "div",
  gap = 0.08,
  delay = 0,
  onMount = false,
  ...rest
}: {
  "aria-label"?: string;
  children: ReactNode;
  className?: string;
  as?: "div" | "ul" | "ol" | "nav";
  gap?: number;
  delay?: number;
  /** Animate immediately instead of waiting for the element to scroll into view. */
  onMount?: boolean;
}) {
  const Comp = motion[as];
  const trigger = onMount
    ? { animate: "show" }
    : { whileInView: "show", viewport: VIEWPORT };
  return (
    <Comp
      className={className}
      initial="hidden"
      {...rest}
      {...trigger}
      variants={{ hidden: {}, show: { transition: { staggerChildren: gap, delayChildren: delay } } }}
    >
      {children}
    </Comp>
  );
}

export function StaggerItem({
  children,
  className,
  as = "div",
  size = "md",
}: {
  children: ReactNode;
  className?: string;
  as?: "div" | "li";
  size?: MotionSize;
}) {
  const Comp = motion[as];
  return (
    <Comp className={className} variants={fadeUp} custom={{ size }}>
      {children}
    </Comp>
  );
}

/** Hairline that draws itself from the left, leading the eye into the section it opens. */
export function Rule({ className = "" }: { className?: string }) {
  return (
    <motion.div
      aria-hidden="true"
      className={`h-px origin-left bg-line ${className}`}
      initial={{ scaleX: 0, opacity: 0 }}
      whileInView={{ scaleX: 1, opacity: 1 }}
      viewport={VIEWPORT}
      transition={{ scaleX: { duration: 0.9, ease: EASE }, opacity: { duration: 0.2, ease: "linear" } }}
    />
  );
}
