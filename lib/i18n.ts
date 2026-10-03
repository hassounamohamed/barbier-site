import fr from "@/messages/fr.json";
import ar from "@/messages/ar.json";
import en from "@/messages/en.json";

export const locales = ["fr", "ar", "en"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "fr";
export const messages = { fr, ar, en } as const;
export function isLocale(value: string): value is Locale {
  return locales.includes(value as Locale);
}
export function getMessages(locale: Locale) {
  return messages[locale];
}
export type Messages = ReturnType<typeof getMessages>;
