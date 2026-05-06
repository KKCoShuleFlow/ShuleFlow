import { useEffect, useState } from "react"
import { db } from "../db"

export default function ReportsDashboard() {
  const [report, setReport] = useState(null)

  useEffect(() => {
    let alive = true

    const run = async () => {
      const students = await db.students.toArray()
      const fees = await db.fees.toArray()
      const attendance = await db.attendance.toArray()

      if (!alive) return
      setReport(buildReportEngine(students, fees, attendance))
    }

    run()
    const t = setInterval(run, 3000)

    return () => {
      alive = false
      clearInterval(t)
    }
  }, [])

  if (!report) {
    return (
      <div style={{
        minHeight: "100vh",
        background: "#050816",
        color: "#93c5fd",
        display: "flex",
        alignItems: "center",
        justifyContent: "center"
      }}>
        📊 Generating institutional intelligence report...
      </div>
    )
  }

  return (
    <div style={{
      padding: 24,
      minHeight: "100vh",
      background: "#050816",
      color: "white"
    }}>

      <Header />

      {/* KPI STRIP */}
      <KPIGrid data={report} />

      {/* MAIN GRID */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "2fr 1fr",
        gap: 16,
        marginTop: 18
      }}>

        {/* LEFT: INSIGHT REPORT */}
        <Panel title="📊 EXECUTIVE REPORT (AI GENERATED)">

          <div style={{
            fontSize: 13,
            lineHeight: 1.7,
            color: "#cbd5e1"
          }}>
            {report.executiveSummary}
          </div>

        </Panel>

        {/* RIGHT SIDE */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>

          <Panel title="📉 FINANCIAL TREND SCORE">
            <Score value={report.financialTrend} />
          </Panel>

          <Panel title="🎓 ACADEMIC STABILITY INDEX">
            <Score value={report.academicStability} />
          </Panel>

          <Panel title="⚠️ SYSTEM VOLATILITY">
            <Score value={report.volatility} />
          </Panel>

        </div>
      </div>

      {/* DEEP ANALYSIS SECTION */}
      <div style={{
        marginTop: 18,
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: 16
      }}>

        <Panel title="📈 KEY INSIGHTS">

          <ul style={{ fontSize: 13, lineHeight: 1.8 }}>
            {report.insights.map((i, idx) => (
              <li key={idx}>• {i}</li>
            ))}
          </ul>

        </Panel>

        <Panel title="🎯 RECOMMENDED STRATEGY">

          <ul style={{ fontSize: 13, lineHeight: 1.8 }}>
            {report.actions.map((a, idx) => (
              <li key={idx}>→ {a}</li>
            ))}
          </ul>

        </Panel>

      </div>
    </div>
  )
}

/* ================= HEADER ================= */

function Header() {
  return (
    <div style={{
      marginBottom: 16,
      borderBottom: "1px solid rgba(148,163,184,0.2)",
      paddingBottom: 12
    }}>
      <div style={{ fontSize: 22, fontWeight: 900 }}>
        📊 SCHOOL EXECUTIVE INTELLIGENCE REPORTS
      </div>
      <div style={{ fontSize: 12, color: "#94a3b8" }}>
        AI-generated institutional analysis, forecasting & strategic guidance
      </div>
    </div>
  )
}

/* ================= KPI GRID ================= */

function KPIGrid({ data }) {
  return (
    <div style={{
      display: "grid",
      gridTemplateColumns: "repeat(4, 1fr)",
      gap: 12
    }}>
      <KPI label="Revenue Health" value={data.revenueHealth + "%"} color="#22c55e" />
      <KPI label="Attendance Quality" value={data.attendanceQuality + "%"} />
      <KPI label="Risk Exposure" value={data.riskExposure + "%"} color="#ef4444" />
      <KPI label="Growth Score" value={data.growthScore + "%"} color="#38bdf8" />
    </div>
  )
}

function KPI({ label, value, color = "white" }) {
  return (
    <div style={{
      background: "#0f172a",
      border: "1px solid rgba(148,163,184,0.2)",
      borderRadius: 14,
      padding: 14
    }}>
      <div style={{ fontSize: 11, color: "#94a3b8" }}>
        {label}
      </div>
      <div style={{ fontSize: 20, fontWeight: 900, color }}>
        {value}
      </div>
    </div>
  )
}

/* ================= PANEL ================= */

function Panel({ title, children }) {
  return (
    <div style={{
      background: "#0f172a",
      border: "1px solid rgba(148,163,184,0.2)",
      borderRadius: 14,
      padding: 14
    }}>
      <div style={{
        fontSize: 12,
        fontWeight: 800,
        marginBottom: 10,
        color: "#cbd5e1"
      }}>
        {title}
      </div>
      {children}
    </div>
  )
}

/* ================= SCORE ================= */

function Score({ value }) {
  const color =
    value > 75 ? "#22c55e" :
    value > 50 ? "#f59e0b" :
    "#ef4444"

  return (
    <div style={{
      fontSize: 38,
      fontWeight: 900,
      textAlign: "center",
      color
    }}>
      {value}/100
    </div>
  )
}

/* ================= ENGINE ================= */

function buildReportEngine(students, fees, attendance) {

  const totalRevenue = fees.reduce((a, f) => a + Number(f.paid || 0), 0)
  const expectedRevenue = fees.reduce((a, f) => a + Number(f.amount || 0), 0)

  const revenueHealth = expectedRevenue
    ? Math.round((totalRevenue / expectedRevenue) * 100)
    : 0

  const attendanceRate =
    students.length
      ? Math.round((attendance.filter(a => a.status === "present").length / students.length) * 100)
      : 0

  const riskExposure =
    Math.min(100, (100 - revenueHealth) + (100 - attendanceRate) / 2)

  const growthScore = Math.max(0, 100 - riskExposure)

  const volatility = Math.round(
    (Math.abs(revenueHealth - attendanceRate) / 2)
  )

  const insights = [
    revenueHealth < 60
      ? "Revenue collection efficiency is below sustainable threshold."
      : "Revenue flow is stable and predictable.",

    attendanceRate < 70
      ? "Attendance inconsistency may impact academic outcomes."
      : "Attendance patterns are stable across cohorts.",

    riskExposure > 50
      ? "System-wide risk exposure is elevated across multiple domains."
      : "System risk exposure remains within safe operational limits."
  ]

  const actions = []

  if (riskExposure > 60) {
    actions.push("Trigger financial recovery plan")
    actions.push("Activate student engagement intervention system")
    actions.push("Escalate monitoring frequency to real-time mode")
  } else {
    actions.push("Maintain current operational strategy")
    actions.push("Continue predictive monitoring")
    actions.push("Optimize efficiency workflows")
  }

  return {
    revenueHealth,
    attendanceQuality: attendanceRate,
    riskExposure: Math.round(riskExposure),
    growthScore: Math.round(growthScore),
    volatility,
    executiveSummary:
      `The institution is operating at ${growthScore}% strategic efficiency. ` +
      `Key performance drivers include revenue health (${revenueHealth}%) and attendance stability (${attendanceRate}%). ` +
      `Overall system volatility is ${volatility}%, indicating ${
        volatility > 30 ? "high uncertainty" : "controlled stability"
      }.`,
    insights,
    actions
  }
}