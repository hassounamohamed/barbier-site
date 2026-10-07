"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState, useSyncExternalStore } from "react";
import { ArrowLeft, ArrowRight, CalendarPlus, Check, ChevronLeft, ChevronRight, Clock, Loader2, Phone, User } from "lucide-react";
import Icon from "../Icon";
import { config } from "@/lib/config";
import { BOOKING, DURATIONS } from "@/lib/booking";
import { nowInTunis, toHHMM, toMin } from "@/lib/slots";
import { homeHref } from "@/lib/routes";
import type { Locale, Messages } from "@/lib/i18n";

type T = Messages["booking"];
type IconName = React.ComponentProps<typeof Icon>["name"];
export type BookingService = { id: string; icon: string; title: string; desc: string };
type Done = { token: string; date: string; time: string; service: string };

const noopSub = () => () => {};
const getToday = () => nowInTunis().date; // date du jour en Tunisie (calculée côté client)

const addDays = (d: string, n: number) => {
  const x = new Date(`${d}T00:00:00Z`);
  x.setUTCDate(x.getUTCDate() + n);
  return x.toISOString().slice(0, 10);
};
const dow = (d: string) => new Date(`${d}T00:00:00Z`).getUTCDay();
const fmt = (d: string, l: Locale, o: Intl.DateTimeFormatOptions) =>
  new Intl.DateTimeFormat(l === "ar" ? "ar-u-nu-latn" : l, { ...o, timeZone: "UTC" }).format(new Date(`${d}T00:00:00Z`));
const normPhone = (s: string) => s.replace(/[\s.-]/g, "").replace(/^(\+216|00216)/, "");
const sv = (i: number) => ({ "--i": i }) as React.CSSProperties;

const CONFETTI = Array.from({ length: 16 }, (_, i) => ({
  x: `${(i * 6.2 + 3) % 100}%`,
  d: `${(i % 6) * 0.08}s`,
  r: `${(i % 2 ? 1 : -1) * (240 + i * 20)}deg`,
  c: ["#c0283b", "#1f4478", "#f6ecd6", "#ffffff"][i % 4],
}));

