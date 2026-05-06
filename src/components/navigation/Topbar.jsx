import { useEffect, useState } from "react"
import AIQuickChat from "../topbar/AIQuickchat";

/* ---------------- HELPERS ---------------- */

function getInitials(name = "") {
  return name
    .split(" ")
    .map(n => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase()
}

function getColor(status) {
  if (status === "critical") return "#ef4444"
  if (status === "warning") return "#f59e0b"
  return "#22c55e"
}

/* ---------------- COMPONENTS ---------------- */

function StatusDot({ status }) {
  return (
    <div
      style={{
        width: 8,
        height: 8,
        borderRadius: "50%",
        background: getColor(status),
        boxShadow: `0 0 10px ${getColor(status)}88`,
      }}
    />
  )
}

function Icon({ label }) {
  return <div style={styles.icon}>{label}</div>
}

/* ---------------- MAIN ---------------- */

export default function Topbar() {
  const [time, setTime] = useState("")
  const [status, setStatus] = useState("stable")

  const user = {
    name: "Kevin Karanja", // 🔥 later: from DB / auth
  }

  useEffect(() => {
    const t = setInterval(() => {
      const now = new Date()
      setTime(now.toLocaleTimeString())
    }, 1000)

    const s = setInterval(() => {
      const states = ["stable", "warning", "critical"]
      setStatus(states[Math.floor(Math.random() * states.length)])
    }, 4000)

    return () => {
      clearInterval(t)
      clearInterval(s)
    }
  }, [])

  return (
    <div style={styles.wrapper}>
      {/* LEFT */}
      <div style={styles.left}>
        <div style={styles.search}>
          🔍 Search <span style={styles.kbd}>Ctrl + K</span>
        </div>
      </div>

      {/* CENTER */}
      <div style={styles.center}>
        <StatusDot status={status} />
        <span style={styles.status}>{status.toUpperCase()}</span>
      </div>

      {/* RIGHT */}
      <div style={styles.right}>
        <Icon label="⚡" />
        <Icon label="🔔" />
        <Icon label="🧠" />

        <div style={styles.divider} />

        {/* 🔥 HERO TIME */}
        <div style={styles.time}>{time}</div>

        {/* PROFILE */}
        <div style={styles.profile}>
          {getInitials(user.name)}
        </div>
      </div>
    </div>
  )
}

/* ---------------- STYLES ---------------- */

const styles = {
  wrapper: {
    height: 60,
    margin: "10px 16px",
    padding: "0 18px",

    display: "grid",
    gridTemplateColumns: "1fr auto 1fr",
    alignItems: "center",

    borderRadius: 16,

    background: "linear-gradient(135deg, #0f172a, #1e293b)",
    boxShadow: "0 10px 30px rgba(0,0,0,0.4)",
    border: "1px solid rgba(255,255,255,0.08)",

    backdropFilter: "blur(12px)",
  },

  left: {
    display: "flex",
    alignItems: "center",
  },

  center: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    justifyContent: "center",
  },

  right: {
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end",
    gap: 12,
  },

  search: {
    background: "rgba(255,255,255,0.05)",
    padding: "6px 12px",
    borderRadius: 10,
    fontSize: 12,
    color: "#cbd5f5",
    border: "1px solid rgba(255,255,255,0.08)",
  },

  kbd: {
    marginLeft: 6,
    padding: "2px 6px",
    borderRadius: 6,
    background: "rgba(255,255,255,0.08)",
    fontSize: 11,
  },

  status: {
    fontSize: 12,
    color: "#e2e8f0",
    fontWeight: 700,
    letterSpacing: 0.5,
  },

  icon: {
    padding: "6px 8px",
    borderRadius: 8,
    background: "rgba(255,255,255,0.05)",
    cursor: "pointer",
    fontSize: 14,
  },

  divider: {
    width: 1,
    height: 20,
    background: "rgba(255,255,255,0.1)",
  },

  time: {
    fontSize: 18,
    fontWeight: 900,
    letterSpacing: 1,
    color: "#38bdf8",
    fontFamily: "monospace",
    textShadow: "0 0 10px rgba(56,189,248,0.6)",
  },

  profile: {
    width: 30,
    height: 30,
    borderRadius: "50%",
    background: "#020617",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 12,
    fontWeight: 800,
    border: "1px solid rgba(255,255,255,0.1)",
    color: "#fff",
  },
}