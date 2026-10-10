import { z } from "zod";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { DURATIONS } from "@/lib/booking";
import { computeSlots, toMin } from "@/lib/slots";

const query = z.object({ date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/), service: z.string().refine((s) => s in DURATIONS) });

export async function GET(req: Request) {
  const sp = new URL(req.url).searchParams;
  const parsed = query.safeParse({ date: sp.get("date"), service: sp.get("service") });
  if (!parsed.success) return Response.json({ error: "Paramètres invalides" }, { status: 400 });
  const { date, service } = parsed.data;
  const { data, error } = await supabaseAdmin.from("bookings").select("start_time,end_time").eq("date", date).neq("status", "cancelled");
  if (error) return Response.json({ error: "Erreur serveur" }, { status: 500 });
  return Response.json({ slots: computeSlots(date, DURATIONS[service], data.map((b) => ({ start: toMin(b.start_time), end: toMin(b.end_time) }))) }, { headers: { "Cache-Control": "no-store" } });
}
