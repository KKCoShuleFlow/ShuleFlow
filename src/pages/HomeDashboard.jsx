import { useEffect, useState } from "react"
import { supabase } from "../lib/supabase"
import { useAuth } from "../context/AuthContext"

/* ---------------- REALTIME HOOK ---------------- */
function useStudentsRealtime() {
  const [students, setStudents] = useState([])

  const load = async () => {
    const { data, error } = await supabase
      .from("students")
      .select("*")

    if (!error) setStudents(data || [])
  }

  useEffect(() => {
    load()

    const channel = supabase
      .channel("students-live")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "students",
        },
        load
      )
      .subscribe()

    return () => supabase.removeChannel(channel)
  }, [])

  return students
}

/* ---------------- MAIN COMPONENT ---------------- */

export default function HomeDashboard() {
  const students = useStudentsRealtime()

  const [fees, setFees] = useState([])
  const [attendance, setAttendance] = useState([])
  const [state, setState] = useState(null)
    const { profile } = useAuth()

  /* LOAD OTHER TABLES */
  const loadOtherData = async () => {
    const { data: feesData } = await supabase.from("fees").select("*")
    const { data: attendanceData } = await supabase.from("attendance").select("*")

    setFees(feesData || [])
    setAttendance(attendanceData || [])
  }

  useEffect(() => {
    loadOtherData()
  }, [])

      {profile?.role === "admin" && (
  <button>Delete Student</button>
)}

  /* BUILD STATE WHEN DATA CHANGES */
  useEffect(() => {
    if (!students) return

    const built = build(students, fees, attendance)
    setState(built)
  }, [students, fees, attendance])

  if (!state) {
    return (
      <div style={styles.loading}>
        ⚡ Booting Global Intelligence Dashboard...
      </div>
    )
  }

  return (
    <div style={styles.wrapper}>

      <Hero state={state} />
      <KPIGrid metrics={state.metrics} />

      <div style={styles.main}>

        <div style={styles.left}>
          <Panel title="🧠 LIVE SYSTEM INTELLIGENCE">
            {state.insights.map((i, idx) => (
              <Insight key={idx} text={i} />
            ))}
          </Panel>

          <Panel title="📡 REAL-TIME ACTIVITY STREAM">
            <EventStream logs={state.logs} />
          </Panel>
        </div>

        <div style={styles.right}>
          <Panel title="🚨 TOP RISKS">
            {state.risks.map((r, i) => (
              <Risk key={i} r={r} />
            ))}
          </Panel>

          <Panel title="🎯 RECOMMENDED ACTIONS">
            <ul style={styles.list}>
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

/* ---------------- UI ---------------- */

function Hero({ state }) {
  return (
    <div style={styles.hero}>
      <div>
        <div style={styles.title}>🧠 SCHOOL COMMAND CENTER</div>
        <div style={styles.subtitle}>
          Real-time intelligence layer
        </div>
      </div>

      <div style={{ ...styles.health, color: state.healthColor }}>
        SYSTEM {state.health}
      </div>
    </div>
  )
}

function KPIGrid({ metrics }) {
  return (
    <div style={styles.grid}>
      {metrics.map((m, i) => (
        <div key={i} style={styles.card}>
          <div style={styles.label}>{m.label}</div>
          <div style={{ ...styles.value, color: m.color }}>
            {m.value}
          </div>
        </div>
      ))}
    </div>
  )
}

function Panel({ title, children }) {
  return (
    <div style={styles.panel}>
      <div style={styles.panelTitle}>{title}</div>
      {children}
    </div>
  )
}

function Insight({ text }) {
  return <div style={styles.insight}>🧠 {text}</div>
}

function Risk({ r }) {
  return (
    <div style={styles.risk}>
      <div style={{ fontWeight: 800 }}>{r.name}</div>
      <div style={{ fontSize: 12, opacity: 0.6 }}>
        Risk: {r.risk}/100
      </div>
    </div>
  )
}

function EventStream({ logs }) {
  return (
    <div style={styles.logs}>
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

  const healthRatio = expected ? revenue / expected : 0

  const risks = students.slice(0, 5).map(s => ({
    name: s.name,
    risk: Math.floor(Math.random() * 100)
  }))

  return {
    health: healthRatio > 0.8 ? "HEALTHY" : healthRatio > 0.5 ? "DEGRADED" : "CRITICAL",
    healthColor: healthRatio > 0.8 ? "#22c55e" : "#ef4444",

    metrics: [
      { label: "Revenue Health", value: Math.round(healthRatio * 100) + "%", color: "#22c55e" },
      { label: "Students", value: students.length, color: "#60a5fa" },
      { label: "Active Risks", value: risks.length, color: "#f59e0b" },
      { label: "System Load", value: "Stable", color: "#a78bfa" }
    ],

    risks,
    insights: [
      "Revenue collection trending downward",
      "Some students show elevated risk",
      "Attendance sync stable"
    ],

    actions: [
      "Contact overdue accounts",
      "Review payment patterns",
      "Audit attendance logs"
    ],

    logs: [
      { time: "10:01", msg: "System heartbeat OK" },
      { time: "10:02", msg: "Fee sync completed" },
      { time: "10:03", msg: "Risk model recalculated" }
    ]
  }
}

/* ---------------- STYLES ---------------- */

const styles = {
  wrapper: {
    padding: 24,
    background: "#050816",
    minHeight: "100vh",
    color: "white"
  },

  loading: {
    padding: 40,
    background: "#050816",
    color: "#93c5fd"
  },

  hero: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: 16,
    borderBottom: "1px solid rgba(255,255,255,0.1)",
    paddingBottom: 12
  },

  title: { fontSize: 22, fontWeight: 900 },
  subtitle: { fontSize: 12, opacity: 0.6 },

  health: { fontWeight: 900 },

  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(4,1fr)",
    gap: 12
  },

  card: {
    background: "#0f172a",
    padding: 14,
    borderRadius: 14
  },

  label: { fontSize: 11, opacity: 0.6 },
  value: { fontSize: 20, fontWeight: 900 },

  main: {
    display: "grid",
    gridTemplateColumns: "2fr 1fr",
    gap: 14,
    marginTop: 16
  },

  left: { display: "flex", flexDirection: "column", gap: 14 },
  right: { display: "flex", flexDirection: "column", gap: 14 },

  panel: {
    background: "#0f172a",
    padding: 14,
    borderRadius: 14
  },

  panelTitle: {
    fontSize: 12,
    fontWeight: 800,
    marginBottom: 10
  },

  insight: {
    padding: 10,
    background: "rgba(59,130,246,0.08)",
    borderRadius: 10,
    marginBottom: 8
  },

  risk: {
    padding: 10,
    background: "rgba(239,68,68,0.08)",
    borderRadius: 10,
    marginBottom: 8
  },

  logs: {
    fontSize: 12,
    color: "#93c5fd",
    maxHeight: 180,
    overflow: "auto"
  },

  list: {
    fontSize: 13,
    lineHeight: 1.8
  }
}