function downloadIcs(d: Done, title: string) {
  const ymd = d.date.replace(/-/g, "");
  const hm = (t: string) => `${t.replace(":", "")}00`;
  const end = toHHMM(toMin(d.time) + (DURATIONS[d.service] ?? 45));
  const esc = (s: string) => s.replace(/[,;\\]/g, "\\$&");
  const lines = [
    "BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//Barbier//FR", "BEGIN:VEVENT",
    `UID:${d.token}@barbier`,
    `DTSTAMP:${new Date().toISOString().replace(/[-:]/g, "").slice(0, 15)}Z`,
    `DTSTART;TZID=Africa/Tunis:${ymd}T${hm(d.time)}`,
    `DTEND;TZID=Africa/Tunis:${ymd}T${hm(end)}`,
    `SUMMARY:${esc(`${config.name} - ${title}`)}`,
    `LOCATION:${esc(config.address)}`,
    "BEGIN:VALARM", "TRIGGER:-PT60M", "ACTION:DISPLAY", "DESCRIPTION:Rappel", "END:VALARM",
    "END:VEVENT", "END:VCALENDAR",
  ];
  const url = URL.createObjectURL(new Blob([lines.join("\r\n")], { type: "text/calendar;charset=utf-8" }));
  const a = document.createElement("a");
  a.href = url;
  a.download = "rendez-vous.ics";
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

function Ticket({ t, locale, service, date, time }: { t: T; locale: Locale; service: string; date: string; time: string }) {
  return (
    <div className="bk-ticket">
      <div><small>{t.ticket.service}</small><b>{service}</b></div>
      <div><small>{t.ticket.day}</small><b>{fmt(date, locale, { weekday: "long", day: "numeric", month: "long" })}</b></div>
      <div><small>{t.ticket.time}</small><b>{time}</b></div>
    </div>
  );
}

export default function BookingFlow({ locale, t, services }: { locale: Locale; t: T; services: BookingService[] }) {
  const [step, setStep] = useState(0);
  const [dirn, setDirn] = useState<1 | -1>(1);
  const [service, setService] = useState<string | null>(null);
  const [date, setDate] = useState<string | null>(null);
  const [time, setTime] = useState<string | null>(null);
  const [slots, setSlots] = useState<string[] | null>(null);
  const [slotsErr, setSlotsErr] = useState(false);
  const [reload, setReload] = useState(0);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [hp, setHp] = useState(""); // honeypot anti-bot
  const [touched, setTouched] = useState({ name: false, phone: false });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState<Done | null>(null);
  const topRef = useRef<HTMLDivElement>(null);
  const daysRef = useRef<HTMLDivElement>(null);

  const today = useSyncExternalStore(noopSub, getToday, () => "");
  const days = useMemo(
    () => (today ? Array.from({ length: BOOKING.maxDaysAhead + 1 }, (_, i) => addDays(today, i)) : []),
    [today]
  );

  const svc = services.find((s) => s.id === service);
  const nameOk = name.trim().length >= 2;
  const phoneOk = /^[2-579]\d{7}$/.test(normPhone(phone));
  const canNext = (step === 0 && !!service) || (step === 1 && !!date) || (step === 2 && !!time);

  // Charger les créneaux libres quand on arrive à l'étape "Heure"
  useEffect(() => {
    if (step !== 2 || !service || !date) return;
    const ac = new AbortController();
    fetch(`/api/slots?date=${date}&service=${service}`, { signal: ac.signal, cache: "no-store" })
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then((j) => setSlots(j.slots))
      .catch((e) => { if (e?.name !== "AbortError") setSlotsErr(true); });
    return () => ac.abort();
  }, [step, service, date, reload]);

  const go = (n: number) => {
    setDirn(n > step ? 1 : -1);
    if (n === 2) { setSlots(null); setSlotsErr(false); }
    setError(null);
    setStep(n);
    topRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const pickService = (id: string) => {
    if (id !== service) { setService(id); setTime(null); }
    setTimeout(() => go(1), 220);
  };
  const pickDate = (d: string) => {
    if (d !== date) { setDate(d); setTime(null); }
    setTimeout(() => go(2), 220);
  };
  const pickTime = (s: string) => { setTime(s); setTimeout(() => go(3), 220); };
  const retry = () => { setSlots(null); setSlotsErr(false); setReload((k) => k + 1); };
  const scrollDays = (s: 1 | -1) =>
    daysRef.current?.scrollBy({ left: s * (locale === "ar" ? -1 : 1) * 240, behavior: "smooth" });

  const submit = async () => {
    if (!service || !date || !time || submitting) return;
    setSubmitting(true);
    setError(null);
    try {
      const r = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ service, date, time, name: name.trim(), phone: normPhone(phone), website: hp }),
      });
      const j = await r.json().catch(() => ({}));
      if (r.status === 201 && j.token) {
        setDone({ token: j.token, date, time, service });
        topRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
        return;
      }
      if (r.status === 409) { setTime(null); go(2); setError(t.errors.taken); return; }
      setError(r.status === 429 ? t.errors.tooMany : r.status === 400 ? t.errors.invalid : t.errors.generic);
    } catch {
      setError(t.errors.generic);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bk" dir={locale === "ar" ? "rtl" : "ltr"}>
      <header className="bk-hero">
        <Link href={homeHref(locale)} className="bk-back">
          <ArrowLeft className="flip" size={18} aria-hidden /> {t.home}
        </Link>
        <span className="eyebrow">{config.name}</span>
        <h1>{t.title}</h1>
        <p>{t.subtitle}</p>
      </header>

      <div className="bk-wrap" ref={topRef}>
        {!done ? (
          <>
            <ol className="bk-steps" aria-label="Progression">
              <span className="bk-fill" style={{ width: `calc((100% - 40px) * ${step / 3})` }} />
              {t.steps.map((label, i) => (
                <li key={label}>
                  <button
                    type="button"
                    className={`bk-step ${i === step ? "on" : ""} ${i < step ? "done" : ""}`}
                    disabled={i >= step}
                    onClick={() => go(i)}
                    aria-current={i === step ? "step" : undefined}
                  >
                    <i>{i < step ? <Check size={18} aria-hidden /> : i + 1}</i>
                    <span>{label}</span>
                  </button>
                </li>
              ))}
            </ol>

            <div className="bk-card">
              {error && <p className="bk-err" role="alert">{error}</p>}

              <div key={step} className={`bk-pane ${dirn > 0 ? "fwd" : "back"}`}>
                {step === 0 && (
                  <>
                    <h2 className="bk-h">{t.pickService}</h2>
                    <div className="bk-svcs">
                      {services.map((s, i) => (
                        <button key={s.id} type="button" className={`bk-svc ${service === s.id ? "on" : ""}`} style={sv(i)} aria-pressed={service === s.id} onClick={() => pickService(s.id)}>
                          <span className="bk-ic"><Icon name={s.icon as IconName} size={28} /></span>
                          <span className="bk-st"><b>{s.title}</b><small>{s.desc}</small></span>
                          <span className="bk-dur"><Clock size={14} aria-hidden /> {DURATIONS[s.id]} {t.min}</span>
                          <span className="bk-tick"><Check size={16} aria-hidden /></span>
                        </button>
                      ))}
                    </div>
                  </>
                )}

                {step === 1 && (
                  <>
                    <h2 className="bk-h">{t.pickDate}</h2>
                    <div className="bk-daywrap">
                      <button type="button" className="bk-arr" onClick={() => scrollDays(-1)} aria-label="←"><ChevronLeft className="flip" size={20} /></button>
                      <div className="bk-days" ref={daysRef}>
                        {days.map((d, i) => {
                          const closed = config.hours[dow(d)] === null;
                          return (
                            <button key={d} type="button" disabled={closed} style={sv(i)} className={`bk-day ${date === d ? "on" : ""} ${closed ? "off" : ""}`} aria-pressed={date === d} onClick={() => pickDate(d)}>
                              <small>{i === 0 ? t.today : i === 1 ? t.tomorrow : fmt(d, locale, { weekday: "short" })}</small>
                              <b>{fmt(d, locale, { day: "numeric" })}</b>
                              <small>{closed ? t.closed : fmt(d, locale, { month: "short" })}</small>
                            </button>
                          );
                        })}
                      </div>
                      <button type="button" className="bk-arr" onClick={() => scrollDays(1)} aria-label="→"><ChevronRight className="flip" size={20} /></button>
                    </div>
                  </>
                )}

                {step === 2 && date && (
                  <>
                    <h2 className="bk-h">{t.pickTime}</h2>
                    <p className="bk-sub">{fmt(date, locale, { weekday: "long", day: "numeric", month: "long" })} · {svc?.title}</p>
                    {!slots && !slotsErr && (
                      <div className="bk-slots" aria-busy="true">{Array.from({ length: 8 }, (_, i) => <span key={i} className="bk-sk" />)}</div>
                    )}
                    {slotsErr && (
                      <div className="bk-empty"><p>{t.slotsError}</p><button type="button" className="btn s" onClick={retry}>{t.retry}</button></div>
                    )}
                    {slots && slots.length === 0 && (
                      <div className="bk-empty"><p>{t.noSlots}</p><button type="button" className="btn s" onClick={() => go(1)}>{t.changeDay}</button></div>
                    )}
                    {slots && slots.length > 0 && (
                      <div className="bk-slots">
                        {slots.map((s, i) => (
                          <button key={s} type="button" style={sv(i)} className={`bk-slot ${time === s ? "on" : ""}`} aria-pressed={time === s} onClick={() => pickTime(s)}>{s}</button>
                        ))}
                      </div>
                    )}
                  </>
                )}

                {step === 3 && svc && date && time && (
                  <>
                    <h2 className="bk-h">{t.yourInfo}</h2>
                    <Ticket t={t} locale={locale} service={svc.title} date={date} time={time} />

                    <label className={`bk-f ${touched.name && !nameOk ? "bad" : ""}`}>
                      <span>{t.name}</span>
                      <div>
                        <User size={18} aria-hidden />
                        <input value={name} maxLength={60} autoComplete="name" placeholder={t.namePh} onChange={(e) => setName(e.target.value)} onBlur={() => setTouched((x) => ({ ...x, name: true }))} />
                      </div>
                      {touched.name && !nameOk && <small>{t.nameInvalid}</small>}
                    </label>

                    <label className={`bk-f ${touched.phone && !phoneOk ? "bad" : ""}`}>
                      <span>{t.phone}</span>
                      <div>
                        <Phone size={18} aria-hidden />
                        <em>+216</em>
                        <input dir="ltr" inputMode="tel" autoComplete="tel-national" maxLength={14} placeholder="20 123 456" value={phone} onChange={(e) => setPhone(e.target.value)} onBlur={() => setTouched((x) => ({ ...x, phone: true }))} />
                      </div>
                      {touched.phone && !phoneOk && <small>{t.phoneInvalid}</small>}
                    </label>

                    <input className="bk-hp" name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" value={hp} onChange={(e) => setHp(e.target.value)} />
                  </>
                )}
              </div>

              <div className="bk-nav">
                {step > 0 ? (
                  <button type="button" className="btn s" onClick={() => go(step - 1)}><ArrowLeft className="flip" size={18} aria-hidden />{t.back}</button>
                ) : <span />}
                {step < 3 ? (
                  <button type="button" className="btn p" disabled={!canNext} onClick={() => go(step + 1)}>{t.next}<ArrowRight className="flip" size={18} aria-hidden /></button>
                ) : (
                  <button type="button" className="btn p" disabled={!nameOk || !phoneOk || submitting} onClick={submit}>
                    {submitting ? <Loader2 className="spin" size={18} aria-hidden /> : <Check size={18} aria-hidden />}
                    {submitting ? t.confirming : t.confirm}
                  </button>
                )}
              </div>
            </div>
          </>
        ) : (
          <div className="bk-card bk-ok">
            {CONFETTI.map((c, i) => (
              <span key={i} className="bk-cf" style={{ "--x": c.x, "--d": c.d, "--r": c.r, "--c": c.c } as React.CSSProperties} />
            ))}
            <svg className="bk-check" viewBox="0 0 52 52" aria-hidden="true">
              <circle cx="26" cy="26" r="24" />
              <path d="M14 27l8 8 16-17" />
            </svg>
            <h2 className="bk-h">{t.success.title}</h2>
            <p className="bk-sub">{t.success.text}</p>
            <Ticket t={t} locale={locale} service={svc?.title ?? done.service} date={done.date} time={done.time} />
            <div className="btns">
              <button type="button" className="btn p" onClick={() => downloadIcs(done, svc?.title ?? done.service)}>
                <CalendarPlus size={18} aria-hidden /> {t.success.addCal}
              </button>
              <Link className="btn s" href={homeHref(locale)}>{t.home}</Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}