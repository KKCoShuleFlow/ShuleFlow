export function attendanceAgent(attendance, history) {
  const total = attendance.length || 1
  const present = attendance.filter(a => a.status === "present").length

  const rate = present / total

  let state = "stable"

  if (rate < 0.6) state = "critical"
  else if (rate < 0.8) state = "warning"

  return {
    name: "attendance",
    rate: Math.round(rate * 100),
    state,
    signal:
      state === "critical"
        ? "Engagement collapse detected"
        : "Attendance stable"
  }
}