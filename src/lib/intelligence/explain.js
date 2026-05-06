export function explainSystem(metrics, trends, prediction) {
  const parts = []

  if (metrics.revenueHealth < 60) {
    parts.push(
      "Revenue health is below optimal threshold, indicating collection inefficiency."
    )
  }

  if (trends.riskTrend === "declining") {
    parts.push(
      "Student risk levels are increasing based on recent behavioral and financial patterns."
    )
  }

  if (trends.attendanceTrend === "declining") {
    parts.push(
      "Attendance is showing downward momentum, which may lead to long-term disengagement."
    )
  }

  if (prediction.risk > 70) {
    parts.push(
      "If current trends continue, system will enter high-risk state within the forecast window."
    )
  }

  return parts.length
    ? parts.join(" ")
    : "System is currently stable with no critical anomalies detected."
}