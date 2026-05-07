export function formatEvent(e) {
  if (!e) return "Unknown event"

  // Support both payload-style and message-style events
  const payload = e.payload || {}

  switch (e.type) {

    /* ---------------- STUDENTS ---------------- */
    case "student_created":
    case "student":
      return `🧑‍🎓 New student enrolled: ${payload.name || e.message || "Unnamed"}`

    case "student_updated":
      return `🧑‍🎓 Student record updated: ${payload.name || "Unknown student"}`


    /* ---------------- FINANCE ---------------- */
    case "fee_paid":
    case "finance":
      return `💰 ${e.message || `Fee payment received: $${payload.amount || 0}`}`

    case "fee_overdue":
      return `⚠️ Fee overdue detected`


    /* ---------------- ATTENDANCE ---------------- */
    case "attendance":
    case "attendance_marked":
      return `📅 Attendance updated: ${payload.status || "Recorded"}`


    /* ---------------- SYSTEM ---------------- */
    case "system":
      return `⚙️ ${payload.msg || e.message || "System event"}`


    /* ---------------- FALLBACK ---------------- */
    default:
      return `📡 ${e.message || "Unrecognized system event"}`
  }
}