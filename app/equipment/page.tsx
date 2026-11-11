import type { Metadata } from "next";
import type { ReactNode } from "react";
import { ButtonLink, Callout, Card, PageIntro, Section } from "@/components/ui";
import { BrainIcon, EyeIcon, HandIcon, RobotIcon } from "@/components/icons";

export const metadata: Metadata = { title: "Equipment" };

type Device = {
  id: string;
  icon: ReactNode;
  name: string;
  measures: string;
  how: string;
  tells: string[];
  comfort: string;
};

const devices: Device[] = [
  {
    id: "eye-tracking",
    icon: <EyeIcon />,
    name: "Eye tracker",
    measures: "Gaze — where a person looks, for how long, and in what order.",
    how: "A small camera with infrared light follows the eyes. Screen-based trackers sit below a monitor; wearable trackers look like glasses.",
    tells: ["What catches attention", "What a person avoids", "Interest, confusion or fatigue"],
    comfort: "Non-invasive. Nothing touches the face with screen-based trackers.",
  },
  {
    id: "eeg",
    icon: <BrainIcon />,
    name: "EEG headset",
    measures: "Brain activity — tiny electrical signals at the surface of the scalp.",
    how: "A soft cap or headband with sensors rests on the head. It only listens; it never sends anything into the body.",
    tells: ["Focus and relaxation", "Reactions to sounds, images or people", "Mental workload"],
    comfort: "Painless. Modern dry sensors need no gel, and sessions can be short.",
  },
  {
    id: "skin-response",
    icon: <HandIcon />,
    name: "Skin response sensor (EDA / GSR)",
    measures: "Arousal — small changes in skin sweat that follow emotional reactions.",
    how: "Two small sensors on the fingers or a wristband, similar to a fitness watch.",
    tells: ["Stress or excitement", "Calm moments", "When something matters to a person"],
    comfort: "Comfortable to wear. Works while a person moves or plays.",
  },
];

export default function EquipmentPage() {
  return (
    <>
      <PageIntro eyebrow="Equipment" title="Sensors that notice what words can't.">
        <p>
          The lab&apos;s biometric equipment measures gaze, brain activity and skin response.
          Together, these signals show how a person reacts in the moment — without asking them
          to explain.
        </p>
      </PageIntro>

      <nav aria-label="Devices on this page" className="mx-auto max-w-6xl px-4 sm:px-6">
        <ul className="flex flex-wrap gap-2">
          {devices.map((d) => (
            <li key={d.id}>
              <a
                href={`#${d.id}`}
                className="inline-flex min-h-11 items-center gap-2 rounded-full border border-line bg-surface px-4 py-2 text-[15px] font-medium hover:bg-mist"
              >
                <span className="text-primary">{d.icon}</span>
                {d.name}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      {devices.map((d) => (
        <Section key={d.id} id={d.id} title={d.name} lead={d.measures}>
          <Card>
            <dl className="grid gap-6 md:grid-cols-2">
              <div>
                <dt className="text-sm font-bold uppercase tracking-[0.08em] text-primary-strong">How it works</dt>
                <dd className="mt-2 leading-relaxed">{d.how}</dd>
              </div>
              <div>
                <dt className="text-sm font-bold uppercase tracking-[0.08em] text-primary-strong">What it can tell us</dt>
                <dd className="mt-2">
                  <ul className="list-disc space-y-1 pl-5 marker:text-primary">
                    {d.tells.map((t) => (
                      <li key={t}>{t}</li>
                    ))}
                  </ul>
                </dd>
              </div>
            </dl>
            <p className="mt-6 rounded-xl bg-mist px-4 py-3 text-[15px]">
              <span className="font-semibold">Comfort: </span>
              {d.comfort}
            </p>
          </Card>
        </Section>
      ))}

      <Section title="Also in the lab" lead="The lab's core work is human–robot collaboration.">
        <Card className="flex items-start gap-4">
          <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-mint text-primary">
            <RobotIcon />
          </span>
          <p className="leading-relaxed">
            Collaborative and social robots are used to study trust, safety and comfort when
            people and machines share a task or a space.
          </p>
        </Card>
      </Section>

      <Section title="Good to know">
        <div className="grid gap-4 sm:grid-cols-2">
          <Callout tone="sage" label="Strength">
            Signals are measured continuously and objectively, so they can reveal reactions a
            person cannot describe.
          </Callout>
          <Callout tone="blush" label="Limit">
            Signals show <em>that</em> something happened, not always <em>why</em>. They need
            careful interpretation, together with people who know the person well.
          </Callout>
        </div>
        <div className="mt-8">
          <ButtonLink href="/research">See how we&apos;d use it</ButtonLink>
        </div>
      </Section>
    </>
  );
}
