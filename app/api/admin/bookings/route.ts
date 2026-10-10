import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { nowInTunis, toMin } from "@/lib/slots";
import { z } from "zod";

const updateBooking = z.object({
  id: z.union([z.string(), z.number()]).transform(String).pipe(z.string().trim().min(1).max(100)),
  status: z.enum(["confirmed", "cancelled"]),
});

export async function GET() {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  const { data, error } = await supabaseAdmin
    .from("bookings")
    .select("id,token,date,start_time,end_time,service_id,name,phone,status,created_at")
    .neq("status", "cancelled")
    .order("date", { ascending: true })
    .order("start_time", { ascending: true });

  if (error) return NextResponse.json({ error: "Impossible de charger les réservations" }, { status: 500 });
  const now = nowInTunis();
  const upcoming = data.filter((booking) =>
    booking.date > now.date || (booking.date === now.date && toMin(booking.end_time) > now.minutes)
  );
  return NextResponse.json({ bookings: upcoming });
}

export async function PATCH(req: Request) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  const parsed = updateBooking.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Données invalides" }, { status: 400 });

  const { id, status } = parsed.data;
  const { data: existing, error: lookupError } = await supabaseAdmin
    .from("bookings").select("id").eq("id", id).eq("status", "pending").single();
  if (lookupError || !existing) {
    return NextResponse.json({ error: "Réservation introuvable ou déjà traitée" }, { status: 404 });
  }

  const { data, error } = await supabaseAdmin
    .from("bookings").update({ status }).eq("id", id).eq("status", "pending")
    .select("id,status").single();
  if (error) return NextResponse.json({ error: "Impossible de modifier la réservation" }, { status: 500 });
  return NextResponse.json({ ok: true, booking: data });
}

export async function DELETE(req: Request) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  const parsed = updateBooking.pick({ id: true }).safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Données invalides" }, { status: 400 });

  const { data: existing, error: lookupError } = await supabaseAdmin
    .from("bookings").select("id").eq("id", parsed.data.id).single();
  if (lookupError || !existing) return NextResponse.json({ error: "Réservation introuvable" }, { status: 404 });

  const { error } = await supabaseAdmin.from("bookings").delete().eq("id", parsed.data.id);
  if (error) return NextResponse.json({ error: "Impossible de supprimer la réservation" }, { status: 500 });
  return NextResponse.json({ ok: true });
}
