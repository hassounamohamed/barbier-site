import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { nowInTunis, toMin } from "@/lib/slots";

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
