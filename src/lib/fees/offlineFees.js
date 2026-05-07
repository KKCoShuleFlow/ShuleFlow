import { offlineDB } from "../../db/offlineDB"
import { supabase } from "../supabase"
import { queueChange } from "../sync/syncEngine"

/* ---------------- GET FEES (OFFLINE FIRST) ---------------- */
export async function getFees() {
  const local = await offlineDB.fees.toArray()

  if (local.length > 0) return local

  const { data } = await supabase.from("fees").select("*")

  await offlineDB.fees.bulkPut(data || [])

  return data || []
}

/* ---------------- CREATE FEE ---------------- */
export async function createFee(fee) {
  const record = {
    ...fee,
    id: crypto.randomUUID(),
    updatedAt: Date.now()
  }

  await offlineDB.fees.put(record)

  if (navigator.onLine) {
    await supabase.from("fees").insert(record)
  } else {
    await queueChange("INSERT", "fees", record)
  }
}

/* ---------------- UPDATE FEE ---------------- */
export async function updateFee(fee) {
  const updated = {
    ...fee,
    updatedAt: Date.now()
  }

  await offlineDB.fees.put(updated)

  if (navigator.onLine) {
    await supabase.from("fees").update(updated).eq("id", fee.id)
  } else {
    await queueChange("UPDATE", "fees", updated)
  }
}