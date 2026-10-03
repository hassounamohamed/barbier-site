import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://barbier.example";
  return ["", "/ar", "/en"].map((path) => ({ url: `${base}${path}`, lastModified: new Date(), alternates: { languages: { fr: `${base}/`, ar: `${base}/ar`, en: `${base}/en` } } }));
}