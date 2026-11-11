import type { Metadata } from "next";
import Link from "next/link";
import { ButtonLink, Callout, Card, PageIntro, Section } from "@/components/ui";
import { PeopleIcon, RobotIcon, ShieldIcon } from "@/components/icons";
import { Stagger, StaggerItem } from "@/components/motion";

export const metadata: Metadata = { title: "The lab" };

const focus = [
  {
    icon: <PeopleIcon />,
    title: "Human factors",
    text: "The social and psychological side of working with robots and intelligent systems: comfort, stress, attention and workload.",
  },
  {
    icon: <ShieldIcon />,
    title: "Trust and reliability",
    text: "How people come to trust — or distrust — robotic systems and AI, and how to design systems that deserve that trust.",
  },
  {
    icon: <RobotIcon />,
    title: "Collaborative robotics",
    text: "Modelling human–robot interaction, assessing risks, and designing robotic workplaces that are safe and human-centred.",
  },
];

export default function LabPage() {
  return (
    <>
      <PageIntro eyebrow="About the lab" title="People first, in every interaction with machines.">
        <p>
          The Human–Robot Interaction (HRI) Lab at TalTech Virumaa College studies how people
          and robots work together. It was established in Ida-Virumaa with a focus on the
          specific needs and challenges of the region.
        </p>
      </PageIntro>

      <Section
        title="What the lab does"
        lead="The lab offers consultancy and recommendations on human factors in human–robot interaction."
      >
        <Stagger className="grid gap-4 sm:grid-cols-3" delay={0.15}>
          {focus.map((f) => (
            <StaggerItem key={f.title}>
            <Card className="h-full">
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-panel text-ink">
                {f.icon}
              </span>
              <h3 className="mt-4 font-display text-lg font-medium">{f.title}</h3>
              <p className="mt-2 text-ink-muted leading-relaxed">{f.text}</p>
            </Card>
            </StaggerItem>
          ))}
        </Stagger>
      </Section>

      <Section
        title="Our approach"
        lead="Human-centred and trustworthy AI, built around usability, accessibility and reliability."
      >
        <div className="space-y-4 text-lg leading-relaxed">
          <p>
            The lab supports the adoption of human-centred, trustworthy artificial intelligence
            and promotes innovation in human–robot collaboration through user-centred design.
          </p>
          <p className="text-ink-muted">
            Using biometric equipment, researchers can see how people actually respond — where
            they look, how their body reacts, how focused or stressed they are — rather than
            relying only on what people say afterwards.
          </p>
        </div>
      </Section>

      <Section title="Who it's for">
        <div className="grid gap-4 sm:grid-cols-2">
          <Callout tone="positive" label="Today">
            Local industry, students and teachers exploring human–robot collaboration,
            workplace design and user trust.
          </Callout>
          <Callout tone="neutral" label="Tomorrow — our proposal">
            Carers, therapists, families and researchers working with people who cannot
            speak. <Link href="/research" className="font-medium text-ink underline underline-offset-4">See the research example</Link>.
          </Callout>
        </div>
      </Section>

      <Section title="Partners">
        <p className="text-lg leading-relaxed">
          The lab is run by TalTech Virumaa College&apos;s <em>Development of Robot-Human
          Co-Creation</em> working group, together with the Human-Computer Interaction group
          at Tallinn University.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <ButtonLink href="/equipment">See the equipment</ButtonLink>
          <ButtonLink href="/contact" variant="outline">Get in touch</ButtonLink>
        </div>
      </Section>
    </>
  );
}
