import type { Metadata } from "next";
import type { ReactNode } from "react";
import { ButtonLink, Callout, Card, Dot, PageIntro, Section } from "@/components/ui";
import { BrainIcon, EyeIcon, HandIcon, RobotIcon, PulseIcon } from "@/components/icons";
import { EegDrawing, EyeTrackerDrawing, SkinResponseDrawing } from "@/components/device-drawings";

export const metadata: Metadata = { title: "Equipment" };

type Device = {
  id: string;
  icon: ReactNode;
  name: string;
  measures: string;
  how: string;
  tells: string[];
  results?: string;
  comfort: string;
  drawing: ReactNode;
};

const devices: Device[] = [
  {
    id: "eye-tracking",
    icon: <EyeIcon />,
    name: "Eye tracker",
    measures: "Gaze — where a person looks, for how long, and in what order.",
    how: "A small camera with infrared light follows the eyes. Screen-based trackers sit below a monitor; wearable trackers look like glasses, and VR headsets can track gaze inside virtual environments.",
    tells: ["What catches attention", "What a person avoids", "Interest, confusion or fatigue"],
    results: "Heatmaps of where people looked, gaze replays of each session, and over 30 measures for chosen areas of interest.",
    comfort: "Non-invasive. Nothing touches the face with screen-based trackers.",
    drawing: <EyeTrackerDrawing />,
  },
  {
    id: "eeg",
    icon: <BrainIcon />,
    name: "EEG headset",
    measures: "Brain activity — tiny electrical signals at the surface of the scalp.",
    how: "A soft cap or headband with sensors rests on the head. It only listens; it never sends anything into the body.",
    tells: ["Focus and relaxation", "Reactions to sounds or images", "Mental workload"],
    comfort: "Painless. Sensors only rest on the head, and sessions can be short.",
    drawing: <EegDrawing />,
  },
  {
    id: "skin-response",
    icon: <HandIcon />,
    name: "Skin response sensor (EDA / GSR)",
    measures: "Arousal — small changes in skin sweat that follow emotional reactions.",
    how: "Two small sensors on the fingers or a wristband, similar to a fitness watch.",
    tells: ["Stress or excitement", "Calm moments", "When something matters to a person"],
    comfort: "Comfortable to wear. Works while a person moves or plays.",
    drawing: <SkinResponseDrawing />,
  },
];

export default function EquipmentPage() {
  return (
    <>
      <PageIntro eyebrow="Equipment" title="Sensors that notice what words can't.">
        <p>
          The lab&apos;s biometric equipment measures gaze, brain and heart activity, muscle tension, skin response and facial expressions.
          Together, these signals show how a person reacts in the moment — without asking them
          to explain.
        </p>
      </PageIntro>

      <nav aria-label="Devices on this page" className="mx-auto mb-10 max-w-6xl px-4 sm:px-6">
        <ul className="flex flex-wrap gap-2">
          {devices.map((d) => (
            <li key={d.id}>
              <a
                href={`#${d.id}`}
                className="inline-flex min-h-11 items-center gap-2 rounded-full border border-line bg-surface px-4 py-2 text-[15px] font-medium hover:bg-panel"
              >
                <span className="text-ink">{d.icon}</span>
                {d.name}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      {devices.map((d) => (
        <Section key={d.id} id={d.id} title={d.name} lead={d.measures}>
          <article className="grid overflow-hidden rounded-md border border-line bg-surface md:grid-cols-[minmax(0,5fr)_minmax(0,6fr)]">
            <div className="border-b border-line md:border-r md:border-b-0">{d.drawing}</div>

            <dl className="flex flex-col gap-6 p-6 sm:p-7">
              <div>
                <dt className="label-mono">How it works</dt>
                <dd className="mt-2 leading-relaxed">{d.how}</dd>
              </div>
              <div>
                <dt className="label-mono">What it can tell us</dt>
                <dd className="mt-2">
                  <ul className="space-y-1.5">
                    {d.tells.map((t) => (
                      <li key={t} className="flex items-baseline gap-3">
                        <span aria-hidden="true" className="h-px w-3 shrink-0 translate-y-[-0.25em] bg-ink" />
                        {t}
                      </li>
                    ))}
                  </ul>
                </dd>
              </div>
              {d.results && (
                <div>
                  <dt className="label-mono">Results</dt>
                  <dd className="mt-2 leading-relaxed">{d.results}</dd>
                </div>
              )}
            </dl>

            <p className="flex items-start gap-3 border-t border-line bg-panel/50 px-6 py-3.5 text-[15px] md:col-span-2">
              <Dot tone="go" className="mt-[0.45em]" />
              <span>
                <span className="font-medium">Comfort: </span>
                {d.comfort}
              </span>
            </p>
          </article>
        </Section>
      ))}

      <Section title="Also in the lab" lead="The lab's core work is human–robot collaboration.">
        <Card className="flex items-start gap-4">
          <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-panel text-ink">
            <RobotIcon />
          </span>
          <p className="leading-relaxed">
            Collaborative and social robots are used to study attention, stress and comfort when
            people and machines share a task or a space.
          </p>
        </Card>
        <Card className="mt-4 flex items-start gap-4">
          <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-panel text-ink">
            <PulseIcon />
          </span>
          <p className="leading-relaxed">
            The lab also records facial expressions, muscle activity (EMG) and heart activity (ECG).
            All signals are recorded and synchronised in iMotions software.
          </p>
        </Card>
      </Section>

      <Section title="Good to know">
        <div className="grid gap-4 sm:grid-cols-2">
          <Callout tone="positive" label="Strength">
            Signals are measured continuously and automatically, so they can reveal reactions a
            person cannot describe.
          </Callout>
          <Callout tone="caution" label="Limit">
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
