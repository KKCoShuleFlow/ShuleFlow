import { useState } from "react"

export default function SettingsDashboard() {
  const [tab, setTab] = useState("school")

  return (
    <div style={styles.wrapper}>

      {/* HEADER */}
      <div style={styles.header}>
        <div style={styles.title}>⚙️ SCHOOL CONTROL CENTER v3</div>
        <div style={styles.subtitle}>
          Full system governance, automation & intelligence control
        </div>
      </div>

      {/* LAYOUT */}
      <div style={styles.layout}>

        {/* SIDEBAR */}
        <div style={styles.sidebar}>
          <Tab label="🏫 School" active={tab==="school"} onClick={()=>setTab("school")} />
          <Tab label="👥 Roles" active={tab==="roles"} onClick={()=>setTab("roles")} />
          <Tab label="💰 Finance Rules" active={tab==="finance"} onClick={()=>setTab("finance")} />
          <Tab label="📡 Sync Engine" active={tab==="sync"} onClick={()=>setTab("sync")} />
          <Tab label="🚨 Alerts" active={tab==="alerts"} onClick={()=>setTab("alerts")} />
          <Tab label="🧠 AI Intelligence" active={tab==="ai"} onClick={()=>setTab("ai")} />
          <Tab label="🔐 Security" active={tab==="security"} onClick={()=>setTab("security")} />
          <Tab label="⚠️ Danger Zone" danger active={tab==="danger"} onClick={()=>setTab("danger")} />
        </div>

        {/* CONTENT */}
        <div style={styles.content}>

          {tab === "school" && (
            <Panel title="🏫 School Identity">
              <Item label="School Name" value="School OS" />
              <Item label="Multi-Campus Mode" value="Enabled" />
              <Item label="Academic Year" value="2026" />
            </Panel>
          )}

          {tab === "roles" && (
            <Panel title="👥 Role Permissions">
              <Item label="Admin Access" value="Full Control" />
              <Item label="Teacher Access" value="Students + Attendance" />
              <Item label="Clerk Access" value="Fees Only" />
              <Item label="Accountant Access" value="Finance Reports" />
            </Panel>
          )}

          {tab === "finance" && (
            <Panel title="💰 Finance Rules Engine">
              <Item label="Late Fee Rule" value="Auto +5%" />
              <Item label="Payment Mode" value="Partial Allowed" />
              <Item label="Receipt System" value="Auto PDF Enabled" />
            </Panel>
          )}

          {tab === "sync" && (
            <Panel title="📡 Sync Engine Control">
              <Item label="Offline Mode" value="Enabled" />
              <Item label="Sync Interval" value="Realtime" />
              <Item label="Conflict Resolver" value="Smart Merge AI" />
            </Panel>
          )}

          {tab === "alerts" && (
            <Panel title="🚨 Alerts System">
              <Item label="Fee Alerts" value="Instant WhatsApp + SMS" />
              <Item label="Attendance Alerts" value="Daily Summary" />
              <Item label="AI Alerts" value="Enabled" />
            </Panel>
          )}

          {tab === "ai" && (
            <Panel title="🧠 Intelligence Engine">
              <Item label="Predictive Mode" value="ON" />
              <Item label="Risk Detection" value="High Sensitivity" />
              <Item label="Auto Recommendations" value="Enabled" />
            </Panel>
          )}

          {tab === "security" && (
            <Panel title="🔐 Security Layer">
              <Item label="Authentication" value="JWT + Sessions" />
              <Item label="Audit Logs" value="Always On" />
              <Item label="Encryption" value="AES-256" />
            </Panel>
          )}

          {tab === "danger" && (
            <div style={styles.danger}>
              <div style={{ fontWeight: 900 }}>⚠️ SYSTEM CONTROL</div>

              <button style={styles.btn}>Reset AI Engine</button>
              <button style={styles.btn}>Clear Cache</button>
              <button style={styles.btn}>Disable Sync</button>
            </div>
          )}

        </div>

      </div>
    </div>
  )
}

/* ---------------- UI ---------------- */

function Panel({ title, children }) {
  return (
    <div style={styles.panel}>
      <div style={styles.panelTitle}>{title}</div>
      {children}
    </div>
  )
}

function Item({ label, value }) {
  return (
    <div style={styles.item}>
      <div style={{ opacity: 0.6, fontSize: 12 }}>{label}</div>
      <div style={{ fontWeight: 800 }}>{value}</div>
    </div>
  )
}

