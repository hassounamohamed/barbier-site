"use client";

import { useEffect } from "react";

export default function LocaleDocument() {
  useEffect(() => {
    const locale = location.pathname.split("/")[1];
    const isArabic = locale === "ar";
    document.documentElement.lang = locale === "en" ? "en" : isArabic ? "ar" : "fr";
    document.documentElement.dir = isArabic ? "rtl" : "ltr";
  }, []);
  return null;
}
