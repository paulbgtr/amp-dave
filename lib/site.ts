// Site-wide settings. Edit here; everything else reads from this file.

export const NAV = [
  { href: "/lab", label: "The lab" },
  { href: "/equipment", label: "Equipment" },
  { href: "/research", label: "Research example" },
  { href: "/contact", label: "Contact" },
] as const;

// Leave email/phone as null until there are real ones — they are hidden while null.
export const CONTACT: { email: string | null; phone: string | null; address: string[] } = {
  email: null,
  phone: null,
  address: ["TalTech Virumaa College", "Järveküla tee 75", "30322 Kohtla-Järve, Estonia"],
};

// Interest-form submissions go to the team's Formspree inbox (public by design).
export const FORMSPREE_ENDPOINT = "https://formspree.io/f/xoedqelk";

// Absolute URL used for share images. Vercel sets VERCEL_PROJECT_PRODUCTION_URL automatically;
// set NEXT_PUBLIC_SITE_URL to override (e.g. a custom domain).
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : "http://localhost:3000");
