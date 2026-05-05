import { supabase } from "../lib/supabase"

// LIVE FEES STREAM
export function subscribeFees(onChange) {
  const channel = supabase
    .channel("fees-live")
    .on(
      "postgres_changes",
      { event: "*", schema: "public", table: "fees" },
      payload => {
        onChange(payload)
      }
    )
    .subscribe()

  return () => supabase.removeChannel(channel)
}

// LIVE STUDENTS STREAM
export function subscribeStudents(onChange) {
  const channel = supabase
    .channel("students-live")
    .on(
      "postgres_changes",
      { event: "*", schema: "public", table: "students" },
      payload => {
        onChange(payload)
      }
    )
    .subscribe()

  return () => supabase.removeChannel(channel)
}