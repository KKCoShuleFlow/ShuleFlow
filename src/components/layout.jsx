import Sidebar from "./navigation/Sidebar"
import Topbar from "./navigation/Topbar"
import { Outlet } from "react-router-dom"

export default function Layout() {
  return (
    <div style={{
      display: "grid",
      gridTemplateColumns: "260px 1fr",
      height: "100vh",
      width: "100vw",          // 🔥 IMPORTANT
      overflow: "hidden"
    }}>

      {/* SIDEBAR */}
      <Sidebar />

      {/* MAIN AREA */}
      <div style={{
        display: "flex",
        flexDirection: "column",
        minWidth: 0,            // 🔥 CRITICAL FIX (prevents squeeze)
        width: "100%"
      }}>

        <Topbar />

        {/* CONTENT AREA */}
        <div style={{
          flex: 1,
          overflow: "auto",
          width: "100%"
        }}>
          <Outlet />
        </div>

      </div>
    </div>
  )
}