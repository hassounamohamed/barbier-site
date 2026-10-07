import TopBar from "../TopBar";
import LocaleDocument from "../LocaleDocument";
import BookingFlow from "./BookingFlow";
import { config } from "@/lib/config";
import { DURATIONS } from "@/lib/booking";
import { getMessages, type Locale } from "@/lib/i18n";

export default function BookingPage({ locale }: { locale: Locale }) {
  const messages = getMessages(locale);
  const items = messages.services.items as unknown as Record<string, { title: string; desc: string }>;

  // On affiche seulement les services qui ont une durée dans DURATIONS (lib/booking.ts)
  const services = config.services
    .filter((s) => s.id in DURATIONS && items[s.id])
    .map((s) => ({ id: s.id, icon: s.icon as string, title: items[s.id].title, desc: items[s.id].desc }));

  return (
    <>
      <LocaleDocument locale={locale} />
      <TopBar locale={locale} messages={messages} />
      <main>
        <BookingFlow locale={locale} t={messages.booking} services={services} />
      </main>
    </>
  );
}