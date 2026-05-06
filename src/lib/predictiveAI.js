// src/lib/predictiveAI.js

export function buildPredictiveModel(history) {
  if (!history.length) {
    return {
      trend: "neutral",
      confidence: 0
    }
  }

  const revenue = history.map(h => h.revenue)
  const risk = history.map(h => h.riskScore)
  const collection = history.map(h => h.collectionRate)

  const revenueSlope = slope(revenue)
  const riskSlope = slope(risk)
  const collectionSlope = slope(collection)

  const trendScore =
    (revenueSlope * 0.4) +
    (collectionSlope * 0.4) -
    (riskSlope * 0.6)

  return {
    trend:
      trendScore > 0.5
        ? "improving"
        : trendScore < -0.5
        ? "declining"
        : "stable",

    confidence: Math.min(95, Math.abs(trendScore * 60)),

    signals: {
      revenueSlope,
      riskSlope,
      collectionSlope
    }
  }
}

/* simple linear slope (momentum detector) */
function slope(arr) {
  if (arr.length < 2) return 0

  let sum = 0
  for (let i = 1; i < arr.length; i++) {
    sum += arr[i] - arr[i - 1]
  }

  return sum / (arr.length - 1)
}