import { useEffect, useState } from "react"
import { supabase } from "../lib/supabase"

export default function AttendanceDashboard() {
  const [classes, setClasses] = useState([])
  const [selectedClass, setSelectedClass] = useState("")
  const [students, setStudents] = useState([])
  const [feed, setFeed] = useState([])

  const [stats, setStats] = useState({
    present: 0,
    absent: 0,
    late: 0,
  })

  /* ---------------- LOAD CLASSES ---------------- */
  const loadClasses = async () => {
    const { data } = await supabase
      .from("students")
      .select("class")

    const unique = [
      ...new Set((data || []).map((s) => s.class)),
    ].filter(Boolean)

    setClasses(unique)
  }

  /* ---------------- LOAD STUDENTS ---------------- */
  const loadStudents = async (className) => {
    if (!className) return

    const { data } = await supabase
      .from("students")
      .select("*")
      .eq("class", className)

    const safe = (data || []).map((s) => ({
      ...s,
      attendanceStatus: "present",
    }))

    setStudents(safe)

    setFeed((prev) => [
      {
        time: new Date().toLocaleTimeString(),
        msg: `📅 Class loaded: ${className}`,
      },
      ...prev,
    ])

    calculateStats(safe)
  }

  /* ---------------- INIT REALTIME ---------------- */
  useEffect(() => {
    loadClasses()

    const channel = supabase
      .channel("attendance-live")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "attendance",
        },
        (payload) => {
          if (payload.new) {
            setFeed((prev) => [
              {
                time: new Date().toLocaleTimeString(),
                msg: `📡 ${payload.new.student} → ${payload.new.status}`,
              },
              ...prev,
            ])
          }
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [])

  /* ---------------- CLASS SELECT ---------------- */
  const handleClassChange = async (value) => {
    setSelectedClass(value)
    await loadStudents(value)
  }

  /* ---------------- MARK ATTENDANCE ---------------- */
  const markAttendance = async (student, status) => {
    const updated = students.map((s) =>
      s.id === student.id
        ? { ...s, attendanceStatus: status }
        : s
    )

    setStudents(updated)
    calculateStats(updated)

    await supabase.from("attendance").insert([
      {
        student_id: student.id,
        student: student.name,
        class: selectedClass,
        status,
        created_at: new Date(),
      },
    ])

    setFeed((prev) => [
      {
        time: new Date().toLocaleTimeString(),
        msg: `${student.name} marked ${status}`,
      },
      ...prev,
    ])
  }

  /* ---------------- STATS ---------------- */
  const calculateStats = (data) => {
    const present = data.filter(
      (s) => s.attendanceStatus === "present"
    ).length

    const absent = data.filter(
      (s) => s.attendanceStatus === "absent"
    ).length

    const late = data.filter(
      (s) => s.attendanceStatus === "late"
    ).length

    setStats({ present, absent, late })
  }

  /* ---------------- MARK ALL ---------------- */
  const markAllPresent = async () => {
    for (const s of students) {
      await markAttendance(s, "present")
    }
  }

  return (
    <div style={styles.wrapper}>

      {/* HEADER */}
      <div style={styles.header}>
        <div style={styles.title}>
          📅 ATTENDANCE OS
        </div>
        <div style={styles.subtitle}>
          Real-time classroom control system
        </div>
      </div>

      {/* KPI */}
      <div style={styles.grid}>
        <Card label="Present" value={stats.present} color="#22c55e" />
        <Card label="Absent" value={stats.absent} color="#ef4444" />
        <Card label="Late" value={stats.late} color="#f59e0b" />
        <Card label="Students" value={students.length} color="#38bdf8" />
      </div>

      {/* MAIN */}
      <div style={styles.main}>

        {/* CLASS PANEL */}
        <div style={styles.classControl}>
  
  <div style={{ fontSize: 12, fontWeight: 700, opacity: 0.8 }}>
    🏫 Class Control
  </div>

  <select
  value={selectedClass}
  onChange={(e) => handleClassChange(e.target.value)}
  style={styles.classSelect}
>
  <option value="">Select Class</option>

  {classes.map((c, i) => (
    <option key={i} value={c} style={styles.option}>
      {c}
    </option>
  ))}
</select>
</div>
        {/* STUDENTS */}
        <div style={styles.panel}>
          <div style={styles.panelTitle}>👨‍🎓 Students</div>

          <div style={styles.students}>
            {students.length === 0 && (
              <div style={styles.empty}>
                Select a class to load students
              </div>
            )}

            {students.map((student) => (
              <StudentRow
                key={student.id}
                student={student}
                onMark={markAttendance}
              />
            ))}
          </div>
        </div>

        {/* FEED */}
        <div style={styles.panel}>
          <div style={styles.panelTitle}>📡 Live Feed</div>

          <div style={styles.feed}>
            {feed.map((f, i) => (
              <div key={i} style={styles.feedItem}>
                [{f.time}] {f.msg}
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  )
}

/* ---------------- STUDENT ROW ---------------- */

function StudentRow({ student, onMark }) {
  const status = student.attendanceStatus || "present"

  return (
    <div style={styles.studentRow}>
      <div>
        <div style={styles.studentName}>{student.name}</div>
        <div style={styles.studentSub}>{student.class}</div>
      </div>

      <div style={styles.actions}>

        <button
          style={{
            ...styles.pill,
            background:
              status === "present"
                ? "rgba(34,197,94,0.15)"
                : "transparent",
            borderColor: "#22c55e",
            color:
              status === "present" ? "#22c55e" : "#94a3b8",
          }}
          onClick={() => onMark(student, "present")}
        >
          Present
        </button>

        <button
          style={{
            ...styles.pill,
            background:
              status === "absent"
                ? "rgba(239,68,68,0.15)"
                : "transparent",
            borderColor: "#ef4444",
            color:
              status === "absent" ? "#ef4444" : "#94a3b8",
          }}
          onClick={() => onMark(student, "absent")}
        >
          Absent
        </button>

        <button
          style={{
            ...styles.pill,
            background:
              status === "late"
                ? "rgba(245,158,11,0.15)"
                : "transparent",
            borderColor: "#f59e0b",
            color:
              status === "late" ? "#f59e0b" : "#94a3b8",
          }}
          onClick={() => onMark(student, "late")}
        >
          Late
        </button>

      </div>
    </div>
  )
}

/* ---------------- CARD ---------------- */

function Card({ label, value, color }) {
  return (
    <div style={styles.card}>
      <div style={styles.cardLabel}>{label}</div>
      <div style={{ ...styles.cardValue, color }}>
        {value}
      </div>
    </div>
  )
}

/* ---------------- STYLES ---------------- */

const styles = {
  wrapper: {
    padding: 20,
    background: "#050816",
    height: "100vh",
    overflow: "hidden",
    color: "white",
  },

  header: {
    marginBottom: 12,
  },

  title: {
    fontSize: 22,
    fontWeight: 900,
  },

  subtitle: {
    fontSize: 12,
    opacity: 0.6,
  },

  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(4,1fr)",
    gap: 10,
    marginBottom: 12,
  },

  card: {
    background: "#0f172a",
    padding: 12,
    borderRadius: 10,
  },

  cardLabel: {
    fontSize: 11,
    opacity: 0.6,
  },

  cardValue: {
    fontSize: 20,
    fontWeight: 900,
  },

  main: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
    gap: 12,
    height: "75vh",
  },

  panel: {
    background: "#0f172a",
    padding: 12,
    borderRadius: 12,
    overflowY: "auto",
  },

  panelTitle: {
    fontSize: 12,
    fontWeight: 800,
    marginBottom: 10,
  },

 classControl: {
  display: "flex",
  flexDirection: "column",
  gap: 10,
  marginBottom: 12,
  padding: 12,
  borderRadius: 12,
  background: "rgba(99,102,241,0.05)",
  border: "1px solid rgba(99,102,241,0.15)",
},



classSelect: {
  width: "100%",
  padding: 12,
  borderRadius: 10,
  backgroundColor: "#000000",
  color: "white",
  fontSize: 14,
  border: "1px solid rgba(255,255,255,0.2)",
  outline: "none",
  cursor: "pointer",
},



  primaryAction: {
    width: "100%",
    padding: 12,
    borderRadius: 12,
    border: "none",
    background: "linear-gradient(135deg,#6366f1,#22c55e)",
    color: "white",
    fontWeight: 800,
    cursor: "pointer",
  },

  students: {
    display: "flex",
    flexDirection: "column",
    gap: 8,
  },

  studentRow: {
    display: "flex",
    justifyContent: "space-between",
    padding: 10,
    borderRadius: 10,
    background: "rgba(255,255,255,0.03)",
  },

  studentName: {
    fontWeight: 700,
  },

  studentSub: {
    fontSize: 11,
    opacity: 0.6,
  },

  actions: {
    display: "flex",
    gap: 6,
  },

  pill: {
    padding: "5px 10px",
    borderRadius: 999,
    border: "1px solid rgba(255,255,255,0.2)",
    fontSize: 12,
    cursor: "pointer",
  },

  feed: {
    fontSize: 12,
    display: "flex",
    flexDirection: "column",
    gap: 6,
  },

  feedItem: {
    padding: 8,
    background: "rgba(59,130,246,0.08)",
    borderRadius: 8,
    color: "#93c5fd",
  },

  empty: {
    fontSize: 12,
    opacity: 0.6,
  },
}