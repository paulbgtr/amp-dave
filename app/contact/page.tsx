import type { Metadata } from "next";
import { Card, CheckList, PageIntro } from "@/components/ui";
import { InterestForm } from "@/components/interest-form";
import { CheckIcon, LockIcon, MailIcon, PinIcon } from "@/components/icons";
import { CONTACT } from "@/lib/site";

export const metadata: Metadata = { title: "Contact" };

export default function ContactPage() {
  return (
    <>
      <PageIntro eyebrow="Contact" title="Let's talk.">
        <p>
          Interested in the lab, in collaborating, or in taking part in a future study? Send us
          a note — there&apos;s no commitment.
        </p>
      </PageIntro>

      <div className="mx-auto grid max-w-6xl gap-6 px-4 sm:px-6 md:grid-cols-12">
        <section id="interest" aria-labelledby="interest-title" className="scroll-mt-24 md:col-span-7">
          <Card className="p-6 sm:p-8">
            <h2 id="interest-title" className="font-display text-2xl font-medium tracking-tight">
              Express interest
            </h2>
            <p className="mt-2 mb-6 text-ink-muted">For carers, families, researchers and organisations.</p>
            <InterestForm />
          </Card>
        </section>

        <aside className="space-y-6 md:col-span-5">
          <Card>
            <h2 className="font-display text-xl font-medium">Reach the lab</h2>
            <ul className="mt-4 space-y-4">
              {(CONTACT.email || CONTACT.phone) && (
                <li className="flex gap-3">
                  <MailIcon className="mt-0.5 shrink-0 text-ink" />
                  <span>
                    {CONTACT.email && (
                      <a href={`mailto:${CONTACT.email}`} className="block font-medium text-ink underline underline-offset-4">
                        {CONTACT.email}
                      </a>
                    )}
                    {CONTACT.phone && (
                      <a href={`tel:${CONTACT.phone.replace(/\s/g, "")}`} className="block text-ink-muted">
                        {CONTACT.phone}
                      </a>
                    )}
                  </span>
                </li>
              )}
              <li className="flex gap-3">
                <PinIcon className="mt-0.5 shrink-0 text-ink" />
                <address className="not-italic">
                  {CONTACT.address.map((line) => (
                    <span key={line} className="block">{line}</span>
                  ))}
                </address>
              </li>
            </ul>
          </Card>

          <CheckList
            items={[
              { icon: <LockIcon />, text: "We only use your details to reply to you" },
              { icon: <CheckIcon />, text: "Expressing interest doesn't sign you up for anything" },
            ]}
          />
        </aside>
      </div>
    </>
  );
}
