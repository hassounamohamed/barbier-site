import { notFound } from "next/navigation";
import type { Metadata } from "next";
import BookingPage from "../../../components/booking/BookingPage";
import { isLocale, locales } from "@/lib/i18n";
import { config } from "@/lib/config";

export function generateStaticParams() {
  return locales.filter((l) => l !== "fr").map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const title = locale === "ar" ? `احجز | ${config.name}` : `Book | ${config.name}`;
  return { title, alternates: { canonical: `/${locale}/reserver`, languages: { fr: "/reserver", ar: "/ar/reserver", en: "/en/reserver" } } };
}

export default async function LocalizedReserver({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale) || locale === "fr") notFound();
  return <BookingPage locale={locale} />;
}