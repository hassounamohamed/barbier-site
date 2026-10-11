import type { MetadataRoute } from "next";

const base = "https://barberhkk.vercel.app";

const LAST_MODIFIED = new Date("2026-10-11");

const pages = [
  { fr: "/", ar: "/ar", en: "/en", priority: 1 },
  { fr: "/reserver", ar: "/ar/reserver", en: "/en/reserver", priority: 0.8 },
];

export default function sitemap(): MetadataRoute.Sitemap {
  return pages.flatMap((p) => {
    const languages = {
      fr: `${base}${p.fr}`,
      ar: `${base}${p.ar}`,
      en: `${base}${p.en}`,
    };
    return (["fr", "ar", "en"] as const).map((lang) => ({
      url: languages[lang],
      lastModified: LAST_MODIFIED,
      changeFrequency: "monthly" as const,
      priority: lang === "fr" ? p.priority : p.priority - 0.1,
      alternates: { languages },
    }));
  });
}