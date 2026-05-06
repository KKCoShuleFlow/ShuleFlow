import { useEffect, useState } from "react"
import { db } from "../db"

export default function AlertsDashboard() {
  const [data, setData] = useState(null)

  useEffect(() => {
    let alive = true

    const run = async () => {
      const students = await db.students.toArray()
      const fees = await db.fees.toArray()
      const attendance = await db.attendance.toArray()

      if (!alive) return
      setData(buildAlertEngine(students, fees, attendance))
    }

    run()
    const t = setInterval(run, 2000)

    return () => {
      alive = false
      clearInterval(t)
    }
  }, [])

  if (!data) {
    return (
      <div style={{
        minHeight: "100vh",
        background: "#050816",
        color: "#93c5fd",
        display: "flex",
        alignItems: "center",
        justifyContent: "center"
      }}>
        🚨 Initializing alert intelligence network...
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

      {/* ALERT STATS */}
      <KPIBar data={data} />

      {/* MAIN GRID */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "2fr 1fr",
        gap: 16,
        marginTop: 18
      }}>

        {/* LEFT: LIVE ALERT STREAM */}
        <Panel title="🚨 LIVE INCIDENT STREAM">

          {data.alerts.map((a, i) => (
            <AlertRow key={i} a={a} />
          ))}

        </Panel>

        {/* RIGHT SIDE */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>

          <Panel title="🧠 SYSTEM RISK SCORE">
            <BigScore value={data.riskScore} />
          </Panel>

          <Panel title="📡 ROOT CAUSE ANALYSIS">
            <div style={{ fontSize: 13, lineHeight: 1.6 }}>
              {data.analysis}
            </div>
          </Panel>

          <Panel title="⚡ AUTONOMOUS RESPONSES">
            <ul style={{ fontSize: 13, lineHeight: 1.8 }}>
              {data.actions.map((a, i) => (
                <li key={i}>→ {a}</li>
              ))}
            </ul>
          </Panel>

        </div>
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
        🚨 SCHOOL INCIDENT CONTROL CENTER
      </div>
      <div style={{ fontSize: 12, color: "#94a3b8" }}>
        Real-time anomalies, risks, and system-wide behavioral alerts
      </div>
    </div>
  )
}

/* ================= KPI ================= */

function KPIBar({ data }) {
  return (
    <div style={{
      display: "grid",
      gridTemplateColumns: "repeat(4, 1fr)",
      gap: 12
    }}>
      <KPI label="Critical Alerts" value={data.critical} color="#ef4444" />
      <KPI label="Warnings" value={data.warning} color="#f59e0b" />
      <KPI label="Info Signals" value={data.info} color="#38bdf8" />
      <KPI label="System Risk" value={data.riskScore + "%"} />
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

/* ================= BIG SCORE ================= */

function BigScore({ value }) {
  const color =
    value > 75 ? "#ef4444" :
    value > 50 ? "#f59e0b" :
    "#22c55e"

  return (
    <div style={{
      fontSize: 44,
      fontWeight: 900,
      textAlign: "center",
      color
    }}>
      {value}/100
    </div>
  )
}

/* ================= ALERT ROW ================= */

function AlertRow({ a }) {
  const color =
    a.level === "critical" ? "#ef4444" :
    a.level === "warning" ? "#f59e0b" :
    "#38bdf8"

  return (
    <div style={{
      display: "flex",
      justifyContent: "space-between",
      padding: 12,
      marginBottom: 10,
      borderRadius: 12,
      background: "rgba(255,255,255,0.03)",
      borderLeft: `3px solid ${color}`
    }}>

      <div>
        <div style={{ fontWeight: 800 }}>
          {a.title}
        </div>
        <div style={{ fontSize: 11, color: "#94a3b8" }}>
          {a.source}
        </div>
      </div>

      <div style={{
        fontWeight: 900,
        color,
        textTransform: "uppercase",
        fontSize: 12
      }}>
        {a.level}
      </div>

    </div>
  )
}

/* ================= ENGINE ================= */

function buildAlertEngine(students, fees, attendance) {
  const alerts = []

  let critical = 0
  let warning = 0
  let info = 0

  // 🔥 FINANCIAL ALERTS
  fees.forEach(f => {
    const overdue = (f.amount || 0) - (f.paid || 0)

    if (overdue > 500) {
      critical++
      alerts.push({
        title: "High Debt Exposure",
        level: "critical",
        source: "Finance System"
      })
    } else if (overdue > 200) {
      warning++
      alerts.push({
        title: "Payment Delay Detected",
        level: "warning",
        source: "Finance System"
      })
    }
  })

  // 📡 ATTENDANCE ALERTS
  const absentToday = attendance.filter(a => a.status === "absent")

  if (absentToday.length > students.length * 0.4) {
    critical++
    alerts.push({
      title: "Mass Attendance Drop",
      level: "critical",
      source: "Attendance System"
    })
  }

  // 🧠 RISK SCORE
  const riskScore = Math.min(100, (critical * 25) + (warning * 10) + (info * 5))

  let analysis = ""
  let actions = []

  if (riskScore > 70) {
    analysis =
      "System instability detected. Multiple financial and behavioral anomalies are occurring simultaneously."

    actions = [
      "Trigger emergency admin review",
      "Activate automated parent notifications",
      "Freeze high-risk accounts monitoring"
    ]
  } else if (riskScore > 40) {
    analysis =
      "Moderate system instability. Early warning signals detected across financial and attendance systems."

    actions = [
      "Increase monitoring frequency",
      "Flag high-risk students",
      "Send automated reminders"
    ]
  } else {
    analysis =
      "System stable. No significant anomalies detected across monitored subsystems."

    actions = [
      "Maintain current monitoring level",
      "Log baseline behavior patterns",
      "Optimize alert thresholds"
    ]
  }

  return {
    alerts: alerts.slice(0, 12),
    critical,
    warning,
    info,
    riskScore,
    analysis,
    actions
  }
}