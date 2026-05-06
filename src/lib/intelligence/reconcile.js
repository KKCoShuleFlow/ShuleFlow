export function reconcileAgents(agents = []) {
  const states = agents.map((a) => a.state)

  const criticalCount = states.filter((s) => s === "critical").length
  const warningCount = states.filter((s) => s === "warning").length

  let globalState = "stable"

  // 🧠 SYSTEM PRIORITY RULES (VERY IMPORTANT)
  if (criticalCount >= 2) {
    globalState = "critical"
  } else if (criticalCount === 1 && warningCount >= 1) {
    globalState = "critical"
  } else if (warningCount >= 2) {
    globalState = "warning"
  }

  // 🧠 SYSTEM INSIGHT ENGINE
  const insight = buildSystemInsight(globalState, agents)

  return {
    globalState,
    agents,
    insight,
  }
}

/* ---------------- INSIGHT GENERATOR ---------------- */

function buildSystemInsight(globalState, agents) {
  const names = agents.map((a) => a.name).join(", ")

  if (globalState === "critical") {
    return `
🚨 CRITICAL SYSTEM ALERT

Multiple agents are reporting instability:
[${names}]

System is experiencing correlated degradation patterns.

Recommendation:
- Immediate intervention required
- Prioritize financial + student risk stabilization
- Suspend non-critical operations if needed
`
  }

  if (globalState === "warning") {
    return `
⚠️ SYSTEM WARNING STATE

Some subsystems are showing stress signals:
[${names}]

Early indicators suggest risk convergence.

Recommendation:
- Monitor closely
- Increase data refresh frequency
- Prepare intervention protocols
`
  }

  return `
🟢 SYSTEM STABLE

All agents report normal operating conditions:
[${names}]

No anomalies detected across financial, attendance, or student systems.
`
}