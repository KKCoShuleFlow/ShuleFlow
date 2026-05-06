import { financeAgent } from "../agents/financeAgent"
import { studentAgent } from "../agents/studentAgent"
import { attendanceAgent } from "../agents/attendanceAgent"
import { reconcileAgents } from "./reconcile"

import { computeMetrics } from "./metrics"
import { detectTrends } from "./trends"
import { forecast } from "./forecast"
import { explainSystem } from "./explain"
import { Memory } from "./memory"
import { supabase } from "../supabase"

const memory = new Memory()

export async function runIntelligence() {
  const { data: students, error: sErr } = await supabase
    .from("students")
    .select("*")

  const { data: fees, error: fErr } = await supabase
    .from("fees")
    .select("*")

  if (sErr || fErr) {
    console.error("AI engine failed", sErr || fErr)
    return null
  }

  return buildInsights(students, fees)
}

/* ---------------- REAL ENGINE ---------------- */

function buildInsights(students, fees) {
  let highRisk = []
  let totalDebt = 0

  students.forEach(s => {
    const sFees = fees.filter(f => f.student_id === s.id)

    const expected = sFees.reduce((a, f) => a + Number(f.amount || 0), 0)
    const paid = sFees.reduce((a, f) => a + Number(f.paid || 0), 0)

    const balance = expected - paid
    const risk = expected ? (balance / expected) * 100 : 0

    totalDebt += balance

    if (risk > 60) {
      highRisk.push({
        ...s,
        risk: Math.round(risk),
        balance
      })
    }
  })

  let insight = ""
  let actions = []

  if (highRisk.length > 0) {
    insight = `${highRisk.length} students are at financial risk. Immediate intervention recommended.`

    actions = [
      "Contact high-risk parents",
      "Offer payment plans",
      "Monitor weekly"
    ]
  } else {
    insight = "System stable. No high-risk students detected."
    actions = ["Maintain monitoring"]
  }

  return {
    totalStudents: students.length,
    highRisk,
    totalDebt,
    insight,
    actions
  }
}