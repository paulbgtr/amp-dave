"use client";

import { useEffect, useRef, useState, type SubmitEvent } from "react";
import { AnimatePresence, motion } from "motion/react";
import { CONTACT, FORMSPREE_ENDPOINT } from "@/lib/site";
import { EASE, EASE_EXIT } from "@/components/motion";
import { Dot, Eyebrow, buttonClass, chipClass, linkClass } from "@/components/ui";

const ROLES = ["Parent or guardian", "Carer or therapist", "Researcher", "Engineer or industry", "Student or teacher", "Organisation", "Other"];
const INTERESTS = ["Taking part in a pilot", "Collaborating on the research", "Just keep me updated"];
const SOURCES = ["Facebook", "Friend or colleague", "TalTech", "Other"];

// Fields are wells: sunk into the card rather than outlined on top of it.
const field = "mt-2 block w-full soft-well px-4 py-3 text-text placeholder:text-ink-muted/70";
const label = "text-[15px] font-medium text-ink";

type Status = "idle" | "sending" | "sent" | "error";

function Choices({ name, legend, options }: { name: string; legend: string; options: string[] }) {
  return (
    <fieldset>
      <legend className={label}>{legend}</legend>
      <div className="mt-2.5 flex flex-wrap gap-2">
        {options.map((o) => (
          <label
            key={o}
            className={`${chipClass} cursor-pointer has-checked:bg-ink has-checked:text-canvas has-checked:shadow-button has-focus-visible:outline-2 has-focus-visible:outline-offset-3 has-focus-visible:outline-signal`}
          >
            {/* The chip itself shows the choice, so the native radio is kept only for the keyboard and screen readers. */}
            <input type="radio" name={name} value={o} required className="sr-only" />
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
          <h3 ref={thanksRef} tabIndex={-1} className="type-statement mt-4 outline-none">
            Thank you{name ? `, ${name}` : ""}.
          </h3>
          <p className="mt-3 max-w-md leading-relaxed text-ink-muted">
            We&apos;ve got your note and will get back to you by email. Expressing interest doesn&apos;t
            commit you to anything.
          </p>
          <button
            type="button"
            onClick={() => setStatus("idle")}
            className={`mt-6 text-[15px] ${linkClass}`}
          >
            Send another response
          </button>
        </motion.div>
      ) : (
        <motion.form
          key="form"
          onSubmit={onSubmit}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.2, ease: EASE_EXIT }}
          className="space-y-6"
        >
          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label htmlFor="name" className={label}>Your name</label>
              <input id="name" name="name" required autoComplete="name" className={field} />
            </div>
            <div>
              <label htmlFor="email" className={label}>Email</label>
              <input id="email" name="email" type="email" required autoComplete="email" className={field} />
            </div>
          </div>

          <Choices name="role" legend="I am a…" options={ROLES} />

          <div>
            <label htmlFor="org" className={label}>
              Organisation <span className="font-normal text-ink-muted">(optional)</span>
            </label>
            <input id="org" name="organisation" autoComplete="organization" className={field} />
          </div>

          <Choices name="interest" legend="What interests you?" options={INTERESTS} />
          <Choices name="source" legend="How did you hear about us?" options={SOURCES} />

          <div>
            <label htmlFor="feedback" className={label}>
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
            <input type="checkbox" name="consent" value="yes" required className="mt-1 h-5 w-5 shrink-0 rounded-md accent-ink" />
            <span>You may contact me by email about this research. I can ask you to delete my details at any time.</span>
          </label>

          <div className="flex flex-wrap items-center gap-4">
            <button
              type="submit"
              disabled={status === "sending"}
              className={`${buttonClass()} disabled:cursor-wait disabled:opacity-70`}
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
              <motion.p
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, ease: EASE }}
                className="soft-well flex items-start gap-3 px-5 py-3.5 text-[15px]"
              >
                <Dot tone="signal" className="mt-[0.5em]" />
                <span>
                  Something went wrong and your note wasn&apos;t sent. Please try again in a moment
                  {CONTACT.email ? (
                    <>
                      , or write to{" "}
                      <a href={`mailto:${CONTACT.email}`} className={linkClass}>{CONTACT.email}</a>
                    </>
                  ) : null}
                  .
                </span>
              </motion.p>
            )}
          </div>
        </motion.form>
      )}
    </AnimatePresence>
  );
}
