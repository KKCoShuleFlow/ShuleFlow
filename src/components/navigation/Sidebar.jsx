import { NavLink } from "react-router-dom"
import { useState } from "react"

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false)

  return (
        <div style={{
  width: collapsed ? 70 : 260,
  height: "100vh",   // MUST
  display: "flex",
  flexDirection: "column",
  background: "#0b1220",
  padding: 14,
  overflow: "hidden"
}}>

      {/* HEADER */}
      <div style={{
        display: "flex",
        justifyContent: collapsed ? "center" : "space-between",
        alignItems: "center",
        marginBottom: 20
      }}>

        {!collapsed && (
          <div style={{ fontWeight: 600 }}>
            🏫 Shule ERP
          </div>
        )}

        <button
          onClick={() => setCollapsed(!collapsed)}
          style={{
            background: "transparent",
            border: "none",
            color: "#94a3b8",
            cursor: "pointer"
          }}
        >
          ☰
        </button>
      </div>

      {/* GROUPS */}
      <Group title={!collapsed && "CORE OPS"}>

        <Item icon="📊" label="Dashboard" to="/" collapsed={collapsed} />
        <Item icon="🧑‍🎓" label="Students" to="/students" collapsed={collapsed} />
        <Item icon="💸" label="Fees & Finance" to="/fees" collapsed={collapsed} />
        <Item icon="📅" label="Attendance" to="/attendance" collapsed={collapsed} />

      </Group>

      <Group title={!collapsed && "INTELLIGENCE"}>

        <Item icon="⚠️" label="Alerts" to="/alerts" collapsed={collapsed} />
        <Item icon="📈" label="Reports" to="/reports" collapsed={collapsed} />
        <Item icon="🧠" label="Insights" to="/insights" collapsed={collapsed} />

      </Group>

      <Group title={!collapsed && "SYSTEM"}>

        <Item icon="🟢" label="System Health" to="/system" collapsed={collapsed} />
        <Item icon="🔄" label="Sync Status" to="/sync" collapsed={collapsed} />
        <Item icon="⚙️" label="Settings" to="/settings" collapsed={collapsed} />

      </Group>

      {/* FOOTER STATUS */}
      {!collapsed && (
        <div style={{
          marginTop: "auto",
          padding: 12,
          borderTop: "1px solid rgba(255,255,255,0.08)",
          fontSize: 12,
          color: "#94a3b8"
        }}>
          ⚡ Offline-first enabled
          <br />
          Sync: Active
        </div>
      )}

    </div>
  )
}

/* ---------------- GROUP ---------------- */

function Group({ title, children }) {
  return (
    <div style={{ marginBottom: 16 }}>
      {title && (
        <div style={{
          fontSize: 11,
          color: "#64748b",
          marginBottom: 8,
          letterSpacing: "0.08em"
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
        gap: 10,
        padding: "10px 10px",
        borderRadius: 10,
        marginBottom: 4,
        textDecoration: "none",
        color: isActive ? "white" : "#cbd5e1",
        background: isActive ? "rgba(99,102,241,0.25)" : "transparent",
        fontSize: 13,
        transition: "0.2s ease"
      })}
    >
      <span style={{ fontSize: 16 }}>{icon}</span>

      {!collapsed && <span>{label}</span>}
    </NavLink>
  )
}