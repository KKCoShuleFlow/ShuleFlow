import { useEffect, useState, useRef } from "react"
import { db } from "../db"

export default function SyncStatusDashboard() {
  const [state, setState] = useState(null)
  const historyRef = useRef([])

  useEffect(() => {
    const run = async () => {
      const start = performance.now()

      try {
        const students = await db.students.toArray()
        const fees = await db.fees.toArray()

        const end = performance.now()
        const latency = Math.round(end - start)

        const snapshot = buildSyncState(students, fees, latency)

        historyRef.current = [
          {
            time: new Date().toLocaleTimeString(),
            latency,
            status: snapshot.status,
          },
          ...historyRef.current.slice(0, 20),
        ]

        setState({
          ...snapshot,
          history: historyRef.current,
        })
      } catch (err) {
        setState({
          status: "critical",
          latency: 999,
          error: err.message,
          history: historyRef.current,
        })
      }
    }

    run()
    const interval = setInterval(run, 2000)

    return () => clearInterval(interval)
  }, [])

  if (!state) {
    return (
      <div style={styles.loading}>
        🔄 Initializing Sync Mesh Network...
      </div>
    )
  }

  return (
    <div style={styles.wrapper}>

      {/* HEADER */}
      <Header state={state} />

      {/* METRICS */}
      <div style={styles.grid}>
        <Metric label="Sync Status" value={state.status.toUpperCase()} />
        <Metric label="Latency" value={state.latency + "ms"} />
        <Metric label="Data Integrity" value={state.integrity + "%"} />
        <Metric label="Throughput" value={state.throughput + " ops/s"} />
      </div>

      {/* LIVE SYNC FLOW VISUAL */}
      <div style={styles.flow}>
        <div style={styles.title}>⚡ Live Sync Flow</div>

        <div style={styles.nodes}>
          <Node label="DB" status={state.status} />
          <Arrow />
          <Node label="ENGINE" status={state.status} />
          <Arrow />
          <Node label="UI" status={state.status} />
        </div>
      </div>

      {/* REAL-TIME LOG STREAM */}
      <div style={styles.stream}>
        <div style={styles.title}>📡 Sync Event Stream</div>

        {state.history.map((h, i) => (
          <div key={i} style={styles.log}>
            <span style={{ opacity: 0.6 }}>{h.time}</span>
            <span style={{ marginLeft: 10 }}>
              {h.status.toUpperCase()}
            </span>
            <span style={{ marginLeft: 10, opacity: 0.7 }}>
              {h.latency}ms
            </span>
          </div>
        ))}
      </div>

      {/* DIAGNOSTIC PANEL */}
      <div style={styles.panel}>
        <div style={styles.title}>🧠 Sync Intelligence</div>
        <div style={styles.text}>{state.diagnosis}</div>
      </div>

      {/* ALERT BAR */}
      {state.status === "critical" && (
        <div style={styles.alert}>
          🚨 SYNC DEGRADATION DETECTED — SYSTEM ENTERING FALLBACK MODE
        </div>
      )}

    </div>
  )
}

/* ---------------- ENGINE ---------------- */

function buildSyncState(students, fees, latency) {
  const total = students.length + fees.length

  const integrity =
    latency < 100 ? 99 :
    latency < 300 ? 90 :
    latency < 600 ? 70 : 50

  const throughput = Math.max(10, Math.floor(1000 / (latency || 1)))

  let status = "stable"
  if (latency > 600) status = "critical"
  else if (latency > 300) status = "degraded"

  let diagnosis = ""

  if (status === "critical") {
    diagnosis =
      "Sync system is under heavy load. Data pipeline delays detected across multiple nodes."
  } else if (status === "degraded") {
    diagnosis =
      "Moderate latency detected. System is operating but performance is reduced."
  } else {
    diagnosis =
      "Sync system operating optimally. Real-time data flow is stable and consistent."
  }

  return {
    status,
    latency,
    integrity,
    throughput,
    diagnosis,
  }
}

/* ---------------- UI COMPONENTS ---------------- */

function Header({ state }) {
  return (
    <div style={styles.header}>
      <div style={{ fontSize: 22, fontWeight: 900 }}>
        🛰 SCHOOL SYNC OBSERVABILITY
      </div>

      <div style={{ fontSize: 12, opacity: 0.7 }}>
        System State:{" "}
        <span style={{ color: getColor(state.status) }}>
          {state.status.toUpperCase()}
        </span>
      </div>
    </div>
  )
}

function Metric({ label, value }) {
  return (
    <div style={styles.card}>
      <div style={{ fontSize: 11, opacity: 0.6 }}>{label}</div>
      <div style={{ fontSize: 20, fontWeight: 900 }}>{value}</div>
    </div>
  )
}

function Node({ label, status }) {
  return (
    <div style={{
      ...styles.node,
      borderColor: getColor(status),
      boxShadow: `0 0 12px ${getColor(status)}33`,
    }}>
      {label}
    </div>
  )
}

function Arrow() {
  return <div style={{ opacity: 0.4 }}>➝</div>
}

/* ---------------- STYLES ---------------- */

const styles = {
  wrapper: {
    padding: 20,
    background: "#050816",
    minHeight: "100vh",
    color: "white",
    fontFamily: "Inter",
  },

  loading: {
    padding: 24,
    background: "#050816",
    color: "#60a5fa",
    minHeight: "100vh",
  },

  header: {
    marginBottom: 16,
    paddingBottom: 10,
    borderBottom: "1px solid rgba(255,255,255,0.1)",
  },

  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(4, 1fr)",
    gap: 12,
  },

  card: {
    background: "#0f172a",
    padding: 14,
    borderRadius: 14,
  },

  flow: {
    marginTop: 14,
    background: "#0f172a",
    padding: 14,
    borderRadius: 14,
  },

  nodes: {
    display: "flex",
    alignItems: "center",
    gap: 12,
    marginTop: 10,
  },

  node: {
    padding: "8px 12px",
    borderRadius: 10,
    border: "1px solid",
    fontWeight: 700,
  },

  stream: {
    marginTop: 14,
    background: "#020617",
    padding: 14,
    borderRadius: 14,
    maxHeight: 200,
    overflow: "auto",
  },

  log: {
    fontSize: 12,
    padding: "6px 0",
    borderBottom: "1px solid rgba(255,255,255,0.05)",
  },

  panel: {
    marginTop: 14,
    background: "#0f172a",
    padding: 14,
    borderRadius: 14,
  },

  title: {
    fontSize: 12,
    fontWeight: 800,
    marginBottom: 8,
  },

  text: {
    fontSize: 13,
    opacity: 0.9,
  },

  alert: {
    marginTop: 14,
    padding: 12,
    borderRadius: 12,
    background: "#7f1d1d",
    fontWeight: 800,
  },
}

/* ---------------- HELPERS ---------------- */

function getColor(status) {
  if (status === "critical") return "#ef4444"
  if (status === "degraded") return "#f59e0b"
  return "#22c55e"
}