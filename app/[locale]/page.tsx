import { notFound } from "next/navigation";
import type { Metadata } from "next";
import HomePage from "@/components/HomePage";
import { isLocale, locales, type Locale } from "@/lib/i18n";

export function generateStaticParams() {
  return locales.filter((locale) => locale !== "fr").map((locale) => ({ locale }));
}

export default async function LocalizedHome({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale) || locale === "fr") notFound();
  return <HomePage locale={locale as Locale} />;
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const titles = { ar: "حلاق حبيب الكربي — حلاق في بنبلة", en: "Habib Korbi — Barber in Bembla" };
  const descriptions = { ar: "قصات ولحى وحلاقة كلاسيكية في بنبلة. احجز عبر الهاتف أو واتساب.", en: "Cuts, fades, beards and classic shaves in Bembla. Book by phone or WhatsApp." };
  if (locale !== "ar" && locale !== "en") return {};
  return { title: titles[locale], description: descriptions[locale], alternates: { canonical: `/${locale}`, languages: { fr: "/", ar: "/ar", en: "/en" } }, openGraph: { title: titles[locale], description: descriptions[locale], locale } };
}