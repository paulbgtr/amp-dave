"use client";

import { useState, type SubmitEvent } from "react";
import { AnimatePresence, motion } from "motion/react";
import { CONTACT } from "@/lib/contact";

const ROLES = ["Parent or guardian", "Carer or therapist", "Researcher", "Organisation", "Other"];

const field =
  "mt-1.5 block w-full rounded-md border border-line bg-surface px-3.5 py-2.5 text-ink placeholder:text-ink-muted/70 focus:border-ink focus:outline-none focus:ring-2 focus:ring-ink/15";

export function InterestForm() {
  const [sent, setSent] = useState(false);

  function onSubmit(e: SubmitEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const name = String(data.get("name") ?? "");
    const role = String(data.get("role") ?? "");
    const org = String(data.get("org") ?? "");
    const message = String(data.get("message") ?? "");

    const subject = `Interest in HRI Lab research — ${role}`;
    const header = [`Name: ${name}`, `I am a: ${role}`];
    if (org) header.push(`Organisation: ${org}`);
    const body = `${header.join("\n")}\n\n${message}`;

    window.location.href = `mailto:${CONTACT.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    setSent(true);
  }

  return (
    <form onSubmit={onSubmit} className="space-y-5">
      <div>
        <label htmlFor="name" className="font-medium">Your name</label>
        <input id="name" name="name" required autoComplete="name" className={field} />
      </div>

      <fieldset>
        <legend className="font-medium">I am a…</legend>
        <div className="mt-2 flex flex-wrap gap-2">
          {ROLES.map((r, i) => (
            <label
              key={r}
              className="inline-flex min-h-11 cursor-pointer items-center gap-2 rounded-full border border-line bg-surface px-4 py-2 has-checked:border-ink has-checked:bg-panel has-focus-visible:ring-2 has-focus-visible:ring-signal"
            >
              <input type="radio" name="role" value={r} required defaultChecked={i === 0} className="accent-ink" />
              {r}
            </label>
          ))}
        </div>
      </fieldset>

      <div>
        <label htmlFor="org" className="font-medium">
          Organisation <span className="font-normal text-ink-muted">(optional)</span>
        </label>
        <input id="org" name="org" autoComplete="organization" className={field} />
      </div>

      <div>
        <label htmlFor="message" className="font-medium">How would you like to be involved?</label>
        <textarea
          id="message"
          name="message"
          rows={4}
          className={field}
          placeholder="For example: I care for my son and would like to hear about a future pilot."
        />
      </div>

      <button
        type="submit"
        className="inline-flex min-h-11 items-center justify-center rounded-full bg-ink px-6 py-2.5 font-medium text-canvas transition-colors hover:bg-graphite"
      >
        Send via email
      </button>

      <div aria-live="polite" className="text-[15px] text-ink-muted">
        <AnimatePresence mode="wait" initial={false}>
          <motion.p
            key={sent ? "sent" : "idle"}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.3 }}
            className={sent ? "rounded-md bg-panel px-4 py-3 text-ink" : undefined}
          >
            {sent
              ? `Your email app should open with the message ready. If it didn't, write to ${CONTACT.email}.`
              : "This opens your email app with the message filled in. Nothing is stored on this website."}
          </motion.p>
        </AnimatePresence>
      </div>
    </form>
  );
}
