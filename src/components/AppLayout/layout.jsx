import { useState } from "react"
import { Outlet } from "react-router-dom"

import Sidebar from "../navigation/Sidebar"
import Topbar from "../navigation/Topbar"
import { useResponsive } from "../../hooks/useResponsive"

const SIDEBAR_WIDTH = 260
const TOPBAR_HEIGHT = 76

export default function AppLayout({ children }) {
  const { isMobile } = useResponsive()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div style={styles.shell}>

      {/* ---------------- SIDEBAR ---------------- */}
      <aside
        style={{
          ...styles.sidebar,

          // DESKTOP
          ...(isMobile
            ? {
                transform: sidebarOpen
                  ? "translateX(0)"
                  : "translateX(-100%)",
                transition: "transform 0.3s ease",
                zIndex: 1000,
              }
            : {
                transform: "translateX(0)",
              }),
        }}
      >
        <Sidebar
          isMobile={isMobile}
          open={sidebarOpen}
          setOpen={setSidebarOpen}
        />
      </aside>

      {/* ---------------- MOBILE OVERLAY ---------------- */}
      {isMobile && sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          style={styles.overlay}
        />
      )}

      {/* ---------------- MAIN ---------------- */}
      <main
        style={{
          ...styles.main,
          marginLeft: isMobile ? 0 : SIDEBAR_WIDTH,
          width: isMobile
            ? "100%"
            : `calc(100% - ${SIDEBAR_WIDTH}px)`,
        }}
      >

        {/* ---------------- TOPBAR ---------------- */}
        <header
          style={{
            ...styles.topbar,
            left: isMobile ? 0 : SIDEBAR_WIDTH,
          }}
        >
          <Topbar
            isMobile={isMobile}
            openSidebar={() => setSidebarOpen(true)}
          />
        </header>

        {/* ---------------- SCROLLABLE CONTENT ---------------- */}
        <section style={styles.content}>
          <div style={styles.dashboard}>
            {children}
          </div>
        </section>

      </main>
    </div>
  )
}

const styles = {
  /* ---------------- APP SHELL ---------------- */

  shell: {
    display: "flex",
    height: "100vh",
    overflow: "hidden",

    background: "#050816",
    color: "white",

    fontFamily: "Inter, sans-serif",
  },

  /* ---------------- SIDEBAR ---------------- */

  sidebar: {
    position: "fixed",
    top: 0,
    left: 0,

    width: SIDEBAR_WIDTH,
    height: "100vh",

    background: "#0b1220",

    borderRight: "1px solid rgba(255,255,255,0.06)",

    zIndex: 999,
  },

  /* ---------------- MOBILE OVERLAY ---------------- */

  overlay: {
    position: "fixed",
    inset: 0,

    background: "rgba(0,0,0,0.5)",

    zIndex: 998,
  },

  /* ---------------- MAIN ---------------- */

  main: {
    height: "100vh",

    display: "flex",
    flexDirection: "column",

    overflow: "hidden",
  },

  /* ---------------- TOPBAR ---------------- */

  topbar: {
    position: "fixed",
    top: 0,
    right: 0,

    height: TOPBAR_HEIGHT,

    zIndex: 200,

    backdropFilter: "blur(12px)",
    background: "rgba(5, 8, 22, 0.82)",

    borderBottom: "1px solid rgba(255,255,255,0.05)",
  },

  /* ---------------- CONTENT ---------------- */

  content: {
    marginTop: TOPBAR_HEIGHT,

    height: `calc(100vh - ${TOPBAR_HEIGHT}px)`,

    overflowY: "auto",
    overflowX: "hidden",

    padding: 20,

    scrollbarWidth: "thin",
    scrollbarColor: "#1e293b transparent",
  },

  /* ---------------- DASHBOARD ---------------- */

  dashboard: {
    minHeight: "100%",

    borderRadius: 20,

    background: `
      linear-gradient(
        180deg,
        rgba(15,23,42,0.85),
        rgba(2,6,23,0.95)
      )
    `,

    border: "1px solid rgba(255,255,255,0.04)",

    boxShadow: `
      0 10px 40px rgba(0,0,0,0.25),
      inset 0 1px 0 rgba(255,255,255,0.03)
    `,

    padding: 20,
  },
}


