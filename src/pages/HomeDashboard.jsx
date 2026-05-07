// import { useEffect, useState } from "react"
// import { supabase } from "../lib/supabase"
// import { useAuth } from "../context/AuthContext"
// import { createEventEngine } from "../lib/event/createEventEngine"
// import { formatEvent } from "../lib/event/formatEvent"

// /* ---------------- REALTIME HOOK ---------------- */
// function useStudentsRealtime(setEvents) {
//   const [students, setStudents] = useState([])

//   useEffect(() => {

//     /* ---------------- LOAD STUDENTS ---------------- */

//     const load = async () => {
//       const { data } = await supabase
//         .from("students")
//         .select("*")

//       setStudents(data || [])
//     }

//     load()

//     /* ---------------- REALTIME STUDENTS ---------------- */

//     const channel = supabase
//       .channel("students-live")
//       .on(
//         "postgres_changes",
//         {
//           event: "*",
//           schema: "public",
//           table: "students",
//         },
//         load
//       )
//       .subscribe()

//     /* ---------------- EVENT ENGINE ---------------- */

//     const cleanupEngine = createEventEngine(setEvents)

//     /* ---------------- CLEANUP ---------------- */

//     return () => {
//       supabase.removeChannel(channel)
//       cleanupEngine()
//     }

//   }, [])

//   return students
// }

// /* ---------------- MAIN ---------------- */

// export default function HomeDashboard() {
//   const [events, setEvents] = useState([])
// const students = useStudentsRealtime(setEvents)

//   const [fees, setFees] = useState([])
//   const [attendance, setAttendance] = useState([])
//   const [state, setState] = useState(null)

//   const { profile } = useAuth()

//   /* LOAD OTHER TABLES */
//   useEffect(() => {
//     const loadOtherData = async () => {
//       const { data: feesData } = await supabase.from("fees").select("*")
//       const { data: attendanceData } = await supabase.from("attendance").select("*")

//       setFees(feesData || [])
//       setAttendance(attendanceData || [])
//     }

//     loadOtherData()
//   }, [])

//   /* ENGINE */
//   useEffect(() => {
//     if (!students) return

//     const built = build(students, fees, attendance)

//     /* EVENT DETECTION (simple diff trigger) */
//     if (state && students.length !== state.metrics?.[1]?.value) {
//       setEvents((prev) => [
//         {
//           time: new Date().toLocaleTimeString(),
//           msg: `Student update detected (${students.length})`,
//         },
//         ...prev.slice(0, 10),
//       ])
//     }

//     setState(built)
//   }, [students, fees, attendance])

//   if (!state) {
//     return (
//       <div style={styles.loading}>
//         ⚡ Booting Global Intelligence Dashboard...
//       </div>
//     )
//   }

  


//   return (
//     <div style={styles.wrapper}>

//       <Hero state={state} />
//       <KPIGrid metrics={state.metrics} />

//       <div style={styles.main}>

//         <div style={styles.left}>
//           <Panel title="🧠 LIVE SYSTEM INTELLIGENCE">
//             {state.insights.map((i, idx) => (
//               <Insight key={idx} text={i} />
//             ))}
//           </Panel>

//           <Panel title="📡 REAL-TIME ACTIVITY STREAM">

//             {/* LIVE EVENTS */}
//             <EventStream logs={[...events, ...state.logs]} />

//           </Panel>
//         </div>

//         <div style={styles.right}>
//           <Panel title="🚨 TOP RISKS">
//             {state.risks.map((r, i) => (
//               <Risk key={i} r={r} />
//             ))}
//           </Panel>

//           <Panel title="🎯 RECOMMENDED ACTIONS">
//             <ul style={styles.list}>
//               {state.actions.map((a, i) => (
//                 <li key={i}>→ {a}</li>
//               ))}
//             </ul>
//           </Panel>
//         </div>

//       </div>
//     </div>
//   )
// }

// /* ---------------- UI ---------------- */

