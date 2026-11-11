import Link from "next/link";
import { ButtonLink, CheckList, Eyebrow } from "@/components/ui";
import { ArrowIcon, CheckIcon, PeopleIcon, PinIcon } from "@/components/icons";

export default function Home() {
  return (
    <div className="mx-auto max-w-6xl px-4 pt-10 sm:px-6 md:pt-16">
      <section className="relative overflow-hidden rounded-3xl border border-line/60 bg-surface px-6 py-12 shadow-[0_24px_60px_-30px_rgba(27,34,32,0.25)] sm:px-10 md:px-14 md:py-20">
        {/* organic shape, decorative */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-mint sm:h-96 sm:w-96 md:-right-16 md:-top-32 md:h-[30rem] md:w-[30rem]"
        />
        <div className="relative max-w-2xl">
          <Eyebrow>TalTech Virumaa College · Ida-Virumaa</Eyebrow>
          <h1 className="mt-5 font-display text-4xl font-semibold leading-[1.05] tracking-tight text-balance sm:text-6xl">
            Human–Robot Interaction Lab
          </h1>
          <p className="mt-5 text-lg leading-relaxed text-ink-muted sm:text-xl">
            Technology that reads what people can&apos;t say already exists in Ida-Virumaa.
            We study how people and machines work together — and how gaze, brain and body
            signals could help us understand the people we care for.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <ButtonLink href="/lab">About the lab</ButtonLink>
            <ButtonLink href="/contact" variant="outline">Contact us</ButtonLink>
          </div>
        </div>

        <div className="relative mt-10 max-w-xl">
          <CheckList
            items={[
              { icon: <PinIcon />, text: "Based in Kohtla-Järve, open to partners across the region" },
              { icon: <PeopleIcon />, text: "Researchers, carers and organisations welcome" },
              { icon: <CheckIcon />, text: "Every study is consent-first and voluntary" },
            ]}
          />
        </div>
      </section>

      <nav aria-label="Explore" className="mt-6 grid gap-4 sm:grid-cols-3">
        {[
          { href: "/equipment", title: "Equipment", text: "Eye tracking, EEG and skin response sensors." },
          { href: "/research", title: "Research example", text: "Understanding people who can't speak." },
          { href: "/contact", title: "Collaborate", text: "Tell us you're interested in a pilot." },
        ].map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="group flex items-start justify-between gap-4 rounded-2xl border border-line/60 bg-surface p-5 transition-colors hover:border-primary/40 hover:bg-mist"
          >
            <span>
              <span className="block font-display text-lg font-semibold">{item.title}</span>
              <span className="mt-1 block text-ink-muted">{item.text}</span>
            </span>
            <ArrowIcon className="mt-1 shrink-0 text-primary transition-transform group-hover:translate-x-1" />
          </Link>
        ))}
      </nav>
    </div>
  );
}
