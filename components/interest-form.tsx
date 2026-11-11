"use client";

import { useState, type FormEvent } from "react";
import { CONTACT } from "@/lib/contact";

const ROLES = ["Parent or guardian", "Carer or therapist", "Researcher", "Organisation", "Other"];

const field =
  "mt-1.5 block w-full rounded-lg border border-line bg-white px-3.5 py-2.5 text-ink placeholder:text-ink-muted/70 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30";

export function InterestForm() {
  const [sent, setSent] = useState(false);

  function onSubmit(e: FormEvent<HTMLFormElement>) {
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
              className="inline-flex min-h-11 cursor-pointer items-center gap-2 rounded-full border border-line bg-white px-4 py-2 has-[:checked]:border-primary has-[:checked]:bg-mint has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-primary"
            >
              <input type="radio" name="role" value={r} required defaultChecked={i === 0} className="accent-[var(--primary)]" />
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
        className="inline-flex min-h-11 items-center justify-center rounded-lg bg-primary px-6 py-2.5 font-semibold text-primary-ink transition-colors hover:bg-primary-strong"
      >
        Send via email
      </button>

      <p className="text-[15px] text-ink-muted" aria-live="polite">
        {sent
          ? `Your email app should open with the message ready. If it didn't, write to ${CONTACT.email}.`
          : "This opens your email app with the message filled in. Nothing is stored on this website."}
      </p>
    </form>
  );
}
