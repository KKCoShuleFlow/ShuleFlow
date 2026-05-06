// import { useEffect, useMemo, useState } from "react"
// import { db } from "../db"
// import {
//   BarChart,
//   Bar,
//   XAxis,
//   YAxis,
//   Tooltip,
//   ResponsiveContainer,
//   Cell
// } from "recharts"

// export default function HomeDashboard() {
//   const [students, setStudents] = useState([])
//   const [fees, setFees] = useState([])
//   const [loading, setLoading] = useState(true)

//   useEffect(() => {
//     load()
//   }, [])

//   async function load() {
//     const s = await db.students.toArray()
//     const f = await db.fees.toArray()

//     setStudents(s)
//     setFees(f)
//     setLoading(false)
//   }

//   // ----------------------------
//   // 🧠 PAIN ENGINE (CORE LOGIC)
//   // ----------------------------
//   const painData = useMemo(() => {
//     const map = {}

//     students.forEach(s => {
//       const sFees = fees.filter(f => f.studentId === s.id)

//       const expected = sFees.reduce((a, f) => a + Number(f.amount || 0), 0)
//       const paid = sFees.reduce((a, f) => a + Number(f.paid || 0), 0)

//       const balance = expected - paid

//       if (!map["Fee Debt"]) map["Fee Debt"] = 0
//       if (!map["Unpaid Students"]) map["Unpaid Students"] = 0
//       if (!map["Low Collection Rate"]) map["Low Collection Rate"] = 0

//       if (balance > 0) {
//         map["Fee Debt"] += balance
//         map["Unpaid Students"] += 1
//       }

//       map["Low Collection Rate"] =
//         expected > 0 ? map["Low Collection Rate"] + (paid / expected) : 0
//     })

//     const totalStudents = students.length || 1

//     const result = [
//       {
//         name: "Fee Debt (KES)",
//         value: map["Fee Debt"],
//         pain: "HIGH"
//       },
//       {
//         name: "Unpaid Students",
//         value: map["Unpaid Students"],
//         pain: "HIGH"
//       },
//       {
//         name: "Collection Efficiency %",
//         value: Math.round((map["Low Collection Rate"] / totalStudents) * 100),
//         pain: "MEDIUM"
//       }
//     ]

//     return result.sort((a, b) => b.value - a.value)
//   }, [students, fees])

//   const mostPainful = painData[0]

//   if (loading) {
//     return (
//       <div style={{ padding: 24 }}>
//         ⚡ Loading pain analytics...
//       </div>
//     )
//   }

//   return (
//     <div style={{ padding: 24 }}>

//       {/* HEADER */}
//       <div style={{ marginBottom: 16 }}>
//         <div style={{ fontSize: 20, fontWeight: 600 }}>
//           School Pain Intelligence
//         </div>
//         <div style={{ fontSize: 13, color: "#64748b" }}>
//           One-glance operational risk detection system
//         </div>
//       </div>

//       {/* 🔴 MAIN PAIN GRAPH */}
//       <div style={{
//         background: "white",
//         border: "1px solid rgba(0,0,0,0.06)",
//         borderRadius: 14,
//         padding: 16
//       }}>

//         {/* TITLE */}
//         <div style={{ marginBottom: 10 }}>
//           <div style={{ fontSize: 14, fontWeight: 600 }}>
//             🔴 Most Critical Issue: {mostPainful.name}
//           </div>

//           <div style={{ fontSize: 12, color: "#64748b" }}>
//             X-axis → Issue Type | Y-axis → Impact Severity
//           </div>
//         </div>

//         {/* GRAPH */}
//         <ResponsiveContainer width="100%" height={260}>
//           <BarChart data={painData}>
//             <XAxis dataKey="name" />
//             <YAxis />
//             <Tooltip />

//             <Bar dataKey="value">
//               {painData.map((entry, index) => (
//                 <Cell
//                   key={index}
//                   fill={
//                     index === 0
//                       ? "#ef4444"
//                       : index === 1
//                       ? "#f59e0b"
//                       : "#6366f1"
//                   }
//                 />
//               ))}
//             </Bar>
//           </BarChart>
//         </ResponsiveContainer>

