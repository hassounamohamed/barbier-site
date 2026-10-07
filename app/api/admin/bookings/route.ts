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

  const raw = await req.json().catch(() => null);
  const parsed = updateBooking.safeParse(raw);
  if (!parsed.success) {
    return NextResponse.json({ error: "Données invalides" }, { status: 400 });
  }

  const { id, status } = parsed.data;
  const { data, error } = await supabaseAdmin
    .from("bookings")
    .update({ status })
    .eq("id", id)
    .eq("status", "pending")
    .select("id,status")
    .single();

  if (error) return NextResponse.json({ error: "Impossible de modifier la réservation" }, { status: 500 });
  return NextResponse.json({ ok: true, booking: data });
}

export async function DELETE(req: Request) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  const raw = await req.json().catch(() => null);
  const parsed = updateBooking.pick({ id: true }).safeParse(raw);
  if (!parsed.success) {
    return NextResponse.json({ error: "Données invalides" }, { status: 400 });
  }

  const { error } = await supabaseAdmin
    .from("bookings")
    .delete()
    .eq("id", parsed.data.id);

  if (error) return NextResponse.json({ error: "Impossible de supprimer la réservation" }, { status: 500 });
  return NextResponse.json({ ok: true });
}
