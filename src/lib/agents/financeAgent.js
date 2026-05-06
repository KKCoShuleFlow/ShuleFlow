export function financeAgent(fees, history) {
  const expected = fees.reduce((a, f) => a + Number(f.amount || 0), 0)
  const paid = fees.reduce((a, f) => a + Number(f.paid || 0), 0)

  const collectionRate = expected ? paid / expected : 0

  let state = "stable"

  if (collectionRate < 0.6) state = "critical"
  else if (collectionRate < 0.85) state = "warning"

  return {
    name: "finance",
    health: Math.round(collectionRate * 100),
    state,
    signal:
      state === "critical"
        ? "Cashflow instability detected"
        : "Revenue stable"
  }
}