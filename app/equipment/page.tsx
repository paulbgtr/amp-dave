import type { Metadata } from "next";
import type { ReactNode } from "react";
import { ButtonLink, Callout, Dot, DotList, IconCard, PageIntro, Section, Well, chipClass } from "@/components/ui";
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
                className={chipClass}
              >
                {d.icon}
                {d.name}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      {devices.map((d) => (
        <Section key={d.id} id={d.id} title={d.name} lead={d.measures}>
          {/* One card; the drawing and the comfort note sit in wells inside it. */}
          <article className="soft-card grid gap-2 p-2 md:grid-cols-[minmax(0,5fr)_minmax(0,6fr)]">
            <Well className="overflow-hidden">{d.drawing}</Well>

            <dl className="flex flex-col gap-6 p-4 sm:p-6">
              <div>
                <dt className="label-mono">How it works</dt>
                <dd className="mt-2 leading-relaxed">{d.how}</dd>
              </div>
              <div>
                <dt className="label-mono">What it can tell us</dt>
                <dd className="mt-2">
                  <DotList items={d.tells} />
                </dd>
              </div>
              {d.results && (
                <div>
                  <dt className="label-mono">Results</dt>
                  <dd className="mt-2 leading-relaxed">{d.results}</dd>
                </div>
              )}
            </dl>

            <Well className="flex items-start gap-3 px-5 py-3.5 text-[15px] md:col-span-2">
              <Dot tone="go" className="mt-[0.5em]" />
              <p>
                <span className="font-medium text-ink">Comfort: </span>
                {d.comfort}
              </p>
            </Well>
          </article>
        </Section>
      ))}

      <Section title="Also in the lab" lead="The lab's core work is human–robot collaboration.">
        <div className="space-y-4">
          <IconCard icon={<RobotIcon />}>
            <p>
              Collaborative and social robots are used to study attention, stress and comfort when
              people and machines share a task or a space.
            </p>
          </IconCard>
          <IconCard icon={<PulseIcon />}>
            <p>
              The lab also records facial expressions, muscle activity (EMG) and heart activity (ECG).
              All signals are recorded and synchronised in iMotions software.
            </p>
          </IconCard>
        </div>
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