function Tab({ label, active, onClick, danger }) {
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
    height: "100vh",
    color: "white",
    fontFamily: "Inter",
    overflow: "hidden",
  },

  header: {
    marginBottom: 12,
  },

  title: {
    fontSize: 22,
    fontWeight: 900,
  },

  subtitle: {
    fontSize: 12,
    opacity: 0.6,
  },

  layout: {
    display: "grid",
    gridTemplateColumns: "260px 1fr",
    gap: 12,
    height: "calc(100vh - 80px)",
  },

  sidebar: {
    background: "#0f172a",
    padding: 10,
    borderRadius: 12,
  },

  content: {
    background: "#0f172a",
    padding: 14,
    borderRadius: 12,
    overflowY: "auto",
  },

  tab: {
    padding: 10,
    borderRadius: 10,
    cursor: "pointer",
    marginBottom: 6,
    fontSize: 13,
  },

  panel: {
    background: "#020617",
    padding: 14,
    borderRadius: 12,
    marginBottom: 12,
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
    background: "#7f1d1d",
    borderRadius: 12,
  },

  btn: {
    width: "100%",
    marginTop: 10,
    padding: 10,
    borderRadius: 10,
    background: "#111827",
    color: "white",
    border: "1px solid rgba(255,255,255,0.1)",
  },
}



// import { useState } from "react"

// export default function SettingsDashboard() {
//   const [tab, setTab] = useState("general")

//   return (
//     <div style={styles.wrapper}>

//       {/* HEADER */}
//       <div style={styles.header}>
//         <div style={{ fontSize: 22, fontWeight: 900 }}>
//           ⚙️ SCHOOL MANAGEMENT SETTINGS
//         </div>
//         <div style={{ fontSize: 12, opacity: 0.7 }}>
//           Configure system behavior, data sync, and automation rules
//         </div>
//       </div>

//       {/* LAYOUT */}
//       <div style={styles.layout}>

//         {/* SIDEBAR */}
//         <div style={styles.sidebar}>
//           <TabButton label="School Profile" active={tab === "general"} onClick={() => setTab("general")} />
//           <TabButton label="Student Analytics" active={tab === "ai"} onClick={() => setTab("ai")} />
//           <TabButton label="Data Sync" active={tab === "sync"} onClick={() => setTab("sync")} />
//           <TabButton label="Notifications & Alerts" active={tab === "alerts"} onClick={() => setTab("alerts")} />
//           <TabButton label="Access & Security" active={tab === "security"} onClick={() => setTab("security")} />
//           <TabButton label="System Reset" active={tab === "danger"} danger onClick={() => setTab("danger")} />
//         </div>

//         {/* CONTENT */}
//         <div style={styles.content}>

//           {tab === "general" && <General />}
//           {tab === "ai" && <AI />}
//           {tab === "sync" && <Sync />}
//           {tab === "alerts" && <Alerts />}
//           {tab === "security" && <Security />}
//           {tab === "danger" && <Danger />}

//         </div>

//       </div>
//     </div>
//   )
// }

// /* ---------------- TABS ---------------- */

// function General() {
//   return (
//     <Panel title="🏫 School Profile Settings">
//       <Item label="School Name" value="School OS" />
//       <Item label="Region / Campus" value="Auto-detected" />
//       <Item label="Operating Mode" value="Real-time Data Mode" />
//     </Panel>
//   )
// }

// function AI() {
//   return (
//     <Panel title="📊 Student Performance Analytics">
//       <Item label="Risk Detection System" value="Enabled" />
//       <Item label="Historical Data Window" value="30 Days" />
//       <Item label="Predictive Insights" value="Active" />
//       <Item label="Automated Alerts" value="On" highlight />
//     </Panel>
//   )
// }

// function Sync() {
//   return (
//     <Panel title="🔄 Data Synchronization Settings">
//       <Item label="Real-time Sync" value="Enabled" highlight />
//       <Item label="Offline Data Recovery" value="Enabled" />
//       <Item label="Max Sync Delay" value="300ms" />
//       <Item label="Duplicate Data Handling" value="Smart Merge" />
//     </Panel>
//   )
// }

// function Alerts() {
//   return (
//     <Panel title="📣 Notification Settings">
//       <Item label="Critical Alerts (Fees / Risk)" value="Instant Email + Dashboard" />
//       <Item label="General Updates" value="Daily Summary" />
//       <Item label="AI Notifications" value="Enabled" highlight />
//     </Panel>
//   )
// }