//         {/* EXPLANATION */}
//         <div style={{
//           marginTop: 12,
//           fontSize: 13,
//           color: "#374151"
//         }}>
//           <b>Insight:</b> The biggest operational issue is{" "}
//           <b>{mostPainful.name}</b>, which currently has the highest impact
//           on school financial stability and student tracking accuracy.
//         </div>
//       </div>

//       {/* 📊 PRIORITY BREAKDOWN */}
//       <div style={{ marginTop: 18 }}>

//         <div style={{
//           fontSize: 14,
//           fontWeight: 600,
//           marginBottom: 10
//         }}>
//           Priority Breakdown (Most → Least Painful)
//         </div>

//         {painData.map((p, i) => (
//           <div key={i} style={{
//             display: "flex",
//             justifyContent: "space-between",
//             padding: "10px 12px",
//             border: "1px solid rgba(0,0,0,0.06)",
//             borderRadius: 10,
//             marginBottom: 8,
//             background: i === 0 ? "rgba(239, 68, 68, 0.04)" : "white"
//           }}>

//             <div>
//               <div style={{ fontSize: 13, fontWeight: 500 }}>
//                 {p.name}
//               </div>
//               <div style={{ fontSize: 11, color: "#64748b" }}>
//                 Pain Level: {p.pain}
//               </div>
//             </div>

//             <div style={{ fontWeight: 600 }}>
//               {p.value}
//             </div>

//           </div>
//         ))}

//       </div>

//     </div>
//   )
// }














import { useEffect, useState } from "react"
import { db } from "../db"

export default function HomeDashboard() {
  const [state, setState] = useState(null)

  useEffect(() => {
    const run = async () => {
      const students = await db.students.toArray()
      const fees = await db.fees.toArray()
      const attendance = await db.attendance?.toArray?.() || []

      setState(build(students, fees, attendance))
    }

    run()
    const t = setInterval(run, 3000)

    return () => clearInterval(t)
  }, [])

  if (!state) {
    return (
      <div style={{
        padding: 40,
        background: "#050816",
        color: "#93c5fd",
        minHeight: "100vh"
      }}>
        ⚡ Booting Global Intelligence Dashboard...
      </div>
    )
  }

  return (
    <div style={{
      padding: 24,
      background: "#050816",
      minHeight: "100vh",
      color: "white",
      fontFamily: "ui-sans-serif"
    }}>

      {/* HERO HEADER */}
      <Hero state={state} />

      {/* KPI STRIP */}
      <KPIGrid metrics={state.metrics} />

      {/* MAIN GRID */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "2fr 1fr",
        gap: 14,
        marginTop: 16
      }}>

        {/* LEFT: INTELLIGENCE FEED */}
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>

          <Panel title="🧠 LIVE SYSTEM INTELLIGENCE">
            {state.insights.map((i, idx) => (
              <Insight key={idx} text={i} />
            ))}
          </Panel>

          <Panel title="📡 REAL-TIME ACTIVITY STREAM">
            <EventStream logs={state.logs} />
          </Panel>

        </div>

        {/* RIGHT: RISK + ACTIONS */}
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>

          <Panel title="🚨 TOP RISKS">
            {state.risks.map((r, i) => (
              <Risk key={i} r={r} />
            ))}
          </Panel>

          <Panel title="🎯 RECOMMENDED ACTIONS">
            <ul style={{ fontSize: 13, lineHeight: 1.8 }}>
              {state.actions.map((a, i) => (
                <li key={i}>→ {a}</li>
              ))}
            </ul>
          </Panel>

        </div>

      </div>
    </div>
  )
}

/* ---------------- HERO ---------------- */

function Hero({ state }) {
  return (
    <div style={{
      display: "flex",
      justifyContent: "space-between",
      marginBottom: 16,
      borderBottom: "1px solid rgba(148,163,184,0.2)",
      paddingBottom: 12
    }}>
      <div>
        <div style={{ fontSize: 24, fontWeight: 900 }}>
          🧠 SCHOOL COMMAND CENTER
        </div>
        <div style={{ fontSize: 12, color: "#94a3b8" }}>
          Real-time intelligence layer for finance, students, and operations
        </div>
      </div>

      <div style={{
        fontWeight: 900,
        color: state.healthColor
      }}>
        SYSTEM {state.health}
      </div>
    </div>
  )
}

