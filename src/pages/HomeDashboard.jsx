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
import { subscribeFees, subscribeStudents } from "../lib/realtimePain"
import { calculatePain } from "../lib/painAI"

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell
} from "recharts"

export default function HomeDashboard() {
  const [students, setStudents] = useState([])
  const [fees, setFees] = useState([])
  const [analysis, setAnalysis] = useState(null)
  const [loading, setLoading] = useState(true)

  // ----------------------------
  // INIT + REALTIME SYNC
  // ----------------------------
  useEffect(() => {
    let unsub1
    let unsub2

    async function init() {
      const s = await db.students.toArray()
      const f = await db.fees.toArray()

      setStudents(s || [])
      setFees(f || [])
      setLoading(false)
    }

    init()

    unsub1 = subscribeStudents(async () => {
      const s = await db.students.toArray()
      setStudents(s || [])
    })

    unsub2 = subscribeFees(async () => {
      const f = await db.fees.toArray()
      setFees(f || [])
    })

    return () => {
      if (unsub1) unsub1()
      if (unsub2) unsub2()
    }
  }, [])

  // ----------------------------
  // PAIN CALC
  // ----------------------------
  useEffect(() => {
    if (!students || !fees) return

    const result = calculatePain(students, fees)

    if (result) {
      setAnalysis(result)
    }
  }, [students, fees])

  if (loading || !analysis) {
    return (
      <div style={{ padding: 24 }}>
        ⚡ Syncing live school intelligence...
      </div>
    )
  }

  return (
    <div style={{ padding: 24 }}>

      {/* HEADER */}
      <div style={{ marginBottom: 16 }}>
        <div style={{ fontSize: 20, fontWeight: 600 }}>
          Real-Time School Pain Engine
        </div>
        <div style={{ fontSize: 13, color: "#64748b" }}>
          Updates instantly when clerk changes data
        </div>
      </div>

      {/* 🔴 MAIN PAIN GRAPH */}
      <div style={{
        background: "white",
        border: "1px solid rgba(0,0,0,0.06)",
        borderRadius: 14,
        padding: 16
      }}>

        <div style={{ fontSize: 14, fontWeight: 600 }}>
          🔴 Most Critical Issue: {analysis.mostPainful?.name}
        </div>

        <div style={{ fontSize: 12, color: "#64748b", marginBottom: 10 }}>
          X-axis → Problem Type | Y-axis → Impact Severity
        </div>

        <ResponsiveContainer width="100%" height={260}>
          <BarChart data={analysis.chart || []}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />

            <Bar dataKey="value">
              {(analysis.chart || []).map((_, i) => (
                <Cell
                  key={i}
                  fill={
                    i === 0 ? "#ef4444" :
                    i === 1 ? "#f59e0b" :
                    "#6366f1"
                  }
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>

      </div>

      {/* 🤖 AI INSIGHT LAYER (FIXED COMPONENT) */}
      <AIInsight analysis={analysis} />

    </div>
  )
}

/* ----------------------------
   🤖 AI INSIGHT COMPONENT
---------------------------- */

function AIInsight({ analysis }) {
  const top = analysis?.mostPainful

  const insights = [
    top?.name === "Fee Debt (KES)" &&
      "Cash flow pressure is increasing due to unpaid balances.",

    top?.name === "Unpaid Students" &&
      "Multiple students are consistently behind on payments.",

    top?.name === "Collection Efficiency %" &&
      "Revenue collection efficiency is below optimal range."
  ].filter(Boolean)

  return (
    <div style={{
      marginTop: 16,
      padding: 14,
      borderRadius: 12,
      background: "rgba(79, 70, 229, 0.05)",
      border: "1px solid rgba(79, 70, 229, 0.15)"
    }}>

      <div style={{ fontSize: 13, fontWeight: 600 }}>
        📊 System Insight
      </div>

      <div style={{ fontSize: 13, marginTop: 6 }}>
        {insights[0] || "System is operating within expected ranges."}
      </div>

      <div style={{
        marginTop: 8,
        fontSize: 11,
        color: "#64748b"
      }}>
        Based on live school financial + student data
      </div>

    </div>
  )
}