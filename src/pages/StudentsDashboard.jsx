// import { useEffect, useState } from "react"
// import { db } from "../db"

// export default function StudentsDashboard() {
//   const [data, setData] = useState(null)

//   useEffect(() => {
//     const run = async () => {
//       const students = await db.students.toArray()
//       const fees = await db.fees.toArray()

//       setData(build(students, fees))
//     }

//     run()
//     const t = setInterval(run, 2500)

//     return () => clearInterval(t)
//   }, [])

//   if (!data) {
//     return (
//       <div style={{
//         padding: 24,
//         background: "#050816",
//         color: "#93c5fd",
//         minHeight: "100vh"
//       }}>
//         🧠 Loading student intelligence engine...
//       </div>
//     )
//   }

//   const top = data?.students?.[0] || null

//   return (
//     <div style={{
//       padding: 24,
//       background: "#050816",
//       minHeight: "100vh",
//       color: "white"
//     }}>

//       {/* HEADER */}
//       <Header />

//       {/* TOP STRIP */}
//       <TopKPIs data={data} />

//       {/* MAIN GRID */}
//       <div style={{
//         display: "grid",
//         gridTemplateColumns: "2fr 1fr",
//         gap: 14,
//         marginTop: 16
//       }}>

//         {/* LEFT: STUDENT RISK BOARD */}
//         <Panel title="🧠 STUDENT RISK INTELLIGENCE">
//           {data.students.map((s, i) => (
//             <StudentRow key={i} s={s} />
//           ))}
//         </Panel>

//         {/* RIGHT: INSIGHTS */}
//         <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>

//           <Panel title="🔴 HIGHEST RISK">
//   <div style={{ fontWeight: 900, fontSize: 16 }}> 
//     {top?.name || "All Clear"} 
//   </div>
//   {top && (
//     <>
//       <div style={{ fontSize: 12, color: "#94a3b8", marginTop: 4 }}> 
//         Risk Score: {top.risk}/100 
//       </div>
//       <div style={{ fontSize: 12, color: "#ef4444" }}> 
//         Debt: ${top.balance} 
//       </div>
//     </>
//   )}
// </Panel>

//           <Panel title="🧠 AI INSIGHT ENGINE">
//             <div style={{ fontSize: 13, lineHeight: 1.6 }}>
//               {data.insight}
//             </div>
//           </Panel>

//           <Panel title="🎯 RECOMMENDED ACTIONS">
//             <ul style={{ fontSize: 13, lineHeight: 1.8 }}>
//               {data.actions.map((a, i) => (
//                 <li key={i}>→ {a}</li>
//               ))}
//             </ul>
//           </Panel>

//         </div>
//       </div>
//     </div>
//   )
// }

// /* ---------------- HEADER ---------------- */

// function Header() {
//   return (
//     <div style={{
//       marginBottom: 14,
//       borderBottom: "1px solid rgba(148,163,184,0.2)",
//       paddingBottom: 10
//     }}>
//       <div style={{ fontSize: 22, fontWeight: 900 }}>
//         🧠 STUDENT INTELLIGENCE SYSTEM
//       </div>
//       <div style={{ fontSize: 12, color: "#94a3b8" }}>
//         Live behavioral + financial risk modeling per student
//       </div>
//     </div>
//   )
// }

// /* ---------------- TOP KPIs ---------------- */

// function TopKPIs({ data }) {
//   return (
//     <div style={{
//       display: "grid",
//       gridTemplateColumns: "repeat(4, 1fr)",
//       gap: 12
//     }}>
//       <KPI label="Total Students" value={data.total} />
//       <KPI label="High Risk" value={data.high} color="#ef4444" />
//       <KPI label="Revenue Risk" value={data.revenueRisk + "%"} />
//       <KPI label="Avg Risk Score" value={data.avgRisk} />
//     </div>
//   )
// }

// function KPI({ label, value, color = "white" }) {
//   return (
//     <div style={{
//       background: "#0f172a",
//       padding: 14,
//       borderRadius: 14,
//       border: "1px solid rgba(148,163,184,0.2)"
//     }}>
//       <div style={{ fontSize: 11, color: "#94a3b8" }}>
//         {label}
//       </div>
//       <div style={{ fontSize: 20, fontWeight: 900, color }}>
//         {value}
//       </div>
//     </div>
//   )
// }

// /* ---------------- PANEL ---------------- */

// function Panel({ title, children }) {
//   return (
//     <div style={{
//       background: "#0f172a",
//       border: "1px solid rgba(148,163,184,0.2)",
//       borderRadius: 14,
//       padding: 14
//     }}>
//       <div style={{
//         fontSize: 12,
//         fontWeight: 800,
//         marginBottom: 10
//       }}>
//         {title}
//       </div>
//       {children}
//     </div>
//   )
// }

// /* ---------------- STUDENT ROW ---------------- */

// function StudentRow({ s }) {
//   const color =
//     s.risk > 70 ? "#ef4444" :
//     s.risk > 40 ? "#f59e0b" :
//     "#22c55e"

//   return (
//     <div style={{
//       display: "flex",
//       justifyContent: "space-between",
//       padding: 10,
//       marginBottom: 8,
//       borderRadius: 10,
//       background: "rgba(255,255,255,0.03)"
//     }}>

//       <div>
//         <div style={{ fontWeight: 700 }}>{s.name}</div>
//         <div style={{ fontSize: 11, color: "#94a3b8" }}>
//           Balance: {s.balance}
//         </div>
//       </div>

//       <div style={{
//         fontWeight: 900,
//         color
//       }}>
//         {s.risk}/100
//       </div>

//     </div>
//   )
// }

// /* ---------------- ENGINE ---------------- */

