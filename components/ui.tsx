import Link from "next/link";
import type { ReactNode } from "react";
import { Reveal, Rule, Stagger, StaggerItem } from "@/components/motion";

/*
 * The site's building blocks. Pages compose these rather than writing their own surface,
 * button or heading styles, so everything shares one shape language:
 *   round   — things you press or that signal state (buttons, chips, badges, dots)
 *   card    — raised paper (Card), a sunk well inside it (Well), a flat linen block (Panel)
 *   type    — type-title / type-subtitle / type-statement / type-lead / label-mono
 */

/** Small round indicator, like the status light on a device. */
export function Dot({ tone = "signal", className = "" }: { tone?: "signal" | "go" | "ink"; className?: string }) {
  const color = { signal: "bg-signal", go: "bg-go", ink: "bg-ink" }[tone];
  return <span aria-hidden="true" className={`inline-block h-2 w-2 shrink-0 rounded-full ${color} ${className}`} />;
}

/** Mono label with an indicator dot: page eyebrows, callout labels, status lines. */
export function Eyebrow({ children, tone = "signal" }: { children: ReactNode; tone?: "signal" | "go" | "ink" }) {
  return (
    <p className="label-mono flex items-center gap-2.5">
      <Dot tone={tone} />
      {children}
    </p>
  );
}

/** Inline text link. */
export const linkClass =
  "font-medium text-ink underline decoration-ink/30 decoration-1 underline-offset-4 transition-colors duration-200 ease-calm hover:decoration-ink";

/** Pill button. Primary is solid purple; secondary is raised paper. */
export function buttonClass(variant: "primary" | "secondary" = "primary") {
  const styles =
    variant === "primary"
      ? "bg-ink text-canvas shadow-button hover:bg-graphite"
      : "bg-surface text-ink shadow-soft hover:bg-white";
  return `inline-flex min-h-12 items-center justify-center gap-2.5 rounded-full px-6 py-2.5 text-[15px] font-medium transition-[color,background-color,scale,opacity] duration-200 ease-calm active:scale-[0.97] ${styles}`;
}

export function ButtonLink({
  href,
  children,
  variant = "primary",
}: {
  href: string;
  children: ReactNode;
  variant?: "primary" | "secondary";
}) {
  return (
    <Link href={href} className={buttonClass(variant)}>
      {children}
    </Link>
  );
}

/** Pill for a choice or a jump link: raised paper, smaller than a button. */
export const chipClass =
  "inline-flex min-h-11 items-center gap-2 rounded-full bg-surface px-4 py-2 text-[15px] font-medium text-ink shadow-soft transition-[color,background-color,scale] duration-200 ease-calm hover:bg-white active:scale-[0.97]";

/** Round linen badge that holds an icon. */
export function IconBadge({
  children,
  size = "md",
  className = "",
}: {
  children: ReactNode;
  size?: "sm" | "md" | "lg";
  className?: string;
}) {
  const box = { sm: "h-9 w-9", md: "h-11 w-11", lg: "h-12 w-12" }[size];
  return (
    <span aria-hidden="true" className={`inline-flex shrink-0 items-center justify-center rounded-full bg-panel text-ink ${box} ${className}`}>
      {children}
    </span>
  );
}

/** Raised paper card. */
export function Card({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`soft-card p-6 sm:p-7 ${className}`}>{children}</div>;
}

/** Sunk area inside a card: notes, drawings, fields. */
export function Well({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`soft-well ${className}`}>{children}</div>;
}

/** Flat linen block for a call to action. */
export function Panel({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`soft-tint p-6 sm:p-10 ${className}`}>{children}</div>;
}

/** Card with an icon badge beside its content. */
export function IconCard({ icon, children, className = "" }: { icon: ReactNode; children: ReactNode; className?: string }) {
  return (
    <Card className={`flex items-start gap-4 ${className}`}>
      <IconBadge>{icon}</IconBadge>
      <div className="min-w-0 flex-1 space-y-3 pt-2 leading-relaxed">{children}</div>
    </Card>
  );
}

/** Card with a heading and a muted description, optionally topped by an icon or a step number. */
export function FeatureCard({
  title,
  children,
  icon,
  step,
}: {
  title: ReactNode;
  children: ReactNode;
  icon?: ReactNode;
  step?: number;
}) {
  return (
    <Card className="h-full">
      {icon && <IconBadge className="mb-5">{icon}</IconBadge>}
      {step !== undefined && <p className="label-mono mb-2">{String(step).padStart(2, "0")}</p>}
      <h3 className="type-subtitle">{title}</h3>
      <p className="mt-2 leading-relaxed text-ink-muted">{children}</p>
    </Card>
  );
}

/** Card with a status light: green = good, pink = caution, purple = neutral. */
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
    <Card className="h-full">
      <Eyebrow tone={dot[tone]}>{label}</Eyebrow>
      <div className="mt-3 leading-relaxed">{children}</div>
    </Card>
  );
}

/** Card of short promises, each with an icon badge. */
export function CheckList({ items }: { items: { icon: ReactNode; text: ReactNode }[] }) {
  return (
    <ul className="soft-card divide-y divide-line/60 px-6 py-2 sm:px-7">
      {items.map((item, i) => (
        <li key={i} className="flex items-center gap-4 py-3.5">
          <IconBadge size="sm">{item.icon}</IconBadge>
          <span>{item.text}</span>
        </li>
      ))}
    </ul>
  );
}

/** Plain list with dot bullets. */
export function DotList({ items }: { items: string[] }) {
  return (
    <ul className="space-y-2">
      {items.map((t) => (
        <li key={t} className="flex items-start gap-3">
          <Dot tone="ink" className="mt-[0.55em] h-1.5! w-1.5!" />
          {t}
        </li>
      ))}
    </ul>
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
        <StaggerItem size="sm">
          <Eyebrow>{eyebrow}</Eyebrow>
        </StaggerItem>
        <StaggerItem size="lg">
          <h1 className="mt-5 max-w-3xl text-4xl font-medium leading-[1.05] tracking-[-0.03em] text-balance sm:text-6xl">
            {title}
          </h1>
        </StaggerItem>
        {children && (
          <StaggerItem className="type-lead mt-6 max-w-2xl text-ink-muted">
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
}: {
  title: string;
  lead?: ReactNode;
  children: ReactNode;
  id?: string;
}) {
  return (
    <section id={id} className="mx-auto max-w-6xl scroll-mt-24 px-4 sm:px-6">
      <Rule />
      <div className="grid gap-8 py-12 md:grid-cols-12">
        <Reveal className="md:col-span-4" delay={0.1}>
          <h2 className="section-title type-title">{title}</h2>
          {lead && <p className="mt-3 max-w-xs leading-relaxed text-ink-muted">{lead}</p>}
        </Reveal>
        <Reveal className="md:col-span-8" delay={0.2}>
          {children}
        </Reveal>
      </div>
    </section>
  );
}
