# HRI Lab — concept site

Concept website for the Human–Robot Interaction Lab at TalTech Virumaa College, by team **AMP Dave**.
It introduces the lab, its biometric equipment, and a research idea: using those sensors to help carers
understand people who can't speak. Visitors can express interest through a form.

## Run it

```bash
bun install
bun run dev      # http://localhost:3000
```

Production build (what gets deployed):

```bash
bun run build && bun run start
```

## Where things live

| What | File |
| --- | --- |
| Nav links, contact details, form endpoint, site URL | `lib/site.ts` |
| Colours, fonts, shared CSS utilities | `app/globals.css` |
| Pages | `app/page.tsx`, `app/lab`, `app/equipment`, `app/research`, `app/contact` |
| Shared building blocks (sections, cards, callouts, buttons) | `components/ui.tsx` |
| Animations | `components/motion.tsx` |
| Speech-bubble illustration and logo | `components/beyond-words.tsx` |
| Equipment line drawings | `components/device-drawings.tsx` |
| Interest form (posts to Formspree) | `components/interest-form.tsx` |
| Favicon, home-screen icon, share image | `app/icon.svg`, `app/apple-icon.tsx`, `app/opengraph-image.tsx` |

Contact email and phone are `null` in `lib/site.ts` and stay hidden on the site until real ones are added.

## Form submissions

The interest form sends to Formspree. Responses arrive in the team inbox and the Formspree dashboard.
The free plan keeps 30 days of history — export a CSV before it matters.

## Deploy

Every page is static, so any static host works. On Vercel: import the GitHub repo, keep the defaults, deploy.
The share image picks up the Vercel address automatically; for a custom domain set `NEXT_PUBLIC_SITE_URL`.
