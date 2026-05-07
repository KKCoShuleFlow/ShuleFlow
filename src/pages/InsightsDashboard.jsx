import { useEffect, useMemo, useState } from "react"
import { supabase } from "../lib/supabase"

export default function InsightsDashboard() {
  const [data, setData] = useState({
    students: [],
    fees: [],
    attendance: [],
  })

  const load = async () => {
    const [{ data: s }, { data: f }, { data: a }] = await Promise.all([
      supabase.from("students").select("*"),
      supabase.from("fees").select("*"),
      supabase.from("attendance").select("*"),
    ])

    setData({
      students: s || [],
      fees: f || [],
      attendance: a || [],
    })
  }

  useEffect(() => {
    load()

    const channel = supabase
      .channel("insights-live")
      .on("postgres_changes", { event: "*", schema: "public", table: "fees" }, load)
      .on("postgres_changes", { event: "*", schema: "public", table: "attendance" }, load)
      .subscribe()

    return () => supabase.removeChannel(channel)
  }, [])

  /* ---------------- INTELLIGENCE ENGINE ---------------- */
  const insight = useMemo(() => {
    const students = data.students
    const fees = data.fees
    const attendance = data.attendance

    const totalStudents = students.length

    const revenue = fees.reduce((a, f) => a + Number(f.paid || 0), 0)
    const expected = fees.reduce((a, f) => a + Number(f.amount || 0), 0)
    const outstanding = expected - revenue

    const attendanceRate = attendance.length
      ? (attendance.filter(a => a.status === "present").length /
          attendance.length) *
        100
      : 0

    const riskyStudents = students.filter((s) => {
      const sFees = fees.filter(f => f.student_id === s.id)
      const paid = sFees.reduce((a, f) => a + Number(f.paid || 0), 0)
      const due = sFees.reduce((a, f) => a + Number(f.amount || 0), 0)

      const sAtt = attendance.filter(a => a.student_id === s.id)
      const attRate = sAtt.length
        ? (sAtt.filter(a => a.status === "present").length / sAtt.length) * 100
        : 100

      return due - paid > 0 || attRate < 60
    })

    /* ---------------- HUMAN INSIGHTS ---------------- */

    let summary = "School is operating normally."

    if (outstanding > 0 && attendanceRate < 70) {
      summary =
        "⚠️ Financial pressure + attendance drop detected. The school may face instability if not addressed."
    } else if (outstanding > 0) {
      summary =
        "💰 Fees collection is slowing down. Cash flow risk increasing."
    } else if (attendanceRate < 70) {
      summary =
        "📉 Attendance is declining. Student engagement needs attention."
    } else {
      summary =
        "✅ School performance is stable and healthy."
    }

    /* ---------------- PREDICTIONS ---------------- */

    const prediction =
      attendanceRate < 60
        ? "Next month: possible student dropouts if no intervention is made."
        : outstanding > 0
        ? "Next month: delayed cash flow likely due to unpaid balances."
        : "Next month: stable growth expected."

    /* ---------------- ACTIONS ---------------- */

    const actions = []

    if (riskyStudents.length > 0)
      actions.push("Call parents of at-risk students")

    if (outstanding > 0)
      actions.push("Send fee reminders immediately")

    if (attendanceRate < 70)
      actions.push("Investigate low attendance classes")

    if (actions.length === 0)
      actions.push("Maintain current performance")

    return {
      totalStudents,
      revenue,
      outstanding,
      attendanceRate,
      riskyStudents,
      summary,
      prediction,
      actions,
    }
  }, [data])

  return (
    <div style={styles.wrapper}>

      {/* HEADER */}
      <div style={styles.header}>
        <div style={styles.title}>🧠 INSIGHTS INTELLIGENCE CORE</div>
        <div style={styles.subtitle}>
          Human-readable school intelligence & predictions
        </div>
      </div>

      {/* KPI STRIP */}
      <div style={styles.kpiGrid}>
        <KPI label="Students" value={insight.totalStudents} color="#38bdf8" />
        <KPI label="Revenue" value={insight.revenue} color="#22c55e" />
        <KPI label="Outstanding" value={insight.outstanding} color="#ef4444" />
        <KPI label="Attendance" value={`${insight.attendanceRate.toFixed(1)}%`} color="#f59e0b" />
      </div>

      {/* MAIN INSIGHT */}
      <div style={styles.panel}>
        <div style={styles.panelTitle}>🧠 WHAT IS HAPPENING</div>
        <div style={styles.summary}>{insight.summary}</div>
      </div>

      {/* PREDICTION */}
      <div style={styles.panel}>
        <div style={styles.panelTitle}>🔮 WHAT WILL HAPPEN NEXT</div>
        <div style={styles.prediction}>{insight.prediction}</div>
      </div>

      {/* ACTIONS */}
      <div style={styles.panel}>
        <div style={styles.panelTitle}>🎯 WHAT YOU SHOULD DO</div>

        {insight.actions.map((a, i) => (
          <div key={i} style={styles.action}>
            👉 {a}
          </div>
        ))}
      </div>

      {/* RISK STUDENTS */}
      <div style={styles.panel}>
        <div style={styles.panelTitle}>👨‍🎓 STUDENTS NEEDING ATTENTION</div>

        {insight.riskyStudents.length === 0 && (
          <div style={styles.ok}>No at-risk students 🎉</div>
        )}

        {insight.riskyStudents.slice(0, 6).map((s, i) => (
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

/* ---------------- STYLES ---------------- */

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

  summary: {
    fontSize: 14,
    lineHeight: 1.6,
  },

  prediction: {
    fontSize: 13,
    opacity: 0.9,
  },

  action: {
    padding: 8,
    background: "rgba(99,102,241,0.08)",
    borderRadius: 10,
    marginBottom: 6,
    fontSize: 13,
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