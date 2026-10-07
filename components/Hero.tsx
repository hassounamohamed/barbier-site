import Link from "next/link";
import { config } from "@/lib/config";
import { reserverHref } from "@/lib/routes";
import HoursBadge from "./HoursBadge";
import type { Locale, Messages } from "@/lib/i18n";

export default function Hero({ locale, messages }: { locale: Locale; messages: Messages }) {
  return (
    <header className="hero">
      <span className="eyebrow">{messages.hero.eyebrow.replace("{city}", config.city).replace("{since}", String(config.since))}</span>
      <h1>
        <span><i>{config.name}</i></span>
        <span><i>{config.barber}</i></span>
      </h1>
      <p className="lead">
        {messages.hero.lead}
      </p>
      <div className="btns">
        <Link className="btn p" href={reserverHref(locale)}>{messages.hero.book}</Link>
        <a className="btn s" href="#infos">{messages.hero.details}</a>
      </div>
      <HoursBadge messages={messages} />

      <svg className="sc" viewBox="0 0 100 100" aria-hidden="true">
        <g className="b1">
          <path d="M50 50 L94 8 L97 13 L57 57Z" fill="#e6ecf7" />
          <path d="M50 50 L34 72" stroke="#c0283b" strokeWidth="6" strokeLinecap="round" />
          <circle cx="28" cy="80" r="11" fill="none" stroke="#c0283b" strokeWidth="6" />
        </g>
        <g className="b2">
          <path d="M50 50 L6 8 L3 13 L43 57Z" fill="#cfd8ea" />
          <path d="M50 50 L66 72" stroke="#c0283b" strokeWidth="6" strokeLinecap="round" />
          <circle cx="72" cy="80" r="11" fill="none" stroke="#c0283b" strokeWidth="6" />
        </g>
      </svg>
    </header>
  );
}