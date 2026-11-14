import type { Metadata } from "next";
import { ButtonLink, Callout, Card, CheckList, PageIntro, Section } from "@/components/ui";
import { CheckIcon, HomeIcon, LockIcon, PeopleIcon } from "@/components/icons";
import { Stagger, StaggerItem } from "@/components/motion";

export const metadata: Metadata = { title: "Care research" };

const steps = [
  { title: "Listen", text: "Interview therapists and guardians to learn what they most need to understand." },
  { title: "Check", text: "Confirm with the lab's researchers what is technically possible." },
  { title: "Protect", text: "Plan ethics approval and a clear consent process with guardians." },
  { title: "Pilot", text: "Agree a first small pilot with one willing care partner." },
];

export default function ResearchPage() {
  return (
    <>
      <PageIntro eyebrow="Care research · proposal" title="Understanding needs beyond words.">
        <p>
          A sound can mean &ldquo;I&apos;m hungry&rdquo;, &ldquo;I&apos;m tired&rdquo; or
          &ldquo;I want company&rdquo;. Often it is the same sound. We propose using the
          lab&apos;s equipment to help carers understand the people they look after.
        </p>
      </PageIntro>

      <Section
        title="The problem"
        lead="People with severe disabilities, often unable to speak, are cared for around the clock."
      >
        <div className="space-y-4 text-lg leading-relaxed">
          <p>
            Carers rely on emotions, gaze and sounds — and the same sound can mean several
            different needs. They guess, and sometimes get it wrong.
          </p>
          <figure className="rounded-r-md border-l-2 border-signal bg-surface px-6 py-5">
            <blockquote className="font-serif text-2xl italic leading-snug text-ink sm:text-[1.75rem]">
              A client throws away a tablet in the middle of a cartoon. Does he want a
              different one, or is he tired, or hungry?
            </blockquote>
            <figcaption className="mt-3 label-mono">— Example from a care worker we interviewed</figcaption>
          </figure>
          <p className="text-ink-muted">
            The people they care for can&apos;t tell us, so they go unheard. Carers carry that
            uncertainty every day.
          </p>
        </div>
      </Section>

      <Section
        title="Why existing tools fall short"
        lead="Our focus is people who can't yet use communication aids."
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <Card>
            <h3 className="font-display text-lg font-medium">Pictogram cards &amp; observation</h3>
            <p className="mt-2 text-ink-muted leading-relaxed">Cheap and familiar, but they depend on guessing.</p>
          </Card>
          <Card>
            <h3 className="font-display text-lg font-medium">Eye-gaze communication devices</h3>
            <p className="mt-2 text-ink-muted leading-relaxed">They exist, but only work for people who can already choose pictures.</p>
          </Card>
        </div>
      </Section>

      <Section title="Our idea" lead="A research partnership between the lab, carers and guardians.">
        <div className="space-y-6">
          <p className="text-lg leading-relaxed">
            During everyday moments, the lab would record gaze and body signals and look for
            patterns that match what a person wants or feels — so carers can guess less and
            understand more.
          </p>
          <CheckList
            items={[
              { icon: <LockIcon />, text: "Private by default, with guardians' consent for every session" },
              { icon: <HomeIcon />, text: "Wearable sensors, so the study can come to the person" },
              { icon: <PeopleIcon />, text: "Built with therapists, carers and families" },
              { icon: <CheckIcon />, text: "Stop anytime, no questions asked" },
            ]}
          />
        </div>
      </Section>

      <Section title="What we've learned so far" lead="Early evidence from three interviews: a researcher, a local company and a care worker.">
        <Stagger as="ol" className="space-y-4" delay={0.15} gap={0.12}>
          <StaggerItem as="li">
            <Callout tone="positive" label="The need is in care">
              The care worker described a real, daily problem that the lab&apos;s sensors could help study, so we chose care for our first proposal.
            </Callout>
          </StaggerItem>
          <StaggerItem as="li">
            <Callout tone="neutral" label="Guardians may say yes">
              Guardians would likely accept studies that help a person open up — as long as
              they give consent.
            </Callout>
          </StaggerItem>
          <StaggerItem as="li">
            <Callout tone="caution" label="The real barriers">
              Ethics, consent and mobility. Many people use wheelchairs and are hard to
              transport. Distrust of data was not the main concern.
            </Callout>
          </StaggerItem>
        </Stagger>
      </Section>

      <Section title="Next steps">
        <Stagger as="ol" className="grid gap-4 sm:grid-cols-2" delay={0.15}>
          {steps.map((s, i) => (
            <StaggerItem as="li" key={s.title}>
              <Card className="h-full">
                <p className="font-mono text-sm text-ink-muted">0{i + 1}</p>
                <h3 className="mt-1 font-display text-lg font-medium">{s.title}</h3>
                <p className="mt-2 text-ink-muted leading-relaxed">{s.text}</p>
              </Card>
            </StaggerItem>
          ))}
        </Stagger>
      </Section>

      <Section title="An honest note">
        <div className="space-y-6">
          <p className="text-lg leading-relaxed">
            We don&apos;t know yet whether these signals can reliably show what a person
            wants. That is exactly what a careful, small pilot would help find out.
          </p>
          <div className="rounded-md bg-panel px-6 py-8 sm:px-8">
            <h3 className="font-serif text-3xl italic leading-tight sm:text-4xl">Care for someone who can&apos;t speak?</h3>
            <p className="mt-2 max-w-xl leading-relaxed">
              Whether you&apos;re a parent, carer, therapist, researcher or organisation, we&apos;d
              love to hear from you.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <ButtonLink href="/contact#interest">Express interest</ButtonLink>
              <ButtonLink href="/equipment" variant="outline">How the sensors work</ButtonLink>
            </div>
          </div>
        </div>
      </Section>
    </>
  );
}
