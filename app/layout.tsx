import type { Metadata } from "next";
import { DM_Mono, DM_Sans } from "next/font/google";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { MotionProvider } from "@/components/motion";
import { SITE_URL } from "@/lib/site";
import "./globals.css";

// One superfamily: DM Sans for everything, its companion DM Mono for small labels.
const sans = DM_Sans({ variable: "--font-sans-face", subsets: ["latin"], axes: ["opsz"] });
const mono = DM_Mono({ variable: "--font-mono-face", subsets: ["latin"], weight: ["400", "500"] });

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Human–Robot Interaction Lab · TalTech Virumaa College",
    template: "%s · HRI Lab Virumaa",
  },
  description:
    "The Human–Robot Interaction Lab at TalTech Virumaa College in Ida-Virumaa: human factors research, biometric equipment, and an open invitation to collaborate.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${sans.variable} ${mono.variable} h-full antialiased`}
    >
      <head>
        {/* If JavaScript is off or fails, show everything that would otherwise animate in. */}
        <noscript>
          <style>{`[style*="opacity"]{opacity:1!important;transform:none!important;clip-path:none!important}`}</style>
        </noscript>
      </head>
      <body className="min-h-full flex flex-col">
        <MotionProvider>
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-full focus:bg-ink focus:px-4 focus:py-2 focus:text-canvas"
        >
          Skip to content
        </a>
        <SiteHeader />
        <main id="main" className="flex-1">
          {children}
        </main>
        <SiteFooter />
        </MotionProvider>
      </body>
    </html>
  );
}
