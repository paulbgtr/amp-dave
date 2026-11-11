import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="mt-24 border-t border-line">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 text-sm text-ink-muted sm:px-6 md:grid-cols-3">
        <div>
          <p className="font-display text-base font-medium text-ink">Human–Robot Interaction Lab</p>
          <p className="mt-1">TalTech Virumaa College, Kohtla-Järve, Ida-Virumaa</p>
        </div>
        <nav aria-label="Footer">
          <ul className="grid grid-cols-2 gap-2">
            <li><Link className="hover:text-ink underline-offset-4 hover:underline" href="/lab">The lab</Link></li>
            <li><Link className="hover:text-ink underline-offset-4 hover:underline" href="/equipment">Equipment</Link></li>
            <li><Link className="hover:text-ink underline-offset-4 hover:underline" href="/research">Research example</Link></li>
            <li><Link className="hover:text-ink underline-offset-4 hover:underline" href="/contact">Contact</Link></li>
          </ul>
        </nav>
        <p className="md:text-right">
          Concept prototype by team <span className="font-medium text-ink">AMP Dave</span>.
          <br />
          Not an official TalTech website.
        </p>
      </div>
    </footer>
  );
}