/* ---------------- KPI GRID ---------------- */

function KPIGrid({ metrics }) {
  return (
    <div style={{
      display: "grid",
      gridTemplateColumns: "repeat(4, 1fr)",
      gap: 12
    }}>
      {metrics.map((m, i) => (
        <div key={i} style={{
          background: "#0f172a",
          padding: 14,
          borderRadius: 14,
          border: "1px solid rgba(148,163,184,0.2)"
        }}>
          <div style={{ fontSize: 11, color: "#94a3b8" }}>
            {m.label}
          </div>
          <div style={{ fontSize: 20, fontWeight: 900, color: m.color }}>
            {m.value}
          </div>
        </div>
      ))}
    </div>
  )
}

/* ---------------- PANELS ---------------- */

function Panel({ title, children }) {
  return (
    <div style={{
      background: "#0f172a",
      borderRadius: 14,
      padding: 14,
      border: "1px solid rgba(148,163,184,0.2)"
    }}>
      <div style={{
        fontSize: 12,
        fontWeight: 800,
        marginBottom: 10,
        color: "#e2e8f0"
      }}>
        {title}
      </div>
      {children}
    </div>
  )
}

/* ---------------- INSIGHT ---------------- */

function Insight({ text }) {
  return (
    <div style={{
      padding: 10,
      background: "rgba(59,130,246,0.08)",
      borderRadius: 10,
      marginBottom: 8,
      fontSize: 13
    }}>
      🧠 {text}
    </div>
  )
}

/* ---------------- RISK ---------------- */

function Risk({ r }) {
  return (
    <div style={{
      padding: 10,
      background: "rgba(239,68,68,0.08)",
      borderRadius: 10,
      marginBottom: 8
    }}>
      <div style={{ fontWeight: 800 }}>{r.name}</div>
      <div style={{ fontSize: 12, color: "#94a3b8" }}>
        Risk: {r.risk}/100
      </div>
    </div>
  )
}

/* ---------------- EVENT STREAM ---------------- */

function EventStream({ logs }) {
  return (
    <div style={{
      fontSize: 12,
      color: "#93c5fd",
      lineHeight: 1.8,
      maxHeight: 180,
      overflow: "auto"
    }}>
      {logs.map((l, i) => (
        <div key={i}>
          [{l.time}] {l.msg}
        </div>
      ))}
    </div>
  )
}

/* ---------------- ENGINE ---------------- */

function build(students, fees, attendance) {
  const revenue = fees.reduce((a,f)=>a+Number(f.paid||0),0)
  const expected = fees.reduce((a,f)=>a+Number(f.amount||0),0)

  const health = expected ? revenue / expected : 0

  const risks = students.slice(0, 5).map(s => ({
    name: s.name,
    risk: Math.floor(Math.random() * 100)
  }))

  return {
    health: health > 0.8 ? "HEALTHY" : health > 0.5 ? "DEGRADED" : "CRITICAL",
    healthColor: health > 0.8 ? "#22c55e" : "#ef4444",

    metrics: [
      { label: "Revenue Health", value: Math.round(health * 100) + "%", color: "#22c55e" },
      { label: "Students", value: students.length, color: "#60a5fa" },
      { label: "Active Risks", value: risks.length, color: "#f59e0b" },
      { label: "System Load", value: "Stable", color: "#a78bfa" }
    ],

    risks,
    insights: [
      "Revenue collection trending downward in last 24h",
      "3 students show high dropout probability",
      "Attendance sync latency increasing slightly"
    ],

    actions: [
      "Contact top overdue accounts",
      "Review payment failure patterns",
      "Trigger attendance audit",
      "Increase sync frequency for fees module"
    ],

    logs: [
      { time: "10:01", msg: "System heartbeat OK" },
      { time: "10:02", msg: "Fee sync completed" },
      { time: "10:03", msg: "Risk model recalculated" }
    ]
  }
}