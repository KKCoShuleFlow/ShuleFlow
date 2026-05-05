import { supabase } from "./supabase"

export function getNetworkStatus() {
  return navigator.onLine ? "online" : "offline"
}

export async function checkBackendStatus() {
  try {
    const { error } = await supabase
      .from("students")
      .select("id")
      .limit(1)

    return error ? "degraded" : "healthy"
  } catch {
    return "offline"
  }
}