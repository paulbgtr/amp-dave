"use client";

import { useEffect, useRef, useState, type SubmitEvent } from "react";
import { AnimatePresence, motion } from "motion/react";
import { CONTACT, FORMSPREE_ENDPOINT } from "@/lib/site";
import { EASE } from "@/components/motion";
import { Dot, Eyebrow } from "@/components/ui";

const ROLES = ["Parent or guardian", "Carer or therapist", "Researcher", "Engineer or industry", "Student or teacher", "Organisation", "Other"];
const INTERESTS = ["Taking part in a pilot", "Collaborating on the research", "Just keep me updated"];
const SOURCES = ["Facebook", "Friend or colleague", "TalTech", "Other"];

const field =
  "mt-1.5 block w-full rounded-md border border-line bg-surface px-3.5 py-2.5 text-ink placeholder:text-ink-muted/70 focus:border-ink focus:outline-none focus:ring-2 focus:ring-ink/15";

type Status = "idle" | "sending" | "sent" | "error";

function Choices({ name, legend, options }: { name: string; legend: string; options: string[] }) {
  return (
    <fieldset>
      <legend className="font-medium">{legend}</legend>
      <div className="mt-2 flex flex-wrap gap-2">
        {options.map((o) => (
          <label
            key={o}
            className="inline-flex min-h-11 cursor-pointer items-center gap-2 rounded-full border border-line bg-surface px-4 py-2 has-checked:border-ink has-checked:bg-panel has-focus-visible:ring-2 has-focus-visible:ring-signal"
          >
            <input type="radio" name={name} value={o} required className="accent-ink" />
            {o}
          </label>
        ))}
      </div>
    </fieldset>
  );
}

export function InterestForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [name, setName] = useState("");
  const thanksRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    if (status === "sent") thanksRef.current?.focus();
  }, [status]);

  async function onSubmit(e: SubmitEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    setName(String(data.get("name") ?? "").trim().split(" ")[0]);
    data.set("_subject", `New interest: ${data.get("role")} — ${data.get("interest")}`);

    setStatus("sending");
    try {
      const res = await fetch(FORMSPREE_ENDPOINT, {
        method: "POST",
        body: data,
        headers: { Accept: "application/json" },
      });
      if (!res.ok) throw new Error(String(res.status));
      form.reset();
      setStatus("sent");
    } catch {
      setStatus("error");
    }
  }

  return (
    <AnimatePresence mode="wait" initial={false}>
      {status === "sent" ? (
        <motion.div
          key="thanks"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: EASE }}
          className="py-6"
        >
          <Eyebrow tone="go">Received</Eyebrow>
          <h3 ref={thanksRef} tabIndex={-1} className="mt-4 font-serif text-3xl italic leading-tight outline-none">
            Thank you{name ? `, ${name}` : ""}.
          </h3>
          <p className="mt-3 max-w-md leading-relaxed text-ink-muted">
            We&apos;ve got your note and will get back to you by email. Expressing interest doesn&apos;t
            commit you to anything.
          </p>
          <button
            type="button"
            onClick={() => setStatus("idle")}
            className="mt-6 text-[15px] font-medium underline underline-offset-4 hover:text-graphite"
          >
            Send another response
          </button>
        </motion.div>
      ) : (
        <motion.form
          key="form"
          onSubmit={onSubmit}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.3 }}
          className="space-y-6"
        >
          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label htmlFor="name" className="font-medium">Your name</label>
              <input id="name" name="name" required autoComplete="name" className={field} />
            </div>
            <div>
              <label htmlFor="email" className="font-medium">Email</label>
              <input id="email" name="email" type="email" required autoComplete="email" className={field} />
            </div>
          </div>

          <Choices name="role" legend="I am a…" options={ROLES} />

          <div>
            <label htmlFor="org" className="font-medium">
              Organisation <span className="font-normal text-ink-muted">(optional)</span>
            </label>
            <input id="org" name="organisation" autoComplete="organization" className={field} />
          </div>

          <Choices name="interest" legend="What interests you?" options={INTERESTS} />
          <Choices name="source" legend="How did you hear about us?" options={SOURCES} />

          <div>
            <label htmlFor="feedback" className="font-medium">
              Does the idea make sense to you? Any concerns?{" "}
              <span className="font-normal text-ink-muted">(optional)</span>
            </label>
            <textarea
              id="feedback"
              name="feedback"
              rows={4}
              className={field}
              placeholder="Anything that would make you more, or less, comfortable taking part."
            />
          </div>

          {/* spam trap: hidden from people, filled in by bots */}
          <input type="text" name="_gotcha" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />

          <label className="flex cursor-pointer items-start gap-3 leading-relaxed">
            <input type="checkbox" name="consent" value="yes" required className="mt-1.5 h-4 w-4 shrink-0 accent-ink" />
            <span>You may contact me by email about this research. I can ask you to delete my details at any time.</span>
          </label>

          <div className="flex flex-wrap items-center gap-4">
            <button
              type="submit"
              disabled={status === "sending"}
              className="inline-flex min-h-11 items-center justify-center gap-2.5 rounded-full bg-ink px-6 py-2.5 font-medium text-canvas transition-colors hover:bg-graphite disabled:cursor-wait disabled:opacity-70"
            >
              {status === "sending" && (
                <motion.span
                  aria-hidden="true"
                  className="h-2 w-2 rounded-full bg-signal"
                  animate={{ opacity: [1, 0.3, 1] }}
                  transition={{ duration: 1, repeat: Infinity }}
                />
              )}
              {status === "sending" ? "Sending…" : "Send"}
            </button>
            <p className="text-[15px] text-ink-muted">Your answers go only to the research team.</p>
          </div>

          <div aria-live="polite">
            {status === "error" && (
              <p className="flex items-start gap-3 rounded-md border border-line bg-surface px-4 py-3 text-[15px]">
                <Dot tone="signal" className="mt-[0.45em]" />
                <span>
                  Something went wrong and your note wasn&apos;t sent. Please try again in a moment
                  {CONTACT.email ? (
                    <>
                      , or write to{" "}
                      <a href={`mailto:${CONTACT.email}`} className="underline underline-offset-4">{CONTACT.email}</a>
                    </>
                  ) : null}
                  .
                </span>
              </p>
            )}
          </div>
        </motion.form>
      )}
    </AnimatePresence>
  );
}
