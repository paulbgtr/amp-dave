import Link from "next/link";
import type { ReactNode } from "react";
import { Reveal, Stagger, StaggerItem } from "@/components/motion";

/** Small round indicator, like the power light on a Braun device. */
export function Dot({ tone = "signal", className = "" }: { tone?: "signal" | "go" | "ink"; className?: string }) {
  const color = { signal: "bg-signal", go: "bg-go", ink: "bg-ink" }[tone];
  return <span aria-hidden="true" className={`inline-block h-2 w-2 shrink-0 rounded-full ${color} ${className}`} />;
}

export function Eyebrow({ children }: { children: ReactNode }) {
  return (
    <p className="flex items-center gap-2.5 font-mono text-[13px] uppercase tracking-[0.12em] text-ink-muted">
      <Dot />
      {children}
    </p>
  );
}

export function ButtonLink({
  href,
  children,
  variant = "primary",
}: {
  href: string;
  children: ReactNode;
  variant?: "primary" | "outline";
}) {
  const styles =
    variant === "primary"
      ? "bg-ink text-canvas border-ink hover:bg-graphite hover:border-graphite"
      : "bg-transparent text-ink border-ink/80 hover:bg-ink hover:text-canvas";
  return (
    <Link
      href={href}
      className={`inline-flex min-h-11 items-center justify-center rounded-full border px-6 py-2.5 text-[15px] font-medium transition-colors duration-200 ${styles}`}
    >
      {children}
    </Link>
  );
}

export function PageIntro({
  eyebrow,
  title,
  children,
}: {
  eyebrow: string;
  title: ReactNode;
  children?: ReactNode;
}) {
  return (
    <section className="mx-auto max-w-6xl px-4 pt-14 pb-12 sm:px-6 md:pt-24">
      <Stagger onMount gap={0.1}>
        <StaggerItem>
          <Eyebrow>{eyebrow}</Eyebrow>
        </StaggerItem>
        <StaggerItem>
          <h1 className="mt-5 max-w-3xl font-display text-4xl font-medium leading-[1.05] tracking-[-0.03em] text-balance sm:text-6xl">
            {title}
          </h1>
        </StaggerItem>
        {children && (
          <StaggerItem className="mt-6 max-w-2xl text-lg leading-relaxed text-ink-muted">
            {children}
          </StaggerItem>
        )}
      </Stagger>
    </section>
  );
}

export function Section({
  title,
  lead,
  children,
  id,
  aside,
}: {
  title: string;
  lead?: ReactNode;
  children: ReactNode;
  id?: string;
  /** Extra content under the title column, e.g. an illustration. */
  aside?: ReactNode;
}) {
  return (
    <section id={id} className="mx-auto max-w-6xl scroll-mt-24 px-4 sm:px-6">
      <div className="grid gap-8 border-t border-line py-12 md:grid-cols-12">
        <Reveal className="md:col-span-4">
          <h2 className="section-title font-display text-2xl font-medium tracking-[-0.02em]">{title}</h2>
          {lead && <p className="mt-3 max-w-xs text-ink-muted leading-relaxed">{lead}</p>}
          {aside && <div className="mt-6 max-w-sm">{aside}</div>}
        </Reveal>
        <Reveal className="md:col-span-8" delay={0.1}>
          {children}
        </Reveal>
      </div>
    </section>
  );
}

export function Card({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`rounded-md border border-line bg-surface p-6 ${className}`}>{children}</div>;
}

/** Bordered panel with a status light: green = good, orange = caution, black = neutral. */
export function Callout({
  tone,
  label,
  children,
}: {
  tone: "positive" | "caution" | "neutral";
  label: string;
  children: ReactNode;
}) {
  const dot = { positive: "go", caution: "signal", neutral: "ink" } as const;
  return (
    <div className="h-full rounded-md border border-line bg-surface px-6 py-5">
      <p className="flex items-center gap-2.5 font-mono text-[13px] uppercase tracking-[0.1em] text-ink-muted">
        <Dot tone={dot[tone]} />
        {label}
      </p>
      <div className="mt-2 leading-relaxed">{children}</div>
    </div>
  );
}

export function CheckList({ items }: { items: { icon: ReactNode; text: ReactNode }[] }) {
  return (
    <ul className="divide-y divide-line rounded-md border border-line bg-surface">
      {items.map((item, i) => (
        <li key={i} className="flex items-start gap-3.5 px-5 py-3.5">
          <span className="mt-0.5 shrink-0 text-ink">{item.icon}</span>
          <span>{item.text}</span>
        </li>
      ))}
    </ul>
  );
}
