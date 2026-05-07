import { offlineDB } from "../../db/offlineDB"
import { supabase } from "../supabase"

/* ---------------- ADD TO QUEUE ---------------- */
export async function queueChange(type, table, payload) {
  await offlineDB.queue.add({
    type,
    table,
    payload,
    status: "pending",
    createdAt: Date.now()
  })
}

/* ---------------- PROCESS QUEUE ---------------- */
export async function processQueue() {
  const items = await offlineDB.queue.where("status").equals("pending").toArray()

  for (const item of items) {
    try {
      if (item.type === "INSERT") {
        await supabase.from(item.table).insert(item.payload)
      }

      if (item.type === "UPDATE") {
        await supabase
          .from(item.table)
          .update(item.payload)
          .eq("id", item.payload.id)
      }

      await offlineDB.queue.update(item.id, { status: "synced" })

    } catch (err) {
      console.error("SYNC FAILED:", err)
    }
  }
}