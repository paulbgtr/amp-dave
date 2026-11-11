"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { EASE } from "@/components/motion";
import { BeyondWordsMark } from "@/components/beyond-words";
import { NAV } from "@/lib/site";

export function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-line/70 bg-canvas/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
        <Link
          href="/"
          className="flex items-center gap-2.5 font-display font-medium tracking-tight"
          onClick={() => setOpen(false)}
        >
          <BeyondWordsMark />
          <span className="text-lg">HRI Lab</span>
          <span className="hidden text-sm font-normal text-ink-muted sm:inline">
            TalTech Virumaa College
          </span>
        </Link>

        <nav aria-label="Main" className="hidden md:block">
          <ul className="flex items-center gap-1">
            {NAV.map((item) => {
              const active = pathname === item.href;
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={active ? "page" : undefined}
                    className={`relative flex items-center gap-2 px-3 py-2 text-[15px] transition-colors ${
                      active ? "text-ink" : "text-ink-muted hover:text-ink"
                    }`}
                  >
                    <span className="relative flex h-2 w-2 items-center justify-center">
                      {active && (
                        <motion.span
                          layoutId="nav-dot"
                          className="absolute h-2 w-2 rounded-full bg-signal"
                          transition={{ type: "spring", stiffness: 420, damping: 36 }}
                        />
                      )}
                      {!active && <span className="h-1.5 w-1.5 rounded-full bg-line" />}
                    </span>
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <button
          type="button"
          className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-line text-ink md:hidden"
          aria-expanded={open}
          aria-controls="mobile-nav"
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => setOpen((v) => !v)}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
            <motion.path animate={{ d: open ? "M6 6L18 18" : "M4 7L20 7" }} transition={{ duration: 0.3, ease: EASE }} />
            <motion.path d="M4 12L20 12" animate={{ opacity: open ? 0 : 1 }} transition={{ duration: 0.2 }} />
            <motion.path animate={{ d: open ? "M6 18L18 6" : "M4 17L20 17" }} transition={{ duration: 0.3, ease: EASE }} />
          </svg>
        </button>
      </div>

      <AnimatePresence initial={false}>
        {open && (
        <motion.nav
          id="mobile-nav"
          aria-label="Main"
          className="overflow-hidden border-t border-line/70 md:hidden"
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.35, ease: EASE }}
        >
          <ul className="flex flex-col px-4 pt-2 pb-4">
            {NAV.map((item) => {
              const active = pathname === item.href;
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={active ? "page" : undefined}
                    onClick={() => setOpen(false)}
                    className={`block rounded-md px-3 py-3 font-medium ${active ? "bg-panel text-ink" : "text-ink-muted hover:text-ink"}`}
                  >
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </motion.nav>
      )}
      </AnimatePresence>
    </header>
  );
}
