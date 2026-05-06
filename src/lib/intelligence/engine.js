import { financeAgent } from "../agents/financeAgent"
import { studentAgent } from "../agents/studentAgent"
import { attendanceAgent } from "../agents/attendanceAgent"
import { reconcileAgents } from "./reconcile"

import { computeMetrics } from "./metrics"
import { detectTrends } from "./trends"
import { forecast } from "./forecast"
import { explainSystem } from "./explain"
import { Memory } from "./memory"

const memory = new Memory()

export function runIntelligence(students, fees, attendance) {
  // base system
  const metrics = computeMetrics(students, fees, attendance)
  const trends = detectTrends(memory.getHistory())
  const prediction = forecast(metrics, trends)

  // 🧠 NEW: multi-agent layer
  const finance = financeAgent(fees)
  const student = studentAgent(students, fees)
  const attendanceAI = attendanceAgent(attendance)

  const consensus = reconcileAgents([
    finance,
    student,
    attendanceAI
  ])

  const insight = explainSystem(metrics, trends, prediction)

  const snapshot = {
    timestamp: Date.now(),
    metrics,
    trends,
    prediction,
    insight,
    agents: consensus.agents,
    systemState: consensus.globalState,
    systemInsight: consensus.insight
  }

  memory.save(snapshot)

  return snapshot
}