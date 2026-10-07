import "server-only";
import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const secret = process.env.SUPABASE_SECRET_KEY;
if (!url || !secret) throw new Error("Variables Supabase manquantes dans .env.local");

export const supabaseAdmin = createClient(url, secret, {
  auth: { persistSession: false, autoRefreshToken: false },
});