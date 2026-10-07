"use client";

import { useEffect } from "react";
import type { Locale } from "@/lib/i18n";

export default function LocaleDocument({ locale }: { locale: Locale }) {
  useEffect(() => {
    const isArabic = locale === "ar";
    document.documentElement.lang = locale === "en" ? "en" : isArabic ? "ar" : "fr";
    document.documentElement.dir = isArabic ? "rtl" : "ltr";
  }, [locale]);
  return null;
}
