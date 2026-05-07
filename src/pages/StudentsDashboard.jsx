import { useEffect, useState } from "react"
import { supabase } from "../lib/supabase"
import { buildStudentsEngine } from "../lib/students/studentsEngine"

export default function StudentsDashboard() {
  const [students, setStudents] = useState([])
  const [engine, setEngine] = useState(null)

  /* ---------------- LOAD ---------------- */
  const load = async () => {
    const { data } = await supabase.from("students").select("*")
    const safe = data || []

    setStudents(safe)
    setEngine(buildStudentsEngine(safe))
  }

  useEffect(() => {
    load()

    const channel = supabase
      .channel("students-live")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "students" },
        load
      )
      .subscribe()

    return () => supabase.removeChannel(channel)
  }, [])

  /* ---------------- LOADING ---------------- */
  if (!engine) {
    return (
      <div style={styles.loading}>
        🧑‍🎓 Loading Students OS...
      </div>
    )
  }

  const { summary, topRisk, insights } = engine

  return (
    <div style={styles.wrapper}>

      {/* HEADER */}
      <div style={styles.header}>
        <div style={styles.title}>🧑‍🎓 STUDENTS OS</div>
        <div style={styles.subtitle}>
          Lifecycle tracking, risk detection & intelligence layer
        </div>
      </div>

      {/* KPI */}
      <div style={styles.grid}>
        <Card label="Total Students" value={summary.total} />
        <Card label="Active" value={summary.active} color="#22c55e" />
        <Card label="Inactive" value={summary.inactive} color="#ef4444" />
      </div>

      {/* MAIN */}
      <div style={styles.main}>

        {/* LEFT */}
        <Panel title="🚨 High Risk Students">

          {topRisk.length === 0 && (
            <div style={styles.empty}>
              No risk detected 🎉
            </div>
          )}

          {topRisk.map((s, i) => (
            <StudentRow key={i} s={s} />
          ))}

        </Panel>

        {/* RIGHT */}
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>

          <Panel title="🧠 AI Insights">
            {insights.map((i, idx) => (
              <div key={idx} style={styles.text}>
                • {i}
              </div>
            ))}
          </Panel>

          <Panel title="➕ Add Student (Quick Input)">
            <StudentForm reload={load} />
          </Panel>

        </div>

      </div>
    </div>
  )
}

/* ---------------- INPUT FORM ---------------- */

function StudentForm({ reload }) {
  const [name, setName] = useState("")
  const [cls, setCls] = useState("")

  const addStudent = async () => {
    if (!name) return

    await supabase.from("students").insert([
      {
        name,
        class: cls,
        status: "active"
      }
    ])

    setName("")
    setCls("")
    reload()
  }

  return (
    <div style={styles.form}>
      <input
        placeholder="Student name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        style={styles.input}
      />

      <input
        placeholder="Class"
        value={cls}
        onChange={(e) => setCls(e.target.value)}
        style={styles.input}
      />

      <button onClick={addStudent} style={styles.button}>
        ➕ Add Student
      </button>
    </div>
  )
}

/* ---------------- COMPONENTS ---------------- */

function Card({ label, value, color = "#38bdf8" }) {
  return (
    <div style={styles.card}>
      <div style={styles.cardLabel}>{label}</div>
      <div style={{ ...styles.cardValue, color }}>{value}</div>
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

function StudentRow({ s }) {
  const color =
    s.risk > 80 ? "#ef4444" :
    s.risk > 50 ? "#f59e0b" :
    "#22c55e"

  return (
    <div style={styles.row}>
      <div>
        <div style={styles.name}>{s.name}</div>
        <div style={styles.sub}>{s.class}</div>
      </div>

      <div style={{ ...styles.risk, color }}>
        {s.risk}%
      </div>
    </div>
  )
}


/* ---------------- STYLES ---------------- */

const styles = {
  wrapper: {
    padding: 20,
    background: "#050816",
    color: "white",
    height: "100vh",
    overflow: "hidden"
  },

  loading: {
    padding: 20,
    color: "#60a5fa",
    background: "#050816",
    minHeight: "100vh"
  },

  header: {
    marginBottom: 12,
    borderBottom: "1px solid rgba(255,255,255,0.08)",
    paddingBottom: 10
  },

  title: { fontSize: 22, fontWeight: 900 },
  subtitle: { fontSize: 12, opacity: 0.6 },

  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(3,1fr)",
    gap: 12,
    marginTop: 12
  },

  card: {
    background: "#0f172a",
    padding: 14,
    borderRadius: 14
  },

  cardLabel: { fontSize: 11, opacity: 0.6 },
  cardValue: { fontSize: 20, fontWeight: 900 },

  main: {
    display: "grid",
    gridTemplateColumns: "2fr 1fr",
    gap: 14,
    marginTop: 16
  },

  panel: {
    background: "#0f172a",
    borderRadius: 14,
    padding: 14
  },

  panelTitle: {
    fontSize: 12,
    fontWeight: 800,
    marginBottom: 10
  },

  text: {
    fontSize: 13,
    lineHeight: 1.6
  },

  row: {
    display: "flex",
    justifyContent: "space-between",
    padding: 10,
    marginBottom: 8,
    borderRadius: 10,
    background: "rgba(255,255,255,0.03)"
  },

  name: { fontWeight: 700 },
  sub: { fontSize: 11, opacity: 0.6 },
  risk: { fontWeight: 900 },

  empty: { fontSize: 13, opacity: 0.6 },

  /* INPUTS */
  form: {
    display: "flex",
    flexDirection: "column",
    gap: 8
  },

  input: {
    padding: 10,
    borderRadius: 8,
    border: "1px solid rgba(255,255,255,0.1)",
    background: "#020617",
    color: "white"
  },

  button: {
    padding: 10,
    borderRadius: 8,
    border: "none",
    background: "#3b82f6",
    color: "white",
    cursor: "pointer"
  }
}