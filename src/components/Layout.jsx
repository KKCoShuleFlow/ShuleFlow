import Sidebar from "../components/navigation/Sidebar"
import Topbar from "../components/navigation/Topbar"
import { Outlet } from "react-router-dom"

export default function Layout() {
  return (
    <div style={styles.shell}>

      {/* SIDEBAR */}
      <div style={styles.sidebar}>
        <Sidebar />
      </div>

      {/* RIGHT SIDE */}
      <div style={styles.right}>

        {/* TOPBAR */}
        <div style={styles.topbar}>
          <Topbar />
        </div>

        {/* SCROLLABLE CONTENT */}
        <div style={styles.content}>
          <Outlet />
        </div>

      </div>

    </div>
  )
}

const styles = {
  shell: {
    display: "flex",
    height: "100vh",
    width: "100vw",
    overflow: "hidden", // lock page scroll (important)
  },

  sidebar: {
    width: 260,
    flexShrink: 0,
    height: "100vh",
  },

  right: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    minWidth: 0,
    height: "100vh", // 🔥 critical for scroll containment
  },

  topbar: {
    flexShrink: 0,
  },

  content: {
    flex: 1,
    minHeight: 0,          // 🔥 THIS FIXES MOST SCROLL BUGS
    overflowY: "auto",     // actual scroll happens here
    overflowX: "hidden",

    padding: 20,

    scrollBehavior: "smooth",

    background: "radial-gradient(circle at top, #0b1022, #050816 60%)",
  },
}