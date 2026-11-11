"use client";

import { motion } from "motion/react";
import { EASE } from "@/components/motion";

// Re-mounts on every navigation, giving each page a soft entrance.
export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.45, ease: EASE }}>
      {children}
    </motion.div>
  );
}
