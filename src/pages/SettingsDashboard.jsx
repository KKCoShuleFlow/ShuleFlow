import { useState } from "react"

export default function SettingsDashboard() {
  const [tab, setTab] = useState("general")

  return (
    <div style={styles.wrapper}>

      {/* HEADER */}
      <div style={styles.header}>
        <div style={{ fontSize: 22, fontWeight: 900 }}>
          ⚙️ SCHOOL OS CONTROL CENTER
        </div>
        <div style={{ fontSize: 12, opacity: 0.7 }}>
          Configure intelligence, sync, and system behavior
        </div>
      </div>

      {/* LAYOUT */}
      <div style={styles.layout}>

        {/* SIDEBAR */}
        <div style={styles.sidebar}>
          <TabButton label="General" active={tab === "general"} onClick={() => setTab("general")} />
          <TabButton label="Intelligence" active={tab === "ai"} onClick={() => setTab("ai")} />
          <TabButton label="Sync Engine" active={tab === "sync"} onClick={() => setTab("sync")} />
          <TabButton label="Alerts" active={tab === "alerts"} onClick={() => setTab("alerts")} />
          <TabButton label="Security" active={tab === "security"} onClick={() => setTab("security")} />
          <TabButton label="Danger Zone" active={tab === "danger"} danger onClick={() => setTab("danger")} />
        </div>

        {/* CONTENT */}
        <div style={styles.content}>

          {tab === "general" && <General />}
          {tab === "ai" && <AI />}
          {tab === "sync" && <Sync />}
          {tab === "alerts" && <Alerts />}
          {tab === "security" && <Security />}
          {tab === "danger" && <Danger />}

        </div>

      </div>
    </div>
  )
}

/* ---------------- TABS ---------------- */

function General() {
  return (
    <Panel title="🌐 General System Configuration">
      <Item label="School Name" value="School OS v1" />
      <Item label="Region" value="Auto (EU Cluster)" />
      <Item label="Time Mode" value="Realtime Sync Enabled" />
    </Panel>
  )
}

function AI() {
  return (
    <Panel title="🧠 Intelligence Engine">
      <Item label="Prediction Mode" value="Enabled" />
      <Item label="Memory Depth" value="30 Days" />
      <Item label="Agent System" value="Multi-Agent Active" />
      <Item label="Self-Awareness" value="ON" highlight />
    </Panel>
  )
}

function Sync() {
  return (
    <Panel title="🛰 Sync Engine Control">
      <Item label="Realtime Sync" value="Active" highlight />
      <Item label="Fallback Mode" value="Auto-Heal Enabled" />
      <Item label="Latency Threshold" value="300ms" />
      <Item label="Conflict Resolver" value="Datadog Mode" />
    </Panel>
  )
}

function Alerts() {
  return (
    <Panel title="🚨 Alert System">
      <Item label="Critical Alerts" value="Instant Push" />
      <Item label="Warning Alerts" value="Batch Every 5m" />
      <Item label="AI Narration" value="Enabled" highlight />
    </Panel>
  )
}

function Security() {
  return (
    <Panel title="🔐 Security Layer">
      <Item label="Auth Mode" value="Session + Token Hybrid" />
      <Item label="Audit Logs" value="Always On" />
      <Item label="Data Encryption" value="AES-256" />
    </Panel>
  )
}

function Danger() {
  return (
    <div style={styles.danger}>
      <div style={{ fontWeight: 900, fontSize: 14 }}>
        ⚠️ DANGER ZONE
      </div>

      <div style={{ fontSize: 12, opacity: 0.8, marginTop: 8 }}>
        These actions can permanently modify system behavior.
      </div>

      <button style={styles.dangerBtn}>
        Reset Intelligence Engine
      </button>

      <button style={styles.dangerBtn}>
        Wipe System Memory
      </button>

      <button style={styles.dangerBtn}>
        Disable Sync Layer
      </button>
    </div>
  )
}

/* ---------------- UI COMPONENTS ---------------- */

function Panel({ title, children }) {
  return (
    <div style={styles.panel}>
      <div style={styles.panelTitle}>{title}</div>
      <div>{children}</div>
    </div>
  )
}

function Item({ label, value, highlight }) {
  return (
    <div style={styles.item}>
      <div style={{ fontSize: 12, opacity: 0.6 }}>{label}</div>
      <div style={{
        fontSize: 14,
        fontWeight: 800,
        color: highlight ? "#22c55e" : "white"
      }}>
        {value}
      </div>
    </div>
  )
}

function TabButton({ label, active, onClick, danger }) {
  return (
    <div
      onClick={onClick}
      style={{
        ...styles.tab,
        background: active ? "#1f2937" : "transparent",
        color: danger ? "#ef4444" : "white",
        borderLeft: active ? "3px solid #60a5fa" : "3px solid transparent",
      }}
    >
      {label}
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

  header: {
    marginBottom: 16,
    paddingBottom: 10,
    borderBottom: "1px solid rgba(255,255,255,0.1)",
  },

  layout: {
    display: "grid",
    gridTemplateColumns: "240px 1fr",
    gap: 14,
  },

  sidebar: {
    background: "#0f172a",
    borderRadius: 14,
    padding: 10,
    height: "fit-content",
  },

  content: {
    background: "#0f172a",
    borderRadius: 14,
    padding: 14,
  },

  tab: {
    padding: "10px 12px",
    borderRadius: 10,
    cursor: "pointer",
    fontSize: 13,
    marginBottom: 6,
  },

  panel: {
    marginBottom: 14,
    padding: 12,
    borderRadius: 12,
    background: "#020617",
    border: "1px solid rgba(255,255,255,0.06)",
  },

  panelTitle: {
    fontSize: 12,
    fontWeight: 800,
    marginBottom: 10,
  },

  item: {
    padding: "8px 0",
    borderBottom: "1px solid rgba(255,255,255,0.05)",
  },

  danger: {
    padding: 14,
    borderRadius: 12,
    background: "#7f1d1d",
  },

  dangerBtn: {
    marginTop: 10,
    padding: "8px 10px",
    borderRadius: 10,
    background: "#111827",
    color: "white",
    border: "1px solid rgba(255,255,255,0.1)",
    cursor: "pointer",
    display: "block",
    width: "100%",
  },
}