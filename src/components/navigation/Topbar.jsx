import { useEffect, useState } from "react"

export default function Topbar({ isMobile, openSidebar }) {
  const [time, setTime] = useState("")

  useEffect(() => {
    const t = setInterval(() => {
      setTime(new Date().toLocaleTimeString())
    }, 1000)

    return () => clearInterval(t)
  }, [])

  return (
    <div style={styles.wrapper}>

      {/* LEFT */}
      <div style={styles.left}>

        {isMobile && (
          <button onClick={openSidebar} style={styles.menuBtn}>
            ☰
          </button>
        )}

        <div style={styles.title}>
          School Dashboard
        </div>

      </div>

      {/* CENTER FLEX FILLER */}
      <div style={{ flex: 1 }} />

      {/* RIGHT (LOCKED ZONE) */}
      <div style={styles.right}>

        {/* STATUS (HIDDEN ON MOBILE) */}
        {!isMobile && (
          <div style={styles.status}>
            🟢 Online
          </div>
        )}

        {/* NOTIFICATIONS (always visible) */}
        <button style={styles.iconBtn} onClick={() => alert("Notifications")}>
          🔔
        </button>

        {/* AI + QUICK ACTIONS (HIDDEN ON MOBILE) */}
        {!isMobile && (
          <>
            <button style={styles.iconBtn} onClick={() => alert("AI Assistant")}>
              🧠
            </button>

            <button style={styles.iconBtn} onClick={() => alert("Quick Actions")}>
              ⚡
            </button>
          </>
        )}

        {/* TIME */}
        <div style={styles.time}>{time}</div>

        {/* AVATAR (ALWAYS VISIBLE + LOCKED) */}
        <div style={styles.avatar}>
          U
        </div>

      </div>

    </div>
  )
}

/* ---------------- STYLES ---------------- */

const styles = {
  wrapper: {
    height: 60,
    width: "100%",
    display: "flex",
    alignItems: "center",
    padding: "0 16px",

    background: "#0f172a",
    borderBottom: "1px solid rgba(255,255,255,0.06)",

    position: "relative",
    overflow: "hidden",
  },

  left: {
    display: "flex",
    alignItems: "center",
    gap: 10,
  },

  menuBtn: {
    background: "transparent",
    border: "none",
    color: "white",
    fontSize: 22,
    cursor: "pointer",
  },

  title: {
    fontWeight: 800,
    fontSize: 14,
    color: "white",
  },

  right: {
    position: "absolute",
    right: 16,
    top: "50%",
    transform: "translateY(-50%)",

    display: "flex",
    alignItems: "center",
    gap: 10,

    whiteSpace: "nowrap",
  },

  status: {
    fontSize: 12,
    opacity: 0.7,
  },

  iconBtn: {
    width: 34,
    height: 34,
    borderRadius: 10,
    background: "rgba(255,255,255,0.05)",
    border: "1px solid rgba(255,255,255,0.06)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    fontSize: 14,
    transition: "0.2s ease",
  },

  time: {
    fontSize: 12,
    fontFamily: "monospace",
    color: "#38bdf8",
  },

  avatar: {
    width: 36,
    height: 36,
    borderRadius: "50%",
    background: "linear-gradient(135deg,#3b82f6,#60a5fa)",
    color: "white",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: 900,
    cursor: "pointer",
    flexShrink: 0,
  },
}






















