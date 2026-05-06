import { useEffect, useState } from "react"
import { db } from "../db"
import { runIntelligence } from "../lib/intelligence/engine"

export default function InsightsDashboard() {
  const [state, setState] = useState(null)

  useEffect(() => {
    let alive = true

    const run = async () => {
      const students = await db.students.toArray()
      const fees = await db.fees.toArray()
      const attendance = await db.attendance.toArray()

      const result = runIntelligence(
        students || [],
        fees || [],
        attendance || []
      )

      if (alive) setState(result)
    }

    run()
    const t = setInterval(run, 4000)

    return () => {
      alive = false
      clearInterval(t)
    }
  }, [])

  if (!state) {
    return (
      <div style={styles.loading}>
        🧠 Initializing multi-agent intelligence layer...
      </div>
    )
  }

  const { metrics, trends, prediction, systemState, systemInsight, agents } =
    state

  return (
    <div style={styles.wrapper}>

      {/* HEADER */}
      <Header systemState={systemState} />

      {/* TOP SIGNAL GRID */}
      <div style={styles.grid}>
        <Card label="Revenue Health" value={metrics.revenueHealth} />
        <Card label="Avg Risk" value={metrics.avgRisk} />
        <Card label="Attendance" value={metrics.attendanceRate} />
        <Card label="System State" value={systemState} highlight />
      </div>

      {/* AGENTS PANEL */}
      <div style={styles.section}>
        <Title>🧠 Active Intelligence Agents</Title>

        <div style={styles.agentGrid}>
          {agents?.map((a, i) => (
            <AgentCard key={i} agent={a} />
          ))}
        </div>
      </div>

      {/* TRENDS */}
      <div style={styles.section}>
        <Title>📈 System Trends</Title>

        <div style={styles.row}>
          <Trend label="Revenue" value={trends.revenueTrend} />
          <Trend label="Risk" value={trends.riskTrend} />
          <Trend label="Attendance" value={trends.attendanceTrend} />
        </div>
      </div>

      {/* PREDICTION ENGINE */}
      <div style={styles.section}>
        <Title>🔮 Forecast (14-day projection)</Title>

        <div style={styles.forecastBox}>
          <div>Risk → {prediction.risk}/100</div>
          <div>Revenue → {prediction.revenue}/100</div>
          <div>Attendance → {prediction.attendance}/100</div>
        </div>
      </div>

      {/* SYSTEM INSIGHT (CORE VALUE) */}
      <div style={styles.insightBox}>
        <div style={{ fontWeight: 900, marginBottom: 6 }}>
          🧠 System Insight
        </div>
        <div style={{ lineHeight: 1.6 }}>{systemInsight}</div>
      </div>
    </div>
  )
}

/* ---------------- HEADER ---------------- */

function Header({ systemState }) {
  const color =
    systemState === "critical"
      ? "#ef4444"
      : systemState === "warning"
      ? "#f59e0b"
      : "#22c55e"

  return (
    <div style={styles.header}>
      <div style={{ fontSize: 22, fontWeight: 900 }}>
        🧠 INSIGHTS CONTROL CENTER
      </div>

      <div style={{ color, fontWeight: 700, marginTop: 4 }}>
        System State: {systemState.toUpperCase()}
      </div>
    </div>
  )
}

/* ---------------- CARDS ---------------- */

function Card({ label, value, highlight }) {
  return (
    <div style={{ ...styles.card, borderColor: highlight ? "#60a5fa" : "#1f2937" }}>
      <div style={styles.cardLabel}>{label}</div>
      <div style={styles.cardValue}>{value}</div>
    </div>
  )
}

/* ---------------- AGENT CARD ---------------- */

function AgentCard({ agent }) {
  const color =
    agent.state === "critical"
      ? "#ef4444"
      : agent.state === "warning"
      ? "#f59e0b"
      : "#22c55e"

  return (
    <div style={styles.agentCard}>
      <div style={{ fontWeight: 800 }}>{agent.name}</div>

      <div style={{ color, marginTop: 4, fontSize: 13 }}>
        {agent.state.toUpperCase()}
      </div>

      <div style={{ fontSize: 12, marginTop: 6, opacity: 0.8 }}>
        {agent.signal}
      </div>
    </div>
  )
}

/* ---------------- TREND ---------------- */

function Trend({ label, value }) {
  const color =
    value === "improving"
      ? "#22c55e"
      : value === "declining"
      ? "#ef4444"
      : "#94a3b8"

  return (
    <div style={styles.trend}>
      <div style={{ fontSize: 12 }}>{label}</div>
      <div style={{ color, fontWeight: 800 }}>{value}</div>
    </div>
  )
}

/* ---------------- STYLES ---------------- */

const styles = {
  wrapper: {
    padding: 24,
    background: "#050816",
    minHeight: "100vh",
    color: "white",
  },

  loading: {
    padding: 24,
    background: "#050816",
    color: "#93c5fd",
    minHeight: "100vh",
  },

  header: {
    marginBottom: 16,
    borderBottom: "1px solid rgba(255,255,255,0.08)",
    paddingBottom: 12,
  },

  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(4, 1fr)",
    gap: 12,
  },

  section: {
    marginTop: 18,
  },

  card: {
    background: "#0f172a",
    border: "1px solid #1f2937",
    padding: 14,
    borderRadius: 14,
  },

  cardLabel: {
    fontSize: 11,
    opacity: 0.7,
  },

  cardValue: {
    fontSize: 20,
    fontWeight: 900,
    marginTop: 6,
  },

  agentGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gap: 12,
  },

  agentCard: {
    background: "#0f172a",
    border: "1px solid #1f2937",
    padding: 12,
    borderRadius: 12,
  },

  row: {
    display: "flex",
    gap: 12,
  },

  trend: {
    background: "#0f172a",
    padding: 12,
    borderRadius: 12,
    flex: 1,
    border: "1px solid #1f2937",
  },

  forecastBox: {
    background: "#0f172a",
    padding: 14,
    borderRadius: 14,
    border: "1px solid #1f2937",
    lineHeight: 1.8,
  },

  insightBox: {
    marginTop: 18,
    background: "rgba(59,130,246,0.08)",
    border: "1px solid rgba(59,130,246,0.3)",
    padding: 14,
    borderRadius: 14,
  },
}

function Title({ children }) {
  return (
    <div style={{ fontWeight: 800, marginBottom: 10 }}>{children}</div>
  )
}