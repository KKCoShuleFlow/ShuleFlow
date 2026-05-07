import { useEffect, useMemo, useState } from "react"
import { supabase } from "../lib/supabase"

export default function AlertsDashboard() {
  const [alerts, setAlerts] = useState([])
  const [loading, setLoading] = useState(true)

  const loadAlerts = async () => {
    const { data } = await supabase
      .from("alerts")
      .select("*")
      .order("created_at", { ascending: false })

    setAlerts(data || [])
    setLoading(false)
  }

  useEffect(() => {
    loadAlerts()

    const channel = supabase
      .channel("alerts-live")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "alerts" },
        loadAlerts
      )
      .subscribe()

    return () => supabase.removeChannel(channel)
  }, [])

  /* ---------------- ALERT INTELLIGENCE ---------------- */
  const processed = useMemo(() => {
    const safe = alerts || []

    const enriched = safe.map((a) => {
      const type = (a.type || "system").toLowerCase()
      const severity = (a.severity || "low").toLowerCase()

      let priority = 1

      if (severity === "critical") priority = 4
      else if (severity === "high") priority = 3
      else if (severity === "medium") priority = 2

      let action = "No action required"

      if (type === "fees") action = "Follow up payment immediately"
      if (type === "attendance") action = "Contact class teacher"
      if (type === "risk") action = "Intervention required"
      if (type === "system") action = "Monitor system"

      return {
        ...a,
        type,
        severity,
        priority,
        action,
      }
    })

    const sorted = [...enriched].sort((a, b) => b.priority - a.priority)

    const critical = sorted.filter((a) => a.severity === "critical")
    const high = sorted.filter((a) => a.severity === "high")
    const medium = sorted.filter((a) => a.severity === "medium")
    const low = sorted.filter((a) => a.severity === "low")

    const todayAlerts = sorted.slice(0, 8)

    return {
      all: sorted,
      critical,
      high,
      medium,
      low,
      todayAlerts,
    }
  }, [alerts])

  if (loading) {
    return <div style={styles.loading}>🚨 Loading Alerts Engine...</div>
  }

  return (
    <div style={styles.wrapper}>

      {/* HEADER */}
      <div style={styles.header}>
        <div style={styles.title}>🚨 ALERT INTELLIGENCE CENTER</div>
        <div style={styles.subtitle}>
          Decision-driven alerts system for school operations
        </div>
      </div>

      {/* KPI STRIP */}
      <div style={styles.kpiGrid}>
        <KPI label="Critical" value={processed.critical.length} color="#ef4444" />
        <KPI label="High" value={processed.high.length} color="#f59e0b" />
        <KPI label="Medium" value={processed.medium.length} color="#38bdf8" />
        <KPI label="Low" value={processed.low.length} color="#22c55e" />
      </div>

      {/* MAIN GRID */}
      <div style={styles.grid}>

        {/* PRIORITY STREAM */}
        <div style={styles.panel}>
          <div style={styles.panelTitle}>⚡ PRIORITY ACTIONS</div>

          {processed.critical.length === 0 && (
            <div style={styles.ok}>No critical issues 🎉</div>
          )}

          {processed.critical.map((a, i) => (
            <AlertCard key={i} a={a} highlight="#ef4444" />
          ))}
        </div>

        {/* TODAY ALERTS */}
        <div style={styles.panel}>
          <div style={styles.panelTitle}>📡 LIVE ALERT FEED</div>

          {processed.todayAlerts.map((a, i) => (
            <AlertCard key={i} a={a} />
          ))}
        </div>

        {/* INSIGHTS PANEL */}
        <div style={styles.panel}>
          <div style={styles.panelTitle}>🧠 SYSTEM INSIGHT</div>

          <div style={styles.insightBox}>
            {processed.critical.length > 0
              ? "Immediate attention required: critical issues detected."
              : processed.high.length > 0
              ? "System stable but requires monitoring."
              : "All systems operating normally."}
          </div>

          <div style={styles.panelTitle}>🎯 Suggested Actions</div>

          <ul style={styles.list}>
            {processed.critical.length > 0 && (
              <li>→ Resolve critical alerts immediately</li>
            )}
            {processed.high.length > 0 && (
              <li>→ Review high-priority alerts</li>
            )}
            <li>→ Monitor system trends</li>
            <li>→ Review attendance + fee sync</li>
          </ul>
        </div>

      </div>

      {/* FULL LIST */}
      <div style={styles.bottom}>
        <div style={styles.panel}>
          <div style={styles.panelTitle}>📚 ALL ALERTS (SYSTEM LOG)</div>

          {processed.all.map((a, i) => (
            <div key={i} style={styles.row}>
              <div>
                <div style={styles.name}>{a.title || a.type}</div>
                <div style={styles.sub}>{a.message || a.text}</div>
              </div>

              <div style={styles.badge}>{a.severity}</div>
            </div>
          ))}
        </div>
      </div>

    </div>
  )
}

/* ---------------- ALERT CARD ---------------- */
function AlertCard({ a, highlight }) {
  const color =
    a.severity === "critical"
      ? "#ef4444"
      : a.severity === "high"
      ? "#f59e0b"
      : a.severity === "medium"
      ? "#38bdf8"
      : "#22c55e"

  return (
    <div style={{ ...styles.alertCard, borderLeft: `4px solid ${highlight || color}` }}>
      <div style={styles.alertTitle}>{a.title || a.type}</div>
      <div style={styles.alertMsg}>{a.message || a.text}</div>
      <div style={styles.alertAction}>👉 {a.action}</div>
    </div>
  )
}

/* ---------------- KPI ---------------- */
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
    minHeight: "100vh",
    fontFamily: "Inter, system-ui",
  },

  loading: {
    padding: 24,
    color: "#60a5fa",
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

  alertCard: {
    padding: 12,
    background: "rgba(255,255,255,0.03)",
    borderRadius: 12,
    marginBottom: 8,
  },

  alertTitle: {
    fontWeight: 800,
    fontSize: 13,
  },

  alertMsg: {
    fontSize: 12,
    opacity: 0.7,
    marginTop: 4,
  },

  alertAction: {
    fontSize: 12,
    marginTop: 6,
    color: "#93c5fd",
  },

  insightBox: {
    padding: 10,
    borderRadius: 10,
    background: "rgba(99,102,241,0.08)",
    marginBottom: 10,
    fontSize: 13,
  },

  list: {
    fontSize: 13,
    lineHeight: 1.8,
  },

  bottom: {
    marginTop: 12,
  },

  row: {
    display: "flex",
    justifyContent: "space-between",
    padding: 10,
    borderRadius: 10,
    background: "rgba(255,255,255,0.03)",
    marginBottom: 6,
  },

  name: {
    fontWeight: 700,
  },

  sub: {
    fontSize: 11,
    opacity: 0.6,
  },

  badge: {
    fontSize: 11,
    padding: "3px 8px",
    borderRadius: 999,
    background: "#1e293b",
  },

  ok: {
    fontSize: 12,
    opacity: 0.6,
  },
}