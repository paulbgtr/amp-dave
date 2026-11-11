import Link from "next/link";
import { ButtonLink, Eyebrow } from "@/components/ui";
import { ArrowIcon, BrainIcon, EyeIcon, HandIcon, PeopleIcon, RobotIcon, ShieldIcon } from "@/components/icons";
import { Reveal, Stagger, StaggerItem } from "@/components/motion";
import { BeyondWords } from "@/components/beyond-words";

const specs = [
  { label: "Location", value: "Kohtla-Järve, Ida-Virumaa" },
  { label: "Open to", value: "Researchers, carers, organisations" },
  { label: "Principle", value: "Consent first, always voluntary" },
];

const explore = [
  {
    href: "/lab",
    title: "The lab",
    text: "What we study, how we work, and who we work with.",
    tags: [
      { icon: <PeopleIcon />, label: "Human factors" },
      { icon: <ShieldIcon />, label: "Trust" },
      { icon: <RobotIcon />, label: "Collaborative robots" },
    ],
  },
  {
    href: "/equipment",
    title: "Equipment",
    text: "Sensors that measure gaze, brain activity and skin response.",
    tags: [
      { icon: <EyeIcon />, label: "Eye tracker" },
      { icon: <BrainIcon />, label: "EEG" },
      { icon: <HandIcon />, label: "Skin response" },
    ],
  },
];

export default function Home() {
  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6">
      <section className="grid items-center gap-12 pt-14 pb-16 md:grid-cols-12 md:pt-24 md:pb-24">
        <Stagger onMount delay={0.1} gap={0.1} className="md:col-span-7">
          <StaggerItem>
            <Eyebrow>TalTech Virumaa College</Eyebrow>
          </StaggerItem>
          <StaggerItem>
            <h1 className="mt-6 font-display text-5xl font-medium leading-[1] tracking-[-0.04em] text-balance sm:text-7xl">
              Human–Robot Interaction Lab
            </h1>
          </StaggerItem>
          <StaggerItem>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-ink-muted sm:text-xl">
              Technology that reads what people can&apos;t say already exists in Ida-Virumaa.
              We study how people and machines work together — and how gaze, brain and body
              signals could help us understand the people we care for.
            </p>
          </StaggerItem>
          <StaggerItem className="mt-9 flex flex-wrap gap-3">
            <ButtonLink href="/lab">About the lab</ButtonLink>
            <ButtonLink href="/contact" variant="outline">Contact us</ButtonLink>
          </StaggerItem>
        </Stagger>

        <div className="mx-auto w-full max-w-sm md:col-span-5">
          <BeyondWords />
        </div>
      </section>

      {/* Device-label style spec strip */}
      <Reveal delay={0.5}>
        <dl className="grid border-y border-line sm:grid-cols-3 sm:divide-x sm:divide-line">
          {specs.map((s) => (
            <div key={s.label} className="border-b border-line py-5 last:border-b-0 sm:border-b-0 sm:px-6 sm:first:pl-0">
              <dt className="font-mono text-[13px] uppercase tracking-[0.1em] text-ink-muted">{s.label}</dt>
              <dd className="mt-1.5">{s.value}</dd>
            </div>
          ))}
        </dl>
      </Reveal>

      {/* The idea behind the site: lead visitors from the lab to the care research */}
      <section aria-labelledby="idea-title" className="mt-16 md:mt-24">
        <Reveal>
          <div className="grid gap-10 rounded-md bg-panel px-6 py-10 sm:px-10 md:grid-cols-12 md:py-14">
            <div className="md:col-span-8">
              <Eyebrow>Research example</Eyebrow>
              <h2 id="idea-title" className="mt-6 font-serif text-3xl italic leading-[1.15] text-balance sm:text-[2.6rem]">
                A sound can mean &ldquo;I&apos;m hungry&rdquo;, &ldquo;I&apos;m tired&rdquo; or
                &ldquo;I want company&rdquo;. Often, it&apos;s the same sound.
              </h2>
            </div>
            <div className="flex flex-col justify-end gap-6 md:col-span-4">
              <p className="leading-relaxed text-graphite">
                People who can&apos;t speak often go unheard. We want to use the lab&apos;s
                sensors to help carers understand what they need — with consent, in small
                pilots, brought to the person.
              </p>
              <div className="flex flex-wrap gap-3">
                <ButtonLink href="/research">Read the idea</ButtonLink>
                <ButtonLink href="/contact#interest" variant="outline">Get involved</ButtonLink>
              </div>
            </div>
          </div>
        </Reveal>
      </section>

      <Stagger as="nav" aria-label="Explore" className="mt-6 grid gap-4 md:grid-cols-2">
        {explore.map((item, i) => (
          <StaggerItem key={item.href}>
            <Link
              href={item.href}
              className="group flex h-full min-h-72 flex-col justify-between gap-10 rounded-md border border-line bg-surface p-6 transition-colors duration-200 hover:border-ink sm:p-8"
            >
              <span className="flex items-start justify-between gap-6">
                <span>
                  <span className="block font-mono text-[13px] text-ink-muted">0{i + 1}</span>
                  <span className="mt-4 block font-display text-3xl font-medium tracking-[-0.02em] sm:text-4xl">
                    {item.title}
                  </span>
                  <span className="mt-2 block max-w-sm text-lg leading-relaxed text-ink-muted">{item.text}</span>
                </span>
                <span
                  aria-hidden="true"
                  className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-ink/80 text-ink transition-colors duration-200 group-hover:bg-ink group-hover:text-canvas"
                >
                  <ArrowIcon className="transition-transform duration-300 group-hover:translate-x-0.5" />
                </span>
              </span>
              <span className="flex flex-wrap gap-x-6 gap-y-3 border-t border-line pt-5">
                {item.tags.map((t) => (
                  <span key={t.label} className="flex items-center gap-2 text-[15px] text-graphite">
                    <span className="text-ink">{t.icon}</span>
                    {t.label}
                  </span>
                ))}
              </span>
            </Link>
          </StaggerItem>
        ))}
      </Stagger>
    </div>
  );
}
