import Link from "next/link";
import { NAV } from "@/lib/site";

export function SiteFooter() {
  return (
    <footer className="mt-24 border-t border-line/60">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 text-sm text-ink-muted sm:px-6 md:grid-cols-3">
        <div>
          <p className="text-base font-medium tracking-[-0.01em] text-ink">Human–Robot Interaction Lab</p>
          <p className="mt-1">TalTech Virumaa College, Kohtla-Järve, Ida-Virumaa</p>
        </div>
        <nav aria-label="Footer">
          <ul className="grid grid-cols-2 gap-2">
            {NAV.map((item) => (
              <li key={item.href}>
                <Link className="transition-colors duration-200 ease-calm hover:text-ink" href={item.href}>
                  {item.label}
                </Link>
              </li>
            ))}
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
