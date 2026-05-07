import { useEffect, useMemo, useState } from "react"
import { supabase } from "../lib/supabase"

export default function SystemHealthDashboard() {
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
      .channel("system-health")
      .on("postgres_changes", { event: "*", schema: "public", table: "students" }, load)
      .on("postgres_changes", { event: "*", schema: "public", table: "fees" }, load)
      .on("postgres_changes", { event: "*", schema: "public", table: "attendance" }, load)
      .subscribe()

    return () => supabase.removeChannel(channel)
  }, [])

  /* ---------------- HEALTH ENGINE ---------------- */
  const health = useMemo(() => {
    const students = data.students
    const fees = data.fees
    const attendance = data.attendance

    const issues = []
    const warnings = []

    // DATA INTEGRITY
    const missingStudents = students.filter(s => !s.name || !s.class).length
    const missingFees = fees.filter(f => !f.student_id || !f.amount).length
    const missingAttendance = attendance.filter(a => !a.student_id || !a.status).length

    if (missingStudents > 0)
      issues.push(`❌ ${missingStudents} incomplete student records`)

    if (missingFees > 0)
      issues.push(`❌ ${missingFees} broken fee records`)

    if (missingAttendance > 0)
      issues.push(`❌ ${missingAttendance} invalid attendance entries`)

    // SYSTEM LOAD SIGNALS
    if (fees.length > 5000)
      warnings.push("⚠️ High financial dataset load detected")

    if (attendance.length > students.length * 50)
      warnings.push("⚠️ Attendance history is very large — optimize queries")

    // SYNC HEALTH
    const lastUpdateTime = new Date(
      Math.max(
        ...fees.map(f => new Date(f.created_at || 0)),
        ...attendance.map(a => new Date(a.created_at || 0))
      )
    )

    const now = new Date()
    const diffMinutes = (now - lastUpdateTime) / 60000

    let syncStatus = "healthy"

    if (diffMinutes > 60) syncStatus = "stale"
    if (diffMinutes > 180) syncStatus = "critical"

    if (syncStatus === "stale")
      warnings.push("⚠️ Data sync is delayed (possible offline mode)")
    if (syncStatus === "critical")
      issues.push("❌ System data is severely outdated")

    // FINAL STATUS
    let systemStatus = "healthy"

    if (issues.length > 0) systemStatus = "critical"
    else if (warnings.length > 0) systemStatus = "warning"

    const recommendation =
      systemStatus === "critical"
        ? "Fix critical data issues immediately — system reliability at risk."
        : systemStatus === "warning"
        ? "Monitor system closely — minor issues detected."
        : "System is stable and operating normally."

    return {
      systemStatus,
      issues,
      warnings,
      recommendation,
      syncStatus,
    }
  }, [data])

  return (
    <div style={styles.wrapper}>

      {/* HEADER */}
      <div style={styles.header}>
        <div style={styles.title}>🧠 SYSTEM HEALTH CENTER</div>
        <div style={styles.subtitle}>
          Real-time infrastructure & data integrity monitor
        </div>
      </div>

      {/* STATUS BANNER */}
      <div
        style={{
          ...styles.banner,
          background:
            health.systemStatus === "critical"
              ? "rgba(239,68,68,0.15)"
              : health.systemStatus === "warning"
              ? "rgba(245,158,11,0.15)"
              : "rgba(34,197,94,0.15)",
        }}
      >
        {health.systemStatus.toUpperCase()} SYSTEM
      </div>

      {/* KPI */}
      <div style={styles.kpiGrid}>
        <KPI label="Issues" value={health.issues.length} color="#ef4444" />
        <KPI label="Warnings" value={health.warnings.length} color="#f59e0b" />
        <KPI label="Sync" value={health.syncStatus} color="#38bdf8" />
        <KPI label="Status" value={health.systemStatus} color="#22c55e" />
      </div>

      {/* MAIN GRID */}
      <div style={styles.grid}>

        {/* ISSUES */}
        <div style={styles.panel}>
          <div style={styles.panelTitle}>❌ CRITICAL ISSUES</div>

          {health.issues.length === 0 && (
            <div style={styles.ok}>No critical issues detected 🎉</div>
          )}

          {health.issues.map((i, idx) => (
            <div key={idx} style={styles.issue}>{i}</div>
          ))}
        </div>

        {/* WARNINGS */}
        <div style={styles.panel}>
          <div style={styles.panelTitle}>⚠️ WARNINGS</div>

          {health.warnings.map((w, idx) => (
            <div key={idx} style={styles.warning}>{w}</div>
          ))}
        </div>

        {/* RECOMMENDATION */}
        <div style={styles.panel}>
          <div style={styles.panelTitle}>🧠 SYSTEM RECOMMENDATION</div>

          <div style={styles.recommendation}>
            {health.recommendation}
          </div>
        </div>

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

  banner: {
    padding: 12,
    borderRadius: 12,
    textAlign: "center",
    fontWeight: 800,
    marginBottom: 12,
  },

  kpiGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(4,1fr)",
    gap: 10,
    marginBottom: 12,
  },

  kpi: {
    background: "#0f172a",
    padding: 12,
    borderRadius: 12,
  },

  kpiLabel: {
    fontSize: 11,
    opacity: 0.6,
  },

  kpiValue: {
    fontSize: 18,
    fontWeight: 800,
  },

  grid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr 1fr",
    gap: 12,
  },

  panel: {
    background: "#0f172a",
    padding: 14,
    borderRadius: 14,
  },

  panelTitle: {
    fontSize: 12,
    fontWeight: 800,
    marginBottom: 10,
  },

  issue: {
    padding: 10,
    background: "rgba(239,68,68,0.08)",
    borderRadius: 10,
    marginBottom: 6,
    fontSize: 12,
  },

  warning: {
    padding: 10,
    background: "rgba(245,158,11,0.08)",
    borderRadius: 10,
    marginBottom: 6,
    fontSize: 12,
  },

  recommendation: {
    fontSize: 13,
    lineHeight: 1.6,
    opacity: 0.9,
  },

  ok: {
    fontSize: 12,
    opacity: 0.6,
  },
}