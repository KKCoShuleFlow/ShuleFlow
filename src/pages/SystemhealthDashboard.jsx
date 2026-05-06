import { useEffect, useState, useRef } from "react"
import { db } from "../db"

export default function SystemhealthDashboard() {
  const [os, setOs] = useState(null)
  const memoryRef = useRef({
    history: [],
    mood: "neutral",
  })

  useEffect(() => {
    const tick = async () => {
      const students = await db.students.toArray()
      const fees = await db.fees.toArray()

      const snapshot = computeOS(students, fees, memoryRef.current)

      memoryRef.current = snapshot.memory
      setOs(snapshot)
    }

    tick()
    const interval = setInterval(tick, 3000)

    return () => clearInterval(interval)
  }, [])

  if (!os) {
    return (
      <div style={styles.loading}>
        🧠 Booting Self-Aware School OS...
      </div>
    )
  }

  return (
    <div style={styles.wrapper}>

      {/* HEADER (SELF AWARE STATE) */}
      <div style={styles.header}>
        <div style={{ fontSize: 22, fontWeight: 900 }}>
          🧠 SCHOOL OS — SELF AWARE MODE
        </div>

        <div style={{ fontSize: 12, opacity: 0.7 }}>
          Mood:{" "}
          <span style={{ color: moodColor(os.memory.mood) }}>
            {os.memory.mood.toUpperCase()}
          </span>{" "}
          | Confidence: {os.confidence}%
        </div>
      </div>

      {/* SYSTEM STATUS CORE */}
      <div style={styles.grid}>

        <Metric label="System Health" value={os.health} />
        <Metric label="Future Risk (Forecast)" value={os.forecast} />
        <Metric label="Memory Depth" value={os.memory.history.length} />
        <Metric label="Stability Index" value={os.stability} />

      </div>

      {/* SELF REFLECTION PANEL */}
      <div style={styles.panel}>
        <div style={styles.title}>🪞 Self Reflection</div>
        <div style={styles.text}>
          {os.thought}
        </div>
      </div>

      {/* FORECAST ENGINE */}
      <div style={styles.panelDark}>
        <div style={styles.title}>🔮 Predictive Awareness</div>
        <div style={styles.text}>
          {os.forecastText}
        </div>
      </div>

      {/* MEMORY STREAM */}
      <div style={styles.stream}>
        <div style={styles.title}>📡 Memory Stream</div>

        {os.memory.history.slice(0, 10).map((h, i) => (
          <div key={i} style={styles.log}>
            <span style={{ opacity: 0.6 }}>{h.time}</span>
            <span style={{ marginLeft: 10 }}>
              {h.state}
            </span>
          </div>
        ))}
      </div>

    </div>
  )
}

/* ---------------- CORE OS ENGINE ---------------- */

function computeOS(students, fees, memory) {
  const totalExpected = fees.reduce((a, f) => a + Number(f.amount || 0), 0)
  const totalPaid = fees.reduce((a, f) => a + Number(f.paid || 0), 0)

  const health = totalExpected
    ? Math.round((totalPaid / totalExpected) * 100)
    : 100

  // simple forward prediction (memory-based trend)
  const last = memory.history[0]?.health || health
  const trend = health - last

  const forecast = Math.max(0, Math.min(100, health + trend * 2))

  let mood = "stable"
  if (health < 40) mood = "distressed"
  else if (health < 70) mood = "unstable"
  else if (trend > 5) mood = "optimistic"
  else if (trend < -5) mood = "declining"

  const stability = Math.max(0, health - Math.abs(trend))

  const confidence = Math.min(100, memory.history.length * 8)

  // SELF-THOUGHT ENGINE
  const thought = generateThought({ health, trend, mood })

  // FUTURE FORECAST TEXT
  const forecastText = generateForecast({ forecast, mood, trend })

  const newMemory = {
    history: [
      {
        time: new Date().toLocaleTimeString(),
        health,
        state: mood,
      },
      ...memory.history,
    ],
    mood,
  }

  return {
    health,
    forecast,
    stability,
    confidence,
    memory: newMemory,
    thought,
    forecastText,
  }
}

/* ---------------- SELF THOUGHT ---------------- */

function generateThought({ health, trend, mood }) {
  if (mood === "distressed") {
    return "System experiencing sustained degradation. Financial stress and student risk signals are converging."
  }

  if (mood === "unstable") {
    return "System stability is weakening. Minor fluctuations detected across financial and attendance layers."
  }

  if (mood === "optimistic") {
    return "System is improving. Positive financial and behavioral signals detected across multiple subsystems."
  }

  return "System is balanced. No significant anomalies detected in current operational state."
}

/* ---------------- FORECAST ---------------- */

function generateForecast({ forecast, trend, mood }) {
  if (forecast < 40) {
    return "If current trajectory continues, system may enter critical instability within next cycle."
  }

  if (trend < -5) {
    return "Downward trend detected. Risk accumulation likely if not corrected."
  }

  if (trend > 5) {
    return "Positive momentum detected. System is self-stabilizing."
  }

  return "System trajectory remains neutral. No immediate risks forecasted."
}

/* ---------------- UI COMPONENTS ---------------- */

function Metric({ label, value }) {
  return (
    <div style={styles.card}>
      <div style={{ fontSize: 11, opacity: 0.6 }}>{label}</div>
      <div style={{ fontSize: 22, fontWeight: 900 }}>
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

  panel: {
    marginTop: 14,
    background: "#0f172a",
    padding: 14,
    borderRadius: 14,
  },

  panelDark: {
    marginTop: 14,
    background: "#020617",
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
    lineHeight: 1.6,
    opacity: 0.9,
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
}

/* ---------------- HELPERS ---------------- */

function moodColor(mood) {
  switch (mood) {
    case "distressed":
      return "#ef4444"
    case "unstable":
      return "#f59e0b"
    case "optimistic":
      return "#22c55e"
    default:
      return "#60a5fa"
  }
}