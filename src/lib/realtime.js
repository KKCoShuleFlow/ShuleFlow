import { supabase } from "./supabase"
import { db } from "../db"

export function subscribeStudents(setStudents) {
  const channel = supabase
    .channel("students-fast")
    .on(
      "postgres_changes",
      { event: "*", schema: "public", table: "students" },
      async (payload) => {

        const { eventType, new: newRow, old } = payload

        // 🔥 UPDATE LOCAL DB ONLY (NO FULL REFRESH)
        if (eventType === "INSERT") {
          await db.students.add(newRow)
        }

        if (eventType === "UPDATE") {
          await db.students.update(newRow.id, newRow)
        }

        if (eventType === "DELETE") {
          await db.students.delete(old.id)
        }

        // 🔥 THEN UPDATE UI FROM LOCAL DB (FAST)
        const updated = await db.students.toArray()
        setStudents(updated)
      }
    )
    .subscribe()

  return () => supabase.removeChannel(channel)
}