import { config } from "@/lib/config";
import { BOOKING } from "@/lib/booking";

export const toMin = (t: string) => {
  const [h, m] = t.split(":");
  return Number(h) * 60 + Number(m);
};
export const toHHMM = (m: number) =>
  `${String(Math.floor(m / 60)).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}`;

export function nowInTunis() {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Africa/Tunis", year: "numeric", month: "2-digit", day: "2-digit",
    hour: "2-digit", minute: "2-digit", hourCycle: "h23",
  }).formatToParts(new Date());
  const g = (t: string) => parts.find((p) => p.type === t)!.value;
  const date = `${g("year")}-${g("month")}-${g("day")}`;
  return {
    date,
    day: new Date(`${date}T00:00:00Z`).getUTCDay(),
    minutes: Number(g("hour")) * 60 + Number(g("minute")),
  };
}

export function subscribeToTunisDay(onChange: () => void) {
  let lastDay = nowInTunis().date;
  const timer = window.setInterval(() => {
    const day = nowInTunis().date;
    if (day !== lastDay) {
      lastDay = day;
      onChange();
    }
  }, 1000);

  return () => window.clearInterval(timer);
}

const addDays = (date: string, n: number) => {
  const d = new Date(`${date}T00:00:00Z`);
  d.setUTCDate(d.getUTCDate() + n);
  return d.toISOString().slice(0, 10);
};

export function computeSlots(date: string, duration: number, taken: { start: number; end: number }[]) {
  const now = nowInTunis();
  if (date < now.date || date > addDays(now.date, BOOKING.maxDaysAhead)) return [];

  const hours = config.hours[new Date(`${date}T00:00:00Z`).getUTCDay()];
  if (!hours) return [];

  const out: string[] = [];
  for (let t = hours[0] * 60; t + duration <= hours[1] * 60; t += BOOKING.slotStep) {
    if (date === now.date && t < now.minutes + BOOKING.minNoticeMin) continue;
    if (taken.some((b) => b.start < t + duration && b.end > t)) continue;
    out.push(toHHMM(t));
  }
  return out;
}