export function forecast(metrics, trends) {
  const horizon = 14 // days

  const riskProjection =
    metrics.avgRisk + (trends.riskTrend === "declining" ? 10 : -5)

  const revenueProjection =
    metrics.revenueHealth + (trends.revenueTrend === "declining" ? -8 : 3)

  const attendanceProjection =
    metrics.attendanceRate + (trends.attendanceTrend === "declining" ? -6 : 2)

  return {
    risk: clamp(riskProjection),
    revenue: clamp(revenueProjection),
    attendance: clamp(attendanceProjection),
    horizon
  }
}

function clamp(v) {
  return Math.max(0, Math.min(100, Math.round(v)))
}