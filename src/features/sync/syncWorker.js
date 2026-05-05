import { getPendingActions, markAsSynced, markAsFailed } from "./syncQueue"
import { supabase } from "../../lib/supabase"

export async function runSync() {
  const actions = await getPendingActions()

  for (const action of actions) {
    try {
      if (action.type === "CREATE_STUDENT") {
        const { error } = await supabase
          .from("students")
          .insert([action.payload])

        if (error) throw error
      }

      await markAsSynced(action.id)

    } catch (err) {
      console.error("Sync failed:", err)
      await markAsFailed(action.id)
    }
  }
}