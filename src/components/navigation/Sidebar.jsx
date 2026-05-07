import { NavLink } from "react-router-dom"
import { useState } from "react"

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false)
  const [hovered, setHovered] = useState(false)

  const isCompact = collapsed && !hovered

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        width: isCompact ? 72 : 260,
        height: "100vh",
        display: "flex",
        flexDirection: "column",

        /* ✅ CLEAN TOP SPACING FIX */
        paddingTop: 20,
        paddingLeft: 14,
        paddingRight: 14,
        paddingBottom: 14,

        background: "#0b1220",
        borderRight: "1px solid rgba(255,255,255,0.06)",
        color: "white",
        transition: "all 0.25s ease",
        overflow: "hidden",
      }}
    >

      {/* ---------------- HEADER ---------------- */}
      {/* HEADER */}
<div
  style={{
    display: "flex",
    alignItems: "center",
    justifyContent: collapsed ? "center" : "space-between",
    marginBottom: 18,
    padding: collapsed ? "8px 0" : "10px 10px",
    borderRadius: 14,
    background: "linear-gradient(135deg, rgba(59,130,246,0.12), rgba(99,102,241,0.08))",
    border: "1px solid rgba(255,255,255,0.08)",
  }}
>

  {/* BRAND */}
  {!collapsed && (
    <div style={{ display: "flex", flexDirection: "column" }}>
      
      {/* LOGO ROW */}
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        
        <div
          style={{
            width: 34,
            height: 34,
            borderRadius: 10,
            background: "linear-gradient(135deg,#3b82f6,#6366f1)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 16,
            fontWeight: 900,
            boxShadow: "0 0 18px rgba(99,102,241,0.35)",
          }}
        >
          SF
        </div>

        <div>
          <div
            style={{
              fontWeight: 900,
              fontSize: 16,
              letterSpacing: 0.4,
              color: "white",
            }}
          >
            ShuleFlow
          </div>

          <div
            style={{
              fontSize: 11,
              color: "#94a3b8",
              marginTop: 1,
            }}
          >
            School OS Platform
          </div>
        </div>
      </div>

      {/* STATUS ROW */}
      <div style={{ display: "flex", alignItems: "center", marginTop: 8, gap: 8 }}>
        <span
          style={{
            width: 7,
            height: 7,
            borderRadius: "50%",
            background: "#22c55e",
            boxShadow: "0 0 10px rgba(34,197,94,0.6)",
          }}
        />

        <span
          style={{
            fontSize: 11,
            color: "#22c55e",
            fontWeight: 600,
          }}
        >
          System Online
        </span>

        <span style={{ fontSize: 11, color: "#64748b" }}>
          • AI Active
        </span>
      </div>
    </div>
  )}

  {/* COLLAPSE BUTTON */}
  {/* <button
    onClick={() => setCollapsed(!collapsed)}
    style={{
      background: "rgba(255,255,255,0.06)",
      border: "1px solid rgba(255,255,255,0.08)",
      color: "#cbd5e1",
      cursor: "pointer",
      fontSize: 14,
      width: 34,
      height: 34,
      borderRadius: 10,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    }}
  >
    ☰
  </button> */}
</div>
  

      {/* ---------------- MENU ---------------- */}
      <div style={{ flex: 1, overflowY: "auto" }}>

        <Group title={!isCompact && "OVERVIEW"}>
          <Item icon="🏠" label="Dashboard" to="/" compact={isCompact} />
        </Group>

        <Group title={!isCompact && "SCHOOL OPS"}>
          <Item icon="💸" label="Fees" to="/fees" compact={isCompact} />
          <Item icon="📈" label="Reports" to="/reports" compact={isCompact} />
          <Item icon="⚠️" label="Alerts" to="/alerts" compact={isCompact} />
          <Item icon="📅" label="Attendance" to="/attendance" compact={isCompact} />
        </Group>

        <Group title={!isCompact && "ACADEMICS"}>
          <Item icon="🧑‍🎓" label="Students" to="/students" compact={isCompact} />
          <Item icon="🧠" label="Insights" to="/insights" compact={isCompact} />
        </Group>

        <Group title={!isCompact && "SYSTEM"}>
          <Item icon="🟢" label="Health" to="/system" compact={isCompact} />
          <Item icon="🔄" label="Sync" to="/sync" compact={isCompact} />
          <Item icon="⚙️" label="Settings" to="/settings" compact={isCompact} />
        </Group>

      </div>

      {/* ---------------- FOOTER ---------------- */}
      <div
        style={{
          paddingTop: 14,
          borderTop: "1px solid rgba(255,255,255,0.08)",
        }}
      >
        {!isCompact ? (
          <div style={{ fontSize: 12, color: "#94a3b8" }}>
            <span style={{ color: "#22c55e" }}>●</span> System Online
            <br />
            AI Engine Active
          </div>
        ) : (
          <div style={{ textAlign: "center" }}>
            <span
              style={{
                width: 8,
                height: 8,
                background: "#22c55e",
                borderRadius: "50%",
                display: "inline-block",
                boxShadow: "0 0 10px rgba(34,197,94,0.6)",
              }}
            />
          </div>
        )}
      </div>
    </div>
  )
}

/* ---------------- GROUP ---------------- */

function Group({ title, children }) {
  return (
    <div style={{ marginBottom: 14 }}>
      {title && (
        <div
          style={{
            fontSize: 10,
            opacity: 0.5,
            letterSpacing: 1,
            margin: "10px 6px",
            textTransform: "uppercase",
          }}
        >
          {title}
        </div>
      )}
      {children}
    </div>
  )
}

/* ---------------- ITEM ---------------- */

function Item({ icon, label, to, compact }) {
  return (
    <NavLink
      to={to}
      style={({ isActive }) => ({
        display: "flex",
        alignItems: "center",
        justifyContent: compact ? "center" : "flex-start",
        gap: 10,

        padding: "10px 12px",
        borderRadius: 12,
        marginBottom: 6,
        textDecoration: "none",

        color: isActive ? "#fff" : "#cbd5e1",

        background: isActive
          ? "linear-gradient(135deg, rgba(59,130,246,0.25), rgba(99,102,241,0.15))"
          : "transparent",

        border: isActive
          ? "1px solid rgba(99,102,241,0.3)"
          : "1px solid transparent",

        fontSize: 13,
        fontWeight: isActive ? 700 : 500,
        transition: "all 0.2s ease",
      })}
    >

     
      <span style={{ fontSize: 16 }}>{icon}</span>
      {!compact && <span>{label}</span>}
    </NavLink>
  )
}




























