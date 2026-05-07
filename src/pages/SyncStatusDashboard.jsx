import { useEffect, useMemo, useState } from "react"
import { supabase } from "../lib/supabase"

export default function SyncStatusDashboard() {
  const [logs, setLogs] = useState([])

  const load = async () => {
    const [{ data: fees }, { data: attendance }, { data: students }] =
      await Promise.all([
        supabase.from("fees").select("*"),
        supabase.from("attendance").select("*"),
        supabase.from("students").select("*"),
      ])

    setLogs([
      ...(fees || []).map((f) => ({
        type: "fees",
        time: f.created_at,
      })),
      ...(attendance || []).map((a) => ({
        type: "attendance",
        time: a.created_at,
      })),
      ...(students || []).map((s) => ({
        type: "students",
        time: s.created_at,
      })),
    ])
  }

  useEffect(() => {
    load()

    const channel = supabase
      .channel("sync-status")
      .on("postgres_changes", { event: "*", schema: "public", table: "fees" }, load)
      .on("postgres_changes", { event: "*", schema: "public", table: "attendance" }, load)
      .on("postgres_changes", { event: "*", schema: "public", table: "students" }, load)
      .subscribe()

    return () => supabase.removeChannel(channel)
  }, [])

  /* ---------------- SYNC INTELLIGENCE ---------------- */
  const sync = useMemo(() => {
    const now = new Date()

    const timestamps = logs
      .map((l) => new Date(l.time))
      .filter((t) => !isNaN(t))

    const lastSync =
      timestamps.length > 0
        ? new Date(Math.max(...timestamps))
        : null

    const diffMinutes = lastSync
      ? (now - lastSync) / 60000
      : Infinity

    let status = "healthy"

    if (diffMinutes > 10) status = "delayed"
    if (diffMinutes > 60) status = "critical"

    const totalEvents = logs.length

    const breakdown = logs.reduce((acc, l) => {
      acc[l.type] = (acc[l.type] || 0) + 1
      return acc
    }, {})

    const pressure =
      totalEvents > 500
        ? "high"
        : totalEvents > 200
        ? "medium"
        : "low"

    let message = "System sync is stable."

    if (status === "delayed")
      message =
        "⚠️ Data updates are delayed — possible network or sync lag."
    if (status === "critical")
      message =
        "❌ Sync failure risk detected — system may be operating on outdated data."

    return {
      status,
      message,
      diffMinutes,
      lastSync,
      totalEvents,
      breakdown,
      pressure,
    }
  }, [logs])

  return (
    <div style={styles.wrapper}>

      {/* HEADER */}
      <div style={styles.header}>
        <div style={styles.title}>🔄 SYNC INTELLIGENCE CENTER</div>
        <div style={styles.subtitle}>
          Real-time data trust, lag detection & system reliability
        </div>
      </div>

      {/* STATUS BANNER */}
      <div
        style={{
          ...styles.banner,
          background:
            sync.status === "critical"
              ? "rgba(239,68,68,0.15)"
              : sync.status === "delayed"
              ? "rgba(245,158,11,0.15)"
              : "rgba(34,197,94,0.15)",
        }}
      >
        {sync.status.toUpperCase()} SYNC STATE
      </div>

      {/* KPI */}
      <div style={styles.kpiGrid}>
        <KPI label="Events" value={sync.totalEvents} color="#38bdf8" />
        <KPI label="Lag (min)" value={sync.diffMinutes.toFixed(1)} color="#f59e0b" />
        <KPI label="Pressure" value={sync.pressure} color="#ef4444" />
        <KPI label="Status" value={sync.status} color="#22c55e" />
      </div>

      {/* MAIN GRID */}
      <div style={styles.grid}>

        {/* STATUS */}
        <div style={styles.panel}>
          <div style={styles.panelTitle}>🧠 SYNC STATUS</div>
          <div style={styles.text}>{sync.message}</div>
        </div>

        {/* BREAKDOWN */}
        <div style={styles.panel}>
          <div style={styles.panelTitle}>📊 DATA FLOW</div>

          <div style={styles.row}>Fees <span>{sync.breakdown.fees || 0}</span></div>
          <div style={styles.row}>Attendance <span>{sync.breakdown.attendance || 0}</span></div>
          <div style={styles.row}>Students <span>{sync.breakdown.students || 0}</span></div>
        </div>

        {/* RECOMMENDATION */}
        <div style={styles.panel}>
          <div style={styles.panelTitle}>🎯 RECOMMENDATION</div>

          <div style={styles.text}>
            {sync.status === "critical"
              ? "Fix sync issues immediately. Data may be outdated."
              : sync.status === "delayed"
              ? "Monitor system closely. Sync lag detected."
              : "System is fully synchronized and reliable."}
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

  text: {
    fontSize: 13,
    lineHeight: 1.6,
  },

  row: {
    display: "flex",
    justifyContent: "space-between",
    padding: 8,
    background: "rgba(255,255,255,0.03)",
    borderRadius: 10,
    marginBottom: 6,
    fontSize: 12,
  },
}