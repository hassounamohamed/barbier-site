import { supabaseAdmin } from "@/lib/supabase-admin";

export async function GET() {
  const { count, error } = await supabaseAdmin.from("bookings").select("*", { count: "exact", head: true });
  if (error) return Response.json({ ok: false, error: error.message }, { status: 500 });
  return Response.json({ ok: true, bookings: count });
}
