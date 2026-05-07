export function generateAlerts({ fees = [], attendance = [], students = [] }) {
  const alerts = []

  const unpaid = fees.filter(
    f => Number(f.amount || 0) > Number(f.paid || 0)
  )

  const attendanceRate =
    attendance.length > 0
      ? attendance.filter(a => a.status === "present").length /
        attendance.length
      : 0

  // 🚨 FINANCE ALERT
  if (unpaid.length > 5) {
    alerts.push({
      type: "finance",
      level: "high",
      message: `${unpaid.length} unpaid fee records detected`
    })
  }

  // 📅 ATTENDANCE ALERT
  if (attendanceRate < 0.6) {
    alerts.push({
      type: "attendance",
      level: "critical",
      message: "Attendance below 60% threshold"
    })
  }

  // 🧠 SYSTEM ALERT
  if (students.length === 0) {
    alerts.push({
      type: "system",
      level: "warning",
      message: "No student data found"
    })
  }

  return alerts
}