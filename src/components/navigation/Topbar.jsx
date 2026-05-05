import SystemMonitor from "../ui/SystemMonitor"
import { useEffect, useState } from "react"

function RoleHeader({ role = "Admin", page = "Dashboard" }) {
  return (
    <div style={{
      display: "flex",
      alignItems: "center",
      gap: 10
    }}>

      {/* ROLE BADGE */}
      <div style={{
        fontSize: 11,
        padding: "4px 8px",
        borderRadius: 999,
        background: "rgba(79, 70, 229, 0.08)",
        color: "#4f46e5",
        fontWeight: 600,
        letterSpacing: "0.02em"
      }}>
        {role.toUpperCase()}
      </div>

      {/* PAGE TITLE */}
      <div style={{
        fontSize: 13,
        color: "#0f172a",
        fontWeight: 500
      }}>
        {page}
      </div>

    </div>
  )
}

export default function Topbar() {
  const [time, setTime] = useState(new Date())

  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000)
    return () => clearInterval(t)
  }, [])

  return (
    <div style={{
      height: 60,
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      padding: "0 18px",
      borderBottom: "1px solid rgba(0,0,0,0.06)",
      background: "white",
      width: "100%",
      boxSizing: "border-box"
    }}>

      {/* LEFT — BRAND (DO NOT REMOVE) */}
      <div style={{ display: "flex", alignItems: "baseline", gap: 10 }}>
        <div style={{
          fontSize: 15,
          fontWeight: 600,
          letterSpacing: "-0.03em",
          color: "#0f172a"
        }}>
          ShuleFlow
        </div>

        <div style={{
          fontSize: 12,
          color: "#94a3b8"
        }}>
          School Operations OS
        </div>
      </div>

      {/* CENTER — ROLE + PAGE */}
      <RoleHeader role="Admin" page="Dashboard" />

      {/* RIGHT — LIVE SYSTEM LAYER */}
      <div style={{
        display: "flex",
        alignItems: "center",
        gap: 14
      }}>

        {/* CLOCK */}
        <div style={{
          fontSize: 12,
          color: "#64748b",
          fontVariantNumeric: "tabular-nums"
        }}>
          {time.toLocaleTimeString()}
        </div>

        {/* SYSTEM STATUS */}
        <SystemMonitor />

      </div>

    </div>
  )
}