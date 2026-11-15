"use client";

import { motion } from "motion/react";

// Re-mounts on every navigation. A short cross-fade only: the page intro does the moving,
// and a long fade here would stack on top of it and muddy the stagger.
export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3, ease: "linear" }}>
      {children}
    </motion.div>
  );
}
