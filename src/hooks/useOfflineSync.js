import { useEffect } from "react"
import { db } from "../lib/db/offlineDB"
import { supabase } from "../lib/supabase"

export function useOfflineSync(syncFn) {
  useEffect(() => {
    const sync = async () => {
      if (!navigator.onLine) return

      try {
        // Custom sync function if provided
        if (syncFn) {
          await syncFn()
          return
        }

        // Default queue sync
        const queue = await db.queue.toArray()

        for (const item of queue) {
          try {
            if (item.type === "fee") {
              await supabase.from("fees").upsert(item.payload)
            }

            if (item.type === "student") {
              await supabase.from("students").upsert(item.payload)
            }

            await db.queue.delete(item.id)
          } catch (err) {
            console.error("Item sync failed:", err)
          }
        }
      } catch (err) {
        console.error("Sync failed:", err)
      }
    }

    // Run immediately
    sync()

    // Sync again when back online
    window.addEventListener("online", sync)

    return () => {
      window.removeEventListener("online", sync)
    }
  }, [syncFn])
}