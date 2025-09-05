import { createClient } from "@supabase/supabase-js";

// Environment variables are available via import.meta.env in Vite projects.

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Missing Supabase environment variables");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export async function signInAnonymously() {
  const { data, error } = await supabase.auth.signInAnonymously();
  if (error) throw error;
  return data;
}

export async function createProfile(userId: string, username: string) {
  const displayId = generateDisplayId();
  const { data, error } = await supabase
    .from("profiles")
    .upsert({ user_id: userId, username, display_id: displayId })
    .select()
    .single();
  if (error) throw error;
  return data;
}

function generateDisplayId(): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let result = "";
  for (let i = 0; i < 6; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}
