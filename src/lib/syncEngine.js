import { supabase } from "./supabase"
import { db } from "../db"

// 🔥 push offline actions to Supabase
export async function syncToCloud(action) {
  const { type, payload } = action

  switch (type) {
    case "CREATE_STUDENT":
      await supabase.from("students").insert(payload)
      break

    case "CREATE_FEE":
      await supabase.from("fees").insert(payload)
      break

    case "MARK_ATTENDANCE":
      await supabase.from("attendance").insert(payload)
      break
  }
}