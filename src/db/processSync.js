import { db } from "./index"
import { syncToCloud } from "../lib/syncEngine"

export async function processSyncQueue() {
  const items = await db.syncQueue.where("status").equals("pending").toArray()

  for (const item of items) {
    try {
      await syncToCloud(item)

      await db.syncQueue.update(item.id, {
        status: "synced"
      })

    } catch (err) {
      console.error("Sync failed:", err)
    }
  }
}