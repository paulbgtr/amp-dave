import Link from "next/link";
import { ButtonLink, Eyebrow, IconBadge, Panel } from "@/components/ui";
import { ArrowIcon, BrainIcon, EyeIcon, HandIcon, PeopleIcon, RobotIcon } from "@/components/icons";
import { Reveal, Stagger, StaggerItem } from "@/components/motion";
import { BeyondWords } from "@/components/beyond-words";

const specs = [
  { label: "Location", value: "Kohtla-Järve, Ida-Virumaa" },
  { label: "Open to", value: "Industry, researchers, carers, students" },
  { label: "Principle", value: "Consent first, always voluntary" },
];

const explore = [
  {
    href: "/lab",
    title: "The lab",
    text: "What we study, how we work, and who we work with.",
    tags: [
      { icon: <PeopleIcon />, label: "Human factors" },
      { icon: <BrainIcon />, label: "Usability" },
      { icon: <RobotIcon />, label: "Collaborative robots" },
    ],
  },
  {
    href: "/equipment",
    title: "Equipment",
    text: "Sensors that measure gaze, brain, muscle and heart activity, skin response and facial expressions.",
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
          <StaggerItem size="sm">
            <Eyebrow>TalTech Virumaa College</Eyebrow>
          </StaggerItem>
          <StaggerItem size="lg">
            <h1 className="mt-6 text-5xl font-medium leading-[1] tracking-[-0.035em] text-balance sm:text-7xl">
              Human–Robot Interaction Lab
            </h1>
          </StaggerItem>
          <StaggerItem>
            <p className="type-lead mt-6 max-w-xl text-ink-muted sm:text-xl">
              Technology that sees reactions words can&apos;t express already exists in Ida-Virumaa.
              We study how people and machines work together, and how gaze, brain and body
              signals could help us understand the people we care for.
            </p>
          </StaggerItem>
          <StaggerItem className="mt-9 flex flex-wrap gap-3">
            <ButtonLink href="/lab">About the lab</ButtonLink>
            <ButtonLink href="/contact" variant="secondary">Contact us</ButtonLink>
          </StaggerItem>
        </Stagger>

        <div className="mx-auto w-full max-w-sm md:col-span-5">
          <BeyondWords />
        </div>
      </section>

      {/* Device-label style spec strip */}
      <Reveal loadDelay={0.5}>
        <dl className="soft-card grid divide-y divide-line/60 px-6 sm:grid-cols-3 sm:divide-x sm:divide-y-0 sm:px-0 sm:py-6">
          {specs.map((s) => (
            <div key={s.label} className="py-5 sm:px-7 sm:py-0">
              <dt className="label-mono">{s.label}</dt>
              <dd className="mt-1.5">{s.value}</dd>
            </div>
          ))}
        </dl>
      </Reveal>

      {/* The idea behind the site: lead visitors from the lab to the care research */}
      <section aria-labelledby="idea-title" className="mt-16 md:mt-24">
        <Reveal>
          <Panel className="grid gap-10 md:grid-cols-12 md:py-14">
            <div className="md:col-span-8">
              <Eyebrow>Care research</Eyebrow>
              <h2 id="idea-title" className="type-statement mt-6">
                A sound can mean &ldquo;I&apos;m hungry&rdquo;, &ldquo;I&apos;m tired&rdquo; or
                &ldquo;I want company&rdquo;. Often, it&apos;s the same sound.
              </h2>
            </div>
            <div className="flex flex-col justify-end gap-6 md:col-span-4">
              <p className="leading-relaxed">
                People who have trouble speaking often go unheard. We want to use the lab&apos;s
                sensors to help carers understand what they need — with consent, in small
                pilots, brought to the person.
              </p>
              <div className="flex flex-wrap gap-3">
                <ButtonLink href="/research">Read the idea</ButtonLink>
                <ButtonLink href="/contact#interest" variant="secondary">Get involved</ButtonLink>
              </div>
            </div>
          </Panel>
        </Reveal>
      </section>

      <Stagger as="nav" aria-label="Explore" className="mt-6 grid gap-6 md:grid-cols-2">
        {explore.map((item, i) => (
          <StaggerItem key={item.href}>
            <Link
              href={item.href}
              className="group soft-card soft-card-link flex h-full min-h-72 flex-col justify-between gap-10 p-6 sm:p-8"
            >
              <span className="flex items-start justify-between gap-6">
                <span>
                  <span className="label-mono block">0{i + 1}</span>
                  <span className="mt-4 block text-3xl font-medium tracking-[-0.03em] text-ink sm:text-4xl">
                    {item.title}
                  </span>
                  <span className="type-lead mt-2 block max-w-sm text-ink-muted">{item.text}</span>
                </span>
                <IconBadge
                  size="lg"
                  className="transition-colors duration-200 ease-calm group-hover:bg-ink group-hover:text-canvas"
                >
                  <ArrowIcon className="transition-transform duration-300 ease-calm group-hover:translate-x-1" />
                </IconBadge>
              </span>
              <span className="flex flex-wrap gap-x-6 gap-y-3 border-t border-line/60 pt-5">
                {item.tags.map((t) => (
                  <span key={t.label} className="flex items-center gap-2 text-[15px]">
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
