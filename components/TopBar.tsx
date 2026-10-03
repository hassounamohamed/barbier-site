"use client";

import Link from "next/link";
import { useState } from "react";
import Icon from "./Icon";
import type { Locale, Messages } from "@/lib/i18n";

export default function TopBar({ locale, messages }: { locale: Locale; messages: Messages }) {
  const [languageOpen, setLanguageOpen] = useState(false);
  const [theme, setTheme] = useState<"light" | "dark" | "system">(() => {
    if (typeof document === "undefined") return "system";
    return (document.documentElement.dataset.theme as "light" | "dark" | "system" | undefined) || "system";
  });
  const cycle = () => {
    const next = theme === "light" ? "dark" : theme === "dark" ? "system" : "light";
    setTheme(next);
    document.documentElement.classList.add("theme-transition");
    try { localStorage.setItem("barbier-theme", next); } catch {}
    document.documentElement.dataset.theme = next === "system" ? "" : next;
    document.querySelector('meta[name="theme-color"]')?.setAttribute("content", next === "light" ? "#f6ecd6" : "#0e1628");
    window.setTimeout(() => document.documentElement.classList.remove("theme-transition"), 360);
  };
  return (
    <nav className="topbar" aria-label="Site navigation">
      <div className="language-menu">
        <button
          className="language-trigger"
          type="button"
          aria-label={messages.labels.language}
          aria-expanded={languageOpen}
          title={messages.labels.language}
          onClick={() => setLanguageOpen((open) => !open)}
        >
          <Icon name="globe" size={21} />
        </button>
        {languageOpen && (
          <div className="language-list" role="menu" aria-label={messages.labels.language}>
            {(["fr", "ar", "en"] as Locale[]).map((item) => (
              <Link key={item} href={item === "fr" ? "/" : `/${item}`} className={item === locale ? "active" : ""} role="menuitem" onClick={() => setLanguageOpen(false)}>{item.toUpperCase()}</Link>
            ))}
          </div>
        )}
      </div>
      <button className="theme-toggle" type="button" onClick={cycle} aria-label={messages.labels.theme} title={messages.labels.theme}>
        <Icon name={theme === "dark" ? "moon" : "sun"} size={20} />
      </button>
    </nav>
  );
}
