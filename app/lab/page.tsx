import type { Metadata } from "next";
import Link from "next/link";
import { ButtonLink, Callout, FeatureCard, IconCard, PageIntro, Section, linkClass } from "@/components/ui";
import { PeopleIcon, RobotIcon, BrainIcon } from "@/components/icons";
import { Stagger, StaggerItem } from "@/components/motion";

export const metadata: Metadata = { title: "The lab" };

const focus = [
  {
    icon: <PeopleIcon />,
    title: "Human factors",
    text: "The social and psychological side of working with robots and machines: comfort, stress, attention and workload.",
  },
  {
    icon: <BrainIcon />,
    title: "Usability and workload",
    text: "How easy robots and their control interfaces are to use, and how much mental effort they demand.",
  },
  {
    icon: <RobotIcon />,
    title: "Collaborative robotics",
    text: "How operators work alongside robots: their attention, stress and comfort during shared tasks.",
  },
];

export default function LabPage() {
  return (
    <>
      <PageIntro eyebrow="About the lab" title="People first, in every interaction with machines.">
        <p>
          The Human–Robot Interaction (HRI) Lab at TalTech Virumaa College studies how people
          and robots work together. Located in Ida-Virumaa, it provides unique opportunities
          for the region with its advanced behavioural research infrastructure.
        </p>
      </PageIntro>

      <Section
        title="What the lab does"
        lead="The lab studies human factors in human–robot interaction and is open to collaboration."
      >
        <Stagger className="grid gap-4 sm:grid-cols-3" delay={0.15}>
          {focus.map((f) => (
            <StaggerItem key={f.title}>
              <FeatureCard icon={f.icon} title={f.title}>
                {f.text}
              </FeatureCard>
            </StaggerItem>
          ))}
        </Stagger>
      </Section>

      <Section
        title="Our approach"
        lead="Human-centred design, built around usability, safety and comfort."
      >
        <div className="type-lead space-y-4">
          <p>
            The lab helps make robots and human–machine interfaces safer and easier to work with, by testing them with real people.
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
            Cobot operators, engineers of human–machine interfaces, researchers evaluating control systems, and students and 
            teachers. <a href="#cobot-example" className={linkClass}>See an example</a>.
          </Callout>
          <Callout tone="neutral" label="Tomorrow — our proposal">
            Carers, therapists, families and researchers working with people who cannot
            speak. <Link href="/research" className={linkClass}>See the care research</Link>.
          </Callout>
        </div>
      </Section>

      <Section title="Example: working with a cobot" lead="How the lab's equipment could be used in an industry study." id="cobot-example">
        <IconCard icon={<RobotIcon />}>
          <p>
            An operator programs a cobot for a new assembly task. Eye tracking glasses show where
            they look and what they miss. A skin response sensor marks moments of stress, and EEG
            shows how hard the task is for them.
          </p>
          <p className="text-ink-muted">
            The results help engineers see which steps of the interface slow people down or
            cause stress, so they know what to improve.
          </p>
        </IconCard>
      </Section>

      <Section title="Partners">
        <p className="type-lead">
          The lab is run by TalTech Virumaa College&apos;s <em>Development of Robot-Human
          Co-Creation</em> working group, together with the Human-Computer Interaction group
          at Tallinn University.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <ButtonLink href="/equipment">See the equipment</ButtonLink>
          <ButtonLink href="/contact" variant="secondary">Get in touch</ButtonLink>
        </div>
      </Section>
    </>
  );
}
