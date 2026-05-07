export function schoolAIAgent({ students = [], fees = [], attendance = [] }) {
  const unpaid = fees.filter(f => Number(f.paid || 0) < Number(f.amount || 0))

  const attendanceRate =
    attendance.length > 0
      ? attendance.filter(a => a.status === "present").length / attendance.length
      : 0

  const revenue = fees.reduce((a, f) => a + Number(f.paid || 0), 0)

  const expected = fees.reduce((a, f) => a + Number(f.amount || 0), 0)

  const dropRate = expected === 0 ? 0 : (expected - revenue) / expected

  return {
    explain: () => `
School Performance Report:
- Students: ${students.length}
- Attendance: ${Math.round(attendanceRate * 100)}%
- Revenue Collected: ${revenue}
- Revenue Expected: ${expected}
- Drop Indicator: ${Math.round(dropRate * 100)}%
    `,

    whyFeesDropping: () => {
      if (unpaid.length > 5) return "High number of unpaid fees detected"
      if (dropRate > 0.3) return "Revenue collection slowing down"
      return "Stable collection patterns"
    },

    predictRevenue: () => {
      const trend = revenue * 1.08
      return Math.round(trend)
    },

    riskLevel: () => {
      if (attendanceRate < 0.6 || unpaid.length > 10) return "HIGH"
      if (attendanceRate < 0.8) return "MEDIUM"
      return "LOW"
    }
  }
}