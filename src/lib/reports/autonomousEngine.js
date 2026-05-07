import { jsPDF } from "jspdf"

export function buildAutonomousReport({ students = [], fees = [], attendance = [] }) {
  const unpaid = fees.filter(f => Number(f.paid || 0) < Number(f.amount || 0))

  const attendanceRate =
    attendance.length > 0
      ? attendance.filter(a => a.status === "present").length / attendance.length
      : 0

  const riskScore = unpaid.length * 10 + (1 - attendanceRate) * 50

  return {
    summary: {
      students: students.length,
      unpaid: unpaid.length,
      attendance: Math.round(attendanceRate * 100),
      riskScore: Math.round(riskScore)
    },

    insights: [
      unpaid.length > 0
        ? `${unpaid.length} unpaid fee records detected`
        : "No financial risk detected",

      attendanceRate < 0.7
        ? "Attendance below healthy threshold"
        : "Attendance stable",

      riskScore > 50
        ? "System in MONITOR mode"
        : "System stable"
    ]
  }
}