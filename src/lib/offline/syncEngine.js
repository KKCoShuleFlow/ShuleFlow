import { db } from "./db"
import { supabase } from "../supabase"

const isOnline = () => navigator.onLine

/* ---------------- QUEUE ACTION ---------------- */

export async function queueAction(type, payload) {
  await db.queue.add({
    type,
    payload,
    createdAt: Date.now(),
  })
}

/* ---------------- LOAD FROM CACHE ---------------- */

export async function getCachedFees() {
  return await db.fees.toArray()
}

/* ---------------- SAVE CACHE ---------------- */

export async function cacheFees(fees) {
  await db.fees.clear()
  await db.fees.bulkPut(fees)
}

/* ---------------- SYNC ENGINE ---------------- */

export async function syncQueue() {
  if (!isOnline()) return

  const queue = await db.queue.toArray()

  for (const item of queue) {
    try {
      if (item.type === "update_fee") {
        await supabase
          .from("fees")
          .update(item.payload.data)
          .eq("id", item.payload.id)
      }

      if (item.type === "create_fee") {
        await supabase.from("fees").insert(item.payload)
      }

      await db.queue.delete(item.id)

    } catch (err) {
      console.log("sync failed", err)
    }
  }
}