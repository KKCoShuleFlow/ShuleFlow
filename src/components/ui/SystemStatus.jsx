import { useEffect, useState } from "react"
import { checkBackendStatus, getNetworkStatus } from "../../lib/systemStatus"

export default function SystemStatus() {
  const [status, setStatus] = useState("loading")

  useEffect(() => {
    runCheck()

    const interval = setInterval(runCheck, 10000) // refresh every 10s

    window.addEventListener("online", runCheck)
    window.addEventListener("offline", runCheck)

    return () => {
      clearInterval(interval)
      window.removeEventListener("online", runCheck)
      window.removeEventListener("offline", runCheck)
    }
  }, [])

  async function runCheck() {
    const network = getNetworkStatus()
    const backend = await checkBackendStatus()

    if (network === "offline") {
      setStatus("offline")
      return
    }

    if (backend === "degraded") {
      setStatus("degraded")
      return
    }

    setStatus("healthy")
  }

  const config = {
    healthy: {
      color: "#10b981",
      text: "All systems operational"
    },
    degraded: {
      color: "#f59e0b",
      text: "Partial service disruption"
    },
    offline: {
      color: "#ef4444",
      text: "Offline mode active"
    },
    loading: {
      color: "#94a3b8",
      text: "Checking system..."
    }
  }[status]

  return (
    <div style={{
      display: "flex",
      alignItems: "center",
      gap: 8,
      fontSize: 13,
      color: "#64748b"
    }}>

      {/* PULSE DOT */}
      <span style={{
        width: 8,
        height: 8,
        borderRadius: "50%",
        background: config.color,
        animation: status === "healthy" ? "pulse 1.5s infinite" : "none"
      }} />

      {config.text}

      <style>{`
        @keyframes pulse {
          0% { opacity: 1; }
          50% { opacity: 0.4; }
          100% { opacity: 1; }
        }
      `}</style>

    </div>
  )
}