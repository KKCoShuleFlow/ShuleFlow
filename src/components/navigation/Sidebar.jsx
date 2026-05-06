import { NavLink } from "react-router-dom"
import { useState } from "react"

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false)

  return (
    <div style={{
      width: collapsed ? 72 : 260,
      transition: "all 0.25s ease",
      background: "#0b1220",
      color: "white",
      height: "100vh",
      display: "flex",
      flexDirection: "column",
      padding: 14
    }}>

      {/* HEADER */}
      <div style={{
        display: "flex",
        justifyContent: collapsed ? "center" : "space-between",
        alignItems: "center",
        marginBottom: 18
      }}>

        {!collapsed && (
          <div style={{
            fontWeight: 700,
            letterSpacing: 0.3
          }}>
            🏫 ShuleFlow
          </div>
        )}

        <button
          onClick={() => setCollapsed(!collapsed)}
          style={{
            background: "transparent",
            border: "none",
            color: "#94a3b8",
            cursor: "pointer",
            fontSize: 16
          }}
        >
          ☰
        </button>
      </div>

      {/* CORE */}
      <Group title={!collapsed && "CORE OPS"}>
        <Item icon="📊" label="Dashboard" to="/" collapsed={collapsed} />
        <Item icon="🧑‍🎓" label="Students" to="/students" collapsed={collapsed} />
        <Item icon="💸" label="Fees & Finance" to="/fees" collapsed={collapsed} />
        <Item icon="📅" label="Attendance" to="/attendance" collapsed={collapsed} />
      </Group>

      {/* INTELLIGENCE */}
      <Group title={!collapsed && "INTELLIGENCE"}>
        <Item icon="⚠️" label="Alerts" to="/alerts" collapsed={collapsed} />
        <Item icon="📈" label="Reports" to="/reports" collapsed={collapsed} />
        <Item icon="🧠" label="Insights" to="/insights" collapsed={collapsed} />
      </Group>

      {/* SYSTEM */}
      <Group title={!collapsed && "SYSTEM"}>
        <Item icon="🟢" label="System Health" to="/system" collapsed={collapsed} />
        <Item icon="🔄" label="Sync Status" to="/sync" collapsed={collapsed} />
        <Item icon="⚙️" label="Settings" to="/settings" collapsed={collapsed} />
      </Group>

      {/* FOOTER STATUS */}
      <div style={{
        marginTop: "auto",
        paddingTop: 14,
        borderTop: "1px solid rgba(255,255,255,0.08)"
      }}>

        {!collapsed ? (
          <div style={{
            fontSize: 12,
            color: "#94a3b8",
            lineHeight: 1.4
          }}>
            <PulseDot /> Offline-first active
            <br />
            <span style={{ color: "#22c55e" }}>Sync running</span>
          </div>
        ) : (
          <div style={{
            display: "flex",
            justifyContent: "center"
          }}>
            <PulseDot />
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
        <div style={{
          fontSize: 10,
          color: "#64748b",
          marginBottom: 8,
          letterSpacing: "0.1em"
        }}>
          {title}
        </div>
      )}
      {children}
    </div>
  )
}

/* ---------------- ITEM ---------------- */

function Item({ icon, label, to, collapsed }) {
  return (
    <NavLink
      to={to}
      style={({ isActive }) => ({
        display: "flex",
        alignItems: "center",
        justifyContent: collapsed ? "center" : "flex-start",
        gap: 10,
        padding: "10px 10px",
        borderRadius: 10,
        marginBottom: 5,
        textDecoration: "none",
        color: isActive ? "#ffffff" : "#cbd5e1",
        background: isActive ? "rgba(99,102,241,0.35)" : "transparent",
        boxShadow: isActive ? "0 0 0 1px rgba(99,102,241,0.4)" : "none",
        transition: "all 0.2s ease",
        fontSize: 13
      })}
    >
      <span style={{ fontSize: 16 }}>{icon}</span>

      {!collapsed && <span>{label}</span>}
    </NavLink>
  )
}

/* ---------------- PULSE DOT ---------------- */

function PulseDot() {
  return (
    <span style={{
      width: 8,
      height: 8,
      background: "#22c55e",
      borderRadius: "50%",
      display: "inline-block",
      boxShadow: "0 0 10px rgba(34,197,94,0.6)",
      animation: "pulse 1.5s infinite"
    }} />
  )
}