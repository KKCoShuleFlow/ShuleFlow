export function buildInsightsEngine({ students = [], fees = [], attendance = [] }) {
  const safeStudents = students ?? []
  const safeFees = fees ?? []
  const safeAttendance = attendance ?? []

  const totalRevenue = safeFees.reduce(
    (a, f) => a + Number(f.paid || 0),
    0
  )

  const expectedRevenue = safeFees.reduce(
    (a, f) => a + Number(f.amount || 0),
    0
  )

  const attendanceRate =
    safeAttendance.length > 0
      ? safeAttendance.filter(a => a.status === "present").length /
        safeAttendance.length
      : 0

  const unpaid = safeFees.filter(
    f => Number(f.paid || 0) < Number(f.amount || 0)
  ).length

  return {
    kpis: {
      revenueHealth: expectedRevenue
        ? Math.round((totalRevenue / expectedRevenue) * 100)
        : 0,

      attendance: Math.round(attendanceRate * 100),
      students: safeStudents.length,
      unpaidFees: unpaid
    },

    insights: [
      attendanceRate < 0.6
        ? "⚠️ Attendance is critically low"
        : "Attendance stable",

      unpaid > 5
        ? "💰 Fee collection delays detected"
        : "Fees collection healthy",

      totalRevenue < expectedRevenue * 0.7
        ? "📉 Revenue below expected threshold"
        : "Revenue within expected range"
    ],

    recommendations: [
      unpaid > 0 ? "Follow up unpaid fees" : "No financial actions needed",
      attendanceRate < 0.7 ? "Improve attendance tracking" : "Maintain attendance strategy"
    ]
  }
}