"use client";

import { MotionConfig, motion, type Variants } from "motion/react";
import type { ReactNode } from "react";

// Calm, unhurried easing — nothing bouncy.
export const EASE = [0.22, 1, 0.36, 1] as const;

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

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 16 },
  show: (delay: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: EASE, delay },
  }),
};

/** Fades content up once when it scrolls into view. */
export function Reveal({
  children,
  className,
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
}) {
  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="show"
      viewport={VIEWPORT}
      variants={fadeUp}
      custom={delay}
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
}: {
  children: ReactNode;
  className?: string;
  as?: "div" | "li";
}) {
  const Comp = motion[as];
  return (
    <Comp className={className} variants={fadeUp}>
      {children}
    </Comp>
  );
}
