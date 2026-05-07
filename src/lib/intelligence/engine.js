import { supabase } from "../supabase"

export async function runIntelligence() {
  const { data: students, error: sErr } = await supabase
    .from("students")
    .select("*")

  const { data: fees, error: fErr } = await supabase
    .from("fees")
    .select("*")

  if (sErr || fErr) {
    console.error("Engine error:", sErr || fErr)
    return null
  }

  const insights = buildInsights(students || [], fees || [])
  const sync = buildSyncState(students || [], fees || [])

  return {
    ...insights,
    sync,
  }
}

/* ---------------- INSIGHTS ---------------- */

function buildInsights(students, fees) {
  let totalDebt = 0
  const enriched = []

  const highRisk = []
  const mediumRisk = []

  for (const s of students) {
    const sFees = fees.filter((f) => f.student_id === s.id)

    const expected = sFees.reduce((a, f) => a + Number(f.amount || 0), 0)
    const paid = sFees.reduce((a, f) => a + Number(f.paid || 0), 0)

    const balance = expected - paid
    const risk = expected > 0 ? (balance / expected) * 100 : 0

    totalDebt += balance

    const student = {
      ...s,
      expected,
      paid,
      balance,
      risk: Math.round(risk),
    }

    enriched.push(student)

    if (risk >= 70) highRisk.push(student)
    else if (risk >= 40) mediumRisk.push(student)
  }

  const avgRisk =
    enriched.length > 0
      ? Math.round(
          enriched.reduce((a, s) => a + s.risk, 0) / enriched.length
        )
      : 0

  const systemHealth = Math.max(0, 100 - avgRisk)

  return {
    students: enriched.sort((a, b) => b.risk - a.risk),
    highRisk,
    mediumRisk,
    totalDebt,
    avgRisk,
    systemHealth,

    insight:
      highRisk.length > 0
        ? `${highRisk.length} students require attention`
        : "System stable",

    actions:
      highRisk.length > 0
        ? ["Send reminders", "Notify parents", "Offer plans"]
        : ["Monitor system"],
  }
}

/* ---------------- SYNC ENGINE ---------------- */

function buildSyncState(students, fees) {
  const latency = 120 // placeholder (upgrade later)

  const integrity =
    latency < 100 ? 99 :
    latency < 300 ? 90 :
    latency < 600 ? 70 : 50

  const throughput = Math.max(10, Math.floor(1000 / latency))

  let status = "stable"
  if (latency > 600) status = "critical"
  else if (latency > 300) status = "degraded"

  return {
    status,
    latency,
    integrity,
    throughput,
    diagnosis:
      status === "critical"
        ? "System overloaded"
        : status === "degraded"
        ? "Performance reduced"
        : "System optimal",
  }
}