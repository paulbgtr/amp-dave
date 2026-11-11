import Link from "next/link";
import type { ReactNode } from "react";

export function Eyebrow({ children }: { children: ReactNode }) {
  return (
    <p className="font-mono text-[13px] uppercase tracking-[0.14em] text-signal">{children}</p>
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
      ? "bg-primary text-primary-ink hover:bg-primary-strong border-primary hover:border-primary-strong"
      : "bg-transparent text-primary border-primary hover:bg-mist";
  return (
    <Link
      href={href}
      className={`inline-flex min-h-11 items-center justify-center rounded-lg border px-5 py-2.5 text-[15px] font-semibold transition-colors ${styles}`}
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
    <section className="mx-auto max-w-6xl px-4 pt-14 pb-10 sm:px-6 md:pt-20">
      <Eyebrow>{eyebrow}</Eyebrow>
      <h1 className="mt-4 max-w-3xl font-display text-4xl font-semibold leading-[1.08] tracking-tight text-balance sm:text-5xl">
        {title}
      </h1>
      {children && (
        <div className="mt-5 max-w-2xl text-lg leading-relaxed text-ink-muted">{children}</div>
      )}
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
    <section id={id} className="mx-auto max-w-6xl scroll-mt-24 px-4 py-10 sm:px-6">
      <div className="grid gap-8 md:grid-cols-12">
        <div className="md:col-span-4">
          <h2 className="font-display text-2xl font-semibold tracking-tight">{title}</h2>
          {lead && <p className="mt-3 text-ink-muted leading-relaxed">{lead}</p>}
        </div>
        <div className="md:col-span-8">{children}</div>
      </div>
    </section>
  );
}

export function Card({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <div className={`rounded-2xl border border-line/60 bg-surface p-6 shadow-[0_1px_2px_rgba(27,34,32,0.04)] ${className}`}>
      {children}
    </div>
  );
}

export function Callout({
  tone,
  label,
  children,
}: {
  tone: "sage" | "blush" | "mist";
  label: string;
  children: ReactNode;
}) {
  const tones = {
    sage: "bg-sage text-ink [&_.label]:text-sage-ink",
    blush: "bg-blush text-ink [&_.label]:text-blush-ink",
    mist: "bg-mist text-ink [&_.label]:text-primary-strong",
  };
  return (
    <div className={`rounded-xl px-6 py-5 ${tones[tone]}`}>
      <p className="label text-sm font-bold uppercase tracking-[0.08em]">{label}</p>
      <div className="mt-1.5 leading-relaxed">{children}</div>
    </div>
  );
}

export function CheckList({ items }: { items: { icon: ReactNode; text: ReactNode }[] }) {
  return (
    <ul className="space-y-3 rounded-xl bg-mist px-6 py-5">
      {items.map((item, i) => (
        <li key={i} className="flex items-start gap-3.5">
          <span className="mt-0.5 shrink-0 text-primary">{item.icon}</span>
          <span>{item.text}</span>
        </li>
      ))}
    </ul>
  );
}
