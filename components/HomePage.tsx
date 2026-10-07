import Hero from "./Hero";
import Marquee from "./Marquee";
import About from "./About";
import Services from "./Services";
import Gallery from "./Gallery";
import Location from "./Location";
import Contact from "./Contact";
import TopBar from "./TopBar";
import ReservationFloat from "./ReservationFloat";
import { config } from "@/lib/config";
import { getMessages, type Locale } from "@/lib/i18n";

export default function HomePage({ locale }: { locale: Locale }) {
  const messages = getMessages(locale);
  const structuredData = {
    "@context": "https://schema.org", "@type": "LocalBusiness", name: config.name,
    telephone: config.phone, address: { "@type": "PostalAddress", addressLocality: config.city, streetAddress: config.address },
    url: "https://barbier.example", inLanguage: locale, sameAs: [config.instagram, config.facebook],
  };
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <TopBar locale={locale} messages={messages} />
      <main>
        <Hero locale={locale} messages={messages} />
        <Marquee messages={messages} />
        <About messages={messages} />
        <Services messages={messages} />
        <Gallery messages={messages} />
        <Location messages={messages} />
        <Contact messages={messages} />
        <footer>
          (c) {new Date().getFullYear()} {config.name} - {messages.footer} - {messages.developedBy}{" "}
          <a href="https://mohamedhassouna.vercel.app" target="_blank" rel="noreferrer">
            Mohamed Hassouna
          </a>
        </footer>
      </main>
      <ReservationFloat locale={locale} messages={messages} />
    </>
  );
}
