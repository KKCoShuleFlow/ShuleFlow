export function computeMetrics(students, fees, attendance) {
  const totalExpected = fees.reduce((a, f) => a + Number(f.amount || 0), 0)
  const totalPaid = fees.reduce((a, f) => a + Number(f.paid || 0), 0)

  const revenueHealth = totalExpected
    ? (totalPaid / totalExpected) * 100
    : 0

  let highRisk = 0
  let totalRisk = 0

  students.forEach(s => {
    const sFees = fees.filter(f => f.studentId === s.id)

    const expected = sFees.reduce((a, f) => a + Number(f.amount || 0), 0)
    const paid = sFees.reduce((a, f) => a + Number(f.paid || 0), 0)

    const balance = expected - paid
    const risk = expected ? (balance / expected) * 100 : 0

    totalRisk += risk
    if (risk > 60) highRisk++
  })

  const avgRisk = students.length ? totalRisk / students.length : 0

  const attendanceRate = attendance.length
    ? (attendance.filter(a => a.status === "present").length /
       attendance.length) * 100
    : 0

  return {
    revenueHealth: Math.round(revenueHealth),
    avgRisk: Math.round(avgRisk),
    highRisk,
    attendanceRate: Math.round(attendanceRate)
  }
}