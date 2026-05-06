import { useEffect, useState } from "react"
import { runIntelligence } from "../lib/intelligence/engine"

export default function InsightsDashboard() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const load = async () => {
    try {
      const res = await runIntelligence()

      if (!res) {
        setError("AI engine failed to generate insights")
        return
      }

      setData(res)
      setError(null)
    } catch (err) {
      console.error(err)
      setError("Something went wrong")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()

    const t = setInterval(load, 4000) // 🔥 live refresh

    return () => clearInterval(t)
  }, [])

  if (loading) {
    return (
      <div style={styles.loading}>
        🧠 Booting Intelligence Engine...
      </div>
    )
  }

  if (error) {
    return (
      <div style={styles.error}>
        ⚠️ {error}
      </div>
    )
  }

  return (
    <div style={styles.wrapper}>

      {/* HEADER */}
      <div style={styles.header}>
        <div style={styles.title}>
          🧠 INTELLIGENCE CORE
        </div>
        <div style={styles.subtitle}>
          Real-time system reasoning & predictive insights
        </div>
      </div>

      {/* KPIs */}
      <div style={styles.grid}>

        <Card
          label="Total Students"
          value={data.totalStudents}
        />

        <Card
          label="High Risk"
          value={data.highRisk.length}
          color="#ef4444"
        />

        <Card
          label="Total Debt"
          value={"$" + data.totalDebt}
          color="#f59e0b"
        />

      </div>

      {/* MAIN GRID */}
      <div style={styles.main}>

        {/* LEFT */}
        <Panel title="🔴 High Risk Students">
          {data.highRisk.length === 0 && (
            <div style={styles.empty}>
              No high-risk students 🎉
            </div>
          )}

          {data.highRisk.map((s, i) => (
            <StudentRow key={i} s={s} />
          ))}
        </Panel>

        {/* RIGHT */}
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>

          <Panel title="🧠 AI Insight">
            <div style={styles.text}>
              {data.insight}
            </div>
          </Panel>

          <Panel title="🎯 Recommended Actions">
            <ul style={styles.list}>
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

/* ---------------- UI COMPONENTS ---------------- */

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
        <div style={styles.sub}>
          Balance: ${s.balance}
        </div>
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
    minHeight: "100vh",
    color: "white",
    fontFamily: "Inter",
  },

  loading: {
    padding: 24,
    color: "#60a5fa",
    background: "#050816",
    minHeight: "100vh",
  },

  error: {
    padding: 24,
    color: "#ef4444",
    background: "#050816",
  },

  header: {
    marginBottom: 16,
    borderBottom: "1px solid rgba(255,255,255,0.08)",
    paddingBottom: 10,
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
    gridTemplateColumns: "repeat(3, 1fr)",
    gap: 12,
    marginTop: 12,
  },

  card: {
    background: "#0f172a",
    padding: 14,
    borderRadius: 14,
    border: "1px solid rgba(255,255,255,0.08)",
  },

  cardLabel: {
    fontSize: 11,
    opacity: 0.6,
  },

  cardValue: {
    fontSize: 20,
    fontWeight: 900,
    marginTop: 6,
  },

  main: {
    display: "grid",
    gridTemplateColumns: "2fr 1fr",
    gap: 14,
    marginTop: 16,
  },

  panel: {
    background: "#0f172a",
    borderRadius: 14,
    padding: 14,
    border: "1px solid rgba(255,255,255,0.08)",
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

  list: {
    fontSize: 13,
    lineHeight: 1.8,
  },

  row: {
    display: "flex",
    justifyContent: "space-between",
    padding: 10,
    marginBottom: 8,
    borderRadius: 10,
    background: "rgba(255,255,255,0.03)",
  },

  name: {
    fontWeight: 700,
  },

  sub: {
    fontSize: 11,
    opacity: 0.6,
  },

  risk: {
    fontWeight: 900,
  },

  empty: {
    fontSize: 13,
    opacity: 0.6,
  },
}





