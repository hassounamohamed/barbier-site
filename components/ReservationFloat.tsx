import Link from "next/link";
import { CalendarPlus } from "lucide-react";
import { reserverHref } from "@/lib/routes";
import type { Locale, Messages } from "@/lib/i18n";

export default function ReservationFloat({ locale, messages }: { locale: Locale; messages: Messages }) {
  return (
    <Link className="reserve-float" href={reserverHref(locale)} aria-label={messages.hero.book} title={messages.hero.book}>
      <CalendarPlus size={26} aria-hidden="true" />
    </Link>
  );
}