// function Security() {
//   return (
//     <Panel title="🔐 Access Control & Security">
//       <Item label="Login System" value="Secure Session Authentication" />
//       <Item label="Audit Logs" value="Enabled" />
//       <Item label="Data Encryption" value="Active (AES-256)" />
//     </Panel>
//   )
// }

// function Danger() {
//   return (
//     <div style={styles.danger}>
//       <div style={{ fontWeight: 900, fontSize: 14 }}>
//         ⚠️ SYSTEM RESET OPTIONS
//       </div>

//       <div style={{ fontSize: 12, opacity: 0.8, marginTop: 8 }}>
//         These actions affect system data and analytics. Use with caution.
//       </div>

//       <button style={styles.dangerBtn}>
//         Reset Analytics Data
//       </button>

//       <button style={styles.dangerBtn}>
//         Clear Cached System Data
//       </button>

//       <button style={styles.dangerBtn}>
//         Disable Real-time Sync
//       </button>
//     </div>
//   )
// }

// /* ---------------- UI COMPONENTS ---------------- */

// function Panel({ title, children }) {
//   return (
//     <div style={styles.panel}>
//       <div style={styles.panelTitle}>{title}</div>
//       <div>{children}</div>
//     </div>
//   )
// }

// function Item({ label, value, highlight }) {
//   return (
//     <div style={styles.item}>
//       <div style={{ fontSize: 12, opacity: 0.6 }}>{label}</div>
//       <div style={{
//         fontSize: 14,
//         fontWeight: 800,
//         color: highlight ? "#22c55e" : "white"
//       }}>
//         {value}
//       </div>
//     </div>
//   )
// }

// function TabButton({ label, active, onClick, danger }) {
//   return (
//     <div
//       onClick={onClick}
//       style={{
//         ...styles.tab,
//         background: active ? "#1f2937" : "transparent",
//         color: danger ? "#ef4444" : "white",
//         borderLeft: active ? "3px solid #60a5fa" : "3px solid transparent",
//       }}
//     >
//       {label}
//     </div>
//   )
// }

// /* ---------------- STYLES (UNCHANGED) ---------------- */

// const styles = {
//    wrapper: {
//   padding: 20,
//   background: "#050816",
//   height: "100vh",        // ✅ CHANGE from minHeight → height
//   overflow: "hidden",     // ✅ prevents page scroll affecting sidebar
//   color: "white",
//   fontFamily: "Inter",
// },

//   header: {
//     marginBottom: 16,
//     paddingBottom: 10,
//     borderBottom: "1px solid rgba(255,255,255,0.1)",
//   },

//   layout: {
//   display: "grid",
//   gridTemplateColumns: "240px 1fr",
//   gap: 14,
//   height: "calc(100vh - 80px)", // ✅ keeps inside screen
//   overflow: "hidden",
// },

//   sidebar: {
//   background: "#0f172a",
//   borderRadius: 14,
//   padding: 10,
//   height: "100%",        // fills full column
//   overflow: "hidden",    // ❌ prevents scrolling inside sidebar
//   position: "sticky",    // optional safety
//   top: 0,
// },

//  content: {
//   background: "#0f172a",
//   borderRadius: 14,
//   padding: 14,
//   height: "100%",
//   overflowY: "auto",     // ✅ ONLY THIS SCROLLS
// },

//   tab: {
//     padding: "10px 12px",
//     borderRadius: 10,
//     cursor: "pointer",
//     fontSize: 13,
//     marginBottom: 6,
//   },

//   panel: {
//     marginBottom: 14,
//     padding: 12,
//     borderRadius: 12,
//     background: "#020617",
//     border: "1px solid rgba(255,255,255,0.06)",
//   },

//   panelTitle: {
//     fontSize: 12,
//     fontWeight: 800,
//     marginBottom: 10,
//   },

//   item: {
//     padding: "8px 0",
//     borderBottom: "1px solid rgba(255,255,255,0.05)",
//   },

//   danger: {
//     padding: 14,
//     borderRadius: 12,
//     background: "#7f1d1d",
//   },

//   dangerBtn: {
//     marginTop: 10,
//     padding: "8px 10px",
//     borderRadius: 10,
//     background: "#111827",
//     color: "white",
//     border: "1px solid rgba(255,255,255,0.1)",
//     cursor: "pointer",
//     display: "block",
//     width: "100%",
//   },
// }