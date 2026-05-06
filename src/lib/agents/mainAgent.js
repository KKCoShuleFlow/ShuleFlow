import { financeAgent } from "./agents/financeAgent"
import { studentAgent } from "./agents/studentAgent"
import { attendanceAgent } from "./agents/attendanceAgent"
import { reconcileAgents } from "./reconcile"

export function runMultiAgentSystem(students, fees, attendance, history) {
  const finance = financeAgent(fees, history)
  const studentsAI = studentAgent(students, fees, history)
  const attendanceAI = attendanceAgent(attendance, history)

  const finalState = reconcileAgents([
    finance,
    studentsAI,
    attendanceAI
  ])

  return finalState
}