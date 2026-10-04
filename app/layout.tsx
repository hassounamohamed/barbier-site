import type { Metadata, Viewport } from "next";
import Script from "next/script";
import { Playfair_Display, Inter, Cairo } from "next/font/google";
import "./globals.css";
import Loader from "@/components/Loader";
import BarberPole from "@/components/BarberPole";
import { config } from "@/lib/config";
import LocaleDocument from "@/components/LocaleDocument";

const playfair = Playfair_Display({ subsets: ["latin"], weight: ["700", "900"], variable: "--font-playfair" });
const inter = Inter({ subsets: ["latin"], weight: ["400", "600", "800"], variable: "--font-inter" });
const cairo = Cairo({ subsets: ["arabic"], weight: ["400", "600", "700", "800"], variable: "--font-cairo", display: "swap" });

export const metadata: Metadata = {
  title: `${config.name} — Barbier à ${config.city}`,
  description: `Coupe, dégradé, barbe et rasage à ${config.city}. Réservez par téléphone ou WhatsApp.`,
  icons: { icon: [{ url: "/icon.svg", type: "image/svg+xml" }] },
};
export const viewport: Viewport = { viewportFit: "cover", themeColor: "#0e1628" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <head>
        <Script id="theme-init" strategy="beforeInteractive">
          {`try{var t=localStorage.getItem('barbier-theme');if(t==='light'||t==='dark')document.documentElement.dataset.theme=t}catch(e){}`}
        </Script>
      </head>
      <body className={`${playfair.variable} ${inter.variable} ${cairo.variable}`}>
        <LocaleDocument />
        <Loader />
        <BarberPole />
        {children}
      </body>
    </html>
  );
}