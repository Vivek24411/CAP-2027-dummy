import type { Metadata } from "next";
import { Inter, Instrument_Serif, Saira_Condensed } from "next/font/google";
import { PageBackdrop } from "@/components/background/PageBackdrop";
import { SmoothScroll } from "@/components/motion/SmoothScroll";
import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";
import { siteConfig } from "@/lib/site";
import "./globals.css";

// Each font maps to a Tailwind class through globals.css: font-sans, font-serif, font-condensed.
const inter = Inter({ variable: "--font-inter", subsets: ["latin"] });

const instrumentSerif = Instrument_Serif({
  variable: "--font-instrument-serif",
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
});

const sairaCondensed = Saira_Condensed({
  variable: "--font-saira-condensed",
  subsets: ["latin"],
  weight: "700",
});

const fontVariables = [inter, instrumentSerif, sairaCondensed]
  .map((font) => font.variable)
  .join(" ");

export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s | ${siteConfig.shortName}`,
  },
  description: siteConfig.description,
};

// Runs before first paint: marks the page as JS-enabled so hidden reveal states only
// ever apply when scripts can undo them. Safety net: if the app hasn't started within
// 6s (a script failed or is stuck), the class comes off and everything shows.
const jsFlag = `(function(d){d.classList.add('js');setTimeout(function(){if(!d.dataset.motion)d.classList.remove('js')},6000)})(document.documentElement)`;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${fontVariables} h-full antialiased`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: jsFlag }} />
      </head>
      <body className="flex min-h-full flex-col">
        <PageBackdrop />
        <SmoothScroll />
        <Navbar />
        <main className="flex-1 overflow-x-clip">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
