import type { Metadata } from "next";
import { DM_Mono, Instrument_Sans, Instrument_Serif } from "next/font/google";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { MotionProvider } from "@/components/motion";
import { SITE_URL } from "@/lib/site";
import "./globals.css";

const sans = Instrument_Sans({ variable: "--font-sans-face", subsets: ["latin"] });
const mono = DM_Mono({ variable: "--font-mono-face", subsets: ["latin"], weight: ["400", "500"] });
const serif = Instrument_Serif({ variable: "--font-serif-face", subsets: ["latin"], weight: "400", style: ["normal", "italic"] });

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
      className={`${sans.variable} ${mono.variable} ${serif.variable} h-full antialiased`}
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
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-ink focus:px-4 focus:py-2 focus:text-canvas"
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