// function Hero({ state }) {
//   return (
//     <div style={styles.hero}>
//       <div>
//         <div style={styles.title}>🧠 SCHOOL COMMAND CENTER</div>
//         <div style={styles.subtitle}>
//           Real-time intelligence layer
//         </div>
//       </div>

//       <div style={{ ...styles.health, color: state.healthColor }}>
//         SYSTEM {state.health}
//       </div>
//     </div>
//   )
// }

// function KPIGrid({ metrics }) {
//   return (
//     <div style={styles.grid}>
//       {metrics.map((m, i) => (
//         <div key={i} style={styles.card}>
//           <div style={styles.label}>{m.label}</div>
//           <div style={{ ...styles.value, color: m.color }}>
//             {m.value}
//           </div>
//         </div>
//       ))}
//     </div>
//   )
// }

// function Panel({ title, children }) {
//   return (
//     <div style={styles.panel}>
//       <div style={styles.panelTitle}>{title}</div>
//       {children}
//     </div>
//   )
// }

// function Insight({ text }) {
//   return <div style={styles.insight}>🧠 {text}</div>
// }

// function Risk({ r }) {
//   const color =
//     r.risk > 70 ? "#ef4444" :
//     r.risk > 40 ? "#f59e0b" :
//     "#22c55e"

//   return (
//     <div style={styles.risk}>
//       <div style={{ fontWeight: 800 }}>{r.name}</div>
//       <div style={{ fontSize: 12, opacity: 0.6, color }}>
//         Risk: {r.risk}/100
//       </div>
//     </div>
//   )
// }

// function EventStream({ logs }) {
//   return (
//     <div style={styles.logs}>
//       {logs.map((l, i) => (
//         <div key={i}>
//           [{l.time}] {l.msg}
//         </div>
//       ))}
//     </div>
//   )
// }

// /* ---------------- ENGINE ---------------- */

// function build(students, fees, attendance) {
//   const revenue = fees.reduce((a,f)=>a+Number(f.paid||0),0)
//   const expected = fees.reduce((a,f)=>a+Number(f.amount||0),0)

//   const healthRatio = expected ? revenue / expected : 0

//   const risks = students.slice(0, 5).map(s => {
//     const unpaid = fees.filter(f => f.studentId === s.id && Number(f.amount) > Number(f.paid || 0)).length

//     return {
//       name: s.name,
//       risk: Math.min(100, unpaid * 20)
//     }
//   })

//   return {
//     health: healthRatio > 0.8 ? "HEALTHY" :
//             healthRatio > 0.5 ? "DEGRADED" : "CRITICAL",

//     healthColor: healthRatio > 0.8 ? "#22c55e" : "#ef4444",

//     metrics: [
//       { label: "Revenue Health", value: Math.round(healthRatio * 100) + "%", color: "#22c55e" },
//       { label: "Students", value: students.length, color: "#60a5fa" },
//       { label: "Active Risks", value: risks.length, color: "#f59e0b" },
//       { label: "System Load", value: "Stable", color: "#a78bfa" }
//     ],

//     risks,

//     insights: [
//       students.length === 0
//         ? "No student data detected yet"
//         : "Student dataset actively updating in real-time",

//       "Fee collection tracking active",
//       "Attendance sync stable"
//     ],

//     actions: [
//       "Review unpaid fees",
//       "Monitor at-risk students",
//       "Validate attendance logs"
//     ],

//     logs: [
//       { time: "LIVE", msg: "System heartbeat active" },
//       { time: "SYNC", msg: "Database connection stable" }
//     ]
//   }
// }

// /* ---------------- STYLES ---------------- */

// const styles = {
//   wrapper: {
//     padding: 20,
//     background: "#050816",
//     height: "100vh",
//     overflow: "hidden",
//     color: "white",
//     fontFamily: "Inter",
//   },

//   loading: {
//     padding: 40,
//     background: "#050816",
//     color: "#93c5fd"
//   },

//   hero: {
//     display: "flex",
//     justifyContent: "space-between",
//     marginBottom: 16,
//     borderBottom: "1px solid rgba(255,255,255,0.1)",
//     paddingBottom: 12
//   },

