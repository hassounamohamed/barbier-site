import type { Locale } from "@/lib/i18n";

export const homeHref = (l: Locale) => (l === "fr" ? "/" : `/${l}`);
export const reserverHref = (l: Locale) => (l === "fr" ? "/reserver" : `/${l}/reserver`);