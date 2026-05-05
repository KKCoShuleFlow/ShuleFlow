import { supabase } from "./supabase"
import { db } from "../db"

export function subscribeFees(setFees) {
  const channel = supabase
    .channel("fees-fast")
    .on(
      "postgres_changes",
      { event: "*", schema: "public", table: "fees" },
      async (payload) => {

        const { eventType, new: newRow, old } = payload

        if (eventType === "INSERT") {
          await db.fees.add(newRow)
        }

        if (eventType === "UPDATE") {
          await db.fees.update(newRow.id, newRow)
        }

        if (eventType === "DELETE") {
          await db.fees.delete(old.id)
        }

        const updated = await db.fees.toArray()
        setFees(updated)
      }
    )
    .subscribe()

  return () => supabase.removeChannel(channel)
}