//   title: { fontSize: 22, fontWeight: 900 },
//   subtitle: { fontSize: 12, opacity: 0.6 },
//   health: { fontWeight: 900 },

//   grid: {
//     display: "grid",
//     gridTemplateColumns: "repeat(4,1fr)",
//     gap: 12
//   },

//   card: {
//     background: "#0f172a",
//     padding: 14,
//     borderRadius: 14
//   },

//   label: { fontSize: 11, opacity: 0.6 },
//   value: { fontSize: 20, fontWeight: 900 },

//   main: {
//     display: "grid",
//     gridTemplateColumns: "2fr 1fr",
//     gap: 14,
//     marginTop: 16
//   },

//   left: { display: "flex", flexDirection: "column", gap: 14 },
//   right: { display: "flex", flexDirection: "column", gap: 14 },

//   panel: {
//     background: "#0f172a",
//     padding: 14,
//     borderRadius: 14
//   },

//   panelTitle: {
//     fontSize: 12,
//     fontWeight: 800,
//     marginBottom: 10
//   },

//   insight: {
//     padding: 10,
//     background: "rgba(59,130,246,0.08)",
//     borderRadius: 10,
//     marginBottom: 8
//   },

//   risk: {
//     padding: 10,
//     background: "rgba(239,68,68,0.08)",
//     borderRadius: 10,
//     marginBottom: 8
//   },

//   logs: {
//     fontSize: 12,
//     color: "#93c5fd",
//     maxHeight: 180,
//     overflow: "auto"
//   },

//   list: {
//     fontSize: 13,
//     lineHeight: 1.8
//   }
// }



















import { useEffect, useState, useMemo } from "react"
import { supabase } from "../lib/supabase"

export default function HomeDashboard() {
  const [data, setData] = useState({
    students: [],
    fees: [],
    attendance: [],
    alerts: [],
  })

  const load = async () => {
    const [{ data: s }, { data: f }, { data: a }, { data: al }] =
      await Promise.all([
        supabase.from("students").select("*"),
        supabase.from("fees").select("*"),
        supabase.from("attendance").select("*"),
        supabase.from("alerts").select("*"),
      ])

    setData({
      students: s || [],
      fees: f || [],
      attendance: a || [],
      alerts: al || [],
    })
  }

  useEffect(() => {
    load()

    const channel = supabase
      .channel("home-live")
      .on("postgres_changes", { event: "*", schema: "public", table: "fees" }, load)
      .on("postgres_changes", { event: "*", schema: "public", table: "students" }, load)
      .on("postgres_changes", { event: "*", schema: "public", table: "attendance" }, load)
      .on("postgres_changes", { event: "*", schema: "public", table: "alerts" }, load)
      .subscribe()

    return () => supabase.removeChannel(channel)
  }, [])

  /* ---------------- DECISION ENGINE ---------------- */
  const insight = useMemo(() => {
    const students = data.students
    const fees = data.fees
    const attendance = data.attendance

    const totalRevenue = fees.reduce((a, f) => a + Number(f.paid || 0), 0)
    const totalDue = fees.reduce((a, f) => a + Number(f.amount || 0), 0)
    const outstanding = totalDue - totalRevenue

    const attendanceRate =
      attendance.length > 0
        ? (attendance.filter(a => a.status === "present").length /
            attendance.length) * 100
        : 0

    const riskyStudents = students.filter((s) => {
      const studentFees = fees.filter(f => f.student_id === s.id)
      const paid = studentFees.reduce((a, f) => a + Number(f.paid || 0), 0)
      const due = studentFees.reduce((a, f) => a + Number(f.amount || 0), 0)

      const balance = due - paid

      const studentAttendance = attendance.filter(a => a.student_id === s.id)
      const attRate =
        studentAttendance.length > 0
          ? (studentAttendance.filter(a => a.status === "present").length /
              studentAttendance.length) * 100
          : 100

      return balance > 0 || attRate < 60
    })

    /* ---------------- CORE DECISIONS ---------------- */

    const alerts = []

    if (outstanding > 0) {
      alerts.push("⚠️ Revenue leakage detected — follow up unpaid fees")
    }

    if (attendanceRate < 70) {
      alerts.push("📉 Attendance is dropping — review classes immediately")
    }

    if (riskyStudents.length > 0) {
      alerts.push(`👨‍🎓 ${riskyStudents.length} students need intervention`)
    }

    if (attendanceRate > 90 && outstanding === 0) {
      alerts.push("✅ School health is excellent")
    }

    return {
      totalRevenue,
      outstanding,
      attendanceRate,
      riskyStudents,
      alerts,
    }
  }, [data])

  return (
    <div style={styles.wrapper}>

      {/* HEADER */}
      <div style={styles.header}>
        <div style={styles.title}>🧠 SCHOOL DECISION OS</div>
        <div style={styles.subtitle}>
          Admin intelligence layer — decisions in seconds
        </div>
      </div>

      {/* KPI STRIP */}
      <div style={styles.kpiGrid}>
        <KPI label="Revenue" value={insight.totalRevenue} color="#22c55e" />
        <KPI label="Outstanding" value={insight.outstanding} color="#ef4444" />
        <KPI label="Attendance" value={`${insight.attendanceRate.toFixed(1)}%`} color="#38bdf8" />
        <KPI label="Risk Students" value={insight.riskyStudents.length} color="#f59e0b" />
      </div>

      {/* DECISION PANEL */}
      <div style={styles.panel}>
        <div style={styles.panelTitle}>⚡ WHAT YOU MUST DO NOW</div>

        {insight.alerts.map((a, i) => (
          <div key={i} style={styles.alert}>
            {a}
          </div>
        ))}
      </div>
      

      {/* RISK STUDENTS */}
      <div style={styles.panel}>
        <div style={styles.panelTitle}>👨‍🎓 Students Needing Action</div>

        {insight.riskyStudents.length === 0 && (
          <div style={styles.ok}>No intervention needed</div>
        )}

        {insight.riskyStudents.slice(0, 5).map((s, i) => (
          <div key={i} style={styles.row}>
            <div>{s.name}</div>
            <div style={styles.badge}>Review</div>
          </div>
        ))}
      </div>

    </div>
  )
}

