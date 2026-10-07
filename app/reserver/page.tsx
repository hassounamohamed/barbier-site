import type { Metadata } from "next";
import BookingPage from "@/components/booking/BookingPage";
import { config } from "@/lib/config";

export const metadata: Metadata = {
  title: `Réserver | ${config.name}`,
  description: "Réserve ton créneau en ligne, confirmation immédiate.",
  alternates: { canonical: "/reserver", languages: { fr: "/reserver", ar: "/ar/reserver", en: "/en/reserver" } },
};

export default function ReserverPage() {
  return <BookingPage locale="fr" />;
}