// <Panel title="🔴 HIGHEST RISK">
//   <div style={{ fontWeight: 900, fontSize: 16 }}> 
//     {top?.name || "All Clear"} 
//   </div>
//   {top && (
//     <>
//       <div style={{ fontSize: 12, color: "#94a3b8", marginTop: 4 }}> 
//         Risk Score: {top.risk}/100 
//       </div>
//       <div style={{ fontSize: 12, color: "#ef4444" }}> 
//         Debt: ${top.balance} 
//       </div>
//     </>
//   )}
// </Panel>















import { useEffect, useState } from "react"
import { db } from "../db/index"

export default function StudentsDashboard() {
  const [data, setData] = useState(null)

  useEffect(() => {
    let active = true

    const run = async () => {
      try {
        const students = (await db.students.toArray()) || []
        const fees = (await db.fees.toArray()) || []

        if (!active) return
        setData(build(students, fees))
      } catch (err) {
        console.error("StudentsDashboard error:", err)
      }
    }

    run()
    const interval = setInterval(run, 2500)

    return () => {
      active = false
      clearInterval(interval)
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
        justifyContent: "center",
        fontSize: 14
      }}>
        🧠 Initializing Student Intelligence Engine...
      </div>
    )
  }

  const top = data.students?.[0] || null

  return (
    <div style={{
      padding: 24,
      minHeight: "100vh",
      background: "#050816",
      color: "white"
    }}>

      {/* HEADER */}
      <Header />

      {/* KPI ROW */}
      <TopKPIs data={data} />

      {/* MAIN GRID */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "2fr 1fr",
        gap: 16,
        marginTop: 18
      }}>

        {/* LEFT: RISK TABLE */}
        <Panel title="🧠 STUDENT RISK MATRIX">
          {(data.students || []).length === 0 ? (
            <div style={{ color: "#94a3b8", fontSize: 13 }}>
              No students available
            </div>
          ) : (
            data.students.map((s) => (
              <StudentRow key={s.id || s.name} s={s} />
            ))
          )}
        </Panel>

        {/* RIGHT SIDE */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>

          <Panel title="🔴 TOP RISK STUDENT">
            <div style={{ fontWeight: 900, fontSize: 16 }}>
              {top?.name || "System Stable"}
            </div>

            <div style={{ fontSize: 12, color: "#94a3b8", marginTop: 6 }}>
              Risk Score: {top?.risk ?? 0}/100
            </div>

            <div style={{ fontSize: 12, color: "#ef4444", marginTop: 4 }}>
              Debt: ${top?.balance ?? 0}
            </div>
          </Panel>

          <Panel title="🧠 AI INSIGHTS ENGINE">
            <div style={{ fontSize: 13, lineHeight: 1.6 }}>
              {data.insight}
            </div>
          </Panel>

          <Panel title="🎯 SYSTEM ACTIONS">
            <ul style={{ fontSize: 13, lineHeight: 1.8 }}>
              {(data.actions || []).map((a, i) => (
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
      paddingBottom: 12,
      borderBottom: "1px solid rgba(148,163,184,0.2)"
    }}>
      <div style={{ fontSize: 22, fontWeight: 900 }}>
        🧠 STUDENT INTELLIGENCE SYSTEM
      </div>
      <div style={{ fontSize: 12, color: "#94a3b8" }}>
        Real-time financial + behavioral risk analytics engine
      </div>
    </div>
  )
}

/* ================= KPI ================= */

function TopKPIs({ data }) {
  return (
    <div style={{
      display: "grid",
      gridTemplateColumns: "repeat(4, 1fr)",
      gap: 12
    }}>
      <KPI label="Students" value={data.total} />
      <KPI label="High Risk" value={data.high} color="#ef4444" />
      <KPI label="Avg Risk" value={data.avgRisk} />
      <KPI label="Revenue Risk" value={data.revenueRisk + "%"} />
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

/* ================= ROW ================= */

function StudentRow({ s }) {
  const color =
    s.risk > 70 ? "#ef4444" :
    s.risk > 40 ? "#f59e0b" :
    "#22c55e"

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
          {s.name}
        </div>
        <div style={{ fontSize: 11, color: "#94a3b8" }}>
          Balance: {s.balance}
        </div>
      </div>

      <div style={{
        fontWeight: 900,
        color
      }}>
        {s.risk}/100
      </div>
    </div>
  )
}

/* ================= ENGINE ================= */
function build(students, fees) {
  const enriched = (students || []).map(s => {
    const sFees = fees.filter(f => f.studentId === s.id)

    const expected = sFees.reduce((a, f) => a + Number(f.amount || 0), 0)
    const paid = sFees.reduce((a, f) => a + Number(f.paid || 0), 0)

    const balance = expected - paid

    let risk = 10
    if (balance > 0) risk += Math.min(balance / 100, 60)
    if (expected > 0) risk += (1 - paid / expected) * 30

    return {
      id: s.id,
      name: s.name || "Unknown",
      risk: Math.min(Math.round(risk), 100),
      balance: balance || 0
    }
  }).sort((a, b) => b.risk - a.risk)

  const total = enriched.length
  const high = enriched.filter(s => s.risk > 70).length
  const avgRisk = Math.round(
    enriched.reduce((a, b) => a + b.risk, 0) / (total || 1)
  )

  return {
    students: enriched,
    total,
    high,
    avgRisk,
    revenueRisk: Math.max(0, 100 - avgRisk),
    insight:
      total === 0
        ? "No student data detected — system idle mode"
        : "Live risk engine analyzing financial stress + behavior patterns",
    actions:
      high > 0
        ? ["Contact high-risk students", "Review unpaid balances", "Trigger alerts"]
        : ["System stable", "Continue monitoring trends"]
  }
}