/* ---------------- UI ---------------- */

function KPI({ label, value, color }) {
  return (
    <div style={styles.kpi}>
      <div style={styles.kpiLabel}>{label}</div>
      <div style={{ ...styles.kpiValue, color }}>{value}</div>
    </div>
  )
}

const styles = {
  wrapper: {
    padding: 20,
    background: "#050816",
    color: "white",
    fontFamily: "Inter, system-ui",
    minHeight: "100vh",
  },

  header: {
    marginBottom: 14,
  },

  title: {
    fontSize: 22,
    fontWeight: 900,
  },

  subtitle: {
    fontSize: 12,
    opacity: 0.6,
  },

  kpiGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(4,1fr)",
    gap: 10,
    marginBottom: 14,
  },

  kpi: {
    background: "#0f172a",
    padding: 14,
    borderRadius: 12,
  },

  kpiLabel: {
    fontSize: 11,
    opacity: 0.6,
  },

  kpiValue: {
    fontSize: 20,
    fontWeight: 800,
    marginTop: 6,
  },

  panel: {
    background: "#0f172a",
    padding: 14,
    borderRadius: 14,
    marginBottom: 12,
  },

  panelTitle: {
    fontSize: 12,
    fontWeight: 800,
    marginBottom: 10,
  },

  alert: {
    padding: 10,
    background: "rgba(239,68,68,0.08)",
    borderRadius: 10,
    marginBottom: 6,
  },

  row: {
    display: "flex",
    justifyContent: "space-between",
    padding: 10,
    background: "rgba(255,255,255,0.03)",
    borderRadius: 10,
    marginBottom: 6,
  },

  badge: {
    fontSize: 11,
    padding: "3px 8px",
    background: "#f59e0b",
    borderRadius: 999,
  },

  ok: {
    opacity: 0.6,
    fontSize: 13,
  },
  
}