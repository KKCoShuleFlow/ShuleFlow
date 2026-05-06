export function detectTrends(history = []) {
  if (history.length < 2) {
    return {
      revenueTrend: "stable",
      riskTrend: "stable",
      attendanceTrend: "stable"
    }
  }

  const last = history.at(-1).metrics
  const prev = history.at(-2).metrics

  const revenueDelta = last.revenueHealth - prev.revenueHealth
  const riskDelta = last.avgRisk - prev.avgRisk
  const attendanceDelta = last.attendanceRate - prev.attendanceRate

  return {
    revenueTrend: classify(revenueDelta),
    riskTrend: classify(-riskDelta),
    attendanceTrend: classify(attendanceDelta)
  }
}

function classify(delta) {
  if (delta > 2) return "improving"
  if (delta < -2) return "declining"
  return "stable"
}