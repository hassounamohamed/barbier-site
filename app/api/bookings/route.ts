import { z } from "zod";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { BOOKING, DURATIONS } from "@/lib/booking";
import { computeSlots, nowInTunis, toHHMM, toMin } from "@/lib/slots";

const body = z.object({
  service: z.string().refine((s) => s in DURATIONS),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  time: z.string().regex(/^\d{2}:\d{2}$/),
  name: z.string().trim().min(2).max(60),
  phone: z.string().transform((s) => s.replace(/[\s.-]/g, "").replace(/^(\+216|00216)/, "")).pipe(z.string().regex(/^[2-579]\d{7}$/)),
});

export async function POST(req: Request) {
  const raw = await req.json().catch(() => null);
  if (!raw) return Response.json({ error: "Requête invalide" }, { status: 400 });
  if (raw.website) return Response.json({ ok: true }, { status: 201 });
  const parsed = body.safeParse(raw);
  if (!parsed.success) return Response.json({ error: "Données invalides" }, { status: 400 });
  const { service, date, time, name, phone } = parsed.data;
  const duration = DURATIONS[service];

  const { count } = await supabaseAdmin.from("bookings").select("id", { count: "exact", head: true })
    .eq("phone", phone).in("status", ["pending", "confirmed"]).gte("date", nowInTunis().date);
  if ((count ?? 0) >= BOOKING.maxActivePerPhone) return Response.json({ error: "Trop de réservations actives pour ce numéro" }, { status: 429 });

  const { data: day, error: e1 } = await supabaseAdmin.from("bookings").select("start_time,end_time").eq("date", date).neq("status", "cancelled");
  if (e1) return Response.json({ error: "Erreur serveur" }, { status: 500 });
  const taken = day.map((b) => ({ start: toMin(b.start_time), end: toMin(b.end_time) }));
  if (!computeSlots(date, duration, taken).includes(time)) return Response.json({ error: "Ce créneau n'est plus disponible" }, { status: 409 });

  const { data, error } = await supabaseAdmin.from("bookings").insert({
    date, service_id: service, name, phone, start_time: time, end_time: toHHMM(toMin(time) + duration),
    status: BOOKING.autoConfirm ? "confirmed" : "pending",
  }).select("token").single();
  if (error) return Response.json({ error: error.code === "23P01" ? "Ce créneau vient d'être pris" : "Erreur serveur" }, { status: error.code === "23P01" ? 409 : 500 });
  return Response.json({ token: data.token, date, time, service }, { status: 201 });
}
