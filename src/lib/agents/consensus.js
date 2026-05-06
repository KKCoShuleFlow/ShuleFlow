export function reconcileAgents(agents) {
  const states = agents.map(a => a.state)

  let globalState = "stable"

  const criticalCount = states.filter(s => s === "critical").length
  const warningCount = states.filter(s => s === "warning").length

  if (criticalCount >= 2) globalState = "critical"
  else if (warningCount >= 2) globalState = "warning"

  const signals = agents.map(a => a.signal)

  const insight = generateInsight(globalState, agents)

  return {
    globalState,
    agents,
    signals,
    insight
  }
}