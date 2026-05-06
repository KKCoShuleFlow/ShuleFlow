import { useEffect, useState } from "react"
import { db } from "../db"

export default function FeesDashboard() {
  const [data, setData] = useState(null)

  useEffect(() => {
    let alive = true

    const run = async () => {
      const students = (await db.students.toArray()) || []
      const fees = (await db.fees.toArray()) || []

      if (!alive) return
      setData(buildFeesEngine(students, fees))
    }

    run()
    const t = setInterval(run, 3000)

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
        💸 Loading financial intelligence engine...
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

      {/* HEADER */}
      <Header />

      {/* KPI STRIP */}
      <KPIBar data={data} />

      {/* MAIN GRID */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "2fr 1fr",
        gap: 16,
        marginTop: 18
      }}>

        {/* LEFT: REVENUE TABLE */}
        <Panel title="💸 REVENUE COLLECTION MATRIX">

          {data.rows.map(r => (
            <FeeRow key={r.id} r={r} />
          ))}

        </Panel>

        {/* RIGHT INSIGHTS */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>

          <Panel title="🔥 FINANCIAL HEALTH SCORE">
            <BigScore value={data.health} />
          </Panel>

          <Panel title="🧠 AI FINANCIAL DIAGNOSIS">
            <div style={{ fontSize: 13, lineHeight: 1.6 }}>
              {data.insight}
            </div>
          </Panel>

          <Panel title="⚡ AUTO ACTIONS">
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
        💸 FINANCIAL CONTROL CENTER
      </div>
      <div style={{ fontSize: 12, color: "#94a3b8" }}>
        Real-time fee collection, risk pressure & revenue intelligence
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
      <KPI label="Total Expected" value={`$${data.totalExpected}`} />
      <KPI label="Collected" value={`$${data.totalPaid}`} color="#22c55e" />
      <KPI label="Outstanding" value={`$${data.outstanding}`} color="#ef4444" />
      <KPI label="Collection Rate" value={data.rate + "%"} />
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
    value > 75 ? "#22c55e" :
    value > 50 ? "#f59e0b" :
    "#ef4444"

  return (
    <div style={{
      fontSize: 42,
      fontWeight: 900,
      color,
      textAlign: "center",
      padding: 10
    }}>
      {value}/100
    </div>
  )
}

/* ================= ROW ================= */

function FeeRow({ r }) {
  return (
    <div style={{
      display: "flex",
      justifyContent: "space-between",
      padding: 10,
      marginBottom: 8,
      borderRadius: 10,
      background: "rgba(255,255,255,0.03)"
    }}>
      <div>
        <div style={{ fontWeight: 700 }}>
          {r.name}
        </div>
        <div style={{ fontSize: 11, color: "#94a3b8" }}>
          Expected: ${r.expected}
        </div>
      </div>

      <div style={{
        textAlign: "right"
      }}>
        <div style={{ color: "#22c55e", fontWeight: 800 }}>
          ${r.paid}
        </div>
        <div style={{
          fontSize: 11,
          color: r.balance > 0 ? "#ef4444" : "#22c55e"
        }}>
          Balance: ${r.balance}
        </div>
      </div>
    </div>
  )
}

/* ================= ENGINE ================= */

function buildFeesEngine(students, fees) {
  let totalExpected = 0
  let totalPaid = 0

  const rows = students.map(s => {
    const sFees = fees.filter(f => f.studentId === s.id)

    const expected = sFees.reduce((a, f) => a + Number(f.amount || 0), 0)
    const paid = sFees.reduce((a, f) => a + Number(f.paid || 0), 0)

    const balance = expected - paid

    totalExpected += expected
    totalPaid += paid

    return {
      id: s.id,
      name: s.name || "Unknown",
      expected,
      paid,
      balance
    }
  })

  const outstanding = totalExpected - totalPaid
  const rate = totalExpected ? Math.round((totalPaid / totalExpected) * 100) : 0
  const health = Math.max(0, 100 - Math.round(outstanding / 100))

  let insight = ""
  let actions = []

  if (rate < 50) {
    insight = "Critical cashflow risk detected. Collection performance is below sustainable threshold."
    actions = [
      "Trigger automated reminders",
      "Flag top 20 overdue accounts",
      "Activate payment escalation flow"
    ]
  } else if (rate < 80) {
    insight = "Moderate collection efficiency. System stable but at risk of delayed inflows."
    actions = [
      "Optimize reminder frequency",
      "Segment overdue students",
      "Improve payment compliance UX"
    ]
  } else {
    insight = "Healthy revenue flow detected. Collection system operating efficiently."
    actions = [
      "Maintain current strategy",
      "Monitor late-payment trends",
      "Optimize reporting automation"
    ]
  }

  return {
    rows,
    totalExpected,
    totalPaid,
    outstanding,
    rate,
    health,
    insight,
    actions
  }
}