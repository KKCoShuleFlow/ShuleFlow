import { supabase } from "../supabase"

export function createEventEngine(callback) {
  const logs = []

  function push(event) {
    logs.unshift({
      ...event,
      time: new Date().toLocaleTimeString(),
    })

    if (logs.length > 20) {
      logs.pop()
    }

    callback([...logs])
  }

  /* ---------------- STUDENTS ---------------- */

  const studentsChannel = supabase
    .channel("students-events")
    .on(
      "postgres_changes",
      {
        event: "INSERT",
        schema: "public",
        table: "students",
      },
      (payload) => {
        push({
          type: "student",
          message: `New student added: ${payload.new.name}`,
        })
      }
    )
    .on(
      "postgres_changes",
      {
        event: "UPDATE",
        schema: "public",
        table: "students",
      },
      (payload) => {
        push({
          type: "student",
          message: `Student updated: ${payload.new.name}`,
        })
      }
    )
    .subscribe()

  /* ---------------- FEES ---------------- */

  const feesChannel = supabase
    .channel("fees-events")
    .on(
      "postgres_changes",
      {
        event: "INSERT",
        schema: "public",
        table: "fees",
      },
      () => {
        push({
          type: "finance",
          message: `Fee payment recorded`,
        })
      }
    )
    .subscribe()

  /* ---------------- ATTENDANCE ---------------- */

  const attendanceChannel = supabase
    .channel("attendance-events")
    .on(
      "postgres_changes",
      {
        event: "INSERT",
        schema: "public",
        table: "attendance",
      },
      () => {
        push({
          type: "attendance",
          message: `Attendance synced`,
        })
      }
    )
    .subscribe()

  /* ---------------- CLEANUP ---------------- */

  return () => {
    supabase.removeChannel(studentsChannel)
    supabase.removeChannel(feesChannel)
    supabase.removeChannel(attendanceChannel)
  }
}