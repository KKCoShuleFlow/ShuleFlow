export function buildStudentsEngine(students = []) {
  const safe = students ?? []

  const total = safe.length

  const active = safe.filter(s => s.status !== "inactive")
  const inactive = safe.filter(s => s.status === "inactive")

  const riskStudents = safe.map(s => {
    const attendance = Number(s.attendanceRate || 0)
    const balance = Number(s.balance || 0)

    const risk =
      (attendance < 60 ? 40 : 0) +
      (balance > 0 ? 30 : 0) +
      (s.flags || 0) * 10

    return {
      id: s.id,
      name: s.name,
      class: s.class,
      risk: Math.min(100, risk)
    }
  })

  const topRisk = riskStudents
    .sort((a, b) => b.risk - a.risk)
    .slice(0, 5)

  return {
    summary: {
      total,
      active: active.length,
      inactive: inactive.length
    },

    topRisk,

    insights: [
      total === 0
        ? "No student data available"
        : `${total} students in system`,

      inactive.length > 0
        ? `${inactive.length} inactive students detected`
        : "All students active",

      topRisk.length > 0
        ? "High-risk students identified"
        : "No major risk detected"
    ]
  }
}