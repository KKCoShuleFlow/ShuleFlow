export function generateInsight(state, agents) {
  if (state === "critical") {
    return `
🚨 SYSTEM CRITICAL

Multiple subsystems are degrading simultaneously.
Financial stress + student risk correlation detected.

Recommended action: immediate intervention required.
`
  }

  if (state === "warning") {
    return `
⚠️ SYSTEM UNDER PRESSURE

One or more subsystems are showing negative trends.
Early intervention recommended to prevent escalation.
`
  }

  return `
🟢 SYSTEM STABLE

All subsystems are operating within expected parameters.
No intervention required.
`
}