import { useEffect, useState } from "react"
import CommandPalette from "./CommandPalette"
import Notifications from "./Notifications"
import AIQuickChat from "./AIQuickChat"
import ProfileMenu from "./ProfileMenu"

export default function Topbar() {
  const [time, setTime] = useState("")
  const [openCmd, setOpenCmd] = useState(false)
  const [openNotif, setOpenNotif] = useState(false)
  const [openAI, setOpenAI] = useState(false)

  const user = {
    name: "Kevin Karanja",
    role: "Admin"
  }

  useEffect(() => {
    const t = setInterval(() => {
      setTime(new Date().toLocaleTimeString())
    }, 1000)

    const keyHandler = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault()
        setOpenCmd(v => !v)
      }
    }

    window.addEventListener("keydown", keyHandler)

    return () => {
      clearInterval(t)
      window.removeEventListener("keydown", keyHandler)
    }
  }, [])

  return (
    <>
      <div style={styles.wrapper}>

        {/* LEFT */}
        <div style={styles.left}>
          <div onClick={() => setOpenCmd(true)} style={styles.search}>
            🔍 Search <span style={styles.kbd}>Ctrl + K</span>
          </div>
        </div>

        {/* CENTER */}
        <div style={styles.center}>
          <HeatIndicator />
        </div>

        {/* RIGHT */}
        <div style={styles.right}>

          <Icon label="⚡" />

          <Icon label="🔔" onClick={() => setOpenNotif(v => !v)} />

          <Icon label="🧠" onClick={() => setOpenAI(v => !v)} />

          <div style={styles.divider} />

          <div style={styles.time}>{time}</div>

          <ProfileMenu user={user} />

        </div>
      </div>

      {/* OVERLAYS */}
      {openCmd && <CommandPalette onClose={() => setOpenCmd(false)} />}
      {openNotif && <Notifications />}
      {openAI && <AIQuickChat />}
    </>
  )
}

/* ---------------- SMALL COMPONENTS ---------------- */

function Icon({ label, onClick }) {
  return (
    <div onClick={onClick} style={styles.icon}>
      {label}
    </div>
  )
}

function HeatIndicator() {
  const level = Math.floor(Math.random() * 100)

  return (
    <div style={styles.heat}>
      🌡 {level}% load
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

  left: { display: "flex" },
  center: { display: "flex", justifyContent: "center" },
  right: { display: "flex", gap: 12, alignItems: "center", justifyContent: "flex-end" },

  search: {
    background: "rgba(255,255,255,0.05)",
    padding: "6px 12px",
    borderRadius: 10,
    cursor: "pointer",
  },

  kbd: { marginLeft: 6, fontSize: 11 },

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

  heat: {
    fontSize: 12,
    color: "#f59e0b",
    fontWeight: 700,
  }
}