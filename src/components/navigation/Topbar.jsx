import { useEffect, useState } from "react"
import { useAuth } from "../../context/AuthContext"
import { logout } from "../../lib/auth"

/* ---------------- HELPERS ---------------- */

function getColor(status) {
  if (status === "critical") return "#ef4444"
  if (status === "warning") return "#f59e0b"
  return "#22c55e"
}

/* ---------------- SMALL COMPONENTS ---------------- */

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
  const [open, setOpen] = useState(false)

  const { user, profile } = useAuth()

  const handleLogout = async () => {
    await logout()
    window.location.href = "/login"
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

        {/* TIME */}
        <div style={styles.time}>{time}</div>

        {/* PROFILE */}
        <div style={{ position: "relative" }}>

          {/* AVATAR */}
          <div
            onClick={() => setOpen(!open)}
            style={styles.avatar}
          >
            {user?.email?.[0]?.toUpperCase() || "U"}
          </div>

          {/* DROPDOWN */}
             {open && (
  <div style={styles.dropdown}>

    {/* HEADER */}
    <div style={styles.header}>
      <div style={styles.avatar}>
        {user?.email?.[0]?.toUpperCase() || "U"}
      </div>

      <div>
        <div style={styles.email}>
          {user?.email}
        </div>

        <div style={styles.role}>
          {profile?.role || "user"}
        </div>
      </div>
    </div>

    {/* CLEAN ACTIONS */}
    <div style={styles.actions}>

      <div style={styles.item}>
        ⚙️ Profile Settings
      </div>

      <div style={styles.item}>
        🔐 Security & Permissions
      </div>

      <div style={styles.item}>
        🧠 AI Preferences
      </div>

    </div>

    {/* FOOTER */}
    <div onClick={handleLogout} style={styles.logout}>
      Logout
    </div>

  </div>
)}

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
  },

  left: { display: "flex", alignItems: "center" },
  center: { display: "flex", alignItems: "center", gap: 8, justifyContent: "center" },
  right: { display: "flex", alignItems: "center", justifyContent: "flex-end", gap: 12 },

  search: {
    background: "rgba(255,255,255,0.05)",
    padding: "6px 12px",
    borderRadius: 10,
    fontSize: 12,
    color: "#cbd5f5",
  },

  kbd: {
    marginLeft: 6,
    padding: "2px 6px",
    borderRadius: 6,
    background: "rgba(255,255,255,0.08)",
  },

  status: {
    fontSize: 12,
    fontWeight: 700,
    color: "#e2e8f0",
  },

  icon: {
    padding: "6px 8px",
    borderRadius: 8,
    background: "rgba(255,255,255,0.05)",
    cursor: "pointer",
  },

  divider: {
    width: 1,
    height: 20,
    background: "rgba(255,255,255,0.1)",
  },

  time: {
    fontSize: 18,
    fontWeight: 900,
    color: "#38bdf8",
    fontFamily: "monospace",
  },

  avatar: {
    cursor: "pointer",
    background: "#3b82f6",
    color: "white",
    borderRadius: "50%",
    width: 36,
    height: 36,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: 900,
  },

  dropdown: {
  position: "absolute",
  right: 0,
  top: 50,
  width: 240,
  padding: 14,

  background: "rgba(255,255,255,0.92)",
  backdropFilter: "blur(16px)",
  borderRadius: 16,

  boxShadow: "0 20px 50px rgba(0,0,0,0.15)",
  border: "1px solid rgba(0,0,0,0.06)",
  fontFamily: "system-ui",
},

header: {
  display: "flex",
  gap: 10,
  alignItems: "center",
  marginBottom: 12
},

avatar: {
  width: 40,
  height: 40,
  borderRadius: "50%",
  background: "linear-gradient(135deg, #3b82f6, #60a5fa)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontWeight: 800,
  color: "white"
},

email: {
  fontSize: 13,
  fontWeight: 700,
  color: "#0f172a",
  wordBreak: "break-word"
},

role: {
  fontSize: 11,
  color: "#64748b",
  marginTop: 2
},

actions: {
  display: "flex",
  flexDirection: "column",
  gap: 6,
  paddingTop: 6,
  paddingBottom: 10
},

item: {
  padding: "8px 10px",
  borderRadius: 10,
  fontSize: 13,
  color: "#0f172a",
  cursor: "pointer",
  transition: "0.2s",
  background: "transparent"
},

logout: {
  marginTop: 6,
  padding: "8px 10px",
  borderRadius: 10,
  fontSize: 13,
  fontWeight: 700,
  color: "#ef4444",
  cursor: "pointer",
  background: "#fff1f2"
},
}