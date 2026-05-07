export function buildAttendanceInsights(attendance = []) {
  const safe = attendance ?? []

  const total = safe.length

  const present = safe.filter(a => a.status === "present").length
  const absent = safe.filter(a => a.status === "absent").length

  const rate = total > 0 ? present / total : 0

  return {
    summary: {
      total,
      present,
      absent,
      rate: Math.round(rate * 100)
    },

    trend:
      rate < 0.6
        ? "CRITICAL DROP"
        : rate < 0.8
        ? "WARNING"
        : "STABLE",

    insights: [
      rate < 0.6
        ? "⚠️ Attendance is critically low"
        : "Attendance within acceptable range",

      absent > present
        ? "More absences than presence detected"
        : "Normal attendance balance"
    ]
  }
}