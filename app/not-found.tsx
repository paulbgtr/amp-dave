import { ButtonLink, PageIntro } from "@/components/ui";

export default function NotFound() {
  return (
    <PageIntro eyebrow="404" title="This page doesn't exist.">
      <p>The link may be old or mistyped.</p>
      <div className="mt-8 flex flex-wrap gap-3">
        <ButtonLink href="/">Go to the home page</ButtonLink>
        <ButtonLink href="/contact" variant="outline">Contact us</ButtonLink>
      </div>
    </PageIntro>
  );
}
