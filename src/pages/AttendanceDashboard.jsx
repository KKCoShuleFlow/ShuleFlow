import { useEffect, useState } from "react"
import { db } from "../db"

export default function AttendanceDashboard() {
  const [data, setData] = useState(null)

  useEffect(() => {
    let alive = true

    const run = async () => {
      const students = await db.students.toArray()
      const attendance = await db.attendance.toArray()

      if (!alive) return
      setData(buildAttendanceEngine(students, attendance))
    }

    run()
    const t = setInterval(run, 2500)

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
        📡 Syncing attendance network...
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

      {/* LIVE KPI STRIP */}
      <KPIBar data={data} />

      {/* MAIN GRID */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "2fr 1fr",
        gap: 16,
        marginTop: 18
      }}>

        {/* LEFT: LIVE ATTENDANCE STREAM */}
        <Panel title="📡 LIVE ATTENDANCE STREAM">

          {data.stream.map((s, i) => (
            <AttendanceRow key={i} s={s} />
          ))}

        </Panel>

        {/* RIGHT PANEL */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>

          <Panel title="🧠 ATTENDANCE HEALTH SCORE">
            <BigScore value={data.health} />
          </Panel>

          <Panel title="🔥 RISK DETECTION ENGINE">
            <div style={{ fontSize: 13, lineHeight: 1.6 }}>
              {data.insight}
            </div>
          </Panel>

          <Panel title="⚡ AUTOMATED ACTIONS">
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
        📡 ATTENDANCE CONTROL CENTER
      </div>
      <div style={{ fontSize: 12, color: "#94a3b8" }}>
        Real-time presence tracking, behavior signals & attendance intelligence
      </div>
    </div>
  )
}

/* ================= KPI BAR ================= */

function KPIBar({ data }) {
  return (
    <div style={{
      display: "grid",
      gridTemplateColumns: "repeat(4, 1fr)",
      gap: 12
    }}>
      <KPI label="Present Today" value={data.present} color="#22c55e" />
      <KPI label="Absent" value={data.absent} color="#ef4444" />
      <KPI label="Late Arrivals" value={data.late} color="#f59e0b" />
      <KPI label="Attendance Rate" value={data.rate + "%"} />
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
    value > 85 ? "#22c55e" :
    value > 60 ? "#f59e0b" :
    "#ef4444"

  return (
    <div style={{
      fontSize: 42,
      fontWeight: 900,
      color,
      textAlign: "center"
    }}>
      {value}/100
    </div>
  )
}

/* ================= ATTENDANCE ROW ================= */

function AttendanceRow({ s }) {
  const color =
    s.status === "present" ? "#22c55e" :
    s.status === "late" ? "#f59e0b" :
    "#ef4444"

  return (
    <div style={{
      display: "flex",
      justifyContent: "space-between",
      padding: 10,
      marginBottom: 8,
      borderRadius: 10,
      background: "rgba(255,255,255,0.03)",
      borderLeft: `3px solid ${color}`
    }}>

      <div>
        <div style={{ fontWeight: 700 }}>
          {s.name}
        </div>
        <div style={{ fontSize: 11, color: "#94a3b8" }}>
          Last seen: {s.lastSeen}
        </div>
      </div>

      <div style={{
        fontWeight: 900,
        color,
        textTransform: "uppercase"
      }}>
        {s.status}
      </div>

    </div>
  )
}

/* ================= ENGINE ================= */

function buildAttendanceEngine(students, attendance) {
  const today = new Date().toISOString().split("T")[0]

  let present = 0
  let absent = 0
  let late = 0

  const stream = students.map(s => {
    const record = attendance.find(a => a.studentId === s.id && a.date === today)

    const status = record?.status || "absent"

    if (status === "present") present++
    else if (status === "late") late++
    else absent++

    return {
      id: s.id,
      name: s.name || "Unknown",
      status,
      lastSeen: record?.time || "—"
    }
  })

  const rate = students.length
    ? Math.round((present / students.length) * 100)
    : 0

  const health = rate

  let insight = ""
  let actions = []

  if (rate < 60) {
    insight =
      "Critical attendance drop detected. Student engagement is significantly below acceptable threshold."

    actions = [
      "Trigger parent notification system",
      "Flag chronic absentees",
      "Investigate class-specific drop patterns"
    ]
  } else if (rate < 85) {
    insight =
      "Moderate attendance variability detected. Some classes show inconsistent presence patterns."

    actions = [
      "Send automated attendance reminders",
      "Identify frequent late students",
      "Review timetable alignment"
    ]
  } else {
    insight =
      "Healthy attendance levels detected across most students and classes."

    actions = [
      "Maintain current engagement strategy",
      "Monitor late arrivals trend",
      "Optimize attendance tracking automation"
    ]
  }

  return {
    stream,
    present,
    absent,
    late,
    rate,
    health,
    insight,
    actions
